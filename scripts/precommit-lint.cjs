#!/usr/bin/env node
// Simple security/banned words lint for commits
// Blocks commit if any banned token appears in tracked staged files
// Extend list as needed
const { execSync } = require('child_process');

const banned = [
  'PASSWORD_PLAIN',
  'API_SECRET',
  'EVAL(',
  'document.write(',
  'innerHTML =' // naive XSS sink example
];

function getStagedFiles(){
  const out = execSync('git diff --cached --name-only', {encoding:'utf8'}).trim();
  if(!out) return [];
  return out.split(/\r?\n/).filter(f=>!f.startsWith('.husky/'));
}

function readFile(path){
  try { return require('fs').readFileSync(path,'utf8'); } catch { return ''; }
}

const files = getStagedFiles();
let violations = [];
for(const f of files){
  if(!/\.(js|jsx|ts|tsx|json|md|html|css)$/i.test(f)) continue;
  const content = readFile(f);
  banned.forEach(tok=>{
    if(content.includes(tok)){
      violations.push({file:f, token:tok});
    }
  });
}

if(violations.length){
  console.error('\n[SECURITY LINT] Commit diblokir. Ditemukan token terlarang:');
  violations.forEach(v=> console.error(` - ${v.file}: ${v.token}`));
  console.error('\nEdit file dan hapus token, atau whitelist secara manual (ubah script jika false positive).');
  process.exit(1);
} else {
  console.log('[security-lint] OK');
}
