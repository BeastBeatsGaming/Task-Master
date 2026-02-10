import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Client dev server port
    proxy: {
      // Proxy API requests to the backend server
      "/api": {
        target: "http://localhost:5001", // Your backend server address
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // if your backend routes don't have /api prefix
      },
    },
  },
});
