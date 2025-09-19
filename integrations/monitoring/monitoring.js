// Lightweight Monitoring module (integrations) with SSO banner handling
(function(){
  'use strict';

  const allowedOrigins = [window.location.origin, 'http://localhost:5174'];
  function isValidOrigin(origin) { return !origin || allowedOrigins.includes(origin); }

  const elTop = document.getElementById('sso-top');
  const elStatus = document.getElementById('sso-status');
  const elUser = document.getElementById('sso-user');
  const elRole = document.getElementById('sso-role');
  const btnLogout = document.getElementById('sso-logout');

  let session = null;

  function parseJWT(token) {
    try {
      const [h,p,s] = token.split('.');
      if (!p) return null;
      return JSON.parse(atob(p.replace(/-/g,'+').replace(/_/g,'/')));
    } catch { return null; }
  }

  function updateBanner() {
    if (!elTop) return;
    if (!session) {
      elTop.classList.add('error');
      elStatus.textContent = 'NO SESSION';
      elUser.textContent = '-';
      elRole.textContent = '';
    } else {
      elTop.classList.remove('error');
      elStatus.textContent = 'SSO OK';
      elUser.textContent = session.email || session.name || '-';
      elRole.textContent = session.role || 'user';
    }
    elTop.style.display = 'flex';
  }

  function handleParentMessage(event) {
    if (!isValidOrigin(event.origin)) return;
    const data = event.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'SSO_SESSION_UPDATE') {
      const payload = parseJWT(data.token);
      if (!payload || payload.exp*1000 < Date.now()) {
        session = null;
      } else {
        session = payload;
      }
      updateBanner();
    } else if (data.type === 'SSO_LOGOUT' || data.type === 'SSO_SESSION_EXPIRED') {
      session = null;
      updateBanner();
    }
  }

  window.addEventListener('message', handleParentMessage);
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      try {
        window.parent && window.parent.postMessage({ type: 'REQUEST_LOGOUT', moduleId: 'monitoring' }, '*');
      } catch {}
    });
  }

  // Request session from parent
  setTimeout(() => {
    try { window.parent && window.parent.postMessage({ type: 'REQUEST_SESSION', moduleId: 'monitoring' }, '*'); } catch {}
  }, 500);

  // Fake data model for demo
  const students = [
    { name: 'Ayu', kelas: '8A', pre: 70, post: 85, aktivitas: 42 },
    { name: 'Budi', kelas: '8A', pre: 65, post: 78, aktivitas: 35 },
    { name: 'Citra', kelas: '8B', pre: 80, post: 90, aktivitas: 51 },
    { name: 'Dwi', kelas: '8B', pre: 60, post: 72, aktivitas: 28 },
  ];

  function renderTable() {
    const tbody = document.getElementById('studentTable');
    tbody.innerHTML = students.map(s => `
      <tr>
        <td>${s.name}</td>
        <td>${s.kelas}</td>
        <td>${s.pre}</td>
        <td>${s.post}</td>
        <td>${s.aktivitas} menit</td>
      </tr>`).join('');
  }

  function renderSummary() {
    const el = document.getElementById('summary');
    const count = students.length;
    const avgPre = Math.round(students.reduce((a,b)=>a+b.pre,0)/count);
    const avgPost = Math.round(students.reduce((a,b)=>a+b.post,0)/count);
    const avgAct = Math.round(students.reduce((a,b)=>a+b.aktivitas,0)/count);
    el.innerHTML = `
      <div>Jumlah siswa: <strong>${count}</strong></div>
      <div>Rata-rata Pre-Test: <strong>${avgPre}</strong></div>
      <div>Rata-rata Post-Test: <strong>${avgPost}</strong></div>
      <div>Rata-rata Aktivitas: <strong>${avgAct} menit</strong></div>
    `;
  }

  function exportCSV() {
    const header = ['Nama','Kelas','Pre-Test','Post-Test','Aktivitas'];
    const rows = students.map(s => [s.name, s.kelas, s.pre, s.post, s.aktivitas]);
    const csv = [header, ...rows].map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'monitoring.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  function importCSV(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const lines = reader.result.split(/\r?\n/).filter(Boolean);
      const [, ...data] = lines; // skip header
      const parsed = data.map(line => {
        const [name, kelas, pre, post, aktivitas] = line.split(',');
        return { name, kelas, pre: Number(pre), post: Number(post), aktivitas: Number(aktivitas) };
      });
      if (parsed.length) {
        students.splice(0, students.length, ...parsed);
        renderTable();
        renderSummary();
      }
    };
    reader.readAsText(file);
  }

  document.getElementById('btnExport').addEventListener('click', exportCSV);
  document.getElementById('fileImport').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) importCSV(file);
  });

  // initial render
  renderTable();
  renderSummary();

})();
