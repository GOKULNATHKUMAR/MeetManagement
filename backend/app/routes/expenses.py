from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import Expense as ExpenseModel
from app.schemas.schemas import Expense, ExpenseCreate, ExpenseUpdate
from app.utils.dependencies import get_current_approved_user

router = APIRouter()

@router.post("/", response_model=Expense)
async def create_expense(
    expense: ExpenseCreate,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    db_expense = ExpenseModel(
        owner_id=current_user.id,
        category=expense.category,
        amount=expense.amount,
        description=expense.description,
        expense_date=expense.expense_date
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/", response_model=List[Expense])
async def read_expenses(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    expenses = db.query(ExpenseModel).filter(ExpenseModel.owner_id == current_user.id).offset(skip).limit(limit).all()
    return expenses

@router.get("/{expense_id}", response_model=Expense)
async def read_expense(
    expense_id: int,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    expense = db.query(ExpenseModel).filter(
        ExpenseModel.id == expense_id,
        ExpenseModel.owner_id == current_user.id
    ).first()
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@router.put("/{expense_id}", response_model=Expense)
async def update_expense(
    expense_id: int,
    expense_update: ExpenseUpdate,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    expense = db.query(ExpenseModel).filter(
        ExpenseModel.id == expense_id,
        ExpenseModel.owner_id == current_user.id
    ).first()
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")

    update_data = expense_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)

    db.commit()
    db.refresh(expense)
    return expense

@router.delete("/{expense_id}")
async def delete_expense(
    expense_id: int,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    expense = db.query(ExpenseModel).filter(
        ExpenseModel.id == expense_id,
        ExpenseModel.owner_id == current_user.id
    ).first()
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted successfully"}