// Membuat fallback 404.html (GitHub Pages reload SPA / iframe asset) dari index.html
// Agar refresh di path atau deep link tetap memuat aplikasi.
const { readFileSync, writeFileSync, existsSync } = require('fs');
const path = require('path');

const distDir = path.join(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');

try {
  if (!existsSync(indexPath)) {
    console.warn('[postbuild] index.html belum ditemukan, lewati pembuatan 404.html');
    process.exit(0);
  }
  const html = readFileSync(indexPath, 'utf-8');
  // Tandai fallback untuk debugging
  const fallback = html.replace('</head>', '  <!-- 404 fallback generated -->\n</head>');
  writeFileSync(notFoundPath, fallback, 'utf-8');
  console.log('[postbuild] 404.html dibuat.');
} catch (err) {
  console.error('[postbuild] Gagal membuat 404.html:', err);
  process.exit(1);
}
