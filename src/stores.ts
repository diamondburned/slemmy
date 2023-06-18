import * as store from "svelte/store"
import * as persistent from "#/lib/persistent.js"
import { LemmyHTTP } from "#/lib/types.js"
import type { Profile, Settings, PostView } from "#/lib/types.js"

export const profiles = persistent.writable<Profile[]>("slemmy-profiles", [])
export const settings = persistent.writable<Settings>("slemmy-settings", {})
export const currentProfile = store.writable<number>(-1)
export const client = store.derived(
  [profiles, currentProfile],
  ([profiles, currentProfile]) => {
    return new LemmyHTTP(profiles[currentProfile]?.instance.url ?? "")
  },
)
export const cachedPosts = store.writable<Record<string, PostView>>({})
