<script lang="ts">
  import "#/styles/theme.scss"
  import "@skeletonlabs/skeleton/styles/skeleton.css"
  import "#/styles/base.postcss"
  import "#/styles/easymde.postcss"
  import "#/styles/markdown.postcss"

  import { Modal, Toast } from "@skeletonlabs/skeleton"

  import { goto } from "$app/navigation"
  import { profiles, currentProfile } from "#/stores.js"

  $: {
    if (!$profiles[$currentProfile]) {
      goto("/profiles")
    }
  }
</script>

<Modal />
<Toast />

<slot />
