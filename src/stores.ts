import * as store from "svelte/store"
import * as persistent from "#/lib/persistent.js"
import type { Profile, Settings } from "#/lib/types.js"

export const profiles = persistent.writable<Profile[]>("slemmy-profiles", [])
export const settings = persistent.writable<Settings>("slemmy-settings", {})

export const currentProfileIx = persistent.writable<number>(
  "slemmy-current-profile",
  -1,
)

// currentProfile is the current Slemmy profile. It is null if no profiles were
// selected.
export const currentProfile = store.derived<
  [store.Readable<Profile[]>, store.Readable<number>],
  ({ index: number } & Profile) | null
>([profiles, currentProfileIx], ([profiles, currentProfileIx]) => {
  const profile = profiles[currentProfileIx]
  if (!profile) return null
  return { ...profile, index: currentProfileIx }
})
