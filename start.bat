@echo off
echo ================================
echo SmartCode Tutor - Startup Script
echo ================================
echo.

echo [1/3] Checking database...
python check_db.py
echo.

echo [2/3] If you saw "No questions found", press Ctrl+C and run: python ingest_leetcode.py
echo Otherwise, continue...i want e
timeout /t 3
echo.

echo [3/3] Starting server...
echo Access your app at: http://127.0.0.1:8000
echo Press Ctrl+C to stop
echo.
uvicorn backend.main:app --reload
