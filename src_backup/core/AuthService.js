/**
 * SSO Authentication Service
 * Mengelola autentikasi Google OAuth, JWT token, dan session management
 */

import { buildGoogleAuthUrl as buildAuthUrl, randomState, generateRandomString, createCodeChallenge } from '../oauthHelpers.js';

class AuthService {
  constructor(ssoCore) {
    this.sso = ssoCore;
    this.googleAuth = null;
    this.tokenRefreshInterval = null;
    this.refreshThreshold = 5 * 60 * 1000; // 5 minutes before expiry
    
    this.init();
  }

  async init() {
    // Initialize Google OAuth
    await this.initGoogleAuth();
    
    // Check for existing session
    this.checkExistingSession();
    
    // Setup token refresh
    this.setupTokenRefresh();
  }

  async initGoogleAuth() {
    const useGis = (import.meta?.env?.VITE_USE_GIS ?? 'false') === 'true';
    if (!useGis) {
      // Skip loading GIS; we'll use pure OAuth popup flow
      console.log('[AuthService] Skipping GIS initialization (VITE_USE_GIS=false). Using popup OAuth flow.');
      return;
    }

    return new Promise((resolve, reject) => {
      if (window.google && window.google.accounts) {
        this.configureGoogleAuth();
        resolve();
      } else {
        // Load Google Identity Services
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
          this.configureGoogleAuth();
          resolve();
        };
        script.onerror = () => reject(new Error('Failed to load Google Auth'));
        document.head.appendChild(script);
      }
    });
  }

  configureGoogleAuth() {
    // Google OAuth Configuration - use configured clientId or environment variable
    const clientId = this.sso.config.google?.clientId || import.meta?.env?.VITE_GOOGLE_CLIENT_ID || '';

    if (!clientId) {
      // Do not initialize GIS with a fake client id: it causes confusing Google modal errors
      console.warn('[AuthService] Google Client ID is not configured. Skipping Google Identity initialization.\n' +
        'Set `SSOCore.config.google.clientId` or environment `VITE_GOOGLE_CLIENT_ID` to enable Google Sign-In.');
      return;
    }

    const useGis = (import.meta?.env?.VITE_USE_GIS ?? 'false') === 'true';
    if (!useGis) {
      // Explicitly disabled
      return;
    }

    // Initialize Google Identity Services (only supported options)
    google.accounts.id.initialize({
      client_id: clientId,
      callback: this.handleGoogleResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signin'
    });

    console.log('[AuthService] Google OAuth initialized with clientId=', clientId);
  }

  async handleGoogleResponse(response) {
    try {
      // Decode JWT token from Google
      const decoded = this.decodeJWT(response.credential);
      
      // Create user profile
      const userProfile = {
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        emailVerified: decoded.email_verified,
        locale: decoded.locale,
        familyName: decoded.family_name,
        givenName: decoded.given_name
      };

      // Validate and create session
      await this.validateAndCreateSession(userProfile, response.credential);
      
    } catch (error) {
      console.error('[AuthService] Google auth error:', error);
      this.sso.broadcast('auth_error', { error: error.message });
      throw error;
    }
  }

  async validateAndCreateSession(userProfile, googleToken) {
    try {
      // Determine user role and permissions
      const userData = await this.processUserData(userProfile);
      
      // Create JWT token
      const jwtToken = this.createJWTToken(userData);
      
      // Create session
      const session = {
        id: this.generateSessionId(),
        token: jwtToken,
        googleToken: googleToken,
        user: userData,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString(), // 24 hours
        deviceInfo: this.getDeviceInfo(),
        ipAddress: await this.getClientIP()
      };

      // Store session
      this.sso.setSession(session);
      
      // Start activity tracking
      this.startActivityTracking();
      
      console.log('[AuthService] Session created successfully for:', userData.email);
      return session;
      
    } catch (error) {
      console.error('[AuthService] Session creation failed:', error);
      throw error;
    }
  }

  async processUserData(profile) {
    // Default user data
    let userData = {
      id: profile.googleId,
      email: profile.email,
      name: profile.name,
      firstName: profile.givenName || '',
      lastName: profile.familyName || '',
      avatar: profile.picture || '',
      locale: profile.locale || 'id',
      emailVerified: profile.emailVerified || false,
      role: 'user', // Default role
      permissions: ['profile.view', 'profile.edit', 'elearning.access'],
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // Check if user is admin (you can customize this logic)
    if (this.isAdminUser(profile.email)) {
      userData.role = 'admin';
      userData.permissions = [
        'admin.*',
        'profile.*',
        'elearning.*',
        'monitoring.*',
        'users.manage',
        'system.settings'
      ];
    }

    // Load additional user data from storage or API
    const existingData = this.loadUserData(userData.id);
    if (existingData) {
      userData = { ...userData, ...existingData };
      userData.lastLogin = new Date().toISOString();
    }

    // Save updated user data
    this.saveUserData(userData);

    return userData;
  }

  isAdminUser(email) {
    const adminEmails = [
      'admin@unesa.ac.id',
      'administrator@unesa.ac.id',
      'pengembang@unesa.ac.id'
    ];
    
    return adminEmails.includes(email.toLowerCase()) || 
           email.endsWith('@admin.unesa.ac.id');
  }

  loadUserData(userId) {
    try {
      const data = localStorage.getItem(`user_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('[AuthService] Failed to load user data:', error);
      return null;
    }
  }

  saveUserData(userData) {
    try {
      localStorage.setItem(`user_${userData.id}`, JSON.stringify(userData));
    } catch (error) {
      console.warn('[AuthService] Failed to save user data:', error);
    }
  }

  createJWTToken(userData) {
    // Simple JWT-like token (in production, use proper JWT library)
    const header = {
      typ: 'JWT',
      alg: 'HS256'
    };

    const payload = {
      sub: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      permissions: userData.permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      iss: 'unesa-sso',
      aud: 'unesa-portal'
    };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = this.createSignature(`${encodedHeader}.${encodedPayload}`);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  createSignature(data) {
    // Simple signature (in production, use proper HMAC)
    const secret = 'unesa-sso-secret-key-2024';
    let hash = 0;
    const combined = data + secret;
    
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return btoa(hash.toString());
  }

  verifyJWTToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      
      // Check expiry
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      // Verify signature
      const expectedSignature = this.createSignature(`${parts[0]}.${parts[1]}`);
      if (parts[2] !== expectedSignature) {
        return null;
      }

      return payload;
    } catch (error) {
      console.warn('[AuthService] Token verification failed:', error);
      return null;
    }
  }

  decodeJWT(token) {
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      console.error('[AuthService] JWT decode error:', error);
      throw new Error('Invalid JWT token');
    }
  }

  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      }
    };
  }

  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.warn('[AuthService] Failed to get IP:', error);
      return 'unknown';
    }
  }

  checkExistingSession() {
    const sessionData = sessionStorage.getItem('sso_session');
    if (!sessionData) return;

    try {
      const session = JSON.parse(sessionData);
      
      // Verify token
      const tokenPayload = this.verifyJWTToken(session.token);
      if (!tokenPayload) {
        this.clearSession();
        return;
      }

      // Check session expiry
      if (new Date(session.expiresAt) <= new Date()) {
        this.clearSession();
        return;
      }

      // Restore session
      this.sso.session = session;
      this.sso.user = session.user;
      this.startActivityTracking();
      
      console.log('[AuthService] Existing session restored for:', session.user.email);
      this.sso.broadcast('session_restored', { session });
      
    } catch (error) {
      console.warn('[AuthService] Failed to restore session:', error);
      this.clearSession();
    }
  }

  setupTokenRefresh() {
    this.tokenRefreshInterval = setInterval(() => {
      this.checkTokenRefresh();
    }, 60000); // Check every minute
  }

  checkTokenRefresh() {
    if (!this.sso.isAuthenticated()) return;

    const session = this.sso.session;
    const expiryTime = new Date(session.expiresAt).getTime();
    const currentTime = Date.now();
    const timeUntilExpiry = expiryTime - currentTime;

    // Refresh if within threshold
    if (timeUntilExpiry <= this.refreshThreshold) {
      this.refreshToken();
    }
  }

  async refreshToken() {
    try {
      const session = this.sso.session;
      if (!session) return;

      // Create new token with extended expiry
      const newToken = this.createJWTToken(session.user);
      const newExpiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString();

      // Update session
      session.token = newToken;
      session.expiresAt = newExpiresAt;
      session.lastActivity = new Date().toISOString();

      // Store updated session
      this.sso.setSession(session);

      console.log('[AuthService] Token refreshed successfully');
      this.sso.broadcast('token_refreshed', { session });

    } catch (error) {
      console.error('[AuthService] Token refresh failed:', error);
      this.logout();
    }
  }

  startActivityTracking() {
    // Track user activity to keep session alive
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const updateActivity = () => {
      if (this.sso.isAuthenticated()) {
        this.sso.session.lastActivity = new Date().toISOString();
        this.sso.setSession(this.sso.session);
      }
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });
  }

  // Authentication methods
  async login() {
    try {
      // Ensure clientId configured
      const clientId = this.sso.config.google?.clientId || import.meta?.env?.VITE_GOOGLE_CLIENT_ID || '';
      if (!clientId) {
        throw new Error('Google Client ID is not configured. Please set SSOCore.config.google.clientId or VITE_GOOGLE_CLIENT_ID to enable Google Sign-In.');
      }

      // Use direct OAuth popup flow to avoid GIS prompt overlay
      return await this.loginWithPopup();
    } catch (error) {
      console.error('[AuthService] Login error:', error);
      throw error;
    }
  }

  async loginWithPopup() {
    try {
      // Use Google OAuth popup
      let authUrl;
      try {
        authUrl = await this.buildGoogleAuthUrl();
      } catch (err) {
        // Surface a helpful error to caller
        console.error('[AuthService] Cannot build Google auth URL:', err.message);
        throw err;
      }
      const popup = window.open(authUrl, 'google-auth', 'width=500,height=600');
      
      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            reject(new Error('Login cancelled'));
          }
        }, 1000);

        // Listen for auth result
        window.addEventListener('message', (event) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
            clearInterval(checkClosed);
            popup.close();
            this.handleGoogleResponse(event.data);
            resolve();
          } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
            clearInterval(checkClosed);
            popup.close();
            reject(new Error(event.data.error));
          }
        });
      });
    } catch (error) {
      console.error('[AuthService] Popup login error:', error);
      throw error;
    }
  }

  async buildGoogleAuthUrl() {
    const clientId = this.sso.config.google?.clientId || import.meta?.env?.VITE_GOOGLE_CLIENT_ID || '';

    // Fail early if clientId missing to avoid executing PKCE helpers (which use window.crypto)
    if (!clientId) {
      throw new Error('Google Client ID not configured. Set SSOCore.config.google.clientId or VITE_GOOGLE_CLIENT_ID.');
    }

    // Use Vite base path (import.meta.env.BASE_URL) to build correct callback path for dev/prod
    const base = (import.meta?.env?.BASE_URL || '/').replace(/\\+/g, '/');
    const redirectUri = `${window.location.origin}${base.endsWith('/') ? base : base + '/'}oauth-callback.html`;
    if (import.meta?.env?.DEV) {
      console.log('[AuthService] OAuth redirect URI:', redirectUri);
    }
    const scope = 'openid email profile';
    const state = randomState(24);
    const nonce = generateRandomString(32);

    // PKCE
    const code_verifier = generateRandomString(64);
    const code_challenge = await createCodeChallenge(code_verifier);

    // Persist for callback validation
    try {
      sessionStorage.setItem('oauth-google-state', state);
      sessionStorage.setItem('oauth-google-nonce', nonce);
      sessionStorage.setItem('oauth-google-code-verifier', code_verifier);
      sessionStorage.setItem('oauth-google-timestamp', Date.now().toString());
    } catch {}

    return buildAuthUrl({
      clientId,
      redirectUri,
      scope,
      state,
      nonce,
      code_challenge
    });
  }

  async logout() {
    try {
      // Clear Google session
      if (window.google && window.google.accounts) {
        google.accounts.id.disableAutoSelect();
      }

      // Log activity
      this.sso.logActivity('logout', {
        timestamp: new Date().toISOString()
      });

      // Clear session
      this.clearSession();

      // Clear intervals
      if (this.tokenRefreshInterval) {
        clearInterval(this.tokenRefreshInterval);
        this.tokenRefreshInterval = null;
      }

      console.log('[AuthService] Logged out successfully');
      this.sso.broadcast('logout_complete');

    } catch (error) {
      console.error('[AuthService] Logout error:', error);
      // Force clear even on error
      this.clearSession();
    }
  }

  clearSession() {
    // Clear session storage
    sessionStorage.removeItem('sso_session');
    
    // Clear SSO core
    this.sso.session = null;
    this.sso.user = null;
    
    // Broadcast clear event
    this.sso.broadcast('session_cleared');
  }

  // Permission methods
  hasPermission(permission) {
    if (!this.sso.user) return false;
    
    const userPermissions = this.sso.user.permissions || [];
    
    // Check for wildcard permissions
    for (const perm of userPermissions) {
      if (perm.endsWith('*')) {
        const prefix = perm.slice(0, -1);
        if (permission.startsWith(prefix)) return true;
      } else if (perm === permission) {
        return true;
      }
    }
    
    return false;
  }

  getUserPermissions() {
    return this.sso.user?.permissions || [];
  }

  // Utility methods
  isTokenExpired(token) {
    const payload = this.verifyJWTToken(token);
    return !payload;
  }

  getSessionInfo() {
    if (!this.sso.session) return null;

    return {
      id: this.sso.session.id,
      user: {
        name: this.sso.user.name,
        email: this.sso.user.email,
        role: this.sso.user.role,
        avatar: this.sso.user.avatar
      },
      createdAt: this.sso.session.createdAt,
      lastActivity: this.sso.session.lastActivity,
      expiresAt: this.sso.session.expiresAt,
      timeUntilExpiry: new Date(this.sso.session.expiresAt).getTime() - Date.now()
    };
  }
}

export default AuthService;