import type { NextConfig } from "next";

// Static export for Hostinger shared hosting: `next build` writes plain HTML/CSS/JS to `out/`.
// trailingSlash emits /about/index.html so URLs are served as /about/.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // No image server on static hosting; images are pre-optimised by scripts/optimize-images.mjs.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
