from pydantic import BaseModel, EmailStr
from typing import Optional


# --------------------- USER MODELS ---------------------

class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True


# --------------------- QUESTION MODELS ---------------------

class QuestionOut(BaseModel):
    id: int
    title: str
    slug: Optional[str] = None
    difficulty: Optional[str] = None
    description: Optional[str] = None
    question_type: Optional[str] = "standard"
    test_cases: Optional[str] = "[]"

    class Config:
        from_attributes = True

class QuestionImportRequest(BaseModel):
    title_or_url: str


# --------------------- CODE RUN MODELS ---------------------

class CodeRunRequest(BaseModel):
    question_id: int
    code: str
    language: str = "python"


class CodeRunResult(BaseModel):
    verdict: str
    message: str
    execution_time_ms: float = 0.0
    earned_xp: int = 0
    total_xp: int = 0
    test_input: Optional[str] = None
    expected_output: Optional[str] = None
    your_output: Optional[str] = None
    stderr: Optional[str] = None
