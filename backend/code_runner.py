# backend/code_runner.py
import os
import subprocess
import tempfile
import sys
import json
import time
from typing import Dict, List

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.orm import Session
from backend.schemas import CodeRunRequest, CodeRunResult
from backend.database import get_db
from backend.models import Question, UserSubmission, User
from backend.auth import get_current_user

router = APIRouter(tags=["run-code"])

def _run_compiled_tests(executable_cmd: List[str], tests: List[Dict[str, str]], tmp_dir: str) -> CodeRunResult:
    total_time_ms = 0.0
    for t in tests:
        start_time = time.time()
        try:
            result = subprocess.run(
                executable_cmd,
                input=t["input"].encode(),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=2,
                cwd=tmp_dir
            )
        except subprocess.TimeoutExpired:
            total_time_ms += (time.time() - start_time) * 1000
            return CodeRunResult(verdict="TIME_LIMIT_EXCEEDED", message="Your code took too long.", execution_time_ms=total_time_ms)
        
        total_time_ms += (time.time() - start_time) * 1000

        if result.returncode != 0:
            return CodeRunResult(
                verdict="RUNTIME_ERROR",
                message="Your code crashed.",
                test_input=t["input"],
                stderr=result.stderr.decode(),
                execution_time_ms=total_time_ms
            )

        out = result.stdout.decode().strip()
        expected = str(t["output"]).strip()

        if out != expected:
            return CodeRunResult(
                verdict="WRONG_ANSWER",
                message="Output does not match expected.",
                test_input=t["input"],
                expected_output=expected,
                your_output=out,
                execution_time_ms=total_time_ms
            )
            
    if tests:
        t = tests[-1]
        return CodeRunResult(
            verdict="CORRECT",
            message="All test cases passed!",
            test_input=t["input"],
            expected_output=str(t["output"]).strip(),
            your_output=str(t["output"]).strip(),
            execution_time_ms=total_time_ms
        )
    return CodeRunResult(verdict="CORRECT", message="All test cases passed!", execution_time_ms=total_time_ms)


def run_c_cpp(code: str, tests: List[Dict[str, str]], is_cpp: bool) -> CodeRunResult:
    ext = "cpp" if is_cpp else "c"
    compiler = "g++" if is_cpp else "gcc"
    
    with tempfile.TemporaryDirectory() as tmp:
        src_file = os.path.join(tmp, f"solution.{ext}")
        exe_file = os.path.join(tmp, "solution.exe")
        
        with open(src_file, "w", encoding="utf-8") as f:
            f.write(code)
            
        compile_res = subprocess.run([compiler, src_file, "-o", exe_file], stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=tmp)
        if compile_res.returncode != 0:
            return CodeRunResult(verdict="RUNTIME_ERROR", message="Compilation Error", stderr=compile_res.stderr.decode(), execution_time_ms=0.0)
            
        return _run_compiled_tests([exe_file], tests, tmp)

def run_java(code: str, tests: List[Dict[str, str]]) -> CodeRunResult:
    with tempfile.TemporaryDirectory() as tmp:
        src_file = os.path.join(tmp, "Solution.java")
        
        with open(src_file, "w", encoding="utf-8") as f:
            f.write(code)
            
        compile_res = subprocess.run(["javac", src_file], stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=tmp)
        if compile_res.returncode != 0:
            return CodeRunResult(verdict="RUNTIME_ERROR", message="Compilation Error", stderr=compile_res.stderr.decode(), execution_time_ms=0.0)
            
        return _run_compiled_tests(["java", "Solution"], tests, tmp)

def run_python(code: str, tests: List[Dict[str, str]]) -> CodeRunResult:
    with tempfile.TemporaryDirectory() as tmp:
        src_file = os.path.join(tmp, "solution.py")
        with open(src_file, "w", encoding="utf-8") as f:
            f.write(code)
            
        return _run_compiled_tests([sys.executable, src_file], tests, tmp)

@router.post("/run-code", response_model=CodeRunResult)
def run_code(payload: CodeRunRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> CodeRunResult:
    qid = payload.question_id
    question = db.query(Question).filter(Question.id == qid).first()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    try:
        tests = json.loads(question.test_cases)
    except:
        tests = []
        
    if not tests:
        raise HTTPException(status_code=404, detail="No test cases defined for this question")

    final_code = payload.code
    lang = payload.language.lower()
    
    if lang == "python":
        result = run_python(final_code, tests)
    elif lang == "c":
        result = run_c_cpp(final_code, tests, is_cpp=False)
    elif lang == "cpp":
        result = run_c_cpp(final_code, tests, is_cpp=True)
    elif lang == "java":
        result = run_java(final_code, tests)
    else:
        raise HTTPException(status_code=400, detail="Unsupported language")

    
    # Log submission
    earned = 0
    if result.verdict == "CORRECT":
        earned = 10
        current_user.xp += earned

    submission = UserSubmission(
        user_id=current_user.id,
        question_id=qid, 
        verdict=result.verdict,
        execution_time_ms=result.execution_time_ms
    )
    db.add(submission)
    db.commit()
    db.refresh(current_user)
    
    result.earned_xp = earned
    result.total_xp = current_user.xp
    return result
