import React, { useState } from 'react';

function QuestionPanel({ questions, currentQuestion, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const getCategory = (q) => {
    if (q.question_type === 'binary_tree') return "Tree";
    if (q.title.toLowerCase().includes("string")) return "String";
    return "Array/Math";
  };

  const filteredQuestions = questions.filter(q => {
    // Search
    if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Difficulty
    if (difficultyFilter !== 'All' && q.difficulty !== difficultyFilter) {
      return false;
    }
    // Category
    if (categoryFilter !== 'All' && getCategory(q) !== categoryFilter) {
      return false;
    }
    return true;
  });

  return (
    <section className="panel question-panel">
      <div className="panel-header">
        <h2>Questions List</h2>
      </div>

      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.1)' }}>
        <input 
          type="text" 
          placeholder="Search questions by title..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: '#18181b', color: 'white', outline: 'none' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <select 
            value={difficultyFilter} 
            onChange={(e) => setDifficultyFilter(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: '#18181b', color: 'white', width: '100%', outline: 'none' }}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: '#18181b', color: 'white', width: '100%', outline: 'none' }}
          >
            <option value="All">All Categories</option>
            <option value="Array/Math">Array / Math</option>
            <option value="String">String</option>
            <option value="Tree">Tree (Data Structure)</option>
          </select>
        </div>
      </div>

      <div className="question-list-container">
        <ul className="question-list">
          {filteredQuestions.length === 0 ? (
            <li style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No questions match your search filters.
            </li>
          ) : (
            filteredQuestions.map((q) => (
              <li
                key={q.id}
                className={`question-item ${currentQuestion?.id === q.id ? 'active' : ''}`}
                onClick={() => onSelect(q)}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: '500' }}>{q.id}. {q.title}</span>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '0.15rem 0.4rem', 
                    borderRadius: '12px', 
                    background: q.difficulty === 'Easy' ? '#064e3b' : q.difficulty === 'Medium' ? '#78350f' : '#7f1d1d', 
                    color: q.difficulty === 'Easy' ? '#34d399' : q.difficulty === 'Medium' ? '#fbbf24' : '#f87171',
                    border: '1px solid ' + (q.difficulty === 'Easy' ? '#059669' : q.difficulty === 'Medium' ? '#d97706' : '#dc2626')
                  }}>
                    {q.difficulty}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {getCategory(q)}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

export default QuestionPanel;
