// Build Google OAuth 2.0 authorization URL (Authorization Code flow with PKCE placeholder)
function buildGoogleAuthUrl({clientId, redirectUri, scope, state, nonce, code_challenge}){
  if (!clientId) {
    throw new Error('clientId is required');
  }
  if (!redirectUri) {
    throw new Error('redirectUri is required');
  }
  if (!scope) {
    throw new Error('scope is required');
  }
  if (!state) {
    throw new Error('state is required');
  }

  const base = 'https://accounts.google.com/o/oauth2/v2/auth';
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope,
    state: state,
    access_type: 'offline',
    include_granted_scopes: 'true',
    prompt: 'select_account'
  });

  // Tambahkan parameter PKCE dan Nonce untuk keamanan
  if (code_challenge) {
    params.set('code_challenge', code_challenge);
    params.set('code_challenge_method', 'S256');
  }
  if (nonce) {
    params.set('nonce', nonce);
  }

  return `${base}?${params.toString()}`;
}

// Generate random string for state
function randomState(len=16){
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out='';
  for(let i=0;i<len;i++) out+=chars[Math.floor(Math.random()*chars.length)];
  return out;
}

/**
 * Generates a cryptographically random string for use as a PKCE code_verifier or nonce.
 * @param {number} length The length of the string to generate.
 * @returns {string} A random URL-safe string.
 */
function generateRandomString(length) {
  const array = new Uint32Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

/**
 * Creates a PKCE code_challenge from a code_verifier.
 * @param {string} verifier The code verifier.
 * @returns {Promise<string>} The URL-safe base64-encoded SHA-256 hash of the verifier.
 */
async function createCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  
  // Base64-URL encode
  return btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export { buildGoogleAuthUrl, randomState, generateRandomString, createCodeChallenge };
