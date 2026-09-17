from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BloodSearchRequest(BaseModel):
    blood_group: str
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius: Optional[int] = 50


class BloodAvailabilityUpdate(BaseModel):
    blood_group: str
    status: str
    units_available: Optional[int] = None


class BloodAvailabilityResponse(BaseModel):
    availability_id: int
    blood_bank_id: int
    blood_group: str
    status: str
    units_available: Optional[int] = None
    last_updated: datetime

    class Config:
        from_attributes = True


class BloodBankResponse(BaseModel):
    blood_bank_id: int
    name: str
    address: str
    city: str
    latitude: float
    longitude: float
    phone: str
    verification_status: str
    availability: List[BloodAvailabilityResponse] = []
    distance: Optional[float] = None

    class Config:
        from_attributes = True


class BloodBankCreate(BaseModel):
    name: str
    address: str
    city: str
    latitude: float
    longitude: float
    phone: str


class BloodBankUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
