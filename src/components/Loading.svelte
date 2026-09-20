<script lang="ts">
  import { ProgressRadial } from "@skeletonlabs/skeleton"

  let {
    fullscreen = false,
  }: {
    fullscreen?: boolean
  } = $props()
</script>

<div
  class="grid h-full place-items-center"
  class:h-full={fullscreen}
  class:my-8={!fullscreen}
  class:container={!fullscreen}
>
  <ProgressRadial stroke={80} width="w-12" />
</div>
