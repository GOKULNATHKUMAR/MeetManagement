from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import ChickenSale
from app.schemas.schemas import ChickenSale, ChickenSaleCreate, ChickenSaleUpdate
from app.utils.dependencies import get_current_approved_user

router = APIRouter()

@router.post("/", response_model=ChickenSale)
async def create_sale(
    sale: ChickenSaleCreate,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    db_sale = ChickenSale(
        owner_id=current_user.id,
        quantity=sale.quantity,
        price_per_unit=sale.price_per_unit,
        total_revenue=sale.total_revenue,
        customer_name=sale.customer_name,
        sale_date=sale.sale_date,
        notes=sale.notes
    )
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.get("/", response_model=List[ChickenSale])
async def read_sales(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    sales = db.query(ChickenSale).filter(ChickenSale.owner_id == current_user.id).offset(skip).limit(limit).all()
    return sales

@router.get("/{sale_id}", response_model=ChickenSale)
async def read_sale(
    sale_id: int,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    sale = db.query(ChickenSale).filter(
        ChickenSale.id == sale_id,
        ChickenSale.owner_id == current_user.id
    ).first()
    if sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

@router.put("/{sale_id}", response_model=ChickenSale)
async def update_sale(
    sale_id: int,
    sale_update: ChickenSaleUpdate,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    sale = db.query(ChickenSale).filter(
        ChickenSale.id == sale_id,
        ChickenSale.owner_id == current_user.id
    ).first()
    if sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")

    update_data = sale_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(sale, field, value)

    db.commit()
    db.refresh(sale)
    return sale

@router.delete("/{sale_id}")
async def delete_sale(
    sale_id: int,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    sale = db.query(ChickenSale).filter(
        ChickenSale.id == sale_id,
        ChickenSale.owner_id == current_user.id
    ).first()
    if sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")

    db.delete(sale)
    db.commit()
    return {"message": "Sale deleted successfully"}