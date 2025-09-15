# Portal SSO Kampus (Demo UI)

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

## Penyesuaian Styling & Dark Mode
- Warna utama di `tailwind.config.js` key `brand`.
- Toggle dark mode: class `dark` pada elemen `<html>` (diatur di `App.jsx`).
- Komponen utilitas: lihat layer utilities di `src/index.css` (`.card`, `.btn`, `.badge`).
- Tambahkan styling lanjut di layer `components` / `utilities` untuk varian dark tambahan.

## Lisensi
Contoh UI ini bebas dimodifikasi. Pastikan dependensi tetap mengikuti lisensi masing-masing.

---
Dibuat sebagai fondasi portal autentikasi terpadu.
