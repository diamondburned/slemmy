<script lang="ts">
  import type { Post } from "lemmy-js-client"
  import { postThumbnailURL } from "#/lib/lemmyutils.js"

  import { ProgressRadial } from "@skeletonlabs/skeleton"

  let {
    post,
    prefetchedURL = undefined,
    class: className = "",
    imageClass = "",
    modal = false,
  }: {
    post: Post
    prefetchedURL?: string
    class?: string
    imageClass?: string
    modal?: boolean
  } = $props()

  let fullThumbnailURL = $derived(postThumbnailURL(post, { original: true }))
  let loaded = $state(false)
  let isModal = $derived(modal || className.includes("pointer-events-none"))
</script>

{#if fullThumbnailURL}
  <div
    class="thumbnail-container rounded relative grid place-items-center {isModal
      ? 'modal-fit'
      : 'page-fit'} {className}"
  >
    {#if prefetchedURL}
      <img
        class="thumbnail-image thumbnail-preview {imageClass}"
        src={prefetchedURL}
        alt=" "
      />
    {/if}
    <img
      class="thumbnail-image z-10 duration-100 transition-opacity {imageClass}"
      class:opacity-0={!loaded}
      onload={() => (loaded = true)}
      onerror={() => (loaded = true)}
      src={fullThumbnailURL}
      alt=" "
    />
    {#if !loaded}
      <div class="thumbnail-image grid h-full w-full min-h-32 place-items-center z-20">
        <ProgressRadial stroke={80} width="w-12" />
      </div>
    {/if}
  </div>
{/if}

<style lang="postcss">
  .thumbnail-container {
    display: grid;
    place-items: center;
    width: auto;
    height: auto;
  }

  .thumbnail-container.modal-fit {
    max-width: calc(100vw - 2rem);
    max-height: calc(100dvh - 2rem);
  }

  .thumbnail-container.page-fit {
    max-width: 100%;
    max-height: 80vh;
  }

  .thumbnail-image {
    grid-area: 1 / 1;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: inherit;
  }

  .thumbnail-preview {
    width: 100%;
    height: 100%;
  }

  .modal-fit .thumbnail-image {
    max-width: calc(100vw - 2rem);
    max-height: calc(100dvh - 2rem);
  }

  .page-fit .thumbnail-image {
    max-width: 100%;
    max-height: 80vh;
  }
</style>
