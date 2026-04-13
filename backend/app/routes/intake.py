from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import ChickenIntake as ChickenIntakeModel
from app.schemas.schemas import ChickenIntake, ChickenIntakeCreate, ChickenIntakeUpdate
from app.utils.dependencies import get_current_approved_user

router = APIRouter()

@router.post("/", response_model=ChickenIntake)
async def create_intake(
    intake: ChickenIntakeCreate,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    db_intake = ChickenIntakeModel(
        owner_id=current_user.id,
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

@router.get("/", response_model=List[ChickenIntake])
async def read_intakes(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    intakes = db.query(ChickenIntakeModel).filter(ChickenIntakeModel.owner_id == current_user.id).offset(skip).limit(limit).all()
    return intakes

@router.get("/{intake_id}", response_model=ChickenIntake)
async def read_intake(
    intake_id: int,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    intake = db.query(ChickenIntakeModel).filter(
        ChickenIntakeModel.id == intake_id,
        ChickenIntakeModel.owner_id == current_user.id
    ).first()
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
    intake = db.query(ChickenIntakeModel).filter(
        ChickenIntakeModel.id == intake_id,
        ChickenIntakeModel.owner_id == current_user.id
    ).first()
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
    intake = db.query(ChickenIntakeModel).filter(
        ChickenIntakeModel.id == intake_id,
        ChickenIntakeModel.owner_id == current_user.id
    ).first()
    if intake is None:
        raise HTTPException(status_code=404, detail="Intake not found")

    db.delete(intake)
    db.commit()
    return {"message": "Intake deleted successfully"}