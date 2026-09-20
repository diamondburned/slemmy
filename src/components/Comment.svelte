<script lang="ts">
  import Comment from "./Comment.svelte"
  import Symbol from "./Symbol.svelte"
  import Markdown from "#/components/Markdown.svelte"
  import UserBadge from "#/components/UserBadge.svelte"
  import UpvoteBadge from "./UpvoteBadge.svelte"
  import CommentComposer from "./CommentComposer.svelte"
  import RelativeTimestamp from "./RelativeTimestamp.svelte"

  import type { PostView } from "lemmy-js-client"
  import type { NestedCommentView } from "#/lib/types.js"
  import { getModalStore } from "@skeletonlabs/skeleton"
  import { cubicInOut as inOut } from "svelte/easing"
  import { infoToast } from "#/lib/toasty.js"
  import { slide } from "svelte/transition"

  let {
    post,
    comment = $bindable(),
    refresh,
    level = 0,
    controls = true,
    expanded = true,
    outerClass = "",
    innerClass = "",
    headerClass = "",
    contentClass = "",
  }: {
    post: PostView
    comment: NestedCommentView
    refresh: () => void
    level?: number
    controls?: boolean
    expanded?: boolean
    outerClass?: string
    innerClass?: string
    headerClass?: string
    contentClass?: string
  } = $props()

  const modalStore = getModalStore()

  // svelte-ignore state_referenced_locally
  let isExpanded = $state(expanded)
  let children = $derived(comment.children)

  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "purple",
  ]

  let color = $derived(level == 0 ? "surface" : colors[(level - 1) % colors.length])

  const expandingTransition = { duration: 200, easing: inOut }

  function copyCommentLink() {
    navigator.clipboard.writeText(comment.comment.ap_id)
    infoToast("Copied post link to clipboard!")
  }

  function replyToThis() {
    modalStore.trigger({
      type: "component",
      component: {
        ref: CommentComposer,
        props: {
          post,
          replyingTo: comment,
          refresh,
        },
      },
    })
  }
</script>

<blockquote
  class="
    comment mx-auto my-2 w-full {outerClass}
    {level > 0 ? `border-l-2 border-${color}-400` : ''}
  "
>
  <div
    id="comment-{comment.comment.id}"
    class="target:bg-surface-700 comment-self w-full {innerClass}"
  >
    <!-- svelte-ignore a11y_interactive_supports_focus -->
    <div
      role="button"
      tabindex="0"
      class="comment-header cursor-pointer text-sm text-left w-full px-3 py-1 hover:bg-surface-700 ease-out duration-150 hover:transition-none {headerClass}"
      class:text-surface-400={!isExpanded}
      onclick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        isExpanded = !isExpanded
      }}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation()
          e.preventDefault()
          isExpanded = !isExpanded
        }
      }}
    >
      <UserBadge width="w-4" user={comment.creator} class="pr-2" />
      {#if controls}
        <span class="text-surface-400">
          <span>ꞏ</span>
          <UpvoteBadge
            {comment}
            class="text-surface-400 !pl-1 !pr-2 hover:font-bold hover:text-white"
            style="none"
            classes={{
              div: "align-bottom",
              upvoted: "!text-success-400 font-bold",
              downvoted: "!text-error-400 font-bold",
            }}
          />
          <span>ꞏ</span>
          <button
            type="button"
            class="px-2 hover:text-white hover:font-bold"
            onclick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              copyCommentLink()
            }}
          >
            <Symbol name="link" class="!align-top" />
          </button>
          <span>ꞏ</span>
          <button
            type="button"
            class="px-2 hover:text-white hover:font-bold"
            onclick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              replyToThis()
            }}
          >
            <Symbol name="reply" class="!align-top" />
          </button>
          <span>ꞏ</span>
          <RelativeTimestamp
            date={comment.comment.published}
            icon={false}
            class="px-2"
          />
        </span>
      {/if}
    </div>
    {#if isExpanded}
      <div transition:slide={expandingTransition}>
        <Markdown
          class="comment-body mx-3 mb-1 {contentClass}"
          markdown={comment.comment.content}
        />
      </div>
    {/if}
  </div>
  {#if isExpanded && children}
    <div class="pl-2" transition:slide={expandingTransition}>
      {#each children as child}
        <Comment comment={child} {post} {refresh} level={level + 1} />
      {/each}
    </div>
  {/if}
</blockquote>
