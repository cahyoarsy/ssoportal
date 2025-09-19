// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';

// Mock SSO core modules to avoid relying on browser-specific globals / network
vi.mock('../core/SSOCore.js', () => {
  class MockSSOCore {
    constructor(){
      this.listeners = {};
      this.session = { token: 'test-token', user: { email: 'tester@example.com', role: 'user' } };
      this.preferences = { darkMode: false, wideLayout: true, language: 'id' };
      this.user = this.session.user;
    }
    addEventListener(type, cb){ this.listeners[type] = cb; }
    removeEventListener(){}
    init(){ return Promise.resolve(); }
    isAuthenticated(){ return true; }
    updatePreferences(p){ Object.assign(this.preferences, p); }
  }
  const instance = new MockSSOCore();
  return { default: instance };
});

vi.mock('../core/AuthService.js', () => ({
  default: class AuthService {
    constructor(core){ this.core = core; }
    handleGoogleResponse(){ return Promise.resolve(); }
    logout(){ return Promise.resolve(); }
    login(){ return Promise.resolve(); }
    // mimic shape used in LoginForm (authService.sso.addEventListener)
    sso = {
      addEventListener(){ /* noop */ },
      removeEventListener(){ /* noop */ }
    };
  }
}));

vi.mock('../core/ModuleManager.js', () => ({
  default: class ModuleManager {
    constructor(core){ this.core = core; }
    getAvailableModules(){ return []; }
    load(){ return Promise.resolve(); }
    sendMessage(){ /* no-op */ }
  }
}));

import App from '../App.jsx';

// Minimal IntersectionObserver polyfill for framer-motion viewport features
if(typeof window !== 'undefined' && !window.IntersectionObserver){
  window.IntersectionObserver = class {
    constructor(){ /* noop */ }
    observe(){ /* noop */ }
    unobserve(){ /* noop */ }
    disconnect(){ /* noop */ }
    takeRecords(){ return []; }
  };
}

describe('App mount smoke test', () => {
  it('mounts without throwing', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = createRoot(div);
    expect(() => {
      root.render(<App />);
    }).not.toThrow();
  });
});
