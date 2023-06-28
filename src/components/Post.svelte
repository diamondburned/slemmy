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

  export let post: PostView

  export let showCounters = true
  export let showThumbnail = true
  export let showExternalLink = true
  export let authorPosition: "top" | "bottom" = "bottom"
  export let size: "small" | "large" = "large"

  $: large = size == "large"

  export let headerClass = ""
  export let authorClass = ""
  export let titleClass = ""
  export let countersClass = ""
  export let thumbnailClass = ""
  export let contentClass = ""

  let klass = "container"
  export { klass as class }
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
        <UpvoteBadge bind:post class="btn" />
        <span class="btn variant-soft pointer-events-none">
          <Symbol name="comment" inline margin="mr-1" class="!align-middle" />
          {post.counts.comments}
        </span>
        <RelativeTimestamp
          date={post.post.published}
          style="long"
          class="btn variant-soft pointer-events-none"
        >
          <svelte:fragment slot="icon">
            <Symbol
              name="schedule"
              inline
              margin="mr-1"
              class="!align-middle"
            />
          </svelte:fragment>
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
