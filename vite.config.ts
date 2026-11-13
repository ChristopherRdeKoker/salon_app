import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/apps/salon/",
  resolve: { alias: { "@": "/src" } },
  esbuild: { jsx: "automatic" },
  build: {
    sourcemap: false,
    modulePreload: { polyfill: false },
    assetsInlineLimit: 0,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
