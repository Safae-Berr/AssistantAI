from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database import Base


class KnowledgeBaseEntry(Base):
    __tablename__ = "knowledge_base_entries"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    content = Column(Text, nullable=False)

    source = Column(String, nullable=True)

    category = Column(String, nullable=True)

    embedding_id = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)