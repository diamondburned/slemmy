<script lang="ts">
  import { AppShell } from "@skeletonlabs/skeleton"
  import type { Snippet } from "svelte"
  import { scrollDelta } from "#/lib/events.js"
  import type { ScrollDeltaEvent } from "#/lib/events.js"

  let {
    scrollContainer = $bindable(),
    lockHeaderHeight = false,
    onscroll,
    onscrolldelta,
    pageHeader,
    children,
  }: {
    scrollContainer?: HTMLElement
    lockHeaderHeight?: boolean
    onscroll?: (ev: Event) => void
    onscrolldelta?: (ev: ScrollDeltaEvent) => void
    pageHeader?: Snippet
    children?: Snippet
  } = $props()

  let lockingHeight = $state(false)
  let headerHeight = $state(0)
  let headerPadding = $state<HTMLElement>()

  $effect(() => {
    if (headerPadding && headerHeight) {
      if (!lockHeaderHeight || !lockingHeight) {
        headerPadding.style.height = `${headerHeight}px`
        lockingHeight = true
      }
    }
  })

  let hideBar = $state(false)
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
  <svelte:fragment slot="pageHeader">
    <div
      bind:clientHeight={headerHeight}
      style="z-index: 1; {hideBar ? `top: -${headerHeight}px` : 'top: 0'}"
      class="absolute w-full z-10 transition-all duration-100 ease-in-out"
    >
      {@render pageHeader?.()}
    </div>
  </svelte:fragment>

  <div
    class="overflow-y-scroll h-full flex flex-col"
    use:scrollDelta
    bind:this={scrollContainer}
    onscroll={(ev) => onscroll?.(ev)}
    onscrolldelta={(ev) => {
      onscrolldelta?.(ev)
      handlePostsScroll(ev)
    }}
  >
    <div><div bind:this={headerPadding}></div></div>
    <div class="container m-auto">
      {@render children?.()}
    </div>
  </div>
</AppShell>
