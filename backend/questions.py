import os
import json
import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import Question, UserSubmission
from backend.schemas import QuestionImportRequest
from backend.auth import get_current_user
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

@router.post("/questions/import")
def import_question(req: QuestionImportRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured.")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    prompt = f"""
    You are an AI that extracts algorithms/LeetCode problems and converts them into a specific JSON schema.
    The user has provided this problem title or URL: '{req.title_or_url}'
    
    If it is a known problem, recall the details. If it's vague, make up a standard algorithmic problem based on the prompt.
    Return ONLY a valid JSON object with the following keys, no markdown blocks, no extra text:
    - "title": A clean string title (e.g., "Two Sum")
    - "slug": A URL-friendly slug (e.g., "two-sum")
    - "difficulty": "Easy", "Medium", or "Hard"
    - "description": A string with the problem description, including example inputs/outputs.
    - "test_cases": A list of exactly 3 objects, each with "input" and "output" string fields. The input should be space-separated or newline-separated values suitable for Python's input() reading.
    """

    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        data = json.loads(response.text)
        
        # Build standard driver code
        driver_code = f"# Problem: {data['title']}\n# Read input from stdin, process it, and print to stdout.\nimport sys\n\ndef solve():\n    # TODO: Write your logic here\n    pass\n\nif __name__ == '__main__':\n    solve()\n"
        
        new_q = Question(
            title=data["title"],
            slug=data["slug"],
            difficulty=data["difficulty"],
            description=data["description"],
            question_type="standard",
            driver_code=driver_code,
            test_cases=json.dumps(data["test_cases"])
        )
        db.add(new_q)
        db.commit()
        db.refresh(new_q)
        
        return {"message": "Question imported successfully", "question_id": new_q.id, "title": new_q.title}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Import failed: {str(e)}")

@router.get("/questions")
def get_questions(db: Session = Depends(get_db)):
    return db.query(Question).order_by(Question.id).all()

@router.get("/next-question")
def next_question(
    last_question_id: int | None = None,
    verdict: str | None = None,
    db: Session = Depends(get_db)
):
    if last_question_id is None:
        q = db.query(Question).order_by(Question.id).first()
        return {"next": q, "reason": "Let's start your practice!"}

    last_q = db.query(Question).filter(Question.id == last_question_id).first()
    
    difficulties = {"Easy": 1, "Medium": 2, "Hard": 3}
    rev_diff = {1: "Easy", 2: "Medium", 3: "Hard"}
    current_diff_val = difficulties.get(last_q.difficulty, 1) if last_q else 1

    # Recommendation Engine Logic based on verdict
    if verdict == "CORRECT":
        target_diff = min(3, current_diff_val + 1)
        q = db.query(Question).filter(
            Question.difficulty == rev_diff[target_diff], 
            Question.id != last_question_id
        ).first()
        if not q:
            q = db.query(Question).filter(Question.id > last_question_id).first()
        reason = f"Great job on that one! Here's a {rev_diff[target_diff]} challenge to test your skills."
    else:
        target_diff = max(1, current_diff_val - 1)
        q = db.query(Question).filter(
            Question.difficulty == rev_diff[target_diff], 
            Question.id != last_question_id
        ).first()
        if not q:
            q = db.query(Question).filter(Question.id < last_question_id).first()
        reason = f"That was tricky. Let's build a stronger foundation with this {rev_diff[target_diff]} question."

    return {"next": q, "reason": reason}
