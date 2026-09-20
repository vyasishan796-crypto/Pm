from pydantic import BaseModel, Field
from typing import Optional, List


class AIQueryRequest(BaseModel):
    question: str = Field(..., max_length=5000)
    language: str = "en"


class Source(BaseModel):
    title: str
    source: str
    category: str
    snippet: str


class AIQueryResponse(BaseModel):
    answer: str
    sources: List[Source] = []
    confidence: float = 0.0
    related_questions: List[str] = []


class DocumentUpload(BaseModel):
    title: str
    source: Optional[str] = None
    category: str
    language: str = "en"
    content_text: str


class DocumentResponse(BaseModel):
    document_id: int
    title: str
    source: Optional[str] = None
    category: str
    language: str
    verified_status: str

    class Config:
        from_attributes = True
