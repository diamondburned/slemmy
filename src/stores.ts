import * as store from "svelte/store"
import * as persistent from "#/lib/persistent.js"
import { LemmyHTTP } from "#/lib/types.js"
import type { Profile, Settings } from "#/lib/types.js"
import type { PostView } from "lemmy-js-client"

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

export const client = store.derived(
  [profiles, currentProfile],
  ([profiles, currentProfile]) => {
    return new LemmyHTTP(profiles[currentProfile]?.instance.url ?? "")
  },
)

export const cachedPosts = store.writable<Record<string, PostView>>({})
