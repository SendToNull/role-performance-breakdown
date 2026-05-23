import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` is set via env so the same build can target a user/project page or root.
// Default for GH Pages project site: "/role-performance-breakdown/".
const base = process.env.VITE_BASE ?? "/role-performance-breakdown/";

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    target: "es2022",
    sourcemap: true,
  },
});
