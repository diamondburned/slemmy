import preprocess from "svelte-preprocess"
import adapterAuto from "@sveltejs/adapter-auto"
import adapterStatic from "@sveltejs/adapter-static"
import { vitePreprocess } from "@sveltejs/kit/vite"
import * as fs from "fs/promises"
import * as childprocess from "child_process"

// isCloud is true if the app is being deployed to a cloud provider.
// Keep this up to date with adapterAuto's list of cloud providers:
// https://github.com/sveltejs/kit/blob/master/packages/adapter-auto/adapters.js
const isCloud =
  !!process.env.VERCEL ||
  !!process.env.NETLIFY ||
  !!process.env.CF_PAGES ||
  process.env.GITHUB_ACTION_REPOSITORY === "Azure/static-web-apps-deploy"

const fonts = [
  "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0&display=block",
]

const preHooks = []

async function injectHead(outdir, head) {
  await editFile(`${outdir}/index.html`, (html) => {
    return html.replace(/%sveltekit.head%/, head + "\n%sveltekit.head%")
  })
}

const postHooks = [
  async (outdir) => {
    childprocess.spawnSync("prettier", ["--write", `${outdir}/index.html`], {
      stdio: "inherit",
    })
  },
]

async function editFile(path, apply) {
  const file = await fs.readFile(path, "utf-8")
  const edited = await apply(file)
  await fs.writeFile(path, edited)
}

const staticOutDir = "build"

const staticAdapter = adapterStatic({
  pages: staticOutDir,
  precompress: true,
  fallback: "index.html",
  strict: true,
})

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
      : {
          name: "adapter-static-but-actually-works",
          async adapt(builder) {
            await Promise.all(preHooks.map((hook) => hook(staticOutDir)))
            await staticAdapter.adapt(builder)
            await Promise.all(postHooks.map((hook) => hook(staticOutDir)))
          },
        },
    alias: {
      "#": "./src",
    },
    output: {
      preloadStrategy: "preload-mjs",
    },
  },
}

export default config
