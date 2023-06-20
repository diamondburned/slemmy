<script lang="ts">
  export let name: string
  export let size: string | undefined = undefined
  export let tooltip = ""
  export let large = false
  export let inline = false
  export let margin = ""

  let className = ""
  export { className as class }
</script>

<span
  class="
    material-symbols-rounded symbol
    {className} {margin} {size != undefined ? `text-${size}` : ''}
  "
  class:large
  class:sized={size != undefined}
  class:margin={!!margin}
  class:inline
  title={tooltip || undefined}
>
  {name.replaceAll("-", "_")}
</span>

<style lang="scss">
  .material-symbols-rounded {
    cursor: inherit;
    user-select: none;

    &:not(.sized) {
      font-size: 1.35em;
    }

    &.inline {
      &:not(.sized) {
        font-size: 1.5em;
      }
      &:not(.margin) {
        margin: 0 -0.1em;
      }
      vertical-align: bottom;
      display: inline-flex;
    }
  }
</style>
