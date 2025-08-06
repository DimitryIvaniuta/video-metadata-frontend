// vite.config.mjs
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import checker from "vite-plugin-checker";
import path from "path";

export default defineConfig({
  plugins: [
    react({ jsxRuntime: "automatic" }),
    tailwindcss(), // ← now actually loaded!
    checker({ typescript: { tsconfigPath: "./tsconfig.json" } }),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    proxy: { "/api": { target: "http://localhost:8080", changeOrigin: true } },
    port: 5173,
  },
});
