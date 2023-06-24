#!/usr/bin/env node
import * as fs from "fs/promises"
import * as path from "path"
import * as childprocess from "child_process"

const basedir = path.dirname(new URL(import.meta.url).pathname)

async function main() {
  let scripts = await fs.readdir(basedir)
  scripts = scripts.filter((f) => f.startsWith("gen-"))

  for (const script of scripts) {
    console.log("invoking autogenerate script", script)
    childprocess.spawnSync(path.join(basedir, script), [], {
      stdio: "inherit",
    })
  }
}

main()
