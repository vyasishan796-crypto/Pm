from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.blood import BloodAvailabilityUpdate, BloodBankResponse
from app.services.blood_service import search_blood, update_availability, get_all_blood_banks
from app.core.security import get_current_user, require_blood_bank

router = APIRouter(prefix="/api/blood", tags=["blood"])


@router.get("/search")
async def search_blood_availability(
    blood_group: str = Query(...),
    city: Optional[str] = Query(None),
    latitude: Optional[float] = Query(None),
    longitude: Optional[float] = Query(None),
    radius: int = Query(50),
    db: AsyncSession = Depends(get_db),
):
    results = await search_blood(
        db=db,
        blood_group=blood_group,
        city=city,
        latitude=latitude,
        longitude=longitude,
        radius=radius,
    )
    return {"results": results, "total": len(results)}


@router.get("/banks")
async def list_blood_banks(db: AsyncSession = Depends(get_db)):
    banks = await get_all_blood_banks(db)
    return {"banks": banks}


@router.put("/banks/{blood_bank_id}/availability")
async def update_blood_availability(
    blood_bank_id: int,
    updates: list[BloodAvailabilityUpdate],
    db: AsyncSession = Depends(get_db),
    user=Depends(require_blood_bank),
):
    results = []
    for update in updates:
        avail = await update_availability(
            db=db,
            blood_bank_id=blood_bank_id,
            blood_group=update.blood_group,
            status=update.status,
            units_available=update.units_available,
        )
        results.append(avail)
    return {"updated": len(results)}
