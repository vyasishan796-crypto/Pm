from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.document_service import (
    get_admin_stats,
    get_all_users_admin,
    get_all_blood_banks_admin,
    verify_blood_bank,
    get_all_queries,
    get_all_documents,
)
from app.core.security import require_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats")
async def admin_stats(
    db: AsyncSession = Depends(get_db),
    user=Depends(require_admin),
):
    return await get_admin_stats(db)


@router.get("/users")
async def admin_users(
    db: AsyncSession = Depends(get_db),
    user=Depends(require_admin),
):
    users = await get_all_users_admin(db)
    return {"users": users}


@router.get("/blood-banks")
async def admin_blood_banks(
    db: AsyncSession = Depends(get_db),
    user=Depends(require_admin),
):
    banks = await get_all_blood_banks_admin(db)
    return {"banks": banks}


@router.put("/blood-banks/{blood_bank_id}/verify")
async def admin_verify_blood_bank(
    blood_bank_id: int,
    status: str = Query("verified"),
    db: AsyncSession = Depends(get_db),
    user=Depends(require_admin),
):
    bb = await verify_blood_bank(db, blood_bank_id, status)
    return {"status": bb.verification_status if bb else "not_found"}


@router.get("/queries")
async def admin_queries(
    db: AsyncSession = Depends(get_db),
    user=Depends(require_admin),
):
    queries = await get_all_queries(db)
    return {"queries": queries}


@router.get("/documents")
async def admin_documents(
    db: AsyncSession = Depends(get_db),
    user=Depends(require_admin),
):
    docs = await get_all_documents(db)
    return {"documents": docs}
