import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base './' — готовую папку dist можно выложить на любой хостинг и в любую подпапку
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
