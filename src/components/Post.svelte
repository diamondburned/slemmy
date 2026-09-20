<script lang="ts">
  import type { PostView } from "lemmy-js-client"
  import { urlHostname } from "#/lib/lemmyutils.js"

  import Symbol from "#/components/Symbol.svelte"
  import Markdown from "#/components/Markdown.svelte"
  import UserBadge from "#/components/UserBadge.svelte"
  import UpvoteBadge from "#/components/UpvoteBadge.svelte"
  import CommunityBadge from "#/components/CommunityBadge.svelte"
  import RelativeTimestamp from "#/components/RelativeTimestamp.svelte"
  import PostThumbnailLarge from "#/components/PostThumbnailLarge.svelte"

  let {
    post = $bindable(),
    showCounters = true,
    showThumbnail = true,
    showExternalLink = true,
    authorPosition = "bottom",
    size = "large",
    headerClass = "",
    authorClass = "",
    titleClass = "",
    countersClass = "",
    thumbnailClass = "",
    contentClass = "",
    class: klass = "container",
  }: {
    post: PostView
    showCounters?: boolean
    showThumbnail?: boolean
    showExternalLink?: boolean
    authorPosition?: "top" | "bottom"
    size?: "small" | "large"
    headerClass?: string
    authorClass?: string
    titleClass?: string
    countersClass?: string
    thumbnailClass?: string
    contentClass?: string
    class?: string
  } = $props()

  let large = $derived(size == "large")
</script>

<div class={klass}>
  <hgroup class="{large ? 'space-y-4 my-4' : 'space-y-1'} {headerClass}">
    {#if authorPosition == "top"}
      <p class="{authorClass} {large ? 'text-base' : 'text-sm'}">
        <UserBadge width={large ? "w-[1.5rem]" : "w-4"} user={post.creator} />
        <span class="mx-1 text-surface-400">to</span>
        <CommunityBadge
          width={large ? "w-[1.5rem]" : "w-4"}
          community={post.community}
        />
      </p>
    {/if}

    <h2 class="{large ? 'text-2xl' : 'text-base'} {titleClass}">
      <a
        href={post.post.url}
        class="font-semibold {post.post.url ? 'hover:underline' : ''}"
        target={post.post.url ? "_blank" : ""}
      >
        <Markdown markdown={post.post.name} inline />
      </a>
      {#if showExternalLink && post.post.url}
        <Symbol
          name="open_in_new"
          size={large ? "lg" : "sm"}
          class="align-middle text-surface-400"
        />
        {#if urlHostname(post.post.url)}
          <span class="text-surface-400 {large ? 'text-lg' : 'text-sm'}">
            ({urlHostname(post.post.url)})
          </span>
        {/if}
      {/if}
    </h2>

    {#if authorPosition == "bottom"}
      <p class="{authorClass} {large ? 'text-base' : 'text-sm'}">
        <UserBadge width="w-[1.5rem]" user={post.creator} />
        <span class="mx-1 text-surface-400">to</span>
        <CommunityBadge width="w-[1.5rem]" community={post.community} />
      </p>
    {/if}

    {#if showCounters}
      <div class="flex flex-row flex-wrap gap-2 {countersClass}">
        <UpvoteBadge {post} class="btn" />
        <span class="btn variant-soft pointer-events-none">
          <Symbol name="comment" inline margin="mr-1" class="!align-middle" />
          {post.counts.comments}
        </span>
        <RelativeTimestamp
          date={post.post.published}
          style="long"
          class="btn variant-soft pointer-events-none"
        >
          {#snippet iconSnippet()}
            <Symbol
              name="schedule"
              inline
              margin="mr-1"
              class="!align-middle"
            />
          {/snippet}
        </RelativeTimestamp>
        {#if post.post.nsfw}
          <span class="btn variant-soft pointer-events-none !text-red-400">
            NSFW
          </span>
        {/if}
      </div>
    {/if}

    {#if showThumbnail}
      <PostThumbnailLarge post={post.post} class={thumbnailClass} />
    {/if}
  </hgroup>

  <Markdown markdown={post?.post.body || ""} class={contentClass} />
</div>
