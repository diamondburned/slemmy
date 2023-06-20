import { LemmyWebsocket } from "lemmy-js-client/dist/websocket.js"
import { UserOperation } from "lemmy-js-client"
import * as store from "svelte/store"
import type types from "#/lib/lemmyws.types.js"
import type * as lemmy from "lemmy-js-client"

export type StatusEvent = {
  op: null
  _status: "connected" | "connecting" | "disconnected"
  _error?: string
}

export const _X = "GetPost" as keyof typeof UserOperation
export const x = 2 as (typeof UserOperation)[typeof _X]

export type ServerEvent = {
  op: string
  data: Record<string, unknown>
}

export type Event = StatusEvent | ServerEvent

export class LemmyWebsocketClient extends LemmyWebsocket {
  static timeout = 15000 // seconds

  private ws: WebSocket | null = null
  private wsEndpoint: string
  private readyPromise = Promise.resolve()
  private closed = false

  event = store.writable<Event>({ op: null, _status: "connecting" })

  constructor(url: string) {
    super()

    this.wsEndpoint = url.replace("http", "ws") + "/api/v3/ws"
    try {
      this.ws = this.newWebsocket()
      this.readyPromise = this.newReadyPromise()
    } catch (err) {
      this.readyPromise = Promise.reject(err)
    }
  }

  // ready is a Promise that is resolved once the Websocket is ready.
  get ready() {
    return this.readyPromise
  }

  // status returns the current status event of the Websocket.
  get status(): StatusEvent {
    const ev = store.get(this.event)
    if (ev.op == null) return ev
    return { op: null, _status: "connected" }
  }

  // send sends a message to the server.
  async send<T extends UserOperation>(op: T, data: types[T][0]) {
    if (!this.ws) {
      throw new Error("Websocket not connected")
    }
    await this.ready
    this.ws.send(
      JSON.stringify({
        op: UserOperation[op],
        data,
      } as ServerEvent),
    )
  }

  // close closes the Websocket.
  close() {
    this.closed = true
    this.ws?.close()
  }

  // derive returns a new readable store that contains the latest version of an
  // event.
  derive<T extends UserOperation>(op: T): store.Readable<types[T][1] | null> {
    const opStr = UserOperation[op]
    let last: types[T][1] | null = null
    return store.derived(this.event, (ev) => {
      if (ev.op == null) {
        last = null
      } else if (ev.op == opStr) {
        last = ev.data as typeof last
      }
      return last
    })
  }

  wait<T extends UserOperation>(op: T): Promise<types[T][1]> {
    return new Promise((resolve, reject) => {
      const timeoutHandle = setTimeout(
        () => reject("Timeout waiting for WS"),
        LemmyWebsocketClient.timeout,
      )

      const opStr = UserOperation[op]
      let last: types[T][1] | null = null

      let unsub: store.Unsubscriber | null = null
      unsub = this.event.subscribe((ev) => {
        if (!unsub) return // Ignore current event

        console.log("while waiting for", opStr, "got", ev)
        if (ev.op == null) {
          reject(ev._error || "Websocket closed")
          return
        }
        if (ev.op == opStr) {
          resolve(ev.data as typeof last)
          return
        }
      })
    })
  }

  private newWebsocket(): WebSocket {
    console.log(this.wsEndpoint)
    const ws = new WebSocket(this.wsEndpoint)

    ws.addEventListener("message", (msg) => {
      const ev = JSON.parse(msg.data) as Event
      if (typeof ev.op != "string") {
        console.debug("websocket received unknown event", ev)
        return
      }

      this.event.set(ev)
      console.debug("websocket received event", ev)
    })

    ws.addEventListener("open", () => {
      this.event.set({ op: null, _status: "connected" })
    })

    ws.addEventListener("error", (ev) => {
      console.error("websocket error:", ev)
      this.event.set({ op: null, _status: "disconnected", _error: `${ev}` })
    })

    ws.addEventListener("close", (ev) => {
      console.debug("websocket closed:", ev)
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
        setTimeout(() => {
          this.ws = this.newWebsocket()
          this.readyPromise = this.newReadyPromise()
        }, 5000 + Math.random() * 2000)
      }
    })

    return ws
  }

  private newReadyPromise(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const timeoutHandle = setTimeout(
        () => reject("Timeout waiting for WS"),
        LemmyWebsocketClient.timeout,
      )

      const unsub = this.event.subscribe((ev) => {
        if (ev.op != null) {
          unsub()
          clearTimeout(timeoutHandle)
          resolve()
          return
        }

        switch (ev._status) {
          case "connected": {
            unsub()
            clearTimeout(timeoutHandle)
            resolve()
            break
          }
          case "disconnected": {
            unsub()
            clearTimeout(timeoutHandle)
            reject(ev._error || "Unexpected WS error")
            break
          }
        }
      })
    })
  }
}
