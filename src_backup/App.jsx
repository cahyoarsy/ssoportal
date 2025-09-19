import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

import EnhancedPortalSystem from './components/EnhancedPortalSystem';

import ProfessionalDashboard from './components/ProfessionalDashboard';import EnhancedPortalSystem from './components/EnhancedPortalSystem';



function App() {import ProfessionalDashboard from './components/ProfessionalDashboard';function App() {

  const [user, setUser] = useState(null);

  console.log('🚀 [APP] App function called - pure CSS version');

  useEffect(() => {

    // Check for stored user datafunction App() {  

    const storedUser = localStorage.getItem('user');

    if (storedUser) {  const [user, setUser] = useState(null);  const [loading, setLoading] = useState(true);

      setUser(JSON.parse(storedUser));

    }  

  }, []);

  useEffect(() => {  useEffect(() => {

  const handleLogin = (userData) => {

    setUser(userData);    // Check for stored user data    console.log('🚀 [APP] App component mounted');

    localStorage.setItem('user', JSON.stringify(userData));

  };    const storedUser = localStorage.getItem('user');    setTimeout(() => {



  const handleLogout = () => {    if (storedUser) {      setLoading(false);

    setUser(null);

    localStorage.removeItem('user');      setUser(JSON.parse(storedUser));    }, 1000);

  };

    }  }, []);

  if (user) {

    return <ProfessionalDashboard user={user} onLogout={handleLogout} />;  }, []);  

  }

  if (loading) {

  return <EnhancedPortalSystem onLogin={handleLogin} />;

}  const handleLogin = (userData) => {    return (



export default App;    setUser(userData);      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#f8fafc'}}>

    localStorage.setItem('user', JSON.stringify(userData));        <div className="text-center">

  };          <div style={{

            width: '32px',

  const handleLogout = () => {            height: '32px',

    setUser(null);            border: '3px solid #2563eb',

    localStorage.removeItem('user');            borderTop: '3px solid transparent',

  };            borderRadius: '50%',

            animation: 'spin 1s linear infinite',

  if (user) {            margin: '0 auto 1rem'

    return <ProfessionalDashboard user={user} onLogout={handleLogout} />;          }}></div>

  }          <h1 style={{fontSize: '1.5rem', color: '#1e293b', fontWeight: '600'}}>SSO Portal</h1>

          <p style={{color: '#64748b'}}>Memuat aplikasi...</p>

  return <EnhancedPortalSystem onLogin={handleLogin} />;        </div>

}      </div>

    );

export default App;  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navbar */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <h1 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1e293b'}}>
              🚀 SSO Portal
            </h1>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="container">
        <div className="main-content">
          <div className="content-box">
            <div className="text-center">
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '1rem'
              }}>
                Portal SSO Berfungsi!
              </h2>
              <p className="text-gray-600 mb-6">
                Sistem autentikasi dan manajemen pembelajaran siap digunakan.
              </p>
              <button 
                onClick={() => alert('Portal SSO berhasil dimuat!')}
                className="btn btn-primary"
              >
                Test Portal
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;