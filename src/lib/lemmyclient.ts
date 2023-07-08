import { LemmyWebsocketClient as internalWSClient } from "#/lib/lemmyws.js"
import { LemmyHttp, UserOperation } from "lemmy-js-client"
import { urlHostname } from "#/lib/lemmyutils.js"
import { clientRouteMap } from "#/lib/lemmy.generated.js"
import type { typeMap } from "#/lib/lemmy.generated.js"

export type X = typeMap[UserOperation.GetSite][0]

// LemmyClient describes the interface of a Lemmy client.
// It takes in a request and returns a response from the server.
export interface LemmyClient {
  readonly instanceHost: string

  // request makes a request to the Lemmy server and returns the response.
  request<
    T extends UserOperation,
    Request extends typeMap[T][0],
    Response extends typeMap[T][1],
  >(
    op: T,
    data: Request,
  ): Promise<Response>

  // close closes the connection to the Lemmy server.
  close(): void
}

export type LemmyConnectMethod = "ws" | "http"

export class LemmyHTTPClient implements LemmyClient {
  readonly instanceHost: string

  private readonly client: LemmyHttp
  private readonly routeMap: Record<UserOperation, unknown>

  constructor(instanceURL: string) {
    this.instanceHost = mustHostname(instanceURL)
    this.client = new LemmyHttp(instanceURL)
    this.routeMap = clientRouteMap(this.client)
  }

  async request<
    T extends UserOperation,
    Request extends typeMap[T][0],
    Response extends typeMap[T][1],
  >(op: T, data: Request): Promise<Response> {
    const method = this.routeMap[op] as (data: Request) => Promise<Response>
    return method(data)
  }

  close() {}
}

export class LemmyWebsocketClient implements LemmyClient {
  readonly instanceHost: string

  private readonly client: internalWSClient

  constructor(instanceURL: string) {
    this.instanceHost = mustHostname(instanceURL)
    this.client = new internalWSClient(instanceURL)
  }

  async request<
    T extends UserOperation,
    Request extends typeMap[T][0],
    Response extends typeMap[T][1],
  >(op: T, data: Request): Promise<Response> {
    return this.client.sendForReply(op, data)
  }

  close() {
    this.client.close()
  }
}

function mustHostname(url: string): string {
  const hostname = urlHostname(url)
  if (!hostname) {
    throw new Error("invalid instance URL")
  }
  return hostname
}

export class LemmyAutoClient implements LemmyClient {
  readonly instanceHost: string

  private client: Promise<LemmyClient>

  constructor(instanceURL: string) {
    this.instanceHost = mustHostname(instanceURL)

    this.client = new Promise(async (resolve, reject) => {
      try {
        const method = await LemmyClient.detect(instanceURL)
        resolve(LemmyClient.create(instanceURL, method))
      } catch (err) {
        reject(err)
      }
    })
  }

  async request<
    T extends UserOperation,
    Request extends typeMap[T][0],
    Response extends typeMap[T][1],
  >(op: T, data: Request): Promise<Response> {
    const client = await this.client
    return client.request(op, data)
  }

  close() {
    this.client.then((client) => client.close())
  }
}

export class LemmyDummyClient implements LemmyClient {
  readonly instanceHost = ""

  constructor() {}

  async request<
    T extends UserOperation,
    Request extends typeMap[T][0],
    Response extends typeMap[T][1],
  >(_op: T, _data: Request): Promise<Response> {
    throw new Error("not implemented")
  }

  close() {}
}

export class LemmyClient {
  static dummy = new LemmyDummyClient()

  static auto(instanceURL: string): LemmyAutoClient {
    return new LemmyAutoClient(instanceURL)
  }

  static create(
    instanceURL: string,
    preferred: LemmyConnectMethod,
  ): LemmyClient {
    switch (preferred) {
      case "ws":
        return new LemmyWebsocketClient(instanceURL)
      case "http":
        return new LemmyHTTPClient(instanceURL)
      default:
        throw new Error("invalid preferred")
    }
  }

  static async detect(instanceURL: string): Promise<LemmyConnectMethod> {
    try {
      const testingRoute = "/api/v3/site"
      await fetch(instanceURL + testingRoute)
      return "http"
    } catch (_) {}

    return "ws"
  }
}
