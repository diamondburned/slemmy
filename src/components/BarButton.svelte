<script lang="ts">
  import { createEventDispatcher } from "svelte"

  import Symbol from "#/components/Symbol.svelte"

  export let label: string | undefined = undefined
  export let icon: string | undefined = undefined
  export let tooltip = ""
  export let active: boolean | null = null
  export let href: string | undefined = undefined
  $: tag = href ? "a" : "button"

  let className = ""
  export { className as class }

  const dispatch = createEventDispatcher<{
    click: void
  }>()
</script>

<!-- Fucking Svelte and TypeScript, man. -->
<svelte:element
  this={tag}
  class:btn={label != undefined}
  class:btn-icon={label == undefined && icon != undefined}
  class="{className} btn btn-sm btn-icon-sm hover:bg-surface-100-800-token"
  title={tooltip}
  class:!variant-filled={active}
  class:!variant-outlined={!active}
  on:click={() => {
    dispatch("click")
    if (active != null) {
      active = !active
    }
  }}
  target={tag == "a" ? "_blank" : undefined}
  role={tag == "a" ? "button" : undefined}
  type={tag == "button" ? "button" : undefined}
  {href}
>
  <slot name="icon">
    {#if icon}
      <Symbol name={icon} />
    {/if}
  </slot>
  <slot name="label">
    {label || ""}
  </slot>
</svelte:element>
