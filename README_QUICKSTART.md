# SmartCode Tutor - Quick Start Guide

## What I Fixed

1. **API Route Issue**: Fixed the duplicate `/api` prefix in the questions router
2. **Database Check Script**: Added `check_db.py` to verify if questions are loaded
3. **Improved Ingest Script**: Fixed duplicate entry handling in `ingest_leetcode.py`

## How to Run

### 1. Check if Database Has Questions

```bash
python check_db.py
```

### 2. If No Questions Found, Ingest Data

```bash
python ingest_leetcode.py
```

This will fetch 200 questions from LeetCode and store them in the database.

### 3. Start the Backend Server

```bash
uvicorn backend.main:app --reload
```

The server will run at `http://127.0.0.1:8000`

### 4. Open the Frontend

Open your browser and go to:
```
http://127.0.0.1:8000
```

The frontend should now load and display questions!

## Troubleshooting

### Still No Questions?

1. Make sure the backend is running
2. Open browser console (F12) to check for errors
3. Try accessing the API directly: `http://127.0.0.1:8000/api/questions/`

### Port Already in Use?

If port 8000 is busy, use a different port:
```bash
uvicorn backend.main:app --reload --port 8080
```

Then update `API_BASE` in `frontend/script.js` to `http://127.0.0.1:8080`

## Project Structure

- `backend/` - FastAPI backend
  - `main.py` - Main app with CORS and static file serving
  - `questions.py` - Question endpoints
  - `models.py` - Database models
  - `database.py` - Database connection

- `frontend/` - Simple HTML/CSS/JS interface
  - `index.html` - Main UI
  - `script.js` - API calls and interactions
  - `style.css` - Styling

- `smartcode.db` - SQLite database
- `ingest_leetcode.py` - Script to fetch questions from LeetCode
- `check_db.py` - Utility to check database contents
