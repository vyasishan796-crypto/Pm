import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.ai_query import AIQuery
from app.models.document import Document
from app.rag.retriever import retrieve_documents
from app.rag.llm import generate_answer


def calculate_confidence(num_docs: int, query_length: int) -> float:
    if num_docs == 0:
        return 0.15
    base = min(num_docs * 0.2, 0.8)
    if query_length > 20:
        base += 0.1
    return min(round(base, 2), 0.95)


def generate_related_questions(question: str, sources: list) -> list:
    questions = []
    if any(s.get("category") == "patent" for s in sources):
        questions.append("What are the steps to file a patent for an Ayurveda product?")
    if any(s.get("category") == "trademark" for s in sources):
        questions.append("How do I register a trademark for my Ayurveda brand?")
    if any(s.get("category") == "traditional_knowledge" for s in sources):
        questions.append("How is traditional knowledge protected under Indian IP law?")
    if not questions:
        questions = [
            "What is the difference between a patent and a trademark?",
            "How can I protect my Ayurveda formulation internationally?",
            "What are the requirements for GI registration of traditional products?",
        ]
    return questions[:3]


async def process_ai_query(
    db: AsyncSession,
    question: str,
    language: str,
    user_id: int = None,
) -> dict:
    retrieved_docs = await retrieve_documents(db, question, language)

    sources = []
    context_parts = []
    for doc in retrieved_docs:
        sources.append({
            "title": doc.title,
            "source": doc.source or "Nexora Knowledge Base",
            "category": doc.category,
            "snippet": (doc.content_text or "")[:300],
        })
        context_parts.append(doc.content_text or "")

    answer = await generate_answer(question, context_parts, language, sources)

    confidence = calculate_confidence(len(retrieved_docs), len(question))
    related_questions = generate_related_questions(question, sources)

    query_record = AIQuery(
        user_id=user_id,
        question=question,
        language=language,
        response=answer,
        sources=json.dumps(sources),
    )
    db.add(query_record)

    return {
        "answer": answer,
        "sources": sources,
        "confidence": confidence,
        "related_questions": related_questions,
    }
