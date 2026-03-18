import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "icons/favicon.ico",
        "icons/favicon.svg",
        "icons/favicon-96x96.png",
        "icons/apple-touch-icon.png",
      ],
      manifest: {
        name: "Shuu",
        short_name: "Shuu",
        description: "A simple, focused habit tracker.",
        start_url: "/",
        display: "standalone",
        background_color: "#0e0e0d",
        theme_color: "#0e0e0d",
        icons: [
          {
            src: "icons/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
  resolve: { alias: { src: "/src" } },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["hyuji-dev.local"],
  },
});
