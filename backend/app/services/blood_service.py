import json
from math import radians, sin, cos, sqrt, atan2
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.blood_bank import BloodBank
from app.models.blood_availability import BloodAvailability


def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371e3
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))


async def search_blood(
    db: AsyncSession,
    blood_group: str,
    city: str = None,
    latitude: float = None,
    longitude: float = None,
    radius: int = 50,
):
    query = select(BloodBank).where(
        BloodBank.verification_status == "verified"
    )
    if city:
        query = query.where(BloodBank.city.ilike(f"%{city}%"))

    result = await db.execute(query)
    blood_banks = result.scalars().all()

    results = []
    for bank in blood_banks:
        avail_result = await db.execute(
            select(BloodAvailability).where(
                BloodAvailability.blood_bank_id == bank.blood_bank_id,
                BloodAvailability.blood_group == blood_group,
            )
        )
        availability = avail_result.scalars().all()

        distance = None
        if latitude and longitude:
            distance = haversine(latitude, longitude, bank.latitude, bank.longitude)
            if distance > radius * 1000:
                continue

        avail_data = []
        all_avail_result = await db.execute(
            select(BloodAvailability).where(
                BloodAvailability.blood_bank_id == bank.blood_bank_id
            )
        )
        for a in all_avail_result.scalars().all():
            avail_data.append({
                "availability_id": a.availability_id,
                "blood_bank_id": a.blood_bank_id,
                "blood_group": a.blood_group,
                "status": a.status,
                "units_available": a.units_available,
                "last_updated": a.last_updated.isoformat() if a.last_updated else None,
            })

        results.append({
            "blood_bank_id": bank.blood_bank_id,
            "name": bank.name,
            "address": bank.address,
            "city": bank.city,
            "latitude": bank.latitude,
            "longitude": bank.longitude,
            "phone": bank.phone,
            "verification_status": bank.verification_status,
            "availability": avail_data,
            "distance": distance,
        })

    if latitude and longitude:
        results.sort(key=lambda x: x["distance"] or float("inf"))

    return results


async def update_availability(
    db: AsyncSession,
    blood_bank_id: int,
    blood_group: str,
    status: str,
    units_available: int = None,
):
    result = await db.execute(
        select(BloodAvailability).where(
            BloodAvailability.blood_bank_id == blood_bank_id,
            BloodAvailability.blood_group == blood_group,
        )
    )
    avail = result.scalar_one_or_none()

    if avail:
        avail.status = status
        avail.units_available = units_available
    else:
        avail = BloodAvailability(
            blood_bank_id=blood_bank_id,
            blood_group=blood_group,
            status=status,
            units_available=units_available,
        )
        db.add(avail)

    await db.flush()
    await db.refresh(avail)
    return avail


async def get_all_blood_banks(db: AsyncSession):
    result = await db.execute(select(BloodBank))
    return result.scalars().all()


async def get_blood_bank_by_id(db: AsyncSession, blood_bank_id: int):
    result = await db.execute(
        select(BloodBank).where(BloodBank.blood_bank_id == blood_bank_id)
    )
    return result.scalar_one_or_none()
