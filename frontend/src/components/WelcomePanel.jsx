import React from 'react';

function WelcomePanel() {
  return (
    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '3rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👋</div>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white', fontWeight: 'bold' }}>Welcome to SmartCode Tutor</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', marginBottom: '3rem', lineHeight: '1.6' }}>
        You're about to embark on an interactive journey to master Data Structures and Algorithms. 
        Select a challenge from the left panel to begin your training session.
      </p>
      
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', width: '220px', textAlign: 'left' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💻</div>
          <h3 style={{ fontSize: '1.2rem', color: '#10b981', marginBottom: '0.5rem' }}>Write Code</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Use our professional Monaco Editor to solve complex problems effortlessly.</p>
        </div>
        
        <div style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)', width: '220px', textAlign: 'left' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🤖</div>
          <h3 style={{ fontSize: '1.2rem', color: '#f59e0b', marginBottom: '0.5rem' }}>AI Tutor</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Get stuck? The floating AI Tutor is ready to give you Socratic hints.</p>
        </div>
        
        <div style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', width: '220px', textAlign: 'left' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📈</div>
          <h3 style={{ fontSize: '1.2rem', color: '#818cf8', marginBottom: '0.5rem' }}>Track XP</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Earn XP for every correct solution and view your detailed Analytics.</p>
        </div>
      </div>
      
      <div style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '0.8rem 1.5rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }}>👈</span>
        <p style={{ color: '#818cf8', fontWeight: 'bold', margin: 0 }}>Select a question from the panel to start</p>
      </div>
    </div>
  );
}

export default WelcomePanel;
