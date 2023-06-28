<script lang="ts">
  import Symbol from "./Symbol.svelte"
  import Markdown from "#/components/Markdown.svelte"
  import UserBadge from "#/components/UserBadge.svelte"
  import UpvoteBadge from "./UpvoteBadge.svelte"
  import CommentComposer from "./CommentComposer.svelte"
  import RelativeTimestamp from "./RelativeTimestamp.svelte"

  import type { PostView } from "lemmy-js-client"
  import type { NestedCommentView } from "#/lib/types.js"
  import { modalStore } from "@skeletonlabs/skeleton"
  import { cubicInOut as inOut } from "svelte/easing"
  import { infoToast } from "#/lib/toasty.js"
  import { slide } from "svelte/transition"

  export let post: PostView
  export let comment: NestedCommentView
  export let refresh: () => void

  export let level = 0
  export let controls = true
  export let expanded = true

  export let outerClass = ""
  export let innerClass = ""
  export let headerClass = ""
  export let contentClass = ""

  $: children = comment.children

  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "purple",
  ]

  $: color = level == 0 ? "surface" : colors[(level - 1) % colors.length]

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
          children: children,
          onComment: () => (children = children), // force update
          replyingTo: comment,
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
  <!-- Special treatment for our first button on:click :) -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    id="comment-{comment.comment.id}"
    class="target:bg-surface-700 comment-self w-full {innerClass}"
  >
    <!-- on:click|stopPropagation to allow selecting text -->
    <button
      class="comment-header text-sm text-left w-full px-3 py-1 hover:bg-surface-700 ease-out duration-150 hover:transition-none {headerClass}"
      class:text-surface-400={!expanded}
      on:click|stopPropagation|preventDefault={() => (expanded = !expanded)}
    >
      <UserBadge width="w-4" user={comment.creator} class="pr-2" />
      {#if controls}
        <span class="text-surface-400">
          <span>ꞏ</span>
          <UpvoteBadge
            bind:comment
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
            class="px-2 hover:text-white hover:font-bold"
            on:click|preventDefault|stopPropagation={() => copyCommentLink()}
          >
            <Symbol name="link" class="!align-top" />
          </button>
          <span>ꞏ</span>
          <button
            class="px-2 hover:text-white hover:font-bold"
            on:click|preventDefault|stopPropagation={() => replyToThis()}
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
    </button>
    {#if expanded}
      <div transition:slide|local={expandingTransition}>
        <Markdown
          class="comment-body mx-3 mb-1 {contentClass}"
          markdown={comment.comment.content}
        />
      </div>
    {/if}
  </div>
  {#if expanded && children}
    <div class="pl-2" transition:slide|local={expandingTransition}>
      {#each children as comment}
        <svelte:self {comment} {refresh} level={level + 1} />
      {/each}
    </div>
  {/if}
</blockquote>
