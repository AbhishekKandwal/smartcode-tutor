from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey
from backend.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String)
    difficulty = Column(String)
    description = Column(Text)
    question_type = Column(String, default="standard")
    driver_code = Column(Text, nullable=True)
    test_cases = Column(Text, default="[]")

class UserSubmission(Base):
    __tablename__ = "user_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # allow null during transition
    question_id = Column(Integer, index=True)
    verdict = Column(String)
    execution_time_ms = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow)

