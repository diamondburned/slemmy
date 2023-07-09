import type { Post } from "lemmy-js-client"

const acceptedExts = ["jpg", "jpeg", "png", "gif", "webp"]

export function postThumbnailURL(
  post: Post,
  opts?: ThumbnailOpts,
): string | undefined {
  const imageURL = post.thumbnail_url || post.url
  if (!imageURL || !acceptedExts.some((ext) => imageURL.endsWith(ext))) {
    return undefined
  }

  return thumbnailURL(imageURL, opts)
}

export type ThumbnailOpts = {
  size?: number // default: 256
  hidpi?: boolean // default: true
  format?: "webp" | "jpg" | "png" // default: webp
  original?: boolean // default: false
}

export function thumbnailURL(imageURL: string, opts?: ThumbnailOpts): string
export function thumbnailURL(
  imageURL: string | undefined,
  opts?: ThumbnailOpts,
): string | undefined

export function thumbnailURL(
  imageURL: string | undefined,
  opts?: ThumbnailOpts,
): string | undefined {
  if (!imageURL) {
    return
  }

  if (opts?.original) {
    return imageURL
  }

  let url: URL
  try {
    url = new URL(imageURL)
  } catch (err) {
    console.warn("invalid thumbnail URL, continuing anyway", err)
    return imageURL
  }
  if (!url.pathname.startsWith("/pictrs/image/")) {
    return imageURL
  }

  url.searchParams.set(
    "format",
    // WebP is animated so we don't want to use it for GIFs.
    opts?.format || (url.pathname.endsWith(".gif") ? "jpg" : "webp"),
  )

  const size =
    (opts?.size ? roundUpToPowerOf2(opts.size) : 256) *
    (opts?.hidpi ? window.devicePixelRatio : 1)
  url.searchParams.set("thumbnail", `${size}`)

  return url.toString()
}

function roundUpToPowerOf2(x: number): number {
  return 2 ** Math.ceil(Math.log2(x))
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
