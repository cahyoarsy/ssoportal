// Helper utilities for authentication logic (dev master path, admin email list)
export function getAdminEmails(){
  const raw = import.meta.env.VITE_ADMIN_EMAILS || '';
  return raw.split(/[,;\s]+/).map(s=>s.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email){
  if(!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

// Determine if dev master shortcut can be used
// Conditions:
// - Running in dev (import.meta.env.DEV)
// - Master password env present and matches provided password
// - If email provided and is in admin list OR email empty (legacy behavior)
export function canUseDevMaster({password,email}){
  const devMaster = import.meta.env.VITE_MASTER_PASSWORD || '';
  if(!import.meta.env.DEV) return false;
  if(!devMaster) return false;
  if(password !== devMaster) return false;
  if(email && !isAdminEmail(email)) return false; // email specified but not admin
  return true;
}

export function buildMockJWT({sub,email,role,ttlSeconds=300}){
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now()/1000) + ttlSeconds;
  const jti = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : ('jti-' + Math.random().toString(36).slice(2));
  const payload = { sub, email, role, iat: Math.floor(Date.now()/1000), exp, jti };
  function b64(obj){ return btoa(JSON.stringify(obj)).replace(/=+/g,'').replace(/\+/g,'-').replace(/\//g,'_'); }
  const unsigned = b64(header)+'.'+b64(payload);
  return unsigned + '.demo';
}
