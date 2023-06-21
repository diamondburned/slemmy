import preprocess from "svelte-preprocess"
import adapterAuto from "@sveltejs/adapter-auto"
import adapterStatic from "@sveltejs/adapter-static"
import { vitePreprocess } from "@sveltejs/kit/vite"

// isCloud is true if the app is being deployed to a cloud provider.
// Keep this up to date with adapterAuto's list of cloud providers:
// https://github.com/sveltejs/kit/blob/master/packages/adapter-auto/adapters.js
const isCloud =
  !!process.env.VERCEL ||
  !!process.env.NETLIFY ||
  !!process.env.CF_PAGES ||
  process.env.GITHUB_ACTION_REPOSITORY === "Azure/static-web-apps-deploy"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    vitePreprocess(),
    preprocess({
      postcss: true,
    }),
  ],
  kit: {
    adapter: isCloud
      ? adapterAuto()
      : adapterStatic({
          fallback: "index.html",
          precompress: true,
          strict: true,
        }),
    alias: {
      "#": "./src",
    },
  },
}

export default config
