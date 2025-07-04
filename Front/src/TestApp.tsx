import React from 'react';

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🎓 SmartCampus Test</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ background: '#f0f0f0', padding: '10px', marginTop: '10px' }}>
        Environment: {import.meta.env.VITE_ENVIRONMENT || 'development'}
      </div>
      <div style={{ background: '#e0e0e0', padding: '10px', marginTop: '10px' }}>
        API URL: {import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}
      </div>
    </div>
  );
}

export default TestApp;
