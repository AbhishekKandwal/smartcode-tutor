# Build the Python Backend & Execution Engine
FROM python:3.10-slim

# Install OS-level dependencies for the Code Execution Engine
# (GCC, G++, and Java JDK)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source code
COPY backend/ ./backend/

# Copy the pre-filled SQLite database
COPY smartcode.db .

# Copy the frontend folder (which contains the PRE-COMPILED dist/ folder)
COPY frontend/ ./frontend/

# Unlock the database and directory so Hugging Face can write to it
RUN chmod -R 777 /app

# Expose port 7860 (Mandatory for Hugging Face Spaces Free Tier)
EXPOSE 7860

# Run the FastAPI server on host 0.0.0.0 and port 7860
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
