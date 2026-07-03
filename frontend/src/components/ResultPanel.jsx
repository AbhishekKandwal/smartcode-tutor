import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function ResultPanel({ result, code, currentQuestion }) {
  const [review, setReview] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);

  useEffect(() => {
    setReview(null);
  }, [result]);

  const handleGetReview = async () => {
    setLoadingReview(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/chat/review", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ code: code, question_title: currentQuestion?.title })
      });
      const data = await res.json();
      setReview(data.review);
    } catch(err) {
      console.error(err);
    } finally {
      setLoadingReview(false);
    }
  };
  if (result && result.verdict === "NEXT") {
    return (
      <section className="panel result-panel">
        <div className="panel-header">
          <h2>Recommendation</h2>
        </div>
        <div className="verdict" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          {result.message}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
          Your editor has been updated with the next challenge. Good luck!
        </p>
      </section>
    );
  }

  let hint = "Run your code. If it is wrong, explain what test case failed and how to fix the logic.";
  let verdictClass = "";

  if (result) {
    if (result.verdict === "WRONG_ANSWER") {
      hint = "Your output didn't match. In viva, explain which input failed and why your logic gave a different result.";
      verdictClass = "verdict-wrong";
    } else if (result.verdict === "TIME_LIMIT_EXCEEDED") {
      hint = "Your code took too long. In viva, talk about time complexity and how to optimize loops.";
      verdictClass = "verdict-error";
    } else if (result.verdict === "RUNTIME_ERROR") {
      hint = "Your code crashed. In viva, explain the error and how you would fix it.";
      verdictClass = "verdict-error";
    } else if (result.verdict === "CORRECT") {
      hint = "All test cases passed. In viva, explain your algorithm, complexity, and edge cases.";
      verdictClass = "verdict-success";
    } else {
      hint = result.message || hint;
    }
  }

  const isError = result && (result.verdict === "WRONG_ANSWER" || result.verdict === "TIME_LIMIT_EXCEEDED" || result.verdict === "RUNTIME_ERROR");
  const isCorrect = result && result.verdict === "CORRECT";

  return (
    <section className="panel result-panel">
      <div className="panel-header">
        <h2>Result</h2>
      </div>

      <div className={`result-box ${isError ? 'error' : isCorrect ? 'success' : ''}`}>
        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Verdict: {result ? result.verdict : "No runs yet."}
        </h3>
        {result && <p>{result.message}</p>}
        {result?.execution_time_ms > 0 && (
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>Execution Time: {result.execution_time_ms.toFixed(2)} ms</p>
        )}
      </div>

      {isCorrect && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px' }}>
          {!review && !loadingReview && (
            <button onClick={handleGetReview} className="btn success" style={{ width: '100%' }}>
              ✨ Get AI Code Review (Time/Space Complexity)
            </button>
          )}
          {loadingReview && <div style={{ textAlign: 'center', color: '#10b981' }}>Analyzing your code...</div>}
          {review && (
            <div className="ai-message">
              <h4 style={{ color: '#10b981', marginBottom: '0.5rem' }}>✨ AI Coach Review</h4>
              <ReactMarkdown>{review}</ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {result?.test_input && (
        <div className="output-block">
          <h3>Test Input</h3>
          <pre>{result?.test_input || "–"}</pre>
        </div>
      )}

      <div className="output-block">
        <h3>Expected Output</h3>
        <pre>{result?.expected_output || "–"}</pre>
      </div>

      <div className="output-block">
        <h3>Your Output</h3>
        <pre>{result?.your_output || "–"}</pre>
      </div>

      <div className="output-block">
        <h3>Error / Logs</h3>
        <pre>{result?.stderr || (result?.verdict && result.verdict !== "CORRECT" ? result.message : "–")}</pre>
      </div>

      <div className="hint-block">
        <h3>AI Hint (how to explain in viva)</h3>
        <p>{hint}</p>
      </div>
    </section>
  );
}

export default ResultPanel;
