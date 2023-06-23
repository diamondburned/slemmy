import * as store from "svelte/store"
import * as persistent from "#/lib/persistent.js"
import { LemmyHTTP } from "#/lib/types.js"
import { LemmyWebsocketClient } from "#/lib/lemmyws.js"
import type { Profile, Settings } from "#/lib/types.js"
import type {
  PostView,
  CommentView,
  SortType,
  ListingType,
} from "lemmy-js-client"

/*
 * Persistent (local-storage) stores
 */

export const profiles = persistent.writable<Profile[]>("slemmy-profiles", [])
export const settings = persistent.writable<Settings>("slemmy-settings", {})

export const currentProfile = persistent.writable<number>(
  "slemmy-current-profile",
  -1,
)

export const postsSettings = persistent.writable<{
  sort: SortType
  listing: ListingType
}>("slemmy-posts-settings", {
  sort: "Active",
  listing: "Local",
})

/*
 * In-memory/temporary stores
 */

// client is a LemmyHTTP client for the current profile.
//
// Deprecated: use ws instead.
export const client = store.derived(
  [profiles, currentProfile],
  ([profiles, currentProfile]) => {
    return new LemmyHTTP(profiles[currentProfile]?.instance.url ?? "")
  },
)

// posts is a cache of posts for the current profile.
export const posts = store.writable<PostView[]>([])
currentProfile.subscribe(() => posts.set([]))

let lastWS: LemmyWebsocketClient | null = null

// ws is a LemmyWebsocketClient for the current profile.
export const ws = store.derived(
  [profiles, currentProfile],
  ([profiles, currentProfile]) => {
    if (lastWS) {
      lastWS.close()
    }

    console.debug("switching to profile", profiles[currentProfile])
    lastWS = profiles[currentProfile]
      ? new LemmyWebsocketClient(profiles[currentProfile].instance.url)
      : LemmyWebsocketClient.invalid
    return lastWS
  },
)

export const cachedComments = store.writable<Record<number, CommentView>>({})

// subscribeLater is a helper function for subscribing to a store, but only
// calling the callback when the value changes (and not on initial
// subscription).
export function subscribeLater<T>(
  store: store.Writable<T>,
  callback: (value: T) => void,
) {
  let first = true
  return store.subscribe((value) => {
    if (first) {
      first = false
      return
    }
    callback(value)
  })
}
