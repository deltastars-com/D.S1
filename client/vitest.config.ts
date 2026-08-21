import { defineConfig } from "vitest/config";
import path from "path";

const configDir = path.resolve(import.meta.dirname);
const projectRoot = path.resolve(configDir, "..");

export default defineConfig({
  root: projectRoot,
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "client", "src"),
      "@shared": path.resolve(projectRoot, "shared"),
      "@assets": path.resolve(projectRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    include: ["server/**/*.test.ts", "server/**/*.spec.ts", "tests/**/*.test.ts"],
  },
});
