from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class BloodAvailability(Base):
    __tablename__ = "blood_availability"

    availability_id = Column(Integer, primary_key=True, autoincrement=True)
    blood_bank_id = Column(Integer, ForeignKey("blood_banks.blood_bank_id"), nullable=False)
    blood_group = Column(String(5), nullable=False, index=True)
    status = Column(String(20), nullable=False, default="unavailable")
    units_available = Column(Integer, nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
