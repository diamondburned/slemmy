<script lang="ts">
  import type { Post } from "lemmy-js-client"
  import { pushState } from "$app/navigation"
  import { getModalStore } from "@skeletonlabs/skeleton"
  import { onDestroy } from "svelte"
  import { postThumbnailURL } from "#/lib/lemmyutils.js"
  import PostThumbnailLarge from "#/components/PostThumbnailLarge.svelte"

  let { post }: { post: Post } = $props()

  const modalStore = getModalStore()

  let fullThumbnailURL = $derived(postThumbnailURL(post, { original: true }))
  let jpegThumbnailURL = $derived(postThumbnailURL(post, { format: "jpg" }))

  let failed = $state(false)
  let loaded = $state(false)

  let image = $state<HTMLImageElement>()
  let prefetchedURL = $state("")

  // True if the background should be rendered.
  // loaded won't be true if post.nsfw is true
  let showBackground = $derived(!!prefetchedURL && (post.nsfw || loaded))

  let cleanupNavigation: (() => void) | undefined

  onDestroy(() => {
    cleanupNavigation?.()
  })

  function openModal() {
    const targetHash = `#${post.id}-thumbnail`
    let closedByNavigation = false

    const onCloseNavigation = () => {
      if (location.hash !== targetHash) {
        closedByNavigation = true
        cleanupNavigation?.()
        modalStore.close()
      }
    }

    window.addEventListener("popstate", onCloseNavigation)
    window.addEventListener("hashchange", onCloseNavigation)
    cleanupNavigation = () => {
      window.removeEventListener("popstate", onCloseNavigation)
      window.removeEventListener("hashchange", onCloseNavigation)
      cleanupNavigation = undefined
    }

    if (location.hash !== targetHash) {
      pushState(targetHash, {})
    }

    modalStore.trigger({
      type: "component",
      component: {
        ref: PostThumbnailLarge,
        props: {
          post,
          class: "pointer-events-none",
          prefetchedURL,
          modal: true,
        },
      },
      response: () => {
        cleanupNavigation?.()
        if (!closedByNavigation && location.hash === targetHash) {
          history.back()
        }
      },
    })
  }
</script>

{#if post.thumbnail_url}
  <button
    class="h-20 w-20 shrink-0 relative aspect-square sm:w-36 sm:aspect-auto overflow-hidden rounded bg-surface-600"
    class:nsfw={post.nsfw}
    class:hidden={!fullThumbnailURL}
    style="background-image: url({showBackground ? prefetchedURL : ''})"
    onclick={() => openModal()}
  >
    {#if post.nsfw}
      <div class="absolute top-0 nsfw-overlay h-full w-full"></div>
    {/if}
    <picture class:opacity-0={post.nsfw}>
      <source srcset={jpegThumbnailURL} />
      <img
        loading="lazy"
        class="h-full w-full object-contain"
        src={fullThumbnailURL}
        alt=" "
        bind:this={image}
        onload={() => {
          loaded = true
          if (image) prefetchedURL = image.currentSrc
        }}
        onerror={() => (failed = true)}
      />
    </picture>
  </button>
{/if}

<style>
  img,
  div.nsfw-overlay {
    border-radius: 0;
    backdrop-filter: blur(10px) brightness(0.5) contrast(0.65);
  }

  button {
    background-size: cover;
    background-position: center;
  }
</style>
