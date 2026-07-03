# SmartCode Tutor - Complete Project Guide (Hinglish)
*A simple, step-by-step explanation of your Final Year Project*

---

## 1. Project Kya Hai? (What is this project?)
Imagine karo ek **LeetCode** jaisi website jahan log coding practice karte hain. Lekin normal websites sirf ye batati hain ki "Code Galat Hai". Tumhara project, **SmartCode Tutor**, ek step aage hai. Ye ek **AI-Powered Coding Platform** hai jisme ek AI teacher (Gemini) baitha hai. Agar tum phas jate ho, toh AI tumhara code padh ke tumhe hints deta hai, exactly ek real teacher ki tarah!

Isme humne add kiya hai:
- **Practice Arena**: Code likhne ki jagah (C, C++, Java, Python support ke sath).
- **AI Chatbot**: Socratic AI jo code review karta hai.
- **AI Importer**: URL ya naam daalo, aur AI khud LeetCode se question generate karke tumhare database mein daal dega!
- **Dashboard**: Tumhari progress aur XP (Experience Points) dekhne ke liye.

---

## 2. Architecture: Ye Kaam Kaise Karta Hai?
Computer science mein kisi bhi bade project ke **3 main hisse (parts)** hote hain. Isko ek **Restaurant** ki tarah samjho:
1. **Frontend (UI)**: Ye Restaurant ka Menu aur Waiter hai. User ko kya dikhega aur wo kahan click karega.
2. **Backend (Server)**: Ye Restaurant ka Kitchen hai. Jo request waiter laya, usko process karna.
3. **Database**: Ye Restaurant ka Fridge/Store-room hai. Jahan data (users, questions, passwords) safe rakha jata hai.

Humne kya use kiya aur uske Alternatives kya the?
- **Frontend**: Humne **React.js** use kiya. (Alternative: Angular ya Vue.js tha, par React easy aur sabse popular hai).
- **Backend**: Humne **FastAPI (Python)** use kiya. (Alternative: Django ya Node.js tha, par AI aur Code Execution Python mein sabse fast aur aasan hote hain).
- **Database**: Humne **SQLite** use kiya. (Alternative: MySQL ya MongoDB tha, par SQLite ke liye alag se software install nahi karna padta, ye ek simple file mein save ho jata hai).

---

## 3. Frontend (React.js) - The UI
Frontend wo sab kuch hai jo browser mein dikhta hai.

### React kyun use kiya?
Pehle log simple HTML/CSS use karte the, par usme har page load hone pe screen refresh hoti thi. React ek **Single Page Application (SPA)** banata hai. Iska matlab page kabhi refresh nahi hota, bas content change ho jata hai (jaise Instagram app).
React mein hum **Components** banate hain. Component matlab chhote-chhote blocks. Jaise `EditorPanel.jsx` ek block hai, `QuestionPanel.jsx` dusra block hai. Inko jod kar puri website banti hai.

### Monaco Editor kya hai?
Agar hum normal `<textarea>` use karte toh code black-and-white dikhta aur auto-complete nahi hota. Humne Microsoft ka **Monaco Editor** use kiya hai (ye wahi engine hai jo VSCode ke andar chalta hai!). Isliye hamari website par VSCode jaisi feeling aati hai.

### Vite kya hai?
React application ko chalane ke liye ek engine chahiye hota hai. Pehle log `create-react-app` use karte the jo bahut slow tha. Humne **Vite** use kiya hai, jo basically ek aisi machine hai jo tumhare React code ko jaldi se bundle karke browser ko de deti hai.

---

## 4. Backend (FastAPI & Python) - The Brain
Backend tumhari website ka dimag hai. Ye user requests (jaise login karna, code run karna) handle karta hai.

### FastAPI kyun chuna?
Hum Flask ya Django use kar sakte the. Lekin FastAPI aajkal industry mein sabse modern aur fast hai. Ye apne aap hamare API ki documentation (Swagger UI) bana deta hai aur error handling khud kar leta hai.

### 🧠 Code Execution Engine (Sabse important part!)
Jab user website par Python, C++ ya Java mein code likh kar "Run" dabata hai, toh backend kya karta hai?
1. **File Save**: Backend user ke code ko leta hai aur ek temporary file banata hai (jaise `solution.cpp`).
2. **Compile**: Agar C++ ya Java hai, toh hum computer ka asli compiler (`g++` ya `javac`) use karke code ko compile (machine language mein convert) karte hain. Agar isme error aaya, toh turant user ko bhej dete hain.
3. **Run & Test**: Fir hum us code ko chalate hain, aur uske andar chori-chupe test cases (inputs) daalte hain. Jo output aata hai, usko Database ke expected output se match karte hain. Agar match ho gaya toh "CORRECT", warna "WRONG_ANSWER".

---

## 5. Database (SQLite + SQLAlchemy)
Database data ko yaad rakhta hai. Hum direct SQL (jaise `SELECT * FROM users`) likhne ke bajaye **SQLAlchemy** use karte hain.

### SQLAlchemy kya hai?
Ye ek ORM (Object-Relational Mapper) hai. SQL queries likhna mushkil hota hai. ORM kya karta hai ki humein SQL nahi likhni padti. Hum bas Python mein likhte hain `db.query(User).all()` aur ye khud SQL command run karke data le aata hai. Isse security (SQL Injection attacks) bhi badh jati hai.

### Passwords kaise save hote hain? (Bcrypt)
Hum database mein user ka real password (jaise `abcd@123`) kabhi save nahi karte. Agar DB hack ho gaya toh sabke passwords chori ho jayenge. Hum **Bcrypt** algorithm use karte hain jo password ko ek ajeeb text (`$2b$12$xYz...`) mein badal deta hai jisko wapas password mein convert karna impossible hai. Ise Hashing kehte hain.

---

## 6. Authentication (JWT Tokens)
Jab tum Login karte ho, toh website yaad kaise rakhti hai ki tum logged in ho?
Hum **JWT (JSON Web Token)** use karte hain. 
Socho JWT ek **VIP Entry Pass** hai. Jab tum sahi email/password daalte ho, backend tumhe ek lamba sa token string de deta hai. Ab tum frontend se jo bhi request bhejoge (jaise code run karna), uske sath wo Token bhejoge. Backend Token check karega aur bolega "Haan ye valid user hai, aane do".

---

## 7. AI Integration (Gemini AI)
Humne Google ka latest AI, **Gemini 2.5 Flash**, use kiya hai.
Hamare paas do AI features hain:
1. **AI Tutor**: Jab user "Review Code" ya chat karta hai, hum backend se Gemini ko ek prompt (instruction) bhejte hain. Prompt mein hum likhte hain: *"You are a teacher. Here is the student's code. Give hints but don't give the direct answer."* AI uske hisaab se reply karta hai aur hum use frontend par dikha dete hain.
2. **AI Importer**: Hum Gemini ko kehte hain: *"Mujhe LeetCode ke 'Two Sum' problem ka JSON format mein title, description aur 3 test cases do."* AI humein JSON bhejta hai, hum JSON read karte hain aur seedha Database mein Question add kar dete hain. Magic!

---

---

## 8. Code Explanation (Code Kaise Kaam Kar Raha Hai)
Ab hum actual code ko dekhte hain, jisse tum apne Examiner ko easily samjha sako.

### A. Code Runner (`backend/code_runner.py`)
Ye file tumhare project ki sabse important file hai. Ye decide karti hai ki code kaise run hoga.

```python
def run_c_cpp(code: str, tests: List[Dict[str, str]], is_cpp: bool) -> CodeRunResult:
    # 1. ext aur compiler decide karte hain (C ke liye 'gcc', C++ ke liye 'g++')
    ext = "cpp" if is_cpp else "c"
    compiler = "g++" if is_cpp else "gcc"
    
    # 2. Ek Temporary Folder banate hain (taki code baad mein delete ho jaye)
    with tempfile.TemporaryDirectory() as tmp:
        src_file = os.path.join(tmp, f"solution.{ext}") # File ka naam: solution.cpp
        exe_file = os.path.join(tmp, "solution.exe")    # Output ka naam: solution.exe
        
        # 3. User ka code is file mein save karte hain
        with open(src_file, "w", encoding="utf-8") as f:
            f.write(code)
            
        # 4. Compiler ko run karte hain. Agar Error aata hai, toh wahi se wapas bhej dete hain
        compile_res = subprocess.run([compiler, src_file, "-o", exe_file], stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=tmp)
        if compile_res.returncode != 0:
            return CodeRunResult(verdict="RUNTIME_ERROR", message="Compilation Error", stderr=compile_res.stderr.decode())
            
        # 5. Agar compile ho gaya, toh saare Test Cases us 'solution.exe' par run karte hain!
        return _run_compiled_tests([exe_file], tests, tmp)
```
**Explanation:** Computer directly C++ code nahi samajhta. Humne pehle user ka code `.cpp` file mein save kiya, fir `g++` chalaya jo usko `.exe` banata hai. Fir hum us `.exe` file ko chalate hain aur usme chori-chupe test inputs pass karte hain!

### B. Authentication Engine (`backend/auth.py`)
Ye login aur security ko handle karta hai.

```python
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Password ko safe banata hai
def get_password_hash(password):
    return pwd_context.hash(password)

# Check karta hai ki login password, database ke password se match ho raha hai ya nahi
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Naya VIP Pass (JWT Token) banata hai jo 30 minute tak chalega
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=30))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```
**Explanation:** `get_password_hash` normal password (`1234`) ko weird letters (`$2b$12...`) mein convert karta hai. Jab user login karta hai, `verify_password` check karta hai ki kya dono match hote hain. Agar match hue, toh `create_access_token` unko ek VIP pass (Token) deta hai.

### C. Frontend - Main Application (`frontend/src/App.jsx`)
React mein sab kuch **State** par chalta hai. State matlab "Website ki current condition kya hai".

```javascript
  // STATE VARIABLES: Ye variables change hote hi website ka design update ho jata hai
  const [questions, setQuestions] = useState([]);         // Saare questions ki list
  const [currentQuestion, setCurrentQuestion] = useState(null); // Abhi kaunsa question open hai
  const [code, setCode] = useState("");                   // Editor mein kya code likha hai
  const [language, setLanguage] = useState("python");     // C++, Java, ya Python

  // Jab user "Run Code" dabata hai
  const runCode = async () => {
    // 1. Data pack karte hain
    const payload = {
      question_id: currentQuestion.id,
      code: code,
      language: language,
    };
    
    // 2. Backend ko data bhejte hain (fetch API use karke)
    const res = await fetch(`http://127.0.0.1:8000/api/run-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    
    // 3. Result wapas aata hai aur hum use ResultPanel mein show karte hain
    const data = await res.json();
    setRunResult(data);
  };
```
**Explanation:** Frontend backend se `fetch()` function use karke baat karta hai. Jab hum Code run karte hain, toh hum code, language aur token ko ek packet (JSON payload) banate hain aur backend ke URL par bhej dete hain. Fir backend result wapas karta hai aur hum UI update kar dete hain.

### D. AI Problem Importer (`backend/questions.py`)
Ye wo magic hai jo URL se problem banata hai.

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
**Explanation:** Hum apne server se seedha Google ke Gemini AI server ko ek English message (Prompt) bhejte hain. Hum strict rules lagate hain ki "Sirf JSON format do". Gemini automatically problem generate karke deta hai, aur `json.loads` usko Python dictionary bana deta hai, jise hum directly database mein save kar dete hain!

---

## 9. Conclusion
Ye project koi chhota-mota college assignment nahi hai. Isme actual industry-level concepts use hue hain:
- **Containerized/Isolated Code Execution** (Executing un-trusted code locally safely).
- **Prompt Engineering** (AI ko programmatically control karna).
- **JWT Auth & Hashed Passwords** (Cybersecurity & Hashing).
- **React State Management** (Modern Frontend routing aur components).

*Jab Examiner puche toh confidently batana ki tumne full-stack development ki hai jisme compiler level C++ execution se le kar Generative AI integration tak sab kuch tumne khud architecture kiya hai!*
