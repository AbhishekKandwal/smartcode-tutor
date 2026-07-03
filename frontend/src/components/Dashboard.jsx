import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch("/api/analytics", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Analytics...</div>;
  if (!data || data.error) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No submission data available yet. Solve some questions!</div>;

  const COLORS = {
    'CORRECT': '#10b981', // emerald-500
    'WRONG_ANSWER': '#f59e0b', // amber-500
    'RUNTIME_ERROR': '#ef4444', // red-500
    'TIME_LIMIT_EXCEEDED': '#8b5cf6' // violet-500
  };

  return (
    <div className="dashboard-container" style={{ padding: '2rem', overflowY: 'auto', height: '100%', background: '#09090b', color: 'white' }}>
      <h2 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>Performance Analytics</h2>
      
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="metric-card" style={{ background: '#18181b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #27272a' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Submissions</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f4f4f5' }}>{data.metrics.total_submissions}</p>
        </div>
        <div className="metric-card" style={{ background: '#18181b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #27272a' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Global Accuracy</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{data.metrics.accuracy}%</p>
        </div>
        <div className="metric-card" style={{ background: '#18181b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #27272a' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Avg Execution Time</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#6366f1' }}>{data.metrics.avg_execution_time_ms} ms</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Pie Chart */}
        <div style={{ background: '#18181b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #27272a' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Submission Verdicts</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.accuracy_data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.accuracy_data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#27272a', border: 'none', borderRadius: '8px', color: 'white' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ background: '#18181b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #27272a' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Topic Strengths (Pass Rate %)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data.topic_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                <XAxis dataKey="topic" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" domain={[0, 100]} />
                <Tooltip cursor={{fill: '#27272a'}} contentStyle={{ background: '#27272a', border: 'none', borderRadius: '8px', color: 'white' }} />
                <Bar dataKey="passRate" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Line Chart Timeline */}
      <div style={{ background: '#18181b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #27272a' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Execution Time Timeline (Correct Submissions)</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data.timeline_data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
              <XAxis dataKey="attempt" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: '#a1a1aa' }} />
              <Tooltip contentStyle={{ background: '#27272a', border: 'none', borderRadius: '8px', color: 'white' }} />
              <Line type="monotone" dataKey="time" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
}

export default Dashboard;
