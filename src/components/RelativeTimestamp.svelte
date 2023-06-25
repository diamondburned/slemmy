<script lang="ts">
  import { relative, absolute } from "#/lib/time.js"

  import Symbol from "#/components/Symbol.svelte"

  let className = ""
  export { className as class }

  export let date: Date | number | string
  export let icon = true
  export let style: "long" | "short" = "short"

  let date_: Date
  const tzlessRegex = /^\d+-\d+-\d+T\d+:\d+:\d+(?:\.\d+)?$/
  $: {
    switch (typeof date) {
      case "number":
        date_ = new Date(date)
        break
      case "string":
        date_ = new Date(
          Date.parse(
            // Deal with Lemmy being stupid.
            tzlessRegex.test(date) ? `${date}Z` : date,
          ),
        )
        break
      default:
        date_ = date
    }
  }
</script>

<time datetime={date_.toISOString()} title={absolute(date_)} class={className}>
  {#if icon}
    <slot name="icon">
      <Symbol name="schedule" />
    </slot>
  {/if}
  {relative(date_, style)}
</time>
