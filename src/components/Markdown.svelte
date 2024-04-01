<script lang="ts" context="module">
  import * as commonmark from "commonmark"

  const parser = new commonmark.Parser({
    smart: true,
  })

  const renderer = new commonmark.HtmlRenderer({
    safe: true,
    smart: true,
  })

  export function markdownToHTML(md: string): string {
    const parsed = parser.parse(md)
    walk(parsed, (node) => {
      switch (node.type) {
        case "text": {
          // Thanks, @stephenhay.
          // https://mathiasbynens.be/demo/url-regex
          node.literal = node.literal
            ? node.literal.replaceAll(
                /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/gi,
                "[$&]($&)",
              )
            : node.literal
          break
        }
      }
    })

    return renderer
      .render(parsed)
      .replaceAll(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
      .replaceAll(/<img /g, '<img loading="lazy" alt="Post image" ')
  }

  function walk(node: commonmark.Node, f: (_: commonmark.Node) => void) {
    f(node)
    for (let child = node.firstChild; child; child = child.next) {
      walk(child, f)
    }
  }
</script>

<script lang="ts">
  export let markdown: string
  export let style: string = ""
  export let inline = false

  let className = ""
  export { className as class }
</script>

<!--
  Tailwind is fucking dogshit. The styles for this element are at
  src/styles/markdown.postcss for that reason.
-->
<div class="markdown prose prose-nopad {className}" class:inline {style}>
  {@html markdownToHTML(markdown)}
</div>
