<script lang="ts">
  import type { Snippet } from "svelte"
  import { relative, absolute } from "#/lib/time.js"
  import Symbol from "#/components/Symbol.svelte"

  let {
    class: className = "",
    date,
    icon = true,
    style = "short",
    iconSnippet,
  }: {
    class?: string
    date: Date | number | string
    icon?: boolean
    style?: "long" | "short"
    iconSnippet?: Snippet
  } = $props()

  const tzlessRegex = /^\d+-\d+-\d+T\d+:\d+:\d+(?:\.\d+)?$/

  let date_ = $derived.by(() => {
    switch (typeof date) {
      case "number":
        return new Date(date)
      case "string":
        return new Date(
          Date.parse(
            // Deal with Lemmy being stupid.
            tzlessRegex.test(date) ? `${date}Z` : date,
          ),
        )
      default:
        return date
    }
  })
</script>

<time datetime={date_.toISOString()} title={absolute(date_)} class={className}>
  {#if icon}
    {#if iconSnippet}
      {@render iconSnippet()}
    {:else}
      <Symbol name="schedule" />
    {/if}
  {/if}
  {relative(date_, style)}
</time>
