<script lang="ts">
  export let name: string
  export let size = ""
  export let tooltip = ""
  export let large = false
  export let inline = false

  let className = ""
  export { className as class }
</script>

<span
  class="
    material-symbols-rounded symbol
    {className} {size ? `text-${size}` : ''}
  "
  class:large
  class:sized={!!size}
  class:inline
  title={tooltip || undefined}
>
  {name}
</span>

<style lang="scss">
  .material-symbols-rounded {
    cursor: inherit;
    user-select: none;

    &:not(.sized) {
      font-size: 1.35em;
    }

    &.large {
      font-size: 2.25em;
    }

    &.inline {
      &:not(.sized) {
        font-size: 1.5em;
      }
      margin: 0 -0.1em;
      vertical-align: bottom;
      display: inline-flex;
    }
  }
</style>
