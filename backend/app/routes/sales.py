from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app.models.models import ChickenSale as ChickenSaleModel
from app.schemas.schemas import ChickenSale, ChickenSaleCreate, ChickenSaleUpdate, ChickenSaleWithOwner
from app.utils.dependencies import get_current_approved_user

router = APIRouter()

@router.post("/", response_model=ChickenSale)
async def create_sale(
    sale: ChickenSaleCreate,
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
    
    db_sale = ChickenSaleModel(
        owner_id=user_owner_id,
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

@router.get("/", response_model=List[ChickenSaleWithOwner])
async def read_sales(
    skip: int = 0,
    limit: int = 100,
    user_id: int = None,  # For admin filtering
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    query = db.query(ChickenSaleModel).options(joinedload(ChickenSaleModel.owner))
    
    # If super admin, they can filter by user_id or see all
    if current_user.is_superuser:
        if user_id:
            query = query.filter(ChickenSaleModel.owner_id == user_id)
        # else: return all sales
    else:
        # Regular user sees only their own
        query = query.filter(ChickenSaleModel.owner_id == current_user.id)
    
    sales = query.offset(skip).limit(limit).all()
    return sales

@router.get("/{sale_id}", response_model=ChickenSale)
async def read_sale(
    sale_id: int,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    query = db.query(ChickenSaleModel).filter(ChickenSaleModel.id == sale_id)
    
    # Admin can access any sale, regular user only their own
    if not current_user.is_superuser:
        query = query.filter(ChickenSaleModel.owner_id == current_user.id)
    
    sale = query.first()
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
    query = db.query(ChickenSaleModel).filter(ChickenSaleModel.id == sale_id)
    
    # Admin can access any sale, regular user only their own
    if not current_user.is_superuser:
        query = query.filter(ChickenSaleModel.owner_id == current_user.id)
    
    sale = query.first()
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
    query = db.query(ChickenSaleModel).filter(ChickenSaleModel.id == sale_id)
    
    # Admin can access any sale, regular user only their own
    if not current_user.is_superuser:
        query = query.filter(ChickenSaleModel.owner_id == current_user.id)
    
    sale = query.first()
    if sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")

    db.delete(sale)
    db.commit()
    return {"message": "Sale deleted successfully"}