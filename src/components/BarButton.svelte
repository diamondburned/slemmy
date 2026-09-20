<script lang="ts">
  import type { Snippet } from "svelte"
  import Symbol from "#/components/Symbol.svelte"

  let {
    label = undefined,
    icon = undefined,
    tooltip = "",
    active = $bindable(null),
    href = undefined,
    disabled = false,
    class: className = "",
    onclick,
    iconSnippet,
    labelSnippet,
  }: {
    label?: string
    icon?: string
    tooltip?: string
    active?: boolean | null
    href?: string
    disabled?: boolean
    class?: string
    onclick?: () => void
    iconSnippet?: Snippet
    labelSnippet?: Snippet
  } = $props()

  let tag = $derived(href ? "a" : "button")

  function handleClick() {
    onclick?.()
    if (active != null) {
      active = !active
    }
  }
</script>

{#if tag === "a"}
  <a
    {href}
    class:btn={label != undefined}
    class:btn-icon={label == undefined && icon != undefined}
    class="{className} btn btn-sm btn-icon-sm hover:bg-surface-100-800-token"
    title={tooltip}
    class:!variant-filled={active}
    class:!variant-outlined={!active}
    onclick={handleClick}
    target="_blank"
    role="button"
  >
    {#if iconSnippet}
      {@render iconSnippet()}
    {:else if icon}
      <Symbol name={icon} />
    {/if}
    {#if labelSnippet}
      {@render labelSnippet()}
    {:else}
      {label || ""}
    {/if}
  </a>
{:else}
  <button
    type="button"
    {disabled}
    class:btn={label != undefined}
    class:btn-icon={label == undefined && icon != undefined}
    class="{className} btn btn-sm btn-icon-sm hover:bg-surface-100-800-token"
    title={tooltip}
    class:!variant-filled={active}
    class:!variant-outlined={!active}
    onclick={handleClick}
  >
    {#if iconSnippet}
      {@render iconSnippet()}
    {:else if icon}
      <Symbol name={icon} />
    {/if}
    {#if labelSnippet}
      {@render labelSnippet()}
    {:else}
      {label || ""}
    {/if}
  </button>
{/if}
