from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app.models.models import Expense as ExpenseModel
from app.schemas.schemas import Expense, ExpenseCreate, ExpenseUpdate, ExpenseWithOwner
from app.utils.dependencies import get_current_approved_user

router = APIRouter()

@router.post("/", response_model=Expense)
async def create_expense(
    expense: ExpenseCreate,
    owner_id: int = None,  # For admin creating on behalf of user
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    # Regular users can only add for themselves
    # Admins can add for any user (if owner_id provided) or for themselves
    if current_user.is_superuser and owner_id:
        user_owner_id = owner_id
    else:
        user_owner_id = current_user.id
    
    db_expense = ExpenseModel(
        owner_id=user_owner_id,
        category=expense.category,
        amount=expense.amount,
        description=expense.description,
        expense_date=expense.expense_date
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/", response_model=List[ExpenseWithOwner])
async def read_expenses(
    skip: int = 0,
    limit: int = 100,
    user_id: int = None,  # For admin filtering
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    query = db.query(ExpenseModel).options(joinedload(ExpenseModel.owner))
    
    # If super admin, they can filter by user_id or see all
    if current_user.is_superuser:
        if user_id:
            query = query.filter(ExpenseModel.owner_id == user_id)
        # else: return all expenses
    else:
        # Regular user sees only their own
        query = query.filter(ExpenseModel.owner_id == current_user.id)
    
    expenses = query.offset(skip).limit(limit).all()
    return expenses

@router.get("/{expense_id}", response_model=Expense)
async def read_expense(
    expense_id: int,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    query = db.query(ExpenseModel).filter(ExpenseModel.id == expense_id)
    
    # Admin can access any expense, regular user only their own
    if not current_user.is_superuser:
        query = query.filter(ExpenseModel.owner_id == current_user.id)
    
    expense = query.first()
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
    query = db.query(ExpenseModel).filter(ExpenseModel.id == expense_id)
    
    # Admin can access any expense, regular user only their own
    if not current_user.is_superuser:
        query = query.filter(ExpenseModel.owner_id == current_user.id)
    
    expense = query.first()
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
    query = db.query(ExpenseModel).filter(ExpenseModel.id == expense_id)
    
    # Admin can access any expense, regular user only their own
    if not current_user.is_superuser:
        query = query.filter(ExpenseModel.owner_id == current_user.id)
    
    expense = query.first()
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted successfully"}