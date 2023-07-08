<script lang="ts">
  import type { Post } from "lemmy-js-client"
  import { postThumbnailURL } from "#/lib/lemmyutils.js"

  import { ProgressRadial } from "@skeletonlabs/skeleton"

  export let post: Post
  $: thumbnailURL = post.thumbnail_url

  let className = ""
  export { className as class }
  export let imageClass = ""

  let loaded = false
  let imageElement: HTMLImageElement
</script>

{#if thumbnailURL}
  <div class="rounded w-full h-full {className}">
    <img
      class="rounded w-full h-full object-contain m-auto duration-100 transition-opacity {imageClass}"
      class:absolute={!loaded}
      class:opacity-0={!loaded}
      on:load={() => (loaded = true)}
      src={thumbnailURL}
      alt="Post thumbnail"
    />
    {#if !loaded}
      <div class="grid h-full place-items-center">
        <ProgressRadial stroke={80} width="w-12" />
      </div>
    {/if}
  </div>
{/if}
