<script lang="ts">
  import Symbol from "./Symbol.svelte"
  import UserBadge from "#/components/UserBadge.svelte"
  import RelativeTimestamp from "./RelativeTimestamp.svelte"

  import type { NestedCommentView } from "#/lib/types.js"
  import { markdown } from "#/lib/markdown.js"
  import { cubicInOut as inOut } from "svelte/easing"
  import { slide } from "svelte/transition"

  export let level = 0
  export let comment: NestedCommentView
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

  let expanded = true
  const expandingTransition = { duration: 200, easing: inOut }
</script>

<blockquote
  class="
    comment my-2 w-full
    {level > 0 ? `border-l-2 border-${color}-400` : ''}
  "
>
  <!-- Special treatment for our first button on:click :) -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <button
    class="comment-self px-2 w-full text-left hover:bg-surface-700 ease-out duration-150 hover:transition-none"
    class:cursor-default={children.length == 0}
    on:click|stopPropagation|preventDefault={() => {
      if (children.length > 0) {
        expanded = !expanded
      }
    }}
  >
    <!-- on:click|stopPropagation to allow selecting text -->
    <div
      class="comment-header text-sm my-1 ease-out duration-150"
      class:text-surface-400={!expanded}
    >
      <UserBadge width="w-4" user={comment.creator} />
      <span class="text-surface-400">
        <span class="mx-1">ꞏ</span>
        <button
          class="hover:font-bold hover:text-primary-400 transition"
          on:click|preventDefault|stopPropagation={() => {}}
        >
          <Symbol name="expand_less" inline />
          {comment.counts.upvotes - comment.counts.downvotes}
        </button>
        <span class="mx-1">ꞏ</span>
        <RelativeTimestamp date={comment.comment.published} icon={false} />
      </span>
    </div>
    {#if expanded}
      <div
        class="comment-body select-text cursor-text z-2 prose prose-nopad my-1"
        on:click|stopPropagation
        transition:slide|local={expandingTransition}
      >
        {@html markdown(comment.comment.content)}
      </div>
    {/if}
  </button>
  {#if expanded}
    <div class="pl-2" transition:slide|local={expandingTransition}>
      {#each children as comment}
        <svelte:self {comment} level={level + 1} />
      {/each}
    </div>
  {/if}
</blockquote>
