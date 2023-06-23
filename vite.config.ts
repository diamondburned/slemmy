import { defineConfig } from "vite"
import { sveltekit } from "@sveltejs/kit/vite"
import { VitePWA as vitePWA } from "vite-plugin-pwa"
import { viteWebfontDownload } from "vite-plugin-webfont-dl"
import * as path from "path"
import manifest from "./src/manifest.json"

const fonts = [
  "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0&display=block",
]

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
    {
      name: "fonts-css-injector",
      transformIndexHtml: {
        enforce: "pre",
        async handler(html: string) {
          const tags: string[] = []
          for (const font of fonts) {
            tags.push(`<link rel="stylesheet" href="${font}">`)
            tags.push(`<link rel="preload" href="${font}" as="style">`)
            try {
              const css = await (await fetch(font)).text()
              const urlRegex = /url\((.*\.(?:ttf|woff))\)/gm
              for (const [_, url] of css.matchAll(urlRegex)) {
                tags.push(
                  `<link rel="preload" href="${url}" as="font" type="font/woff2">`,
                )
              }
            } catch (_) {}
          }

          return html.replace(/%fonts%/, () => tags.join("\n"))
        },
      },
      writeBundle() {
        console.log(
          "klfhjsdjkghjiksdfhjk hwrjkcgrh jkghetjklb eth khwetkjteh ethjikhetgrthei werg uirehg uieth it ",
        )
      },
    },
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
