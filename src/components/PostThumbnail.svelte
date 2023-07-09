<script lang="ts">
  import type { Post } from "lemmy-js-client"
  import { modalStore } from "@skeletonlabs/skeleton"
  import { postThumbnailURL } from "#/lib/lemmyutils.js"
  import PostThumbnailLarge from "#/components/PostThumbnailLarge.svelte"

  import { onMount } from "svelte"
  import * as store from "svelte/store"

  export let post: Post
  $: fullThumbnailURL = postThumbnailURL(post, { original: true })
  $: webpThumbnailURL = postThumbnailURL(post)
  $: jpegThumbnailURL = postThumbnailURL(post, { format: "jpg" })

  let failed = false
  let loaded = false

  let image: HTMLImageElement
  let prefetchedURL = ""

  // True if the background should be rendered.
  // loaded won't be true if post.nsfw is true
  $: showBackground = prefetchedURL && (post.nsfw || loaded)

  function openModal() {
    modalStore.trigger({
      type: "component",
      component: {
        ref: PostThumbnailLarge,
        props: {
          post,
          class: "pointer-events-none",
          prefetchedURL,
        },
      },
    })
  }
</script>

{#if post.thumbnail_url}
  <button
    class="h-20 w-20 relative aspect-square sm:w-36 sm:aspect-auto overflow-hidden rounded bg-surface-600"
    class:nsfw={post.nsfw}
    class:hidden={!fullThumbnailURL}
    style="background-image: url({showBackground ? prefetchedURL : ''})"
    on:click={() => openModal()}
  >
    {#if post.nsfw}
      <div class="absolute top-0 nsfw-overlay z-10 h-full w-full" />
    {/if}
    <picture>
      <source srcset={webpThumbnailURL} type="image/webp" />
      <source srcset={jpegThumbnailURL} type="image/jpeg" />
      <img
        loading="lazy"
        class="h-full w-full object-contain"
        class:hidden={post.nsfw || failed}
        src={fullThumbnailURL}
        alt=" "
        bind:this={image}
        on:load={() => {
          loaded = true
          prefetchedURL = image.currentSrc
        }}
        on:error={() => (failed = true)}
      />
    </picture>
  </button>
{/if}

<style>
  img,
  div.nsfw-overlay {
    height: calc(100% + 1px);
    border-radius: 0;
    backdrop-filter: blur(15px) brightness(0.5) contrast(0.65);
  }

  button {
    background-size: cover;
    background-position: center;
  }
</style>
