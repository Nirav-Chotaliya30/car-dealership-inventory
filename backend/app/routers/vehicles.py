from fastapi import APIRouter, Depends,status,HTTPException
from sqlalchemy.orm import Session
from app import schemas,models
from app.database import get_db
from app.dependencies import get_current_user,get_current_admin_user
from typing import List,Optional

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])

@router.get("/search", response_model=List[schemas.VehicleOut])
def search_vehicles(
    make: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Vehicle)

    if make:
        query = query.filter(models.Vehicle.make == make)
    if model:
        query = query.filter(models.Vehicle.model == model)
    if category:
        query = query.filter(models.Vehicle.category == category)
    if min_price is not None:
        query = query.filter(models.Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Vehicle.price <= max_price)

    return query.all()

@router.put("/{vehicle_id}", response_model=schemas.VehicleOut)
def update_vehicle(
    vehicle_id: int,
    vehicle_update: schemas.VehicleUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    for field, value in vehicle_update.model_dump().items():
        setattr(vehicle, field, value)

    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    db.delete(vehicle)
    db.commit()
    return None

@router.post("/{vehicle_id}/purchase", response_model=schemas.VehicleOut)
def purchase_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    if vehicle.quantity <= 0:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Vehicle out of stock")

    vehicle.quantity -= 1
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.post("/{vehicle_id}/restock", response_model=schemas.VehicleOut)
def restock_vehicle(
    vehicle_id: int,
    restock: schemas.RestockRequest,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    vehicle.quantity += restock.amount
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.get("", response_model=List[schemas.VehicleOut])
def list_vehicles(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Vehicle).all()

@router.post("", response_model=schemas.VehicleOut, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    vehicle: schemas.VehicleCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    new_vehicle = models.Vehicle(**vehicle.model_dump())
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    return new_vehicle