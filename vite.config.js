import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Konfigurasi Vite dengan base path dinamis agar mudah dideploy di subfolder (GitHub Pages / shared hosting)
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = mode === 'development';
  return {
    // Dev should use '/' for stable HMR; production can use subfolder base
    // Set VITE_BASE_PATH (e.g., "/ssoportal/") only for prod builds (.env.production)
    base: isDev ? '/' : (env.VITE_BASE_PATH || '/'),
    plugins: [react()],
    server: {
      port: 5174,          // Disamakan dengan task npm run dev:5174
      strictPort: true,    // Jika port dipakai, akan error daripada silent pindah port
      host: true,          // Listen on all interfaces; still accessible via localhost
      open: true           // Auto-open browser on start
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false, // Set true jika butuh debugging produksi
    },
  };
});
