import * as commonmark from "commonmark"

const parser = new commonmark.Parser({
  smart: true,
})

const renderer = new commonmark.HtmlRenderer({
  safe: true,
  esc: (s: string) => s, // manually escaped in markdown()
})

export function markdown(md: string): string {
  const parsed = parser.parse(md)
  walk(parsed, (node) => {
    switch (node.type) {
      case "text": {
        // Thanks, @stephenhay.
        // https://mathiasbynens.be/demo/url-regex
        node.literal = node.literal
          ? node.literal.replaceAll(
              /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/gi,
              "<a href='$&' target='_blank' rel='noopener noreferrer'>$&</a>",
            )
          : node.literal
        break
      }
      case "html_block":
      case "html_inline": {
        node.literal = escapeHTML(node.literal ?? "")
        break
      }
    }
  })

  return renderer
    .render(parsed)
    .replaceAll(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
}

function walk(node: commonmark.Node, f: (_: commonmark.Node) => void) {
  f(node)
  for (let child = node.firstChild; child; child = child.next) {
    walk(child, f)
  }
}

const escaperElem = document.createElement("textarea")
export function escapeHTML(html: string): string {
  escaperElem.textContent = html
  return escaperElem.innerHTML
}
