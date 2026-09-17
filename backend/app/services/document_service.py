from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.user import User
from app.models.blood_bank import BloodBank
from app.models.blood_availability import BloodAvailability
from app.models.document import Document
from app.models.ai_query import AIQuery


async def get_admin_stats(db: AsyncSession):
    users = await db.execute(select(func.count(User.user_id)))
    blood_banks = await db.execute(select(func.count(BloodBank.blood_bank_id)))
    verified_bb = await db.execute(
        select(func.count(BloodBank.blood_bank_id)).where(
            BloodBank.verification_status == "verified"
        )
    )
    pending_bb = await db.execute(
        select(func.count(BloodBank.blood_bank_id)).where(
            BloodBank.verification_status == "pending"
        )
    )
    documents = await db.execute(select(func.count(Document.document_id)))
    queries = await db.execute(select(func.count(AIQuery.query_id)))

    return {
        "total_users": users.scalar() or 0,
        "total_blood_banks": blood_banks.scalar() or 0,
        "verified_blood_banks": verified_bb.scalar() or 0,
        "pending_verifications": pending_bb.scalar() or 0,
        "total_documents": documents.scalar() or 0,
        "total_queries": queries.scalar() or 0,
    }


async def get_all_users_admin(db: AsyncSession):
    result = await db.execute(select(User))
    return result.scalars().all()


async def get_all_blood_banks_admin(db: AsyncSession):
    result = await db.execute(select(BloodBank))
    return result.scalars().all()


async def verify_blood_bank(db: AsyncSession, blood_bank_id: int, status: str):
    result = await db.execute(
        select(BloodBank).where(BloodBank.blood_bank_id == blood_bank_id)
    )
    bb = result.scalar_one_or_none()
    if bb:
        bb.verification_status = status
        await db.flush()
    return bb


async def get_all_queries(db: AsyncSession):
    result = await db.execute(select(AIQuery).order_by(AIQuery.created_at.desc()).limit(100))
    return result.scalars().all()


async def get_all_documents(db: AsyncSession):
    result = await db.execute(select(Document))
    return result.scalars().all()
