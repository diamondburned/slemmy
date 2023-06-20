import type { ScrollDeltaEvent } from "#/lib/events.js"

declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    scrolldelta: (_: ScrollDeltaEvent) => void
  }
}
