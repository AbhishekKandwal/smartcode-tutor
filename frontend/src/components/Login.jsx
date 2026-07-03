import React, { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      
      let body, headers;
      if (isLogin) {
        // OAuth2 expects form url-encoded data
        body = new URLSearchParams();
        body.append('username', username);
        body.append('password', password);
        headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      } else {
        body = JSON.stringify({ username, password });
        headers = { 'Content-Type': 'application/json' };
      }

      const res = await fetch(`${endpoint}`, {
        method: 'POST',
        headers,
        body
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Authentication failed');

      onLoginSuccess(data.access_token, data.username, data.xp);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#09090b', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      <div style={{ background: '#18181b', padding: '3rem', borderRadius: '12px', border: '1px solid #27272a', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>SmartCode Tutor</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>{isLogin ? 'Welcome back, coder!' : 'Create your account'}</p>
        
        {error && <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#a1a1aa' }}>Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #3f3f46', background: '#27272a', color: 'white', outline: 'none' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#a1a1aa' }}>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #3f3f46', background: '#27272a', color: 'white', outline: 'none' }} 
            />
          </div>
          <button type="submit" className="btn primary" style={{ marginTop: '1rem', padding: '0.75rem' }}>
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: '#a1a1aa' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
