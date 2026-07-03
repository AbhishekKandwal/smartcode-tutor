from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any

from backend.database import get_db
from backend.models import UserSubmission, Question, User
from backend.auth import get_current_user

router = APIRouter(tags=["analytics"])

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    submissions = db.query(UserSubmission, Question).join(Question, UserSubmission.question_id == Question.id).filter(UserSubmission.user_id == current_user.id).all()
    
    total_submissions = len(submissions)
    if total_submissions == 0:
        return {"error": "No data available"}
    
    correct_count = 0
    verdict_counts = {}
    topic_stats = {
        "Array/Math": {"total": 0, "correct": 0},
        "String": {"total": 0, "correct": 0},
        "Tree": {"total": 0, "correct": 0},
    }
    
    correct_exec_time = 0.0
    
    for sub, q in submissions:
        v = sub.verdict
        verdict_counts[v] = verdict_counts.get(v, 0) + 1
        
        if v == "CORRECT":
            correct_count += 1
            correct_exec_time += sub.execution_time_ms
        
        # Determine category
        cat = "Array/Math"
        if q.question_type == "binary_tree":
            cat = "Tree"
        elif "string" in q.title.lower():
            cat = "String"
            
        topic_stats[cat]["total"] += 1
        if v == "CORRECT":
            topic_stats[cat]["correct"] += 1
            
    # Format for Recharts
    accuracy_data = [{"name": k, "value": v} for k, v in verdict_counts.items()]
    
    topic_data = []
    for topic, stats in topic_stats.items():
        if stats["total"] > 0:
            topic_data.append({
                "topic": topic,
                "passRate": round((stats["correct"] / stats["total"]) * 100, 1)
            })
            
    # Timeline data (last 50)
    timeline_subs = db.query(UserSubmission).order_by(UserSubmission.id.asc()).limit(50).all()
    timeline_data = []
    for idx, sub in enumerate(timeline_subs):
        timeline_data.append({
            "attempt": idx + 1,
            "time": round(sub.execution_time_ms, 2)
        })
        
    avg_time = correct_exec_time / correct_count if correct_count > 0 else 0
        
    return {
        "metrics": {
            "total_submissions": total_submissions,
            "accuracy": round((correct_count / total_submissions) * 100, 1),
            "avg_execution_time_ms": round(avg_time, 2)
        },
        "accuracy_data": accuracy_data,
        "topic_data": topic_data,
        "timeline_data": timeline_data
    }
