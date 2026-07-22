from fastapi import APIRouter, Depends,status
from sqlalchemy.orm import Session
from app import schemas,models
from app.database import get_db
from app.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])

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