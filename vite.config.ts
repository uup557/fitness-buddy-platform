import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.VITE_XIAOMI_API_KEY || '';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        // 所有 /api/* 请求代理到 MiMo API
        '/api': {
          target: 'https://token-plan-cn.xiaomimimo.com',
          changeOrigin: true,
          rewrite: () => '/v1/chat/completions',
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      },
    },
  };
})
