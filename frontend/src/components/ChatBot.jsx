import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function ChatBot({ currentQuestion, code }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Dragging state
  const [position, setPosition] = useState({ bottom: 32, right: 32 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ bottom: 32, right: 32 });
  const isDragAction = useRef(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    isDragAction.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = { ...position };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      isDragAction.current = true;
    }

    setPosition({
      right: elementStartPos.current.right - dx,
      bottom: elementStartPos.current.bottom - dy
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggleClick = (e) => {
    if (isDragAction.current) {
      e.preventDefault();
      return;
    }
    setIsOpen(!isOpen);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentQuestion) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const payload = {
        message: userMessage,
        code: code,
        question_title: currentQuestion.title,
        question_description: currentQuestion.description
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I couldn't connect to my AI brain. Please make sure the server is running and the API key is set." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        className="chatbot-toggle btn primary" 
        onClick={handleToggleClick}
        onMouseDown={handleMouseDown}
        style={{ 
          bottom: `${position.bottom}px`, 
          right: `${position.right}px`,
          cursor: isDragging ? 'grabbing' : 'pointer'
        }}
        title="Ask AI Tutor (Drag to move)"
      >
        {isOpen ? "✖" : "🤖"}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>AI Tutor</h3>
            <span style={{fontSize:'0.8rem', opacity:0.8}}>Socratic Guide</span>
          </div>
          
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-empty">
                <p>Hello! I am your AI Tutor. Stuck on a bug or need a conceptual hint? Ask me anything!</p>
                {!currentQuestion && <p style={{color: '#f87171'}}>Please select a question first.</p>}
              </div>
            )}
            
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-message ${m.role}`}>
                <div className="message-bubble">
                   <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message ai">
                <div className="message-bubble loading">Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={sendMessage}>
            <input 
              type="text" 
              placeholder="Ask about your code..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={!currentQuestion || isLoading}
            />
            <button type="submit" disabled={!currentQuestion || isLoading || !input.trim()} className="btn primary" style={{padding: '0.5rem 1rem'}}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatBot;
