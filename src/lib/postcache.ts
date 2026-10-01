import type { PostView } from "lemmy-js-client"
import type { Profile } from "./types.js"

export type PostsCache = {
  posts: PostView[]
  page: number
  lastScrollTop: number
}

// In-memory cache for posts of a community. An empty name means global frontpage.
export const communityPosts = new Map<string, PostsCache>()
let currentProfile: Profile | null = null

export function clearCommunityPostsIfProfileChanged(
  profile: Profile | null,
): void {
  if (profile !== currentProfile) {
    currentProfile = profile
    communityPosts.clear()
  }
}

/**
 * Searches across all cached community post lists for a post with the given ID.
 */
export function findCachedPost(postID: number): PostView | undefined {
  for (const cache of communityPosts.values()) {
    const found = cache.posts.find((p) => p.post.id === postID)
    if (found) {
      return found
    }
  }
  return undefined
}

/**
 * Updates all cached instances of a post across all community lists.
 */
export function updateCachedPost(updated: PostView): void {
  const postID = updated.post.id
  for (const cache of communityPosts.values()) {
    for (const p of cache.posts) {
      if (p.post.id === postID) {
        p.counts = { ...updated.counts }
        p.my_vote = updated.my_vote
      }
    }
  }
}
