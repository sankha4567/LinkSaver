import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

const alias = { "@": path.resolve(__dirname, ".") };

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "lib/**/*.{ts,tsx}",
        "store/**/*.{ts,tsx}",
        "convex/links.ts",
        "convex/utils.ts",
        "convex/auth.config.ts",
        "proxy.ts",
      ],
      exclude: [
        "node_modules/**",
        ".next/**",
        "convex/_generated/**",
        "components/ui/**",
        "**/*.d.ts",
        "**/*.config.*",
      ],
    },
    projects: [
      {
        plugins: [react()],
        resolve: { alias },
        test: {
          name: "ui",
          globals: true,
          environment: "happy-dom",
          setupFiles: ["./vitest.setup.tsx"],
          clearMocks: true,
          include: ["__tests__/**/*.{test,spec}.{ts,tsx}"],
        },
      },
      {
        resolve: { alias },
        test: {
          name: "convex",
          environment: "edge-runtime",
          server: { deps: { inline: ["convex-test"] } },
          env: {
            CLERK_FRONTEND_API_URL: "https://test.clerk.accounts.dev",
          },
          include: ["convex/**/*.test.ts"],
        },
      },
    ],
  },
});
