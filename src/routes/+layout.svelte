<script lang="ts">
  import "#/styles/theme.scss"
  import "@skeletonlabs/skeleton/styles/skeleton.css"
  import "#/styles/base.postcss"

  import { Modal, Toast } from "@skeletonlabs/skeleton"

  import { goto } from "$app/navigation"
  import { onMount } from "svelte"
  import { profiles, currentProfile } from "#/stores.js"
  import * as store from "svelte/store"

  // For SSR
  let mounted = false
  onMount(() => (mounted = true))

  $: {
    if (mounted && !$profiles[$currentProfile]) {
      goto("/profiles")
    }
  }
</script>

<Modal />
<Toast />

<slot />
