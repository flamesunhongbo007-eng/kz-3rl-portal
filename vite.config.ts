import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.trycloudflare.com',  // 允许所有 trycloudflare.com 子域名（每次重启 URL 变）
      '.ngrok-free.app',     // 兼容未来用 ngrok
      '.ngrok.app',
      '.vercel.app',         // 允许 Vercel 部署域名
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
