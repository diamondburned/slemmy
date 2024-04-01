import { LemmyHttp } from "lemmy-js-client"
import { urlHostname } from "#/lib/lemmyutils.js"

// LemmyClient describes an HTTP client for the Lemmy API.
// WebSocket support has been removed.
export class LemmyClient extends LemmyHttp {
  readonly instanceHost: string

  constructor(instanceURL: string, authorizationToken?: string) {
    super(instanceURL, {
      headers: authorizationToken
        ? { Authorization: `Bearer ${authorizationToken}` }
        : undefined,
    })
    this.instanceHost = mustHostname(instanceURL)
  }
}

function mustHostname(url: string): string {
  const hostname = urlHostname(url)
  if (!hostname) {
    throw new Error("invalid instance URL")
  }
  return hostname
}
