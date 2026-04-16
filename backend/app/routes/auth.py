from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.models.models import User
from app.schemas.schemas import UserCreate, User, LoginRequest, Token
from app.utils.auth import authenticate_user, create_access_token, get_password_hash, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES
from app.utils.dependencies import get_current_active_user, get_current_superuser

router = APIRouter()

@router.post("/register", response_model=User)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email or username already registered")

    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_password,
        is_approved=False  # Shop owners need approval
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
async def login_for_access_token(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    if not user.is_approved and not user.is_superuser:
        raise HTTPException(status_code=400, detail="Account not approved yet")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    return current_user

@router.post("/reset-password")
async def reset_password(email: str, db: Session = Depends(get_db)):
    # In a real application, you'd send an email with a reset token
    # For now, just return a success message
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # TODO: Implement password reset logic with email
    return {"message": "Password reset email sent"}

# Admin endpoints
@router.get("/pending-approvals", response_model=list[User])
async def get_pending_approvals(
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    users = db.query(User).filter(User.is_approved == False, User.is_superuser == False).all()
    return users

@router.put("/approve-user/{user_id}")
async def approve_user(
    user_id: int,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_approved = True
    db.commit()
    return {"message": "User approved successfully"}

@router.put("/reject-user/{user_id}")
async def reject_user(
    user_id: int,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"message": "User rejected and removed"}