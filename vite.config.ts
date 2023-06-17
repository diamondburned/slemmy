import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import webfontDownload from "vite-plugin-webfont-dl";
import * as path from "path";
import manifest from "./src/manifest.json";

export default defineConfig({
  plugins: [
    sveltekit(),
    webfontDownload(),
    SvelteKitPWA({
      manifest,
      registerType: "autoUpdate",
      // See:
      // https://vite-pwa-org.netlify.app/workbox/generate-sw.html
      // https://vite-pwa-org.netlify.app/workbox/inject-manifest.html
      strategies: "generateSW",
      devOptions: {
        enabled: true,
      },
    }),
  ],
  envPrefix: "APP_",
  server: {
    port: 8000,
  },
  build: {
    emptyOutDir: true,
  },
  // https://github.com/vitejs/vite/issues/7385#issuecomment-1286606298
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src/"),
    },
  },
});
