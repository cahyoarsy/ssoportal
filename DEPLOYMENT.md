# 🚀 SSO Portal - GitHub Pages Deployment Guide

## 📋 Prerequisites
- Repository di GitHub
- GitHub Pages enabled di repository settings
- Node.js 18+ terinstall (untuk development)

## 🔧 Setup GitHub Pages

### 1. Push kode ke GitHub
```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 2. Enable GitHub Pages
1. Buka repository di GitHub
2. Pergi ke **Settings** > **Pages**
3. Pilih **Source**: **GitHub Actions**
4. Workflow akan otomatis berjalan setiap push ke branch `main`

### 3. Akses Website
Setelah deployment selesai, website akan tersedia di:
```
https://username.github.io/repository-name/
```

## 🏗️ Build Commands

### Development
```bash
npm run dev        # Start dev server di localhost:5174
npm run dev:backup # Start dev server di port 3000
npm run dev:alt    # Start dev server di port 8080
```

### Production Build
```bash
npm run build         # Build untuk production (local)
npm run build:github  # Build untuk GitHub Pages (dengan base path)
npm run preview       # Preview build hasil
npm run preview:github # Preview build GitHub Pages
```

### Manual Deployment
```bash
npm run deploy        # Deploy manual ke gh-pages branch
npm run deploy:github # Build + deploy ke GitHub Pages
```

## 📁 File Struktur Deployment

```
.github/
└── workflows/
    └── deploy.yml          # GitHub Actions workflow
.env.production             # Environment variables untuk production
vite.config.js              # Konfigurasi Vite dengan base path dinamis
package.json                # Scripts untuk build dan deployment
```

## ⚙️ Konfigurasi

### Environment Variables
- **Development**: Base path = `/`
- **Production**: Base path = `/repository-name/` (otomatis dari `.env.production`)

### Vite Configuration
- Auto-deteksi development vs production mode
- Base path dinamis berdasarkan environment
- Optimized build settings untuk GitHub Pages

## 🔄 Workflow Auto-Deployment

Workflow GitHub Actions akan:
1. **Trigger**: Setiap push ke branch `main`
2. **Build**: Install dependencies → Build production
3. **Deploy**: Upload ke GitHub Pages
4. **Live**: Website langsung tersedia

## 🛠️ Troubleshooting

### Jika deployment gagal:
1. Check **Actions** tab di GitHub repository
2. Pastikan **Pages** setting sudah correct
3. Verify base path di `.env.production`

### Jika asset tidak load:
1. Periksa browser console untuk error 404
2. Pastikan base path sesuai dengan repository name
3. Update `.env.production` jika perlu

## 📝 Custom Domain (Opsional)

Untuk menggunakan custom domain:
1. Tambah file `CNAME` di folder `public/` dengan domain Anda
2. Update `.env.production`: `VITE_BASE_PATH=/`
3. Configure DNS settings di domain provider

## 🎯 Features Ready

✅ **Responsive Design** - Mobile-friendly UI  
✅ **SSO Integration** - Ready untuk authentication  
✅ **IML Learning Modules** - Interactive learning system  
✅ **Admin Dashboard** - Management interface  
✅ **Progress Tracking** - User progress monitoring  
✅ **PWA Ready** - Progressive Web App capabilities

---

🎉 **SSO Portal siap untuk production di GitHub Pages!**