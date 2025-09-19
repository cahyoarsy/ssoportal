import React from 'react';

function BasicApp() {
  console.log('🔥 [BASIC] BasicApp rendering...');
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '400px'
      }}>
        <h1 style={{color: '#1e293b', marginBottom: '1rem'}}>
          🚀 Portal SSO Basic
        </h1>
        <p style={{color: '#64748b', marginBottom: '1rem'}}>
          Versi paling sederhana tanpa library tambahan
        </p>
        <button 
          onClick={() => alert('Portal Basic berfungsi!')}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Test Basic Portal
        </button>
      </div>
    </div>
  );
}

export default BasicApp;