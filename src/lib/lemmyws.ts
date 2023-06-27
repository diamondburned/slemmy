import { LemmyWebsocket } from "lemmy-js-client/dist/websocket.js"
import { UserOperation } from "lemmy-js-client"
import * as store from "svelte/store"
import type { typeMap } from "#/lib/lemmy.generated.js"

export type StatusEvent = {
  op: null
  _status: "connected" | "connecting" | "disconnected"
  _error?: string
}

export type ServerEvent = {
  op: keyof typeof UserOperation
  data: Record<string, unknown>
}

export type Event = StatusEvent | ServerEvent

export class LemmyWebsocketClient {
  // invalid is a LemmyWebsocketClient that is always closed and returns errors
  // for all operations.
  static invalid = new LemmyWebsocketClient()

  private ws: WebSocket | null = null
  private wsEndpoint: string = ""
  private lastEvents = new Map<UserOperation, ServerEvent["data"]>()
  private readyPromise = Promise.resolve()
  private promiseResolved = true

  event = store.writable<Event>({ op: null, _status: "connecting" })
  status = store.derived(this.event, (ev) => {
    if (ev.op == null) return ev
    return { op: null, _status: "connected" }
  })

  constructor(url?: string) {
    if (url) {
      this.wsEndpoint = url.replace("http", "ws") + "/api/v3/ws"
      this.connect()
    }
  }

  // ready is a Promise that is resolved once the Websocket is ready.
  get ready(): Promise<void> {
    if (!this.wsEndpoint) {
      // Whatever. This is only for LemmyWebsocketClient.invalid.
      return Promise.resolve()
    }
    if (this.closed) {
      return Promise.reject("Websocket permanently closed")
    }
    return this.readyPromise
  }

  // connected returns true if the Websocket is connected.
  get connected(): boolean {
    return store.get(this.status)._status == "connected"
  }

  // closed returns true if the Websocket is closed.
  get closed(): boolean {
    return this.ws == null
  }

  lastEvent<T extends UserOperation, Event extends typeMap[T][1]>(
    op: T,
  ): Event | null {
    return (this.lastEvents.get(op) as Event) ?? null
  }

  // send sends a message to the server.
  async send<T extends UserOperation, Command extends typeMap[T][0]>(
    op: T,
    data: Command,
  ) {
    if (this.closed) {
      throw new Error("Websocket permanently closed")
    }
    await this.ready
    this.ws!.send(
      JSON.stringify({
        op: UserOperation[op],
        data,
      } as ServerEvent),
    )
    console.debug("websocket sent op", op, data)
  }

  // sendForReply sends a message to the server and waits for a reply to the
  // same Op.
  async sendForReply<
    T extends UserOperation,
    Command extends typeMap[T][0],
    Event extends typeMap[T][1],
  >(op: T, data: Command, timeout = 5000): Promise<Event> {
    await this.ready
    const reply = this.wait<T, Event>(op, timeout)
    await this.send<T, Command>(op, data)
    try {
      return await reply
    } catch (err) {
      throw new Error(`No ${UserOperation[op]} reply: ${err}`)
    }
  }

  // close closes the Websocket. It does nothing if the Websocket is already
  // closed.
  close() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  async wait<T extends UserOperation, Event extends typeMap[T][1]>(
    op: T,
    timeout = 10000,
  ): Promise<Event> {
    const deadline = timeoutPromise(timeout, "Timeout waiting for WS event")
    await Promise.race([timeout, this.ready])

    let event: Event | undefined
    const opStr = UserOperation[op]

    let unsub: store.Unsubscriber | null = null
    const promise = new Promise<void>((resolve) => {
      unsub = this.event.subscribe((ev) => {
        if (!unsub) return // Ignore current event

        if (ev.op == opStr) {
          event = ev.data as Event
          resolve()
          unsub()
          return
        }
      })
    })

    await Promise.race([promise, deadline])
    if (unsub) (unsub as store.Unsubscriber)()
    return event!
  }

  private connect() {
    this.reconnect(true)
  }

  private reconnect(initial = false, backoff = new exponentialBackoff()) {
    if (!initial && this.closed) {
      return
    }

    if (this.ws) {
      try {
        this.ws.close()
      } catch (_) {}
    }

    try {
      this.ws = new WebSocket(this.wsEndpoint)
    } catch (err) {
      this.readyPromise = Promise.reject(err)
      this.promiseResolved = true
      return
    }

    this.resetReadyPromise()
    this.event.set({ op: null, _status: "connecting" })

    this.ws.addEventListener("message", (msg) => {
      const ev = JSON.parse(msg.data) as Event
      if (typeof ev.op != "string") {
        console.debug("websocket received unknown event", ev)
        return
      }

      console.debug("websocket received event", UserOperation[ev.op], ev)
      this.lastEvents.set(UserOperation[ev.op], ev.data)
      this.event.set(ev)
    })

    this.ws.addEventListener("open", () => {
      console.debug("websocket opened with endpoint", this.wsEndpoint)
      this.event.set({ op: null, _status: "connected" })
    })

    this.ws.addEventListener("close", (ev) => {
      console.debug("websocket closed:", ev)

      this.lastEvents = new Map<UserOperation, ServerEvent["data"]>()
      this.event.update(() => ({
        op: null,
        _status: "disconnected",
        _error: `websocket closed with code ${ev.code}`,
      }))

      if (!this.closed) {
        this.resetReadyPromise()
        backoff.schedule(() => this.reconnect(false, backoff))
      }
    })
  }

  private resetReadyPromise() {
    if (!this.promiseResolved) {
      return
    }

    this.promiseResolved = false
    this.readyPromise = new Promise<void>((resolve, reject) => {
      let unsub: store.Unsubscriber
      let timeoutHandle: number
      let lastError: string | undefined

      const cleanup = () => {
        unsub()
        clearTimeout(timeoutHandle)
        this.promiseResolved = true
      }

      timeoutHandle = window.setTimeout(() => {
        reject(lastError ? `WS error: ${lastError}` : "Timeout waiting for WS")
        cleanup()
      }, 10000)

      unsub = this.event.subscribe((ev) => {
        if (!unsub) return

        if (ev.op != null || ev._status == "connected") {
          cleanup()
          resolve()
        }
      })
    })
  }
}

class exponentialBackoff {
  static readonly maxTimeout = 30000

  private attempt = 0
  constructor(private timeout: number = 1000) {}

  next(): number {
    const timeout = this.timeout
    console.log("backoff", this.timeout)
    this.attempt++

    const rand = Math.random()
    const jitter = 1 + rand * 0.2

    this.timeout = Math.min(
      this.timeout * jitter,
      exponentialBackoff.maxTimeout,
    )
    return timeout
  }

  schedule(cb: () => void) {
    setTimeout(cb, this.next())
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function timeoutPromise(ms: number, message = "timeout") {
  return new Promise((_, reject) => setTimeout(() => reject(message), ms))
}
