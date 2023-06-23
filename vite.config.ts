import { defineConfig } from "vite"
import { sveltekit } from "@sveltejs/kit/vite"
import { VitePWA as vitePWA } from "vite-plugin-pwa"
import { viteWebfontDownload } from "vite-plugin-webfont-dl"
import * as path from "path"
import manifest from "./src/manifest.json"

export default defineConfig({
  plugins: [
    sveltekit(),
    // {
    //   name: "force-reload-hmr",
    //   handleHotUpdate({ file, server, modules }) {
    //     if (file.endsWith(".svelte") || file.endsWith(".ts")) {
    //       console.log("modules", modules)
    //       server.ws.send({
    //         type: "full-reload",
    //         path: "*",
    //       })
    //     }
    //   },
    // },
    vitePWA({
      manifest,
      registerType: "autoUpdate",
      // See:
      // https://vite-pwa-org.netlify.app/workbox/generate-sw.html
      // https://vite-pwa-org.netlify.app/workbox/inject-manifest.html
      strategies: "generateSW",
      devOptions: {
        enabled: true,
      },
      injectRegister: "inline",
    }),
    viteWebfontDownload([], {
      injectAsStyleTag: true,
      minifyCss: true,
      cache: true,
    }),
  ],
  envPrefix: "APP_",
  server: {
    port: 8000,
    host: true,
    proxy: {
      "/_beehaw.org": {
        target: "https://beehaw.org",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/_beehaw.org/, ""),
      },
    },
  },
  build: {
    emptyOutDir: true,
    sourcemap: true,
  },
  // https://github.com/vitejs/vite/issues/7385#issuecomment-1286606298
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src/"),
    },
  },
})
