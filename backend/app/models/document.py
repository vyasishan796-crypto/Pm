from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base


class Document(Base):
    __tablename__ = "documents"

    document_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(500), nullable=False)
    source = Column(String(500), nullable=True)
    category = Column(String(50), nullable=False, index=True)
    language = Column(String(10), nullable=False, default="en")
    file_path = Column(String(500), nullable=True)
    content_text = Column(Text, nullable=True)
    embedding_id = Column(String(255), nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    verified_status = Column(String(20), nullable=False, default="pending")
