import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    css: true,
    setupFiles: "./src/test/setupTests.ts",
    coverage: { provider: "v8", reporter: ["text", "html"] },
  },
});
