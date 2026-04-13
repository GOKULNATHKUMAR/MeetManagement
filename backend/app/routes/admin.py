from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import User, ChickenIntake, ChickenSale, Expense
from app.schemas.schemas import User
from app.utils.dependencies import get_current_superuser

router = APIRouter()

@router.get("/users", response_model=List[User])
async def get_all_users(
    current_user = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()
    return users

@router.put("/users/{user_id}/approve")
async def approve_user(
    user_id: int,
    current_user = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_approved = True
    db.commit()
    return {"message": "User approved successfully"}

@router.put("/users/{user_id}/deactivate")
async def deactivate_user(
    user_id: int,
    current_user = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = False
    db.commit()
    return {"message": "User deactivated successfully"}

@router.get("/intakes/all")
async def get_all_intakes(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    intakes = db.query(ChickenIntake).offset(skip).limit(limit).all()
    return intakes

@router.get("/sales/all")
async def get_all_sales(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    sales = db.query(ChickenSale).offset(skip).limit(limit).all()
    return sales

@router.get("/expenses/all")
async def get_all_expenses(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    expenses = db.query(Expense).offset(skip).limit(limit).all()
    return expenses

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    current_user = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).filter(User.is_superuser == False).count()
    approved_users = db.query(User).filter(User.is_approved == True, User.is_superuser == False).count()
    pending_users = db.query(User).filter(User.is_approved == False, User.is_superuser == False).count()

    total_intakes = db.query(ChickenIntake).count()
    total_sales = db.query(ChickenSale).count()
    total_expenses = db.query(Expense).count()

    return {
        "users": {
            "total": total_users,
            "approved": approved_users,
            "pending": pending_users
        },
        "records": {
            "intakes": total_intakes,
            "sales": total_sales,
            "expenses": total_expenses
        }
    }