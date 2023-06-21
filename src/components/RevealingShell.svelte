<script lang="ts">
  import { AppShell, toastStore } from "@skeletonlabs/skeleton"

  import { createEventDispatcher } from "svelte"
  import { scrollDelta } from "#/lib/events.js"
  import type { ScrollDeltaEvent } from "#/lib/events.js"

  const dispatch = createEventDispatcher<{
    scroll: Event
    scrollDelta: ScrollDeltaEvent
  }>()

  export let scrollContainer: HTMLElement

  let headerSize = { w: 0, h: 0 }
  let headerPadding: HTMLElement
  $: headerPadding && (headerPadding.style.height = `${headerSize.h}px`)

  let hideBar = false
  function handlePostsScroll(event: ScrollDeltaEvent) {
    const { scrollTop } = event.target as HTMLElement
    if (scrollTop < 5) {
      hideBar = false
      return
    }
    if (event.detail.y < 0) {
      hideBar = false
    } else if (event.detail.y > 0) {
      hideBar = true
    }
  }
</script>

<AppShell
  regionPage="h-full overflow-hidden"
  slotPageContent="h-full overflow-hidden"
  slotPageHeader="relative"
>
  <div
    slot="pageHeader"
    bind:clientHeight={headerSize.h}
    style="z-index: 1; {hideBar ? `top: -${headerSize.h}px` : 'top: 0'}"
    class="absolute w-full z-2 transition-all duration-100 ease-in-out"
  >
    <slot name="pageHeader" />
  </div>

  <div
    class="overflow-y-scroll h-full flex flex-col"
    use:scrollDelta
    bind:this={scrollContainer}
    on:scroll={(ev) => dispatch("scroll", ev)}
    on:scrolldelta={(ev) => {
      dispatch("scrollDelta", ev)
      handlePostsScroll(ev)
    }}
  >
    <div><div bind:this={headerPadding} /></div>
    <div class="container m-auto">
      <slot />
    </div>
  </div>
</AppShell>
