# SmartCode Tutor

SmartCode Tutor is an AI-powered coding and practice platform designed to elevate the coding learning experience. Unlike traditional online judges that only provide basic "Correct" or "Incorrect" feedback, SmartCode Tutor features a virtual AI mentor that guides users through hints and Socratic dialogues without directly giving away solutions.

---

## 🚀 Key Features

* **Interactive Code Playground**: A premium coding editor supporting multiple programming languages (C, C++, Java, Python) with code syntax coloring and autocompletion powered by **Microsoft Monaco Editor**.
* **AI Coding Tutor**: An integrated interactive tutor chatbot powered by **Google Gemini 2.5 Flash** that reviews code submissions, points out logic errors, and guides users with hints.
* **AI Question Importer**: An administration utility that generates fully structured coding challenges (titles, descriptions, and test cases) directly from LeetCode URLs or titles using Gemini AI.
* **Student Dashboard**: Tracks user milestones, solved questions, activity status, and XP (Experience Points).

---

## 🏗️ Project Architecture & Tech Stack

The application follows a traditional client-server architecture:

1. **Frontend (User Interface)**:
   * **React.js**: For a responsive, single-page application experience.
   * **Monaco Editor**: Integrated for a native IDE feel.
   * **Vite**: Modern front-end tool for ultra-fast builds.

2. **Backend (API Service)**:
   * **FastAPI (Python)**: High-performance backend routing, validation, and async support.
   * **Subprocess Execution Sandbox**: Compiles and executes user code (using `g++`, `gcc`, `python`) against test cases securely.

3. **Database**:
   * **SQLite**: A serverless local database for simple deployment and rapid query performance.
   * **SQLAlchemy (ORM)**: Translates database rows to Python models securely.
   * **JWT Authentication & Bcrypt**: Secures user routes via cryptographic tokens and hashes user passwords.

---

## 🛠️ Installation & Setup

### Prerequisites
Make sure you have the following installed:
* Python 3.10+
* Node.js & npm
* C/C++ compiler (`gcc`/`g++`) in your system's PATH

### 1. Clone the Repository
```bash
git clone https://github.com/AbhishekKandwal/smartcode-tutor.git
cd smartcode-tutor
```

### 2. Backend Setup
1. Create a virtual environment and activate it:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables in a `.env` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   SECRET_KEY=your_jwt_secret_key_here
   ```
4. Run database verification and populate initial questions:
   ```bash
   python check_db.py
   python populate_100_questions.py
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### 4. Running the Project
To start both servers, you can run the convenience script:
```bash
start.bat
```
Alternatively, run them separately:
* **Backend**: `uvicorn backend.main:app --reload`
* **Frontend**: `npm run dev` (from the `frontend` folder)

---

## 🛡️ License & Author

* **Author**: Abhishek Kandwal
* **Project Type**: Final Year College Project
