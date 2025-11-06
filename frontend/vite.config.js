import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ✅ ensures you can use absolute imports like "@/components/..."
  resolve: {
    alias: {
      "@": "/src",
    },
  },

  // ✅ helpful when your backend runs on localhost:5000
  // and frontend on localhost:5173 (for development only)
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ✅ optional optimization for faster builds
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
