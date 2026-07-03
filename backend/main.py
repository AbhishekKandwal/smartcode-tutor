from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.database import engine
from backend import models
from backend.auth import router as auth_router
from backend.code_runner import router as code_router
from backend.questions import router as question_router

app = FastAPI()

# ---- CORS ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- CREATE TABLES ----
models.Base.metadata.create_all(bind=engine)

# ---- ROUTERS ----
app.include_router(auth_router, prefix="/api")
app.include_router(question_router, prefix="/api")
app.include_router(code_router, prefix="/api")

from backend.chat import router as chat_router
app.include_router(chat_router, prefix="/api")

from backend.analytics import router as analytics_router
app.include_router(analytics_router, prefix="/api")

from backend.auth import router as auth_router
app.include_router(auth_router, prefix="/api")

# ---- FRONTEND ----
import os
frontend_dir = "frontend/dist" if os.path.exists("frontend/dist") else "frontend"
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

@app.get("/api/health")
def health():
    return {"message": "Backend API Running Successfully"}
