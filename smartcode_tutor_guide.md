# SmartCode Tutor - Complete Project Guide
*A simple, step-by-step explanation of your Final Year Project*

---

## 1. Project Overview
Imagine a coding platform like **LeetCode** where users practice programming questions. However, traditional coding websites only tell you if a "Code is Incorrect" (e.g., Wrong Answer, Runtime Error). Your project, **SmartCode Tutor**, goes a step further. It is an **AI-Powered Coding Platform** that features a virtual AI teacher (powered by Google's Gemini). If a student gets stuck, the AI analyzes their code and provides hints/guidance, exactly like a real teacher, without giving away the direct solution.

Key features of this platform include:
- **Practice Arena**: Code editing interface with support for multiple languages (C, C++, Java, Python).
- **AI Chatbot**: A Socratic AI tutor that reviews code and answers queries interactively.
- **AI Question Importer**: Admin tool to automatically generate LeetCode-style questions (with titles, descriptions, and test cases) from a URL or title, saving them directly to the database.
- **Dashboard**: A page where users can view their progress, XP (Experience Points), and solved questions.

---

## 2. Architecture: How It Works
In computer science, full-stack projects are structured into **3 core layers** (comparable to a restaurant operation):
1. **Frontend (User Interface)**: Comparable to the restaurant's menu and waiters. It is what the user interacts with (clicks, inputs, reads).
2. **Backend (Server)**: Comparable to the kitchen. It processes user requests (e.g., executing code, talking to the AI, authenticating users).
3. **Database**: Comparable to the refrigerator/pantry. It stores persistent data (users, questions, test cases, code submissions) securely.

### Technologies Used and Alternatives:
- **Frontend**: Built using **React.js** (Alternatives: Angular or Vue.js; React was chosen for its virtual DOM speed, ease of learning, and huge community ecosystem).
- **Backend**: Built using **FastAPI (Python)** (Alternatives: Django, Flask, or Node.js; FastAPI was selected for its high performance, automatic OpenAPI documentation, and Python's native support for running compilers/subprocesses).
- **Database**: Built using **SQLite** (Alternatives: MySQL, PostgreSQL, or MongoDB; SQLite is serverless and lightweight, saving all data directly into a local database file, which simplifies deployment and testing).

---

## 3. Frontend (React.js + Vite)
The frontend manages everything rendered in the browser.

### Why React?
Traditional websites load pages dynamically by refreshing the entire screen. React creates a **Single Page Application (SPA)**, where the page updates seamlessly without a full reload, enhancing user experience (similar to applications like Instagram or Gmail).
React applications are structured using **Components**—reusable visual blocks. For example, `EditorPanel.jsx` handles code input, `QuestionPanel.jsx` renders question details, and these work together to form the page.

### Monaco Editor
Instead of a basic HTML `<textarea>`, which lacks code highlighting or autocompletion, we integrated Microsoft's **Monaco Editor** (the same editor engine powering VS Code). This provides developers with code syntax coloring, indentation, and a premium IDE experience.

### Vite Build Tool
To run and bundle a React application, a build system is required. Instead of the older, slower `create-react-app`, we used **Vite**. Vite leverages native ES modules to compile code extremely fast, providing instant hot module reloading (HMR) during development.

---

## 4. Backend (FastAPI & Python)
The backend acts as the brain of the application, processing business logic and handling external integrations.

### Why FastAPI?
FastAPI is a modern, high-performance web framework for building APIs with Python. It provides:
- Automatic documentation using Swagger UI (accessible at `/docs`).
- Native asynchronous execution (async/await).
- Quick request validation and automatic error serialization.

### Code Execution Engine
When a user clicks "Run Code" on the frontend:
1. **Save Temporary File**: The backend receives the user's code and saves it as a temporary file on the server (e.g., `solution.cpp`).
2. **Compile**: For compiled languages (like C, C++, or Java), the backend runs compiler commands (`g++` or `javac`) via system subprocesses. If there is a syntax or compilation error, it captures the output and returns it to the user.
3. **Execute & Test**: For interpreted languages (Python) or successfully compiled executables, the backend runs the code in an isolated subprocess. It feeds input test cases into `stdin` and matches the resulting `stdout` with the expected outputs stored in the database.
4. **Result Verdict**: It evaluates the outputs and returns the status (`CORRECT`, `WRONG_ANSWER`, `RUNTIME_ERROR`, or `TIME_LIMIT_EXCEEDED`).

---

## 5. Database & ORM (SQLite + SQLAlchemy)
The database stores and manages the persistence of all application data.

### SQLAlchemy (ORM)
Rather than writing raw SQL queries (which can be error-prone and vulnerable to SQL Injection), we use **SQLAlchemy**, a popular Python Object-Relational Mapper (ORM). It allows us to define database tables as Python classes (models) and query them using clean Python syntax (e.g., `db.query(User).filter_by(id=1).first()`).

### Password Security (Bcrypt)
Plaintext passwords should never be stored in a database in case of data breaches. We use the **Bcrypt** hashing algorithm. When a user registers, their password is combined with a random salt and hashed into a secure, irreversible format (e.g., `$2b$12$...`). During login, Bcrypt verifies the inputted password against the stored hash.

---

## 6. Authentication (JWT Tokens)
To maintain user sessions, we use **JSON Web Tokens (JWT)**:
1. When a user logs in with valid credentials, the backend generates a unique cryptographic token.
2. This token is sent to the frontend, which stores it (e.g., in localStorage).
3. For subsequent protected API requests (such as submitting code or accessing progress), the frontend attaches this token in the HTTP Authorization header (`Bearer <token>`).
4. The backend verifies the signature of the token to authenticate the user.

---

## 7. AI Integration (Gemini AI)
We integrated Google's **Gemini 2.5 Flash** model for two major features:
1. **Interactive AI Tutor**: When a student requests help, the backend sends a custom-tailored prompt to Gemini. The prompt includes the question description, user code, and instructions: *"Act as a Socratic programming teacher. Point out logical errors or offer hints in the user's code. Do not give them the direct solution."*
2. **AI Question Importer**: When an admin inputs a topic or LeetCode URL, the backend asks Gemini to fetch and structure the challenge. The prompt instructs the model to return structured data in JSON. We parse this JSON response to save the question, difficulty, description, and test cases directly to the SQLite database.

---

## 8. Code Implementation Walkthrough

### A. Code Runner (`backend/code_runner.py`)
This script manages compiling and running user-submitted code:
```python
def run_c_cpp(code: str, tests: List[Dict[str, str]], is_cpp: bool) -> CodeRunResult:
    # 1. Select extension and compiler
    ext = "cpp" if is_cpp else "c"
    compiler = "g++" if is_cpp else "gcc"
    
    # 2. Create a temporary directory (which auto-deletes on exit)
    with tempfile.TemporaryDirectory() as tmp:
        src_file = os.path.join(tmp, f"solution.{ext}")
        exe_file = os.path.join(tmp, "solution.exe")
        
        # 3. Write user code to the source file
        with open(src_file, "w", encoding="utf-8") as f:
            f.write(code)
            
        # 4. Compile the source file using a subprocess
        compile_res = subprocess.run([compiler, src_file, "-o", exe_file], stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=tmp)
        if compile_res.returncode != 0:
            return CodeRunResult(verdict="COMPILE_ERROR", message="Compilation Error", stderr=compile_res.stderr.decode())
            
        # 5. Execute compiled binary against database test cases
        return _run_compiled_tests([exe_file], tests, tmp)
```

### B. Authentication Security (`backend/auth.py`)
This script handles password hashing and token generation:
```python
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hashes the plaintext password
def get_password_hash(password):
    return pwd_context.hash(password)

# Verifies if the entered password matches the stored hash
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Generates a JSON Web Token valid for 30 minutes
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=30))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

### C. Frontend API Request (`frontend/src/App.jsx`)
React state variables and API calling mechanism:
```javascript
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");

  // Runs when user clicks "Run Code"
  const runCode = async () => {
    const payload = {
      question_id: currentQuestion.id,
      code: code,
      language: language,
    };
    
    const res = await fetch(`http://127.0.0.1:8000/api/run-code`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    });
    
    const data = await res.json();
    setRunResult(data);
  };
```

### D. AI Problem Importer (`backend/questions.py`)
Generates standardized coding question structures from a text prompt or URL using Gemini AI:
```python
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    prompt = f"""
    The user has provided this problem title or URL: '{req.title_or_url}'
    Return ONLY a valid JSON object with:
    - "title": A clean string title
    - "difficulty": "Easy", "Medium", or "Hard"
    - "description": Problem description
    - "test_cases": A list of exactly 3 objects (input & output)
    """

    response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
    data = json.loads(response.text)
```

---

## 9. Conclusion
This project features full-stack engineering principles and industry standard concepts:
- **Sandbox/Isolated Subprocess Code Execution**: Executing user-submitted code safely on a host machine.
- **Prompt Engineering**: Programmatic integration of Generative AI to guide coding tasks dynamically.
- **API Authentication & Cybersecurity**: Securing endpoints with JWT tokens and applying Bcrypt hashing for password storage.
- **State-Driven Frontend Architecture**: Managing states with React hook variables to drive single-page app behavior.
