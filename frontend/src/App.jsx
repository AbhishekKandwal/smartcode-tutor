import { useState, useEffect } from 'react';
import QuestionPanel from './components/QuestionPanel';
import EditorPanel from './components/EditorPanel';
import ResultPanel from './components/ResultPanel';
import ChatBot from './components/ChatBot';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import WelcomePanel from './components/WelcomePanel';
import './index.css'; // Make sure styles are loaded

const API_BASE = "";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [savedCodes, setSavedCodes] = useState({});
  const [runResult, setRunResult] = useState(null);
  const [lastVerdict, setLastVerdict] = useState(null);
  const [activeTab, setActiveTab] = useState("practice"); // "practice", "dashboard", "admin"
  const [language, setLanguage] = useState("python");

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [xp, setXp] = useState(parseInt(localStorage.getItem('xp') || "0"));

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (currentQuestion) {
      setSavedCodes((prev) => ({ ...prev, [currentQuestion.id]: newCode }));
    }
  };

  const handleLoginSuccess = (newToken, newUsername, newXp) => {
    setToken(newToken);
    setUsername(newUsername);
    setXp(newXp);
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    localStorage.setItem('xp', newXp);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    setXp(0);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('xp');
  };

  const getAuthHeaders = () => {
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (token) fetchQuestions();
  }, [token]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/questions`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      alert("Error loading questions: " + err.message);
    }
  };

  const getBoilerplate = (q, lang) => {
    if (!q) return "";
    
    if (lang === 'cpp') {
      return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Problem: ${q.title}\n    // TODO: Write your logic here\n    return 0;\n}\n`;
    } else if (lang === 'c') {
      return `#include <stdio.h>\n\nint main() {\n    // Problem: ${q.title}\n    // TODO: Write your logic here\n    return 0;\n}\n`;
    } else if (lang === 'java') {
      return `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Problem: ${q.title}\n        // TODO: Write your logic here\n    }\n}\n`;
    } else {
      if (q.question_type === 'binary_tree') {
        return `# Problem: ${q.title}\n# The TreeNode class and deserialization are handled automatically.\n# Just write your logic inside the Solution class!\n\nclass Solution:\n    def solve(self, root: 'TreeNode') -> int:\n        # TODO: Write your logic here\n        pass\n`;
      } else {
        return `# Problem: ${q.title}\n# Read input from stdin, process it, and print to stdout.\nimport sys\n\ndef solve():\n    # TODO: Write your logic here\n    # Example for numbers: data = input().split()\n    pass\n\nif __name__ == '__main__':\n    solve()\n`;
      }
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (currentQuestion) {
      setCode(getBoilerplate(currentQuestion, newLang));
    }
  };

  const selectQuestion = (q) => {
    setCurrentQuestion(q);
    setRunResult(null);
    setLastVerdict(null);

    // Default to the correct boilerplate or keep saved codes.
    // For simplicity, we just inject the correct boilerplate if they change questions.
    setCode(getBoilerplate(q, language));
  };

  const runCode = async () => {
    if (!currentQuestion) return alert("Select a question first.");
    try {
      const payload = {
        question_id: currentQuestion.id,
        code,
        language: language,
      };
      const res = await fetch(`${API_BASE}/api/run-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        if (res.status === 401) handleLogout();
        throw new Error("HTTP " + res.status);
      }
      const data = await res.json();
      setRunResult(data);
      setLastVerdict(data.verdict);
      if (data.total_xp !== undefined && data.total_xp > 0) {
        setXp(data.total_xp);
        localStorage.setItem('xp', data.total_xp);
      }
    } catch (err) {
      alert("Error running code: " + err.message);
    }
  };

  const nextQuestion = async () => {
    try {
      const params = new URLSearchParams();
      if (currentQuestion) params.set("last_question_id", currentQuestion.id);
      if (lastVerdict) params.set("verdict", lastVerdict);

      const res = await fetch(`${API_BASE}/api/next-question?` + params.toString(), { headers: getAuthHeaders() });
      if (!res.ok) {
        if (res.status === 401) handleLogout();
        throw new Error("HTTP " + res.status);
      }

      const data = await res.json();
      if (data.next) {
        selectQuestion(data.next);
        if (data.reason) {
            setRunResult({ verdict: "NEXT", message: data.reason });
        }
      } else {
        alert("No next question available.");
      }
    } catch (err) {
      alert("Error getting next question: " + err.message);
    }
  };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div 
            onClick={() => { setCurrentQuestion(null); setActiveTab('practice'); }}
            style={{ cursor: 'pointer', textAlign: 'left' }}
          >
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, color: 'white' }}>
              SmartCode Tutor <span style={{ fontSize: '1.8rem' }}>👨‍💻</span>
            </h1>
            <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>AI-assisted DSA practice with auto-evaluation</p>
          </div>

          {/* Right Side Navigation & Info */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Hello, {username}!</span>
            <button 
              className={`btn ${activeTab === 'practice' ? 'primary' : 'secondary'}`}
              onClick={() => setActiveTab('practice')}
            >
              Practice Arena
            </button>
            <button 
              className={`btn ${activeTab === 'dashboard' ? 'primary' : 'secondary'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Analytics Dashboard
            </button>
            <button 
              className={`btn ${activeTab === 'admin' ? 'primary' : 'secondary'}`}
              onClick={() => setActiveTab('admin')}
              style={activeTab !== 'admin' ? { border: '1px solid #8b5cf6', color: '#8b5cf6' } : { background: '#8b5cf6', color: 'white', border: '1px solid #8b5cf6', boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' }}
            >
              Admin Panel
            </button>
            <button className="btn" onClick={handleLogout} style={{ border: '1px solid #ef4444', color: '#ef4444' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {activeTab === "dashboard" && (
        <main style={{ flexGrow: 1, overflow: 'hidden' }}>
          <Dashboard />
        </main>
      )}

      {activeTab === "admin" && (
        <main style={{ flexGrow: 1, overflow: 'y-auto' }}>
          <AdminPanel token={token} />
        </main>
      )}

      {activeTab === "practice" && (
        <main className="app-main">
          <QuestionPanel 
            questions={questions} 
            currentQuestion={currentQuestion}
            onSelect={selectQuestion}
            onLoad={fetchQuestions}
          />
          {currentQuestion ? (
            <>
              <EditorPanel 
                currentQuestion={currentQuestion}
                code={code}
                setCode={handleCodeChange}
                language={language}
                onLanguageChange={handleLanguageChange}
                onRun={runCode}
                onNext={nextQuestion}
              />
              <ResultPanel 
                result={runResult}
                code={code}
                currentQuestion={currentQuestion}
              />
            </>
          ) : (
            <div style={{ gridColumn: 'span 2', display: 'flex', flexGrow: 1 }}>
              <WelcomePanel />
            </div>
          )}
          <ChatBot currentQuestion={currentQuestion} code={code} />
        </main>
      )}

      <footer className="app-footer">
        <span>SmartCode Tutor · React Version · Final Year Project · Abhishek</span>
      </footer>
    </div>
  );
}

export default App;
