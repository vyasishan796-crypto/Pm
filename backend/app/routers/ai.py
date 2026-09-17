from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.ai_query import AIQueryRequest, AIQueryResponse
from app.services.ai_service import process_ai_query
from app.core.security import get_current_user

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/query", response_model=AIQueryResponse)
async def query_ai(
    request: AIQueryRequest,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    result = await process_ai_query(
        db=db,
        question=request.question,
        language=request.language,
        user_id=user.user_id,
    )
    return AIQueryResponse(**result)

@router.get("/history")
async def query_history(
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    from sqlalchemy import select
    from app.models.ai_query import AIQuery
    result = await db.execute(
        select(AIQuery)
        .where(AIQuery.user_id == user.user_id)
        .order_by(AIQuery.created_at.desc())
        .limit(50)
    )
    queries = result.scalars().all()
    return {
        "queries": [
            {
                "id": q.query_id,
                "question": q.question,
                "language": q.language,
                "response": q.response,
                "sources": q.sources,
                "created_at": q.created_at.isoformat() if q.created_at else None,
            }
            for q in queries
        ]
    }
