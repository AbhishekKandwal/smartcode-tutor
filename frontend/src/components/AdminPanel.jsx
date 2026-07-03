import React, { useState } from 'react';

function AdminPanel({ token }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleImport = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/questions/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title_or_url: query })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to import problem');
      }

      setMessage(`✅ Success! "${data.title}" has been imported into your database.`);
      setQuery('');
    } catch (err) {
      setError(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-main)' }}>
      <div style={{ background: 'var(--bg-panel)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>✨</span> AI Problem Importer
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
          Enter any LeetCode problem title or a general algorithmic concept (e.g. "Two Sum" or "Reverse a Linked List"). 
          The AI will automatically generate the problem description, difficulty, and standard test cases, then instantly insert it into your platform's database.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="e.g., Climbing Stairs LeetCode"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            style={{ 
              flexGrow: 1, 
              padding: '1rem', 
              fontSize: '1.1rem', 
              background: '#000', 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px', 
              color: 'white',
              outline: 'none'
            }}
          />
          <button 
            className="btn primary" 
            onClick={handleImport} 
            disabled={loading || !query.trim()}
            style={{ padding: '0 2rem', fontSize: '1.1rem', whiteSpace: 'nowrap' }}
          >
            {loading ? '⏳ Generating...' : 'Generate & Import'}
          </button>
        </div>

        {loading && (
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderLeft: '4px solid var(--accent)', borderRadius: '0 8px 8px 0', color: '#a5b4fc' }}>
            <p style={{ margin: 0 }}><strong>AI is thinking...</strong> Reading prompt, generating test cases, and formatting database entries. This usually takes 5-10 seconds.</p>
          </div>
        )}

        {message && (
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid var(--success)', borderRadius: '0 8px 8px 0', color: '#34d399' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{message}</p>
          </div>
        )}

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--error)', borderRadius: '0 8px 8px 0', color: '#f87171' }}>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
