<script lang="ts">
  import "#/styles/theme.scss"
  import "@skeletonlabs/skeleton/styles/skeleton.css"
  import "#/styles/base.scss"

  import { Modal, Toast } from "@skeletonlabs/skeleton"
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link
    href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0"
    rel="stylesheet"
  />
</svelte:head>

<Modal />
<Toast />

<slot />
