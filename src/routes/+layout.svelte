<script lang="ts">
  import "#/styles/theme.scss"
  import "#/styles/base.postcss"
  import "#/styles/easymde.postcss"
  import "#/styles/markdown.postcss"

  import type { Snippet } from "svelte"
  import { Modal, Toast, initializeStores, getToastStore } from "@skeletonlabs/skeleton"
  import { setToastStore } from "#/lib/toasty.js"

  import { goto } from "$app/navigation"
  import { profiles, currentProfile } from "#/stores.js"

  initializeStores()
  setToastStore(getToastStore())

  let { children }: { children?: Snippet } = $props()

  $effect(() => {
    if (!$profiles[$currentProfile]) {
      goto("/profiles")
    }
  })
</script>

<Modal />
<Toast />

{@render children?.()}
