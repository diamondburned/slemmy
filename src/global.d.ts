import type { ScrollDeltaEvent } from "#/lib/events.js"

declare module "svelte/elements" {
  export interface HTMLAttributes<T> {
    onscrolldelta?: (event: ScrollDeltaEvent) => void
  }
}
