import type { Profile } from "./types.js"

export const READ_POSTS_LRU_SIZE = 500

/**
 * Returns a stable, unique key for a given profile.
 * - Logged-in: `${username}@${instanceURL}`
 * - Guest: `${instanceURL}`
 * - None: null
 */
export function profileKey(profile: Profile | null | undefined): string | null {
  if (!profile) return null
  if (profile.user?.name) {
    return `${profile.user.name}@${profile.instance.url}`
  }
  return profile.instance.url
}

/**
 * Adds an ID to an LRU list of IDs, capping at maxSize (default 500).
 * Most recently accessed IDs are placed at index 0.
 */
export function addToLRU(
  list: number[],
  id: number,
  maxSize: number = READ_POSTS_LRU_SIZE,
): number[] {
  const existingIdx = list.indexOf(id)
  if (existingIdx === 0) {
    return list
  }
  const next = [...list]
  if (existingIdx !== -1) {
    next.splice(existingIdx, 1)
  }
  next.unshift(id)
  if (next.length > maxSize) {
    next.length = maxSize
  }
  return next
}
