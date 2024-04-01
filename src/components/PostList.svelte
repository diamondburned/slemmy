<script lang="ts">
  import Symbol from "#/components/Symbol.svelte"
  import Markdown from "#/components/Markdown.svelte"
  import UpvoteBadge from "#/components/UpvoteBadge.svelte"
  import PostThumbnail from "#/components/PostThumbnail.svelte"
  import UserBadge from "#/components/UserBadge.svelte"
  import CommunityBadge from "#/components/CommunityBadge.svelte"
  import RelativeTimestamp from "#/components/RelativeTimestamp.svelte"

  import type { PostView } from "lemmy-js-client"

  import { fade } from "svelte/transition"
  import { urlHostname } from "#/lib/lemmyutils.js"

  export let posts: PostView[]

  let className: string | undefined = undefined
  export { className as class }
</script>

<ol class="{className} list flex flex-col gap-4 py-4">
  {#each posts as post}
    <li
      class="flex flex-row gap-0 items-center"
      transition:fade|local={{ duration: 75 }}
    >
      <div class="flex-1 flex flex-col gap-1 w-full">
        <p class="text-sm text-surface-400">
          <UserBadge user={post.creator} />
          <span class="mx-0.5">to</span>
          <CommunityBadge community={post.community} />

          <span class="float-right">
            {#if post.post.featured_community || post.post.featured_local}
              <span class="badge-icon variant-ghost" title="Featured">
                <Symbol name="push_pin" />
              </span>
            {/if}
          </span>
        </p>

        <h3>
          <a
            href={post.post.url || `/p/${post.post.id}`}
            class="hover:underline font-semibold"
            target={post.post.url ? "_blank" : ""}
          >
            <Markdown markdown={post.post.name} inline />
          </a>
          {#if post.post.url}
            <Symbol
              name="open_in_new"
              size="sm"
              class="align-bottom text-surface-400"
            />
            {#if urlHostname(post.post.url)}
              <span class="text-surface-400 text-xs">
                ({urlHostname(post.post.url)})
              </span>
            {/if}
          {/if}
        </h3>

        {#if post.post.body}
          <Markdown
            class="summary !text-sm line-clamp-2 overflow-hidden border-l-4 px-2 border-surface-400"
            markdown={post.post.body}
          />
        {/if}

        <p class="flex flex-wrap gap-2 mt-1">
          <UpvoteBadge bind:post class="btn-sm" />
          <a
            href="/p/{post.post.id}"
            class="btn btn-sm variant-soft transition inline-flex gap-1 px-3"
          >
            <Symbol name="comment" />
            {post.counts.comments}
          </a>
          <RelativeTimestamp
            date={post.post.published}
            class="btn btn-sm variant-soft pointer-events-none inline-flex gap-1 px-3"
          />
          {#if post.post.nsfw}
            <span class="btn btn-sm variant-soft !text-red-400 gap-1 px-3">
              NSFW
            </span>
          {/if}
        </p>
      </div>

      <PostThumbnail post={post.post} />
    </li>
  {/each}
</ol>
