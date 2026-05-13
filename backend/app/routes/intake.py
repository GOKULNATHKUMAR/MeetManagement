from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app.models.models import ChickenIntake as ChickenIntakeModel
from app.schemas.schemas import ChickenIntake, ChickenIntakeCreate, ChickenIntakeUpdate, ChickenIntakeWithOwner
from app.utils.dependencies import get_current_approved_user

router = APIRouter()

@router.post("/", response_model=ChickenIntake)
async def create_intake(
    intake: ChickenIntakeCreate,
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
    
    db_intake = ChickenIntakeModel(
        owner_id=user_owner_id,
        quantity=intake.quantity,
        supplier=intake.supplier,
        cost_per_unit=intake.cost_per_unit,
        total_cost=intake.total_cost,
        intake_date=intake.intake_date,
        notes=intake.notes
    )
    db.add(db_intake)
    db.commit()
    db.refresh(db_intake)
    return db_intake

@router.get("/", response_model=List[ChickenIntakeWithOwner])
async def read_intakes(
    skip: int = 0,
    limit: int = 100,
    user_id: int = None,  # For admin filtering
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    query = db.query(ChickenIntakeModel).options(joinedload(ChickenIntakeModel.owner))
    
    # If super admin, they can filter by user_id or see all
    if current_user.is_superuser:
        if user_id:
            query = query.filter(ChickenIntakeModel.owner_id == user_id)
        # else: return all intakes
    else:
        # Regular user sees only their own
        query = query.filter(ChickenIntakeModel.owner_id == current_user.id)
    
    intakes = query.offset(skip).limit(limit).all()
    return intakes

@router.get("/{intake_id}", response_model=ChickenIntake)
async def read_intake(
    intake_id: int,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    query = db.query(ChickenIntakeModel).filter(ChickenIntakeModel.id == intake_id)
    
    # Admin can access any intake, regular user only their own
    if not current_user.is_superuser:
        query = query.filter(ChickenIntakeModel.owner_id == current_user.id)
    
    intake = query.first()
    if intake is None:
        raise HTTPException(status_code=404, detail="Intake not found")
    return intake

@router.put("/{intake_id}", response_model=ChickenIntake)
async def update_intake(
    intake_id: int,
    intake_update: ChickenIntakeUpdate,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    query = db.query(ChickenIntakeModel).filter(ChickenIntakeModel.id == intake_id)
    
    # Admin can access any intake, regular user only their own
    if not current_user.is_superuser:
        query = query.filter(ChickenIntakeModel.owner_id == current_user.id)
    
    intake = query.first()
    if intake is None:
        raise HTTPException(status_code=404, detail="Intake not found")

    update_data = intake_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(intake, field, value)

    db.commit()
    db.refresh(intake)
    return intake

@router.delete("/{intake_id}")
async def delete_intake(
    intake_id: int,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    query = db.query(ChickenIntakeModel).filter(ChickenIntakeModel.id == intake_id)
    
    # Admin can access any intake, regular user only their own
    if not current_user.is_superuser:
        query = query.filter(ChickenIntakeModel.owner_id == current_user.id)
    
    intake = query.first()
    if intake is None:
        raise HTTPException(status_code=404, detail="Intake not found")

    db.delete(intake)
    db.commit()
    return {"message": "Intake deleted successfully"}