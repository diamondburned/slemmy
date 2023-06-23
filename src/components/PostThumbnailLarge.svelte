<script lang="ts">
  import type { Post } from "lemmy-js-client"
  import { postThumbnailURL } from "#/lib/lemmyutils.js"

  import { ProgressRadial } from "@skeletonlabs/skeleton"

  export let post: Post
  $: thumbnailURL = postThumbnailURL(post)

  let className = ""
  export { className as class }
  export let imageClass = ""

  let loaded = false
  let imageElement: HTMLImageElement
</script>

{#if thumbnailURL}
  <div class="rounded m-auto w-full max-w-lg max-h-lg {className}">
    <img
      class="rounded max-w-full max-h-full duration-100 transition-opacity {imageClass}"
      class:absolute={!loaded}
      class:opacity-0={!loaded}
      on:load={() => (loaded = true)}
      loading="lazy"
      src={post.thumbnail_url}
      alt="Post thumbnail"
    />
    {#if !loaded}
      <div class="grid h-full place-items-center">
        <ProgressRadial stroke={80} width="w-12" />
      </div>
    {/if}
  </div>
{/if}
