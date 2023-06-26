import type { Post } from "lemmy-js-client"

const acceptedExts = ["jpg", "jpeg", "png", "gif", "webp"]

export function postThumbnailURL(
  post: Post,
  thumbnail = false,
): string | undefined {
  const imageURL = post.thumbnail_url || post.url
  if (!imageURL || !acceptedExts.some((ext) => imageURL.endsWith(ext))) {
    return undefined
  }

  if (!thumbnail) {
    return imageURL
  }

  return thumbnailURL(imageURL)
}

export function thumbnailURL(imageURL: string): string
export function thumbnailURL(imageURL: undefined): undefined
export function thumbnailURL(imageURL: string | undefined): string | undefined

export function thumbnailURL(imageURL: string | undefined): string | undefined {
  if (!imageURL) {
    return
  }

  let url: URL
  try {
    url = new URL(imageURL)
  } catch (err) {
    console.warn("invalid thumbnail URL, continuing anyway", err)
    return imageURL
  }
  if (!url.pathname.startsWith("/pictrs")) {
    return imageURL
  }

  url.searchParams.set(
    "format",
    // WebP is animated so we don't want to use it for GIFs.
    url.pathname.endsWith(".gif") ? "jpg" : "webp",
  )
  url.searchParams.set("thumbnail", "256")
  return url.toString()
}

export function urlHostname(url: string): string | undefined {
  try {
    const u = new URL(url)
    return u.hostname || undefined
  } catch (_) {
    return undefined
  }
}

const userActorIDRe = /:\/\/(.*)\/u\/(\S*)$/
const communityActorIDRe = /:\/\/(.*)\/c\/(\S*)$/

// parseUserActorID parses `https://lemmy.ml/u/username` into
// `username@lemmy.ml`.
export function parseUserActorID(actorID: string): string | null {
  const match = actorID.match(userActorIDRe)
  if (!match) {
    return null
  }

  const [, instance, username] = match
  return `${username}@${instance}`
}

// parseCommunityActorID parses `https://lemmy.ml/c/community` into
// `community@lemmy.ml`.
export function parseCommunityActorID(actorID: string): string | null {
  const match = actorID.match(communityActorIDRe)
  if (!match) {
    return null
  }

  const [, instance, community] = match
  return `${community}@${instance}`
}
