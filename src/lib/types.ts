import { LemmyHttp } from "lemmy-js-client"
import type { CommentView } from "lemmy-js-client"

export type Profile = {
  instance: {
    url: string
    name?: string
    icon?: string
  }
  user?: {
    name: string
    jwt: string

    avatar?: string
    display_name?: string
  }
}

export type Settings = {
  autoLogin?: boolean
  leftThumbnail?: boolean
}

// NestedCommentView is a CommentView with a children field.
export type NestedCommentView = CommentView & { children?: NestedCommentView[] }

export function nestComments(flattened: CommentView[]): NestedCommentView[] {
  const topLevels: NestedCommentView[] = []
  const byID = new Map<number, NestedCommentView>()

  for (const flattenedComment of flattened) {
    const paths = flattenedComment.comment.path
      .split(".")
      .map((x) => parseInt(x))
      .slice(0, -1) // remove last element, which is the comment ID itself

    // This might not be the safest way to do this, but YOLO.
    const comment: NestedCommentView = flattenedComment
    byID.set(comment.comment.id, comment)

    const parentID = paths[paths.length - 1]
    if (parentID == 0) {
      topLevels.push(comment)
      continue
    }

    const parent = byID.get(parentID)
    if (parent) {
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(comment)
    }
  }

  return topLevels
}

// LemmyHTTP is an alias for LemmyHttp.
export class LemmyHTTP extends LemmyHttp {}
