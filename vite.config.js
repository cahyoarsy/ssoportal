import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Konfigurasi Vite dengan base path dinamis agar mudah dideploy di subfolder (GitHub Pages / shared hosting)
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // Jika ingin di GitHub Pages (repo bernama ssoportal) isi VITE_BASE_PATH=/ssoportal/ di .env.production
    // Untuk shared hosting (folder apa saja) bisa biarkan default './'
    base: env.VITE_BASE_PATH || './',
    plugins: [react()],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false, // Set true jika butuh debugging produksi
    },
  };
});
