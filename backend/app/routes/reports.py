from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from typing import List
import io
import requests
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from decouple import config
from app.database import get_db
from app.models.models import ChickenIntake, ChickenSale, Expense, User as UserModel
from app.schemas.schemas import DailyReport, MonthlyReport
from app.utils.dependencies import get_current_approved_user

router = APIRouter()

# Telegram Bot Configuration (Free alternative to Twilio)
TELEGRAM_BOT_TOKEN = config("TELEGRAM_BOT_TOKEN", default="")
TELEGRAM_CHAT_ID = config("TELEGRAM_CHAT_ID", default="")

@router.get("/daily/{report_date}", response_model=DailyReport)
async def get_daily_report(
    report_date: date,
    user_id: int = None,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    report_owner_id = None if current_user.is_superuser else current_user.id
    if current_user.is_superuser and user_id:
        report_owner_id = user_id

    end_date = report_date + timedelta(days=1)
    filters = [
        ChickenIntake.intake_date >= report_date,
        ChickenIntake.intake_date < end_date
    ]
    if report_owner_id is not None:
        filters.insert(0, ChickenIntake.owner_id == report_owner_id)

    intakes = db.query(ChickenIntake).filter(*filters).all()

    sales_filters = [
        ChickenSale.sale_date >= report_date,
        ChickenSale.sale_date < end_date
    ]
    if report_owner_id is not None:
        sales_filters.insert(0, ChickenSale.owner_id == report_owner_id)
    sales = db.query(ChickenSale).filter(*sales_filters).all()

    expense_filters = [
        Expense.expense_date >= report_date,
        Expense.expense_date < end_date
    ]
    if report_owner_id is not None:
        expense_filters.insert(0, Expense.owner_id == report_owner_id)
    expenses = db.query(Expense).filter(*expense_filters).all()

    total_intake = sum(intake.total_cost for intake in intakes)
    total_sales = sum(sale.total_revenue for sale in sales)
    total_expenses = sum(expense.amount for expense in expenses)
    profit_loss = total_sales - total_intake - total_expenses

    return DailyReport(
        date=report_date.isoformat(),
        total_intake=total_intake,
        total_sales=total_sales,
        total_expenses=total_expenses,
        profit_loss=profit_loss
    )

@router.post("/daily/telegram/{report_date}")
async def send_daily_telegram_report(
    report_date: date,
    user_id: int = None,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    target_user = current_user
    if current_user.is_superuser and user_id is not None:
        target_user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if target_user is None:
            raise HTTPException(status_code=404, detail="Target user not found")

    # Use user's telegram settings, fallback to global if not set
    bot_token = target_user.telegram_bot_token or TELEGRAM_BOT_TOKEN
    chat_id = target_user.telegram_chat_id or TELEGRAM_CHAT_ID

    invalid_telegram_config = any(
        value in ("", "your-telegram-bot-token", "your-telegram-chat-id")
        for value in (bot_token, chat_id)
    )

    if invalid_telegram_config:
        raise HTTPException(
            status_code=400,
            detail="Telegram configuration not set up. Please configure your Telegram bot token and chat ID in your profile settings."
        )

    report = await get_daily_report(report_date, user_id, current_user, db)

    message = f"""📊 *Daily Report - {report.date}*

💰 *Total Intake:* ₹{report.total_intake:.2f}
💵 *Total Sales:* ₹{report.total_sales:.2f}
💸 *Total Expenses:* ₹{report.total_expenses:.2f}
📈 *Profit/Loss:* ₹{report.profit_loss:.2f}

_Generated for {target_user.full_name}_"""

    try:
        telegram_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "Markdown"
        }
        response = requests.post(telegram_url, json=payload)
        response.raise_for_status()

        return {"message": "Daily report sent via Telegram"}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to send Telegram message: {str(e)}")

@router.get("/monthly/{year}/{month}")
def get_monthly_report(
    year: int,
    month: int,
    user_id: int = None,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    start_date = date(year, month, 1)
    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    # Get all data for the month
    report_owner_id = None if current_user.is_superuser else current_user.id
    if current_user.is_superuser and user_id:
        report_owner_id = user_id

    intake_query = db.query(ChickenIntake).filter(
        ChickenIntake.intake_date >= start_date,
        ChickenIntake.intake_date < end_date
    )
    sales_query = db.query(ChickenSale).filter(
        ChickenSale.sale_date >= start_date,
        ChickenSale.sale_date < end_date
    )
    expense_query = db.query(Expense).filter(
        Expense.expense_date >= start_date,
        Expense.expense_date < end_date
    )

    if report_owner_id is not None:
        intake_query = intake_query.filter(ChickenIntake.owner_id == report_owner_id)
        sales_query = sales_query.filter(ChickenSale.owner_id == report_owner_id)
        expense_query = expense_query.filter(Expense.owner_id == report_owner_id)

    intakes = intake_query.all()
    sales = sales_query.all()
    expenses = expense_query.all()

    total_intake = sum(intake.total_cost for intake in intakes)
    total_sales = sum(sale.total_revenue for sale in sales)
    total_expenses = sum(expense.amount for expense in expenses)
    profit_loss = total_sales - total_intake - total_expenses

    return MonthlyReport(
        month=datetime(year, month, 1).strftime("%B"),
        year=year,
        total_intake=total_intake,
        total_sales=total_sales,
        total_expenses=total_expenses,
        profit_loss=profit_loss,
        intake_details=[{
            "date": intake.intake_date.isoformat(),
            "supplier": intake.supplier,
            "quantity": intake.quantity,
            "cost": intake.total_cost
        } for intake in intakes],
        sales_details=[{
            "date": sale.sale_date.isoformat(),
            "customer": sale.customer_name or "N/A",
            "quantity": sale.quantity,
            "revenue": sale.total_revenue
        } for sale in sales],
        expenses_details=[{
            "date": expense.expense_date.isoformat(),
            "category": expense.category,
            "amount": expense.amount,
            "description": expense.description or ""
        } for expense in expenses]
    )

@router.get("/monthly/pdf/{year}/{month}")
async def generate_monthly_pdf_report(
    year: int,
    month: int,
    user_id: int = None,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    report_data = get_monthly_report(year, month, user_id, current_user, db)

    # Create PDF
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title = Paragraph(f"Monthly Report - {report_data.month} {report_data.year}", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 12))

    # Summary
    summary_data = [
        ["Total Intake", f"₹{report_data.total_intake:.2f}"],
        ["Total Sales", f"₹{report_data.total_sales:.2f}"],
        ["Total Expenses", f"₹{report_data.total_expenses:.2f}"],
        ["Profit/Loss", f"₹{report_data.profit_loss:.2f}"]
    ]
    summary_table = Table(summary_data)
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 20))

    # Intake details
    if report_data.intake_details:
        intake_title = Paragraph("Chicken Intake Details", styles['Heading2'])
        story.append(intake_title)
        intake_data = [["Date", "Supplier", "Quantity", "Cost"]]
        intake_data.extend([
            [item["date"], item["supplier"], str(item["quantity"]), f"₹{item['cost']:.2f}"]
            for item in report_data.intake_details
        ])
        intake_table = Table(intake_data)
        intake_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(intake_table)
        story.append(Spacer(1, 12))

    # Sales details
    if report_data.sales_details:
        sales_title = Paragraph("Sales Details", styles['Heading2'])
        story.append(sales_title)
        sales_data = [["Date", "Customer", "Quantity", "Revenue"]]
        sales_data.extend([
            [item["date"], item["customer"], str(item["quantity"]), f"₹{item['revenue']:.2f}"]
            for item in report_data.sales_details
        ])
        sales_table = Table(sales_data)
        sales_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(sales_table)
        story.append(Spacer(1, 12))

    # Expenses details
    if report_data.expenses_details:
        expenses_title = Paragraph("Expenses Details", styles['Heading2'])
        story.append(expenses_title)
        expenses_data = [["Date", "Category", "Amount", "Description"]]
        expenses_data.extend([
            [item["date"], item["category"], f"₹{item['amount']:.2f}", item["description"]]
            for item in report_data.expenses_details
        ])
        expenses_table = Table(expenses_data)
        expenses_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(expenses_table)

    doc.build(story)
    buffer.seek(0)

    return StreamingResponse(
        io.BytesIO(buffer.getvalue()),
        media_type='application/pdf',
        headers={'Content-Disposition': f'attachment; filename="monthly_report_{report_data.month}_{report_data.year}.pdf"'}
    )