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
      method: string
    }
  >()
  for (const [_, method, request, response] of httpSrc.matchAll(
    /(\w+)\(\s*form: (.*)\s*\) {\n.*return this\.#wrapper<\n?.*,\s*(.*)\s*>/gm,
  )) {
    requestResponses.set(request, {
      response,
      method,
    })
  }

  const wsRequests: string[] = []
  for (const [_, request] of wsSrc.matchAll(
    /return wrapper\(UserOperation.(.*),/gm,
  )) {
    wsRequests.push(request)
  }

  let output = ""
  output += [
    `// Generated using ./src/scripts/gen-ws-types.sh`,
    ``,
    `import { LemmyHttp, UserOperation } from "lemmy-js-client"`,
    `import type * as ${prefix} from "lemmy-js-client"`,
  ].join("\n")
  output += `\n\n`

  output += `function throwUnimplemented(): never { throw new Error("not implemented") }\n\n`

  output += `export type typeMap = {`
  for (const request of wsRequests) {
    const detail = requestResponses.get(request)
    const data = [
      `${prefix}.${request}`,
      detail ? `${prefix}.${detail.response}` : "never",
    ]
    output += `[UserOperation.${request}]: [${data.join(", ")}],`
  }
  output += `}\n\n`

  output += `export const clientRouteMap = (client: LemmyHttp) => ({`
  for (const request of wsRequests) {
    const detail = requestResponses.get(request)
    output +=
      "\n" +
      `[UserOperation.${request}]: (req: lemmy.${request}) =>` +
      (detail ? `client.${detail.method}(req)` : `throwUnimplemented()`) +
      `,`
  }
  output += `\n})`

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

const output = "src/lib/lemmy.generated.ts"
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
