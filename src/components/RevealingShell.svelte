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
  export let lockHeaderHeight = false
  let lockingHeight = false

  let headerHeight = 0
  let headerPadding: HTMLElement
  $: {
    if (headerPadding && headerHeight) {
      if (!lockHeaderHeight || !lockingHeight) {
        headerPadding.style.height = `${headerHeight}px`
        lockingHeight = true
      }
    }
  }

  let hideBar = false
  function handlePostsScroll(event: ScrollDeltaEvent) {
    const { scrollTop } = event.target as HTMLElement
    if (scrollTop < 10) {
      hideBar = false
      return
    }
    if (event.detail.y < -10) {
      hideBar = false
    } else if (event.detail.y > +10) {
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
    bind:clientHeight={headerHeight}
    style="z-index: 1; {hideBar ? `top: -${headerHeight}px` : 'top: 0'}"
    class="absolute w-full z-10 transition-all duration-100 ease-in-out"
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
