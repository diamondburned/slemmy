<script lang="ts">
  let className = ""
  export { className as class }
  export let variant = "variant-soft"
</script>

<span class="{className} btn btn-sm {variant} text-400 gap-1 px-3">
  <slot />
</span>
