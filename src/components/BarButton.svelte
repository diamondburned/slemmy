<script lang="ts">
  import { createEventDispatcher } from "svelte"

  import Symbol from "#/components/Symbol.svelte"

  export let label: string = ""
  export let icon: string = ""
  export let tooltip = ""
  export let active: bool | null = null

  const dispatch = createEventDispatcher<{
    click: void
  }>()
</script>

<button
  type="button"
  class:btn={label != ""}
  class:btn-icon={label == "" && icon != ""}
  class="btn-sm btn-icon-sm hover:bg-surface-100-800-token"
  title={tooltip}
  class:!variant-filled={active}
  class:!variant-outlined={!active}
  on:click={() => {
    dispatch("click")
    if (active != null) {
      active = !active
    }
  }}
>
  <slot name="icon">
    <Symbol name={icon} />
  </slot>
  <slot name="label">
    {label}
  </slot>
</button>
