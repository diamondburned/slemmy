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

  $: color = colors[level % colors.length]

  let expanded = true
</script>

<blockquote class="comment my-2 w-full border-l-2 border-{color}-400">
  <button
    class="comment-self px-2 pt-2 w-full text-left hover:bg-surface-700 ease-out duration-150 hover:transition-none"
    on:click={() => (expanded = !expanded)}
  >
    <div class="comment-header text-sm">
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
    <div class="comment-body prose prose-nopad py-1">
      {@html markdown(comment.comment.content)}
    </div>
  </button>
  {#if expanded}
    <div class="pl-2" transition:slide|local={{ duration: 200, easing: inOut }}>
      {#each children as comment}
        <svelte:self {comment} level={level + 1} />
      {/each}
    </div>
  {/if}
</blockquote>
