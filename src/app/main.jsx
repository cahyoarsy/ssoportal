import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import IntegrationErrorBoundary from '../components/IntegrationErrorBoundary.jsx';

console.log('[BOOT] Starting Portal SSO...');
console.log('[BOOT] React version:', React.version);
console.log('[BOOT] Document ready state:', document.readyState);

function initApp() {
  try {
    const rootEl = document.getElementById('root');
    
    if (!rootEl) {
      console.error('[BOOT] Root element #root not found');
      document.body.innerHTML = `
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f8fafc;font-family:system-ui">
          <div style="text-align:center;padding:2rem;background:white;border-radius:1rem;box-shadow:0 4px 20px rgba(0,0,0,0.1);max-width:400px">
            <h1 style="color:#dc2626;margin-bottom:1rem">Root Element Missing</h1>
            <p style="color:#64748b;margin-bottom:1rem">The #root element was not found in the DOM.</p>
            <button onclick="location.reload()" style="background:#2563eb;color:white;border:none;padding:0.5rem 1rem;border-radius:0.5rem;cursor:pointer">Reload Page</button>
          </div>
        </div>
      `;
      return;
    }
    
    console.log('[BOOT] Root element found:', rootEl);
    console.log('[BOOT] Creating React root...');
    
    const root = createRoot(rootEl);
    console.log('[BOOT] React root created successfully');
    
    console.log('[BOOT] Rendering App component...');
    root.render(
      <React.StrictMode>
        <IntegrationErrorBoundary>
          <App />
        </IntegrationErrorBoundary>
      </React.StrictMode>
    );
    console.log('[BOOT] Portal SSO mounted successfully');
    
    // Debug: Check if content actually appeared
    setTimeout(() => {
      const hasContent = rootEl.children.length > 0;
      console.log('[BOOT] Post-render check - Root has content:', hasContent);
      if (!hasContent) {
        console.warn('[BOOT] Warning: Root element is empty after render attempt');
      }
    }, 100);
    
  } catch (error) {
    console.error('[BOOT] Critical error during app initialization:', error);
    // Fallback error UI
    document.body.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#fef2f2;font-family:system-ui">
        <div style="text-align:center;padding:2rem;background:white;border-radius:1rem;box-shadow:0 4px 20px rgba(0,0,0,0.1);max-width:500px">
          <h1 style="color:#dc2626;margin-bottom:1rem">App Initialization Failed</h1>
          <p style="color:#64748b;margin-bottom:1rem">Error: ${error.message}</p>
          <pre style="background:#f8f9fa;padding:1rem;border-radius:0.5rem;font-size:0.75rem;text-align:left;overflow:auto;margin-bottom:1rem">${error.stack || error}</pre>
          <button onclick="location.reload()" style="background:#2563eb;color:white;border:none;padding:0.5rem 1rem;border-radius:0.5rem;cursor:pointer">Reload Page</button>
        </div>
      </div>
    `;
  }
}

// Ensure DOM is ready before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
