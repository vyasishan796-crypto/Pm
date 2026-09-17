from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class AIQuery(Base):
    __tablename__ = "ai_queries"

    query_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    question = Column(Text, nullable=False)
    language = Column(String(10), nullable=False, default="en")
    response = Column(Text, nullable=True)
    sources = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
