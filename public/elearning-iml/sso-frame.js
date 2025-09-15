/**
 * SSO Frame Integration Script
 * Shared script untuk semua halaman elearning-iml embedded.
 * Menangani SSO banner, token parsing, theme sync, layout mode, dan logout.
 */
(function() {
  'use strict';

  // Konfigurasi default - bisa di-override via window.SSO_CONFIG
  const DEFAULT_CONFIG = {
    allowedOrigins: [window.location.origin, 'http://localhost:5500'],
    appId: 'elearning-iml',
    bannerSelector: '#sso-top',
    autoShowBannerDelay: 2500
  };

  const config = { ...DEFAULT_CONFIG, ...(window.SSO_CONFIG || {}) };
  
  // DOM elements
  const topBar = document.getElementById('sso-top');
  const elStatus = document.getElementById('sso-status');
  const elUser = document.getElementById('sso-user');
  const elRole = document.getElementById('sso-role');
  const elExp = document.getElementById('sso-exp');
  const btnLogout = document.getElementById('sso-logout');
  
  let currentPayload = null;

  // Utility functions
  function parseJWT(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(payload));
    } catch (error) {
      console.warn('Failed to parse JWT:', error);
      return null;
    }
  }

  function formatTimeLeft(payload) {
    if (!payload || !payload.exp) return '-';
    const ms = payload.exp * 1000 - Date.now();
    if (ms <= 0) return 'exp';
    return Math.floor(ms / 1000) + 's';
  }

  function isValidOrigin(origin) {
    if (!origin) return true; // Allow same-origin
    return config.allowedOrigins.includes(origin);
  }

  function updateBanner() {
    if (!topBar) return;
    
    if (!currentPayload) {
      if (elStatus) elStatus.textContent = 'NO TOKEN';
      topBar.style.display = 'flex';
      return;
    }

    if (elStatus) elStatus.textContent = 'SSO OK';
    if (elUser) elUser.textContent = currentPayload.email || '-';
    if (elRole) {
      elRole.textContent = 'role:' + (currentPayload.role || '-');
      if (currentPayload.role === 'admin') {
        elRole.classList.add('admin');
      }
    }
    if (elExp) elExp.textContent = 'ttl:' + formatTimeLeft(currentPayload);
    
    topBar.style.display = 'flex';
  }

  function postToParent(message) {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, '*');
      }
    } catch (error) {
      console.warn('Failed to post message to parent:', error);
    }
  }

  // Message handlers
  function handleSSOToken(data) {
    const payload = parseJWT(data.token);
    if (!payload || !payload.email || (payload.exp * 1000 < Date.now())) {
      console.warn('Invalid or expired token received');
      return;
    }
    currentPayload = payload;
    updateBanner();
  }

  function handleThemeSync(data) {
    document.documentElement.classList.toggle('dark', !!data.dark);
  }

  function handleLayoutMode(data) {
    if (data.wide) {
      document.body.classList.add('wide-edge');
    } else {
      document.body.classList.remove('wide-edge');
    }
  }

  function handleLogout() {
    currentPayload = null;
    if (elStatus) elStatus.textContent = 'LOGGED OUT';
    if (elUser) elUser.textContent = '-';
    if (elRole) elRole.textContent = 'role:-';
    if (elExp) elExp.textContent = 'ttl:-';
  }

  // Main message listener
  window.addEventListener('message', function(event) {
    if (!isValidOrigin(event.origin)) {
      console.warn('Message from unauthorized origin:', event.origin);
      return;
    }

    const data = event.data || {};
    
    switch (data.type) {
      case 'SSO_TOKEN':
        handleSSOToken(data);
        break;
      case 'THEME_SYNC':
        handleThemeSync(data);
        break;
      case 'LAYOUT_MODE':
        handleLayoutMode(data);
        break;
      case 'LOGOUT':
        handleLogout();
        break;
      default:
        // Allow other message types to pass through
        break;
    }
  });

  // Logout button handler
  if (btnLogout) {
    btnLogout.addEventListener('click', function() {
      const pageId = document.body.dataset.pageId || window.location.pathname.split('/').pop().replace('.html', '');
      postToParent({
        type: 'SSO_LOGOUT',
        app: config.appId + ':' + pageId
      });
    });
  }

  // Send ready signal
  function announceReady() {
    const pageId = document.body.dataset.pageId || window.location.pathname.split('/').pop().replace('.html', '');
    postToParent({
      type: 'EMBED_READY',
      app: config.appId + ':' + pageId
    });
  }

  // Test result helper function
  window.SSO_sendTestResult = function(testType, score, answers, criteria) {
    const pageId = document.body.dataset.pageId || testType;
    postToParent({
      type: 'SSO_TEST_RESULT',
      app: config.appId + ':' + pageId,
      testType: testType,
      score: score,
      criteria: criteria || (score >= 2 ? 'Kompeten' : 'Belum'),
      answers: answers,
      timestamp: Date.now()
    });
  };

  // Initialize
  function init() {
    announceReady();
    
    // Auto-show banner after delay if no token received
    setTimeout(function() {
      if (!currentPayload && topBar) {
        topBar.style.display = 'flex';
        if (elStatus) elStatus.textContent = 'WAITING TOKEN';
      }
    }, config.autoShowBannerDelay);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose config for debugging
  window.SSO_FRAME_CONFIG = config;
})();