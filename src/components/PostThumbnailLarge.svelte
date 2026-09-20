<script lang="ts">
  import type { Post } from "lemmy-js-client"
  import { postThumbnailURL } from "#/lib/lemmyutils.js"

  import { ProgressRadial } from "@skeletonlabs/skeleton"

  let {
    post,
    prefetchedURL = undefined,
    class: className = "",
    imageClass = "",
  }: {
    post: Post
    prefetchedURL?: string
    class?: string
    imageClass?: string
  } = $props()

  let fullThumbnailURL = $derived(postThumbnailURL(post, { original: true }))
  const imageClassDefault =
    "rounded w-full h-full object-contain m-auto duration-100 transition-opacity"

  let loaded = $state(false)
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
      onload={() => (loaded = true)}
      onerror={() => (loaded = true)}
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
