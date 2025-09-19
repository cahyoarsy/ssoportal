// Lightweight logger with level control and namespacing
// Levels: silent(0), error(1), warn(2), info(3), debug(4), trace(5)

const LEVELS = { silent: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5 };

function normalize(level) {
  if (typeof level === 'number') return Math.max(0, Math.min(5, level));
  const key = String(level || '').toLowerCase();
  return LEVELS[key] ?? LEVELS.warn;
}

function getInitialLevel() {
  try {
    // Highest priority: window override
    if (typeof window !== 'undefined' && window.SSO_LOG_LEVEL != null) {
      return normalize(window.SSO_LOG_LEVEL);
    }
    // localStorage
    if (typeof localStorage !== 'undefined') {
      const ls = localStorage.getItem('sso:logLevel');
      if (ls) return normalize(ls);
    }
    // Vite env
    if (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_LOG_LEVEL) {
      return normalize(import.meta.env.VITE_LOG_LEVEL);
    }
  } catch {}
  // Default: keep warnings and errors only
  return LEVELS.warn;
}

let currentLevel = getInitialLevel();

export function setLogLevel(level) {
  currentLevel = normalize(level);
  try {
    if (typeof window !== 'undefined') window.SSO_LOG_LEVEL = currentLevel;
  } catch {}
}

export function getLogLevel() { return currentLevel; }

function shouldLog(level) { return level <= currentLevel; }

function fmt(ns, args) {
  const ts = new Date().toISOString().split('T')[1].replace('Z','');
  return [`[%c${ns}%c %c${ts}%c]`, 'color:#7c3aed', 'color:inherit', 'color:#64748b', 'color:inherit', ...args];
}

export function createLogger(namespace = 'app') {
  return {
    error: (...args) => { if (shouldLog(LEVELS.error)) console.error(...fmt(namespace, args)); },
    warn:  (...args) => { if (shouldLog(LEVELS.warn))  console.warn(...fmt(namespace, args)); },
    info:  (...args) => { if (shouldLog(LEVELS.info))  console.info(...fmt(namespace, args)); },
    debug: (...args) => { if (shouldLog(LEVELS.debug)) console.log(...fmt(namespace, args)); },
    trace: (...args) => { if (shouldLog(LEVELS.trace)) console.log(...fmt(namespace, args)); },
    level: () => currentLevel,
  };
}

// Convenience root logger
const defaultLogger = createLogger('SSO');
export default defaultLogger;
