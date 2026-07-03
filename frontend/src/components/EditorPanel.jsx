import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

function EditorPanel({ currentQuestion, code, setCode, language, onLanguageChange, onRun, onNext }) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setShowHint(false);
  }, [currentQuestion]);

  const getHint = (q) => {
    if (!q) return "";
    if (q.question_type === 'binary_tree') {
      return "Think about Tree Traversal. You can use Recursion (DFS) or a Queue (BFS) to visit every node.";
    }
    if (q.title.includes("Multiply") || q.title.includes("Add") || q.title.includes("Modulo") || q.title.includes("Power")) {
      return "You can use a loop (like a 'for' loop) or list comprehension to process each item in the input array one by one.";
    }
    if (q.title.includes("String")) {
      return "In Python, you can multiply a string by a number to repeat it (e.g. 'hi' * 3).";
    }
    return "Break the problem down into smaller steps. First parse the input correctly, then apply the logic.";
  };

  const handleDownload = () => {
    if (!code) return;
    
    let ext = "py";
    if (language === "cpp") ext = "cpp";
    else if (language === "c") ext = "c";
    else if (language === "java") ext = "java";
    
    let filename = `solution.${ext}`;
    if (language === "java") filename = "Solution.java";

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="panel editor-panel">
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2>{currentQuestion ? currentQuestion.title : "Write your code"}</h2>
          {currentQuestion && (
            <span className={`badge badge-${currentQuestion.difficulty.toLowerCase()}`}>
              {currentQuestion.difficulty}
            </span>
          )}
        </div>

        <select 
          value={language} 
          onChange={(e) => onLanguageChange(e.target.value)}
          style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '6px', 
            background: '#1e1e1e', 
            color: 'white', 
            border: '1px solid var(--border-color)',
            outline: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="java">Java</option>
        </select>
      </div>

      {currentQuestion && (
        <div className="question-context">
          <p style={{ whiteSpace: 'pre-wrap' }}>{currentQuestion.description}</p>
          
          {currentQuestion.test_cases && currentQuestion.test_cases !== "[]" && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>EXAMPLE INPUT:</strong>
                <pre style={{ margin: '0.25rem 0 0 0', color: '#e5e7eb', fontFamily: 'monospace' }}>
                  {(() => {
                    try { return JSON.parse(currentQuestion.test_cases)[0]?.input; }
                    catch(e) { return "N/A"; }
                  })()}
                </pre>
              </div>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>EXPECTED OUTPUT:</strong>
                <pre style={{ margin: '0.25rem 0 0 0', color: '#e5e7eb', fontFamily: 'monospace' }}>
                  {(() => {
                    try { return JSON.parse(currentQuestion.test_cases)[0]?.output; }
                    catch(e) { return "N/A"; }
                  })()}
                </pre>
              </div>
            </div>
          )}

          {showHint && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderLeft: '3px solid #fbbf24', borderRadius: '4px 8px 8px 4px', color: '#e5e7eb', fontSize: '0.95rem' }}>
              <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '0.25rem' }}>💡 Hint:</strong>
              {getHint(currentQuestion)}
            </div>
          )}
        </div>
      )}

      <div style={{ flexGrow: 1, minHeight: '300px', margin: '1rem 0', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            padding: { top: 16 }
          }}
        />
      </div>

      <div className="editor-actions">
        <button onClick={() => setShowHint(!showHint)} className="btn secondary">
          {showHint ? "Hide Hint" : "Need a Hint?"}
        </button>
        <button onClick={handleDownload} className="btn secondary" style={{ border: '1px solid #10b981', color: '#10b981' }}>
          ⬇️ Download
        </button>
        <button onClick={onRun} className="btn success">Run Code</button>
        <button onClick={onNext} className="btn secondary">Next Question</button>
      </div>
    </section>
  );
}

export default EditorPanel;
