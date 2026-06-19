import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@v2/schema-shared": resolve(__dirname, "../../packages/schema-shared/src"),
    },
  },
});
