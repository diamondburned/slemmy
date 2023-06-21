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

let lastWS: LemmyWebsocketClient | null = null

// ws is a LemmyWebsocketClient for the current profile.
export const ws = store.derived(
  [profiles, currentProfile],
  ([profiles, currentProfile]) => {
    if (lastWS) {
      lastWS.close()
    }

    lastWS = profiles[currentProfile]
      ? new LemmyWebsocketClient(profiles[currentProfile].instance.url)
      : LemmyWebsocketClient.invalid
    return lastWS
  },
)

export const currentPosts = store.writable<{
  posts: PostView[]
  page: number
  sort: SortType
  listing: ListingType
  scrollTop?: number
}>({
  posts: [],
  page: 0,
  sort: "Active",
  listing: "Local",
})

export function resetCurrentPosts() {
  currentPosts.update((p) => {
    p.posts = []
    p.page = 0
    return p
  })
}

export const cachedComments = store.writable<Record<number, CommentView>>({})
