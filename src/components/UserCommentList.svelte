<script lang="ts">
  import Symbol from "#/components/Symbol.svelte"
  import Markdown from "#/components/Markdown.svelte"
  import UpvoteBadge from "#/components/UpvoteBadge.svelte"
  import CommunityBadge from "#/components/CommunityBadge.svelte"
  import RelativeTimestamp from "#/components/RelativeTimestamp.svelte"
  import type { CommentView } from "lemmy-js-client"
  import { fade } from "svelte/transition"

  let {
    comments,
    class: className = "",
  }: {
    comments: CommentView[]
    class?: string
  } = $props()
</script>

<ol class="{className} flex flex-col gap-4 py-4">
  {#each comments as comment (comment.comment.id)}
    <li
      class="flex flex-col gap-1 w-full border-b border-surface-700/60 pb-4"
      transition:fade={{ duration: 75 }}
    >
      <p class="text-sm text-surface-400 flex flex-wrap items-center gap-1">
        <span>Commented in</span>
        <CommunityBadge community={comment.community} />
      </p>

      <h3>
        <a
          href="/p/{comment.post.id}#comment-{comment.comment.id}"
          class="hover:underline font-semibold"
        >
          <Markdown markdown={comment.post.name} inline />
        </a>
      </h3>

      <div
        class="comment-content !text-sm border-l-4 px-3 border-surface-400 bg-surface-800/30 rounded-r py-2 my-1"
      >
        <Markdown markdown={comment.comment.content} />
      </div>

      <p class="flex flex-wrap gap-2 mt-1">
        <UpvoteBadge {comment} class="btn-sm" />
        <a
          href="/p/{comment.post.id}#comment-{comment.comment.id}"
          class="btn btn-sm variant-soft transition inline-flex gap-1 px-3 hover:text-white"
        >
          <Symbol name="link" />
          <span>Context</span>
        </a>
        <RelativeTimestamp
          date={comment.comment.published}
          class="btn btn-sm variant-soft pointer-events-none inline-flex gap-1 px-3"
        />
      </p>
    </li>
  {/each}
</ol>
