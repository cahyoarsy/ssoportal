// Simple local storage-backed store for E-Learning submissions/results
// Data shape:
// jobsheets: { [email]: Array<{ id, moduleId, timestamp, data }> }
// testResults: { [email]: Array<{ id, moduleId, timestamp, data }> }

const JOBSHEETS_KEY = 'elearn:jobsheets:v1';
const TEST_RESULTS_KEY = 'elearn:testResults:v1';

function safeParse(json, fallback) {
  try { return JSON.parse(json); } catch { return fallback; }
}

function readMap(key) {
  return safeParse(localStorage.getItem(key) || '{}', {});
}

function writeMap(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
}

function ensureArray(map, email) {
  if (!map[email]) map[email] = [];
  return map[email];
}

function makeEntry(moduleId, data) {
  return {
    id: Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    moduleId: moduleId || 'elearning-iml',
    timestamp: new Date().toISOString(),
    data: data || {}
  };
}

// Jobsheets
export function saveJobSheet(email, moduleId, jobSheetData) {
  if (!email) return null;
  const map = readMap(JOBSHEETS_KEY);
  const arr = ensureArray(map, email);
  const entry = makeEntry(moduleId, jobSheetData);
  arr.unshift(entry);
  // cap
  if (arr.length > 200) arr.length = 200;
  writeMap(JOBSHEETS_KEY, map);
  return entry;
}

export function getJobSheets(email) {
  const map = readMap(JOBSHEETS_KEY);
  return email ? (map[email] || []) : [];
}

export function getAllJobSheets() {
  const map = readMap(JOBSHEETS_KEY);
  return map; // { email: [entries] }
}

// Test Results
export function saveTestResult(email, moduleId, resultData) {
  if (!email) return null;
  const map = readMap(TEST_RESULTS_KEY);
  const arr = ensureArray(map, email);
  const entry = makeEntry(moduleId, resultData);
  arr.unshift(entry);
  if (arr.length > 500) arr.length = 500;
  writeMap(TEST_RESULTS_KEY, map);
  return entry;
}

export function getTestResults(email) {
  const map = readMap(TEST_RESULTS_KEY);
  return email ? (map[email] || []) : [];
}

export function getAllTestResults() {
  const map = readMap(TEST_RESULTS_KEY);
  return map; // { email: [entries] }
}

// Optional: lightweight CSV export helpers
export function toCSV(rows, columns) {
  const header = columns.map(c => '"' + (c.header || c.key) + '"').join(',');
  const body = rows.map(r => columns.map(c => {
    const v = typeof c.render === 'function' ? c.render(r) : r[c.key];
    const s = (v === undefined || v === null) ? '' : String(v);
    return '"' + s.replace(/"/g, '""') + '"';
  }).join(',')).join('\n');
  return header + '\n' + body;
}

export function getUserElearning(email) {
  const store = readStore();
  return store.users[email] || { jobsheets: [], tests: {} };
}
