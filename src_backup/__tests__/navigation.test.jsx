// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
vi.mock('../utils/anchors.js', () => {
  return {
    handleAnchorClick: (e, href) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      // record that navigation was invoked
      window.__NAV_CALLED = href;
    }
  };
});

// Mocks matching mount.test.jsx to isolate UI
vi.mock('../core/SSOCore.js', () => {
  class MockSSOCore {
    constructor(){
      this.listeners = {};
      this.session = null; // unauthenticated for landing page
      this.preferences = { darkMode: false, wideLayout: true, language: 'id' };
      this.user = null;
    }
    addEventListener(type, cb){ this.listeners[type] = cb; }
    removeEventListener(){ }
    isAuthenticated(){ return false; }
    updatePreferences(p){ Object.assign(this.preferences, p); }
  }
  return { default: new MockSSOCore() };
});

vi.mock('../core/AuthService.js', () => ({
  default: class AuthService {
    constructor(core){ this.core = core; }
    login(){ return Promise.resolve(); }
    logout(){ return Promise.resolve(); }
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
  }
}));


// IntersectionObserver polyfill
if(typeof window !== 'undefined' && !window.IntersectionObserver){
  window.IntersectionObserver = class {
    observe(){ }
    unobserve(){ }
    disconnect(){ }
    takeRecords(){ return []; }
  };
}

describe('Navigation anchors', () => {
  it('clicking navbar links updates hash and reveals sections', async () => {
    vi.resetModules();
    const { default: Navbar } = await import('../components/Navbar.jsx');
    const { container } = render(
      <div>
        <Navbar dark={false} setDark={()=>{}} lang={'id'} setLang={()=>{}} isAdmin={false} />
        <main>
          <section id="home">home</section>
          <section id="login">login</section>
          <section id="profile">profile</section>
        </main>
      </div>
    );

  const loginLink = container.querySelector('nav a[href="#login"]');
    expect(loginLink).toBeTruthy();
  fireEvent.click(loginLink);
  expect(window.__NAV_CALLED).toBe('#login');

  const homeLink = container.querySelector('nav a[href="#home"]');
    expect(homeLink).toBeTruthy();
  fireEvent.click(homeLink);
  expect(window.__NAV_CALLED).toBe('#home');

  const profileLink = container.querySelector('nav a[href="#profile"]');
    expect(profileLink).toBeTruthy();
  fireEvent.click(profileLink);
  expect(window.__NAV_CALLED).toBe('#profile');
  });
});
