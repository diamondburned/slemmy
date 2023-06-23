import type { Post } from "lemmy-js-client"

const acceptedExts = ["jpg", "jpeg", "png", "gif", "webp"]

export function postThumbnailURL(
  post: Post,
  thumbnail = false,
): string | undefined {
  const thumbnailURL = post.thumbnail_url || post.url
  if (
    !thumbnailURL ||
    !acceptedExts.some((ext) => thumbnailURL.endsWith(ext))
  ) {
    return undefined
  }

  if (!thumbnail) {
    return thumbnailURL
  }

  let url: URL
  try {
    url = new URL(thumbnailURL)
  } catch (err) {
    console.warn("invalid thumbnail URL, continuing anyway", err)
    return thumbnailURL
  }
  if (!url.pathname.startsWith("/pictrs")) {
    return thumbnailURL
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
