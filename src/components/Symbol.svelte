<script lang="ts">
  let {
    name,
    size = undefined,
    tooltip = "",
    hidden = false,
    large = false,
    inline = false,
    margin = "",
    style = "",
    class: className = "",
    ...attrs
  }: {
    name: string
    size?: string
    tooltip?: string
    hidden?: boolean
    large?: boolean
    inline?: boolean
    margin?: string
    style?: string
    class?: string
    [key: string]: any
  } = $props()
</script>

<span
  class="
    material-symbols-rounded symbol
    {className} {margin} {size != undefined ? `text-${size}` : ''}
  "
  class:hidden
  class:large
  class:sized={size != undefined}
  class:margin={!!margin}
  class:inline
  title={tooltip || undefined}
  {style}
  {...attrs}
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
