import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import checker from 'vite-plugin-checker';
import path from 'path';

export default defineConfig({
  plugins: [
    react({ jsxRuntime: 'automatic' }),
    tailwindcss(),
    checker({
      typescript: {
        tsconfigPath: './tsconfig.json',
      }
    }),
  ],
  server: {
    port: 5173,          // your frontend port (optional, defaults to 5173)
    proxy: {
      // Proxy any request starting with /api to your backend
      '/api': {
        target: 'http://localhost:8080', // <-- your GraphQL server
        changeOrigin: true,
        secure: false,
        // if your backend expects /api/graphql at its root, leave rewrite out
        // otherwise uncomment the next line to strip the `/api` prefix:
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
})
