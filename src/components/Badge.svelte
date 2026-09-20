<script lang="ts">
  import type { Snippet } from "svelte"

  let {
    class: className = "",
    variant = "variant-soft",
    children,
  }: {
    class?: string
    variant?: string
    children?: Snippet
  } = $props()
</script>

<span
  class="{className} btn btn-sm {variant} text-400 gap-1 px-3 cursor-default"
>
  {@render children?.()}
</span>
