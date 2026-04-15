from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    is_approved: Optional[bool] = None

class User(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    is_approved: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Authentication schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Chicken Intake schemas
class ChickenIntakeBase(BaseModel):
    quantity: float
    supplier: str
    cost_per_unit: float
    total_cost: float
    notes: Optional[str] = None

class ChickenIntakeCreate(ChickenIntakeBase):
    intake_date: Optional[datetime] = None

class ChickenIntakeUpdate(BaseModel):
    quantity: Optional[float] = None
    supplier: Optional[str] = None
    cost_per_unit: Optional[float] = None
    total_cost: Optional[float] = None
    intake_date: Optional[datetime] = None
    notes: Optional[str] = None

class ChickenIntake(ChickenIntakeBase):
    id: int
    owner_id: int
    intake_date: datetime
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Chicken Sale schemas
class ChickenSaleBase(BaseModel):
    quantity: float
    price_per_unit: float
    total_revenue: float
    customer_name: Optional[str] = None
    notes: Optional[str] = None

class ChickenSaleCreate(ChickenSaleBase):
    sale_date: Optional[datetime] = None

class ChickenSaleUpdate(BaseModel):
    quantity: Optional[float] = None
    price_per_unit: Optional[float] = None
    total_revenue: Optional[float] = None
    customer_name: Optional[str] = None
    sale_date: Optional[datetime] = None
    notes: Optional[str] = None

class ChickenSale(ChickenSaleBase):
    id: int
    owner_id: int
    sale_date: datetime
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Expense schemas
class ExpenseBase(BaseModel):
    category: str
    amount: float
    description: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    expense_date: Optional[datetime] = None

class ExpenseUpdate(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    expense_date: Optional[datetime] = None

class Expense(ExpenseBase):
    id: int
    owner_id: int
    expense_date: datetime
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Report schemas
class DailyReport(BaseModel):
    date: str
    total_intake: float
    total_sales: float
    total_expenses: float
    profit_loss: float

class MonthlyReport(BaseModel):
    month: str
    year: int
    total_intake: float
    total_sales: float
    total_expenses: float
    profit_loss: float
    intake_details: List[dict]
    sales_details: List[dict]
    expenses_details: List[dict]