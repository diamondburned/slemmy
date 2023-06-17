<script lang="ts">
  export let name: string;
  export let tooltip = "";
  export let large = false;
</script>

<span class="material-symbols-rounded" class:large title={tooltip}>{name}</span>

<style lang="scss">
  .material-symbols-rounded {
    cursor: default;
    user-select: none;
    font-size: 1.35em;

    &.large {
      font-size: 2.25em;
    }
  }
</style>
