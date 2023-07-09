<script lang="ts">
  import type { Post } from "lemmy-js-client"
  import { postThumbnailURL } from "#/lib/lemmyutils.js"

  import { ProgressRadial } from "@skeletonlabs/skeleton"
  import PostThumbnail from "./PostThumbnail.svelte"

  export let post: Post
  export let prefetchedURL: string | undefined = undefined

  $: fullThumbnailURL = postThumbnailURL(post, { original: true })
  $: loadingThumbnailURL = prefetchedURL || fullThumbnailURL

  let className = ""
  export { className as class }
  export let imageClass = ""
  $: imageClassDefault =
    "rounded w-full h-full object-contain m-auto duration-100 transition-opacity"

  let loaded = false
</script>

{#if fullThumbnailURL}
  <div class="rounded w-full h-full relative {className}">
    {#if prefetchedURL}
      <img
        class="{imageClassDefault} {imageClass}"
        src={prefetchedURL}
        alt=" "
      />
    {/if}
    <img
      class="{imageClassDefault} {imageClass} absolute top-0 z-10"
      class:!fixed={!loaded}
      class:!opacity-0={!loaded}
      on:load={() => (loaded = true)}
      on:error={() => (loaded = true)}
      src={fullThumbnailURL}
      alt=" "
    />
    {#if !loaded}
      <div class="grid h-full w-full place-items-center absolute top-0 z-10">
        <ProgressRadial stroke={80} width="w-12" />
      </div>
    {/if}
  </div>
{/if}
