#!/usr/bin/env ts-node-esm
import * as fs from "fs/promises"
import * as os from "os"
import * as path from "path"
import * as childprocess from "child_process"

async function generate(): Promise<string> {
  const prefix = "lemmy"
  const version = await depVersion("lemmy-js-client")
  const clientSrc = `https://raw.githubusercontent.com/LemmyNet/lemmy-js-client/${version}/src`

  const httpSrc = await fetch(`${clientSrc}/http.ts`).then((r) => r.text())
  const wsSrc = await fetch(`${clientSrc}/websocket.ts`).then((r) => r.text())

  const requestResponses = new Map<
    string,
    {
      response: string
      route: string
    }
  >()
  for (const [_, request, response, route] of httpSrc.matchAll(
    /return this\.#wrapper<\s*(.*),\s*(.*)\s*>\([^"]*"(\/.*)"[^)]*\)/gm,
  )) {
    console.log(request, response, route)
    requestResponses.set(request, {
      response,
      route,
    })
  }

  const wsRequests = new Set<string>()
  for (const [_, request] of wsSrc.matchAll(
    /return wrapper\(UserOperation.(.*),/gm,
  )) {
    wsRequests.add(request)
  }

  let output = ""
  output += [
    `// Generated using ./src/scripts/gen-ws-types.sh`,
    ``,
    `import { UserOperation } from "lemmy-js-client"`,
    `import type * as ${prefix} from "lemmy-js-client"`,
    ``,
    `type a = {`,
  ].join("\n")

  wsRequests.forEach((request) => {
    const detail = requestResponses.get(request)
    const data = [
      `${prefix}.${request}`,
      detail ? `${prefix}.${detail.response}` : "unknown",
      detail ? `"${detail.route}"` : "never",
    ]
    output += `[UserOperation.${request}]: [${data.join(", ")}],`
  })

  output += `}\n\n`
  output += `export type { a as default }`

  return prettier(output, "ts")
}

function prettier(js: string, filetype = "js"): string {
  const { stdout } = childprocess.spawnSync(
    "prettier",
    [`--stdin-filepath`, `stdin.${filetype}`],
    {
      input: js,
      stdio: ["pipe", "pipe", "inherit"],
      timeout: 10000,
    },
  )
  return stdout.toString()
}

async function depVersion(dep: string): Promise<string> {
  const packageJSONFile = await fs.readFile("package.json", "utf-8")
  const packageJSON = JSON.parse(packageJSONFile)
  const dependencies = {
    ...packageJSON.dependencies,
    ...packageJSON.devDependencies,
  }

  let version = dependencies[dep]
  if (version.startsWith("^")) {
    version = version.slice(1)
  }

  return version
}

let exit = 0

const output = "src/lib/lemmyws.types.ts"
try {
  const out = await generate()
  const outFile = await fs.open(output, "w")
  await outFile.write(out)
} catch (err) {
  console.error(err)
  exit = 1
} finally {
  process.exit(exit)
}
