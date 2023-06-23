#!/usr/bin/env node
import * as fs from "fs/promises"
import * as childprocess from "child_process"

const fonts = [
  "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0&display=block",
]

const htmlPath = "src/app.html"

async function main() {
  const tags = []
  for (const font of fonts) {
    tags.push(`<link rel="stylesheet" href="${font}">`)
    tags.push(`<link rel="preload" href="${font}" as="style">`)
    // try {
    //   const css = await (await fetch(font)).text()
    //   const urlRegex = /url\((.*\.(?:ttf|woff))\)/gm
    //   for (const [_, url] of css.matchAll(urlRegex)) {
    //     tags.push(
    //       `<link rel="preload" href="${url}" as="font" type="font/woff2">`,
    //     )
    //   }
    // } catch (_) {}
  }

  let index = await fs.readFile(htmlPath, "utf-8")
  index = index.replace(
    /(<!-- begin:fonts -->).*(<!-- end:fonts -->)/s,
    `$1\n${tags.join("\n")}\n$2`,
  )

  await fs.writeFile(htmlPath, index)

  childprocess.spawnSync("prettier", ["--write", htmlPath], {
    stdio: "inherit",
  })
}

main()
