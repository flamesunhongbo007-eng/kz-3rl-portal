import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    // 文件名固定，不要 hash（避免 Cloudflare 缓存不一致）
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/chunk-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.trycloudflare.com',
      '.ngrok-free.app',
      '.ngrok.app',
      '.vercel.app',
      '.pages.dev',           // Cloudflare Pages
      '.cloudflare.com',
    ],
    proxy: {
      '/api/feishu': {
        target: 'https://open.feishu.cn',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/feishu/, ''),
      },
    },
  },
});