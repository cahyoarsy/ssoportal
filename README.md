# Portal SSO Kampus (Demo UI)

![Deploy Status](https://github.com/cahyoarsy/ssoportal/actions/workflows/deploy-pages.yml/badge.svg)

Live URL (GitHub Pages): https://cahyoarsy.github.io/ssoportal/


Antarmuka portal Single Sign On (SSO) kampus menggunakan **React + Vite + Tailwind CSS + Framer Motion**. Proyek ini masih berupa demonstrasi front-end (belum terhubung ke backend / identity provider). Cocok sebagai dasar integrasi ke Keycloak, OAuth 2.0 services, OpenID Connect, CAS, dsb.

## Fitur Yang Sudah Ada
- Navigasi responsif dengan menu mobile animasi.
- Hero section dengan visual kartu autentikasi.
- Form login (email + password) + placeholder tombol Google OAuth.
- Grid fitur autentikasi (SSO, Audit, MFA placeholder, Device Trust, Session Intelligence) secara deskriptif.
- Statistik dinamis (animasi increment angka).
- Section Aplikasi Mobile (fitur & CTA store placeholder).
- Carousel Testimoni (auto-rotate + manual control + pause saat hover).
- Kontak & Dukungan (WhatsApp, email, lokasi kantor).
- Footer dengan struktur tautan dan placeholder fitur keamanan lanjutan.
- Komponen terstruktur + animasi masuk viewport dengan Framer Motion.
- Embed aplikasi terintegrasi (multi-app) dalam mode halaman penuh setelah login.
- Mode immersive penuh (iframe menutupi seluruh viewport tanpa Navbar) untuk pengalaman aplikasi maksimal.
 - Mode immersive penuh (iframe menutupi seluruh viewport tanpa Navbar) untuk pengalaman aplikasi maksimal.
 - Animasi transisi masuk/keluar immersive (fade + slight scale) dengan Framer Motion.
 - Preferensi dark mode dipersisten ke localStorage & auto-detect preferensi OS awal.
 - Sinkronisasi tema ke aplikasi ter-embed via postMessage (`THEME_SYNC`).
 - Tombol minimize untuk kembali ke portal landing tanpa logout (tetap mempertahankan sesi SSO).
- Multi-app selector (contoh: `Proyek1` dan `Demo App 2`).
- Mock JWT (header.payload.signature) sementara (signature dummy) + penyimpanan sessionStorage.
- Logout terkoordinasi via `postMessage` dari aplikasi ter-embed.
- Mode gelap (class `dark`) dengan toggle di Navbar & overlay iframe.
- Overlay kontrol di atas iframe (selector app + logout + dark toggle).

## Rencana / Backlog
- Integrasi nyata OAuth/OIDC (endpoint authorize & token exchange).
- MFA (TOTP / Email code / WebAuthn) UI flow.
- Halaman manajemen perangkat & sesi aktif.
- Halaman status sistem + log audit.
- Ganti mock JWT signature dengan HMAC/RS256 backend.
- Refresh token nyata (cookie HttpOnly) + silent re-issue.
- State manajemen (Zustand / Redux) jika kompleksitas bertambah.
- Multi-tenant branding / theming.

## Struktur Direktori Singkat
```
sso-portal/
  package.json
  vite.config.js
  tailwind.config.js
  postcss.config.js
  index.html
  src/
    main.jsx
    index.css
    App.jsx
    components/
      Navbar.jsx
      Hero.jsx
      LoginForm.jsx
      Stats.jsx
      MobileApp.jsx
      Testimonials.jsx
      Contact.jsx
      Footer.jsx
```

## Menjalankan Secara Lokal
Pastikan Node.js >= 18.

```bash
npm install
npm run dev
```
Buka URL yang ditampilkan (biasanya `http://localhost:5173`).

## Build Produksi
```bash
npm run build
npm run preview
```

### Catatan Keamanan (Master Password Development)
Untuk kemudahan pengujian lokal, tersedia shortcut login admin menggunakan *master password* yang hanya aktif di mode development (`import.meta.env.DEV`).

- Variabel: `VITE_MASTER_PASSWORD` (didefinisikan di `.env.development`)
- Tidak aktif di build produksi (blok kode dibungkus `if (import.meta.env.DEV)`)
- Jika mencoba menggunakan master password di produksi tanpa email, aplikasi akan menampilkan pesan error.

Pastikan Anda TIDAK mengisi master password sensitif / real credential di file environment yang ikut ter-commit. Gunakan hanya dummy untuk simulasi.


### Opsi Konfigurasi Base Path
Secara default proyek ini memakai base relatif (`./`) sehingga asset hasil build dapat dipindah ke folder mana saja di hosting statis.

Anda bisa mengubah base path lewat variabel environment `VITE_BASE_PATH`.

Contoh file `.env.production` untuk GitHub Pages (repo bernama `ssoportal`):
```
VITE_BASE_PATH=/ssoportal/
```
Lalu jalankan:
```bash
npm run build
```

## Deploy ke GitHub Pages
1. Pastikan repository sudah dibuat di GitHub (nama misal: `ssoportal`).
2. Salin `.env.example` menjadi `.env.production` dan set `VITE_BASE_PATH=/ssoportal/` (atau nama repo Anda).
3. Jalankan:
   ```bash
   npm install
   npm run deploy
   ```
   Perintah `deploy` menggunakan paket `gh-pages` untuk push isi folder `dist` ke branch `gh-pages`.
4. Di GitHub repository settings -> Pages -> pilih sumber `Deploy from a branch` dan branch `gh-pages` folder root.
5. Akses: `https://<username>.github.io/ssoportal/`.

Jika ingin otomatis via GitHub Actions, buat workflow (opsional) seperti:
```
name: Deploy Pages
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: echo "VITE_BASE_PATH=/ssoportal/" > .env.production
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Deploy ke Shared / VPS / cPanel Hosting
1. Jalankan `npm run build` (pastikan `VITE_BASE_PATH=./`).
2. Upload seluruh isi folder `dist` ke folder publik (misal `public_html/sso`), bukan folder `dist` itu sendiri.
3. Akses melalui `https://domain.com/sso/`.

### Catatan SPA (Single Page App)
Jika hosting tidak mendukung fallback ke `index.html` saat refresh di route lain, Anda harus menambahkan aturan rewrite (Nginx / Apache). Saat ini aplikasi tidak memakai routing React (single root), sehingga aman.

## Struktur Build
Hasil build default: `dist/index.html` + asset di `dist/assets/*` (hashing). Base relatif memastikan referensi `<script>` & `<link>` tetap valid ketika dipindahkan.

## Checklist Produksi Minimum
- [x] Base path relatif / sesuai lokasi hosting
- [x] Token SSO saat ini masih mock (jangan gunakan di produksi nyata)
- [ ] Ganti mock JWT menjadi token sah dari backend
- [ ] Tambahkan header keamanan (CSP, HSTS, dll) di layer server
- [ ] Implementasi logout global + revocation actual

## SEO & Akses (Tambahan)
- `robots.txt` dan `sitemap.xml` dasar telah ditambahkan untuk memudahkan indexing.
- Pastikan menambahkan OpenGraph image bila publik.

## Custom Domain
Workflow mendukung domain kustom dengan membuat variable repository (Settings → Variables → Actions) bernama `CUSTOM_DOMAIN`.

1. Tambahkan variable `CUSTOM_DOMAIN` dengan nilai misal: `sangsongko.co.id` atau `sso.sangsongko.co.id`.
2. Workflow otomatis:
  - Mengganti `VITE_BASE_PATH` menjadi `/`
  - Membuat `public/CNAME` berisi domain
3. Push terbaru akan mendeploy ke domain itu setelah Anda mengatur DNS.

### DNS (Root Domain)
Tambahkan record A (IPv4) ke GitHub Pages:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
Opsional IPv6 (AAAA):
```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

### DNS (Subdomain `sso.` misal)
Gunakan CNAME:
```
sso  CNAME  cahyoarsy.github.io.
```

Setelah propagasi (cek dengan `nslookup` / `dig`), buka Settings → Pages → pastikan domain diverifikasi.

Jika Anda menghapus variable `CUSTOM_DOMAIN`, deployment berikutnya kembali memakai base `/ssoportal/`.



## Integrasi SSO (Garis Besar)
1. Redirect user ke `https://idp.example.com/oauth2/authorize?...` (Gunakan tombol Google atau SSO utama).
2. Identity Provider (IdP) mengirim kembali `code` ke redirect URI.
3. Frontend kirim `code` ke backend Anda (`/api/auth/oidc/callback`) untuk ditukar dengan `access_token` + `id_token` secara server-side.
4. Backend set secure HTTP-only cookie (mis. `session` atau `id_token` disimpan terenkripsi / referensi sesi DB).
5. Frontend fetch profil (`/api/me`) -> render dashboard / state global.
6. Perbarui token menggunakan refresh token (server side) atau silent iframe (OIDC) sesuai strategi.

## Mode Embed Multi-Aplikasi
Portal kini dapat langsung menampilkan satu atau lebih aplikasi lain setelah login dengan token SSO mock.

Alur singkat:
1. User login -> portal menghasilkan JWT mock pendek (exp ~5m) & menyimpannya di sessionStorage.
2. Aplikasi dipanggil di iframe dengan hash: `#<base>?sso=<jwt>` (contoh `#home` untuk Proyek1 atau `#start` untuk Demo App 2).
3. Aplikasi klien membaca hash, mem-parse token, memvalidasi `exp`, lalu menampilkan profil / status login.
4. Logout dari aplikasi mengirim `postMessage({type:'SSO_LOGOUT'})` ke parent -> portal menghapus token dan kembali ke halaman awal.
5. (Next) Refresh token nyata sebaiknya dikelola via cookie HttpOnly + endpoint re-issue.

Struktur untuk dev (disajikan oleh Vite / static root):
```
sso-portal/
  public/
    proyek1/
      index.html
      styles.css
      app.js
     demo2/
       index.html
```

Jika menjalankan server statis root (opsional produksi dev lintas proyek):
```
serve -p 5500 d:\Website
```
Maka akses portal di: `http://localhost:5500/sso-portal/`.

Penguatan yang disarankan sebelum produksi:
- Implementasi JWT bertanda tangan (HS256/RS256) di backend.
- Access Token (pendek) + Refresh Token (lebih panjang) dikelola cookie HttpOnly + rotasi.
- Endpoint introspeksi / revocation / logout global.
- Validasi claim (aud, iss, iat, nbf, jti) & replay protection.
- Logout dua arah (portal -> iframe & iframe -> portal) + broadcast multi-tab.
- CSP ketat + Subresource Integrity.

## Keamanan & Praktik Baik
- Jangan simpan `access_token` di `localStorage` (raw). Gunakan cookie HttpOnly + CSRF protection.
- Terapkan rate limiting, IP throttling pada endpoint autentikasi.
- Audit log: simpan event login / logout / gagal login / recovery.
- MFA sebaiknya opsional tapi direkomendasikan untuk peran sensitif.
- Gunakan CSP header dan nonce untuk skrip dinamis.

### Security Hardening (postMessage SSO)  
Perubahan (Sept 2025):
1. Portal tidak lagi mengirim `postMessage` dengan target origin `*`, melainkan origin hasil parsing dari URL iframe aktif (lihat `AppEmbed.jsx`).
2. Portal hanya memproses pesan dari origin yang sama dengan iframe yang sedang aktif.
3. Halaman `monitoring` mengunci (`lockedOrigin`) origin pertama yang mengirim `SSO_TOKEN` / `SSO_CONFIG` dan menolak pesan origin lain selanjutnya.
4. Dikirimkan `SSO_CONFIG` berisi daftar origin yang diizinkan agar aplikasi anak bisa memvalidasi tambahan jika perlu.

Langkah lanjutan (belum diimplementasikan):
- Channel binding: sertakan `sessionId` acak unik di setiap `EMBED_READY` -> parent membalas dengan `SSO_TOKEN` + `sessionId` yang sama.
- Tambah Subresource Integrity (SRI) untuk CDN (Bootstrap, jQuery, Chart.js) atau ganti ke bundling lokal.
- Tambahkan `Content-Security-Policy` (contoh awal):
  `default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; img-src 'self' data:; frame-ancestors 'self';` (sesuaikan kebutuhan).
- Validasi claim token di aplikasi turunan (exp, iat, aud, iss).
- Rotasi token & revoke melalui endpoint backend.

Lokasi kode relevan:
- `src/components/AppEmbed.jsx` (fungsi pengiriman & listener pesan)
- `public/monitoring/index.html` (script handshake + origin lock)

Untuk aplikasi baru: tambahkan script handshake mirip, kirim `EMBED_READY`, validasi origin, terapkan tema dari `THEME_SYNC`, dan simpan token di memori / sessionStorage (bukan localStorage) jika diperlukan.

## Penyesuaian Styling & Dark Mode
- Warna utama di `tailwind.config.js` key `brand`.
- Toggle dark mode: class `dark` pada elemen `<html>` (diatur di `App.jsx`).
- Komponen utilitas: lihat layer utilities di `src/index.css` (`.card`, `.btn`, `.badge`).
- Tambahkan styling lanjut di layer `components` / `utilities` untuk varian dark tambahan.

## Lisensi
Contoh UI ini bebas dimodifikasi. Pastikan dependensi tetap mengikuti lisensi masing-masing.

---
Dibuat sebagai fondasi portal autentikasi terpadu.

## (Baru) Penyimpanan Hasil E-Learning & Monitoring

Perubahan September 2025:

1. Format lama `localStorage.elearning_results` masih dipertahankan sebagai ringkasan terakhir (key `preTest` / `postTest`).
2. Format baru `localStorage.elearning_results_history` (Array) menampung seluruh riwayat setiap submit dengan struktur objek:
```
{
  id: string,            // unik (pre-<timestamp>-<random> / post-...)
  type: 'preTest'|'postTest',
  userEmail: string,     // email dari token SSO (atau 'anonymous')
  score: number,
  total: number,         // 80
  percentage: number,    // 0-100
  criteria: string,      // Sangat Baik | Baik | Cukup | Perlu Bimbingan
  answers: { [qKey]: val }, // semua jawaban termasuk uraian
  timestamp: ISOString
}
```
3. `monitoring.js` kini membaca array ini secara incremental tanpa menghapusnya. ID yang sudah diproses dicatat di `localStorage.monitoring_processed_ids` untuk mencegah duplikasi.
4. Mapping siswa sekarang menggunakan `userEmail` sebagai `id` stabil. Jika email tidak ada, fallback ke label `anonymous`.
5. Aktivitas baru ditambahkan ke log dengan format ringkas (misal: `nama menyelesaikan Pre-Test (75%)`).

### Backward Compatibility
Jika hanya format lama yang ada (misal hasil dari versi sebelumnya), sistem masih akan mengonsumsi satu paket ringkasan dan menambahkan sebagai entri pseudo siswa dengan prefix `LEGACY_`.

### Menghapus / Reset Data Monitoring
Untuk mereset seluruh data terkait monitoring/dev:
```
localStorage.removeItem('monitoring_students');
localStorage.removeItem('monitoring_activities');
localStorage.removeItem('monitoring_processed_ids');
localStorage.removeItem('elearning_results_history');
localStorage.removeItem('elearning_results');
```

## (Perubahan) Penghapusan Aplikasi Demo Awal

Daftar aplikasi yang di-embed kini disederhanakan hanya:
- `E-Learning IML`
- `Monitoring Guru`

Entri awal `proyek1` dan `demo2` dihapus dari daftar `APPS` di `src/App.jsx` untuk fokus pada dua modul inti.

Jika ingin menambah kembali aplikasi baru, cukup tambahkan objek:
```
{ id: 'nama-app', name: 'Nama App', path: 'nama-app/index.html', hashBase: '' }
```
ke array `APPS` dan letakkan folder di `public/`.

## (Baru) Section Profil / CV

Portal kini menyertakan section `Profil & CV` (bilingual) untuk menampilkan informasi personal / profesional.

Lokasi kode: `src/components/Profile.jsx`.

Fitur:
- Dual bahasa (Indonesia + English) dalam satu komponen.
- Ringkasan, motivasi, target, skills (badge), kontak, tombol unduh CV.
- Foto otomatis memuat dari `public/profile.jpg` (jika ada). Jika belum tersedia ditampilkan placeholder gradient.
- Tombol "Unduh CV" menunjuk ke `public/cv.pdf` (ganti dengan file CV asli Anda).

Cara kustomisasi cepat:
1. Ganti isi objek `profileData` di `Profile.jsx` (nama, email, tautan GitHub/LinkedIn, narasi, skills).
2. Replace file `public/profile.jpg` dengan foto asli (ukuran rasio 3:4 direkomendasikan).
3. Replace file `public/cv.pdf` dengan CV resmi Anda.
4. Jika ingin satu bahasa saja — hapus blok English atau komentari bagian yang tidak diperlukan.

Jika tidak ingin menampilkan profil di landing, hapus impor dan penggunaan `<Profile />` di `App.jsx`.
