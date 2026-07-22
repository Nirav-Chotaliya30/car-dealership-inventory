from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app import models

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])

@router.get("")
def list_vehicles(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return []