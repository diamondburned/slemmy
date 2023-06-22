import { LemmyWebsocket } from "lemmy-js-client/dist/websocket.js"
import { UserOperation } from "lemmy-js-client"
import * as store from "svelte/store"
import type types from "#/lib/lemmyws.types.js"

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

export class LemmyWebsocketClient extends LemmyWebsocket {
  static timeout = 15000 // ms
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
    super()
    if (!url) {
      this.readyPromise = Promise.reject("No URL")
      return
    }

    this.wsEndpoint = url.replace("http", "ws") + "/api/v3/ws"
    this.connect()
  }

  // ready is a Promise that is resolved once the Websocket is ready.
  get ready() {
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

  lastEvent<T extends UserOperation, Event = types[T][1]>(op: T): Event | null {
    return (this.lastEvents.get(op) as Event) ?? null
  }

  // send sends a message to the server.
  async send<T extends UserOperation>(op: T, data: types[T][0]) {
    if (this.closed) {
      throw new Error("Websocket closed")
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

  // close closes the Websocket. It does nothing if the Websocket is already
  // closed.
  close() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  // derive returns a new readable store that contains the latest version of an
  // event.
  derive<T extends UserOperation, Event extends types[T][1]>(
    op: T,
    {
      reset,
      filter,
      initial,
    }: {
      reset?: (_: LemmyWebsocketClient) => void
      filter?: (_: Event) => boolean
      initial?: Event | null
    } = {},
  ): store.Readable<Event | null> {
    filter = filter ?? (() => true)
    initial = initial ?? null

    const opStr = UserOperation[op]
    return store.derived(
      this.event,
      (ev) => {
        if (ev.op == null) {
          initial = null
        } else if (ev.op == opStr && filter!(ev.data as Event)) {
          initial = ev.data as typeof initial
        }
        if (this.connected && initial == null && reset) {
          reset(this)
        }
        return initial ?? null
      },
      initial,
    )
  }

  async wait<T extends UserOperation>(op: T): Promise<types[T][1]> {
    const timeout = timeoutPromise(
      LemmyWebsocketClient.timeout,
      "Timeout waiting for WS event",
    )
    await Promise.race([timeout, this.ready])

    let event: types[T][1] | undefined
    const opStr = UserOperation[op]

    const promise = new Promise<void>((resolve, reject) => {
      let unsub: store.Unsubscriber | null = null
      unsub = this.event.subscribe((ev) => {
        if (!unsub) return // Ignore current event

        if (ev.op == null) {
          reject(ev._error || "Websocket closed")
          unsub()
          return
        }

        if (ev.op == opStr) {
          event = ev.data as typeof event
          resolve()
          unsub()
          return
        }
      })
    })

    await Promise.race([promise, timeout])
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
      console.debug("websocket opened")
      this.event.set({ op: null, _status: "connected" })
    })

    this.ws.addEventListener("error", (ev) => {
      console.error("websocket error:", ev)
      this.event.set({ op: null, _status: "disconnected", _error: `${ev}` })
    })

    this.ws.addEventListener("close", (ev) => {
      console.debug("websocket closed:", ev)

      this.lastEvents = new Map<UserOperation, ServerEvent["data"]>()
      this.event.update((ev) => {
        if (ev.op == null && ev._status == "disconnected") {
          return ev
        }

        return {
          op: null,
          _status: "disconnected",
          _error: "Websocket closed",
        }
      })

      if (!this.closed) {
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
      const timeoutHandle = window.setTimeout(
        () => reject("Timeout waiting for WS"),
        LemmyWebsocketClient.timeout,
      )

      let unsub: store.Unsubscriber

      const cleanup = () => {
        unsub()
        clearTimeout(timeoutHandle)
        this.promiseResolved = true
      }

      unsub = this.event.subscribe((ev) => {
        if (!unsub) return

        if (ev.op != null) {
          cleanup()
          resolve()
          return
        }

        switch (ev._status) {
          case "connected": {
            cleanup()
            resolve()
            break
          }
          case "disconnected": {
            cleanup()
            reject(ev._error || "Unexpected WS error")
            break
          }
        }
      })
    })
  }
}

class exponentialBackoff {
  private attempt = 0
  constructor(private timeout: number = 1000) {}

  next(): number {
    const timeout = this.timeout
    console.log("backoff", this.timeout)
    this.attempt++

    const rand = Math.random()
    const jitter = 1 + rand * 0.2

    this.timeout *= jitter
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
