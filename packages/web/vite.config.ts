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
    // Sourcemaps off in production so devtools can't show original TS.
    // The minified JS is still visible to anyone — this just removes the
    // friendly view. For real source hiding, move the analysis server-side.
    sourcemap: false,
  },
});
