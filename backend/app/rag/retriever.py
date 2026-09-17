from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.document import Document
from app.rag.embeddings import get_embeddings
from app.rag.vector_store import query_documents


async def retrieve_documents(db: AsyncSession, question: str, language: str, top_k: int = 5) -> list[Document]:
    embeddings = get_embeddings([question])
    if not embeddings or not embeddings[0]:
        result = await db.execute(
            select(Document)
            .where(Document.verified_status == "verified")
            .limit(top_k)
        )
        return result.scalars().all()

    query_result = query_documents(embeddings[0], n_results=top_k)

    doc_ids = []
    if query_result and query_result.get("ids") and query_result["ids"][0]:
        doc_ids = [int(did) for did in query_result["ids"][0] if did.isdigit()]

    if doc_ids:
        result = await db.execute(
            select(Document).where(Document.document_id.in_(doc_ids))
        )
        docs = result.scalars().all()
        if docs:
            return docs

    result = await db.execute(
        select(Document)
        .where(Document.verified_status == "verified")
        .limit(top_k)
    )
    return result.scalars().all()
