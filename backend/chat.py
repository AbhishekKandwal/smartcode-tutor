import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
from backend.auth import get_current_user

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

router = APIRouter(tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    code: str
    question_title: str
    question_description: str

class ChatResponse(BaseModel):
    response: str

class ReviewRequest(BaseModel):
    code: str
    question_title: str

@router.post("/chat", response_model=ChatResponse)
def ai_tutor_chat(payload: ChatRequest):
    if not api_key:
        return ChatResponse(response="It looks like the GEMINI_API_KEY is not set in your .env file! Please add a valid key and restart the server to use the AI Tutor.")
        
    system_instruction = (
        "You are an expert Socratic Code Tutor. Your goal is to guide the student to the right answer, "
        "not give them the code directly. Point out bugs, give conceptual hints, and encourage them. "
        "Format your answer with markdown. Keep it concise, helpful, and friendly."
    )
    
    prompt = f"""
    Context:
    The student is working on the problem: "{payload.question_title}".
    Problem Description:
    {payload.question_description}
    
    Student's Current Code:
    ```python
    {payload.code}
    ```
    
    Student Message: {payload.message}
    """
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash', system_instruction=system_instruction)
        response = model.generate_content(prompt)
        return ChatResponse(response=response.text)
    except Exception as e:
        return ChatResponse(response=f"Error communicating with AI: {str(e)}")

@router.post("/chat/review")
def ai_code_review(req: ReviewRequest, current_user = Depends(get_current_user)):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured.")
        
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    prompt = f"""
    You are an expert Competitive Programming coach.
    The user just solved the problem: '{req.question_title}'.
    Here is their correct code:
    ```python
    {req.code}
    ```
    Please provide a brief, encouraging review of their code.
    Specifically state the Time Complexity (Big O) and Space Complexity of their approach.
    Keep it under 3-4 sentences.
    """
    
    response = model.generate_content(prompt)
    return {"review": response.text}
