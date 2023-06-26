import * as store from "svelte/store"
import * as persistent from "#/lib/persistent.js"
import { LemmyHTTP } from "#/lib/types.js"
import { LemmyClient } from "#/lib/lemmyclient.js"
import { LemmyWebsocketClient } from "#/lib/lemmyws.js"
import type { Profile, Settings } from "#/lib/types.js"
import type {
  PostView,
  CommentView,
  CommentSortType,
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

export const commentsSettings = persistent.writable<{
  sort: CommentSortType
}>("slemmy-comments-settings", {
  sort: "Hot",
})

/*
 * In-memory/temporary stores
 */

// posts is a cache of posts for the current profile.
export const posts = store.writable<PostView[]>([])
currentProfile.subscribe(() => posts.set([]))

let lastClient: LemmyClient | null = null

export const client = store.derived(
  [profiles, currentProfile],
  ([profiles, currentProfile]) => {
    if (lastClient) {
      lastClient.close()
    }

    const profile = profiles[currentProfile]
    lastClient = profile
      ? LemmyClient.auto(profile.instance.url, profile.instance.method)
      : LemmyClient.dummy
    return lastClient
  },
)

export const profile = store.derived(
  [profiles, currentProfile],
  ([profiles, currentProfile]) =>
    // Make TS detect nullability.
    profiles[currentProfile] ? profiles[currentProfile] : null,
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
