import * as store from "svelte/store"
import * as persistent from "#/lib/persistent.js"
import { LemmyClient } from "#/lib/lemmyclient.js"
import type { Profile, Settings } from "#/lib/types.js"
import { profileKey, addToLRU, READ_POSTS_LRU_SIZE } from "#/lib/readposts.js"
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

export const readPosts = persistent.writable<Record<string, number[]>>(
  "slemmy-read-posts",
  {},
)

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
    const profile = profiles[currentProfile]
    lastClient = profile
      ? new LemmyClient(profile.instance.url, profile.user?.jwt)
      : null
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

// readPostIDs is a derived store containing the Set of read post IDs for the current profile.
export const readPostIDs = store.derived(
  [readPosts, profile],
  ([$readPosts, $profile]) => {
    const key = profileKey($profile)
    if (!key) return new Set<number>()
    const ids = $readPosts[key]
    return new Set<number>(Array.isArray(ids) ? ids : [])
  },
)

// markPostAsRead marks a post as read for the active profile using a 500-capacity LRU.
export function markPostAsRead(postID: number) {
  const current = store.get(profile)
  const key = profileKey(current)
  if (!key) return

  readPosts.update((all) => {
    const existing = Array.isArray(all[key]) ? all[key] : []
    if (existing[0] === postID) {
      return all
    }
    const updated = addToLRU(existing, postID, READ_POSTS_LRU_SIZE)
    return {
      ...all,
      [key]: updated,
    }
  })
}
