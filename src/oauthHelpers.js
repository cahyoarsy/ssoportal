// Build Google OAuth 2.0 authorization URL (Authorization Code flow with PKCE placeholder)
export function buildGoogleAuthUrl({clientId, redirectUri, scope, state}){
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
  return `${base}?${params.toString()}`;
}

// Generate random string for state
export function randomState(len=16){
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out='';
  for(let i=0;i<len;i++) out+=chars[Math.floor(Math.random()*chars.length)];
  return out;
}
