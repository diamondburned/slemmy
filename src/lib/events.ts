// JS is dogshit.

export type ScrollDeltaEvent = CustomEvent<{
  x: number
  y: number
  last: { x: number; y: number }[]
}>

export function scrollDelta(node: HTMLElement) {
  let lastScrollTop = 0
  let lastScrollLeft = 0
  let lastDeltas = new Array(10).fill({ x: 0, y: 0 })

  const handleScroll = () => {
    const { scrollTop, scrollLeft } = node
    const delta = {
      x: scrollLeft - lastScrollLeft,
      y: scrollTop - lastScrollTop,
    }

    lastDeltas = [...lastDeltas.slice(1), delta]
    lastScrollTop = scrollTop
    lastScrollLeft = scrollLeft

    node.dispatchEvent(
      new CustomEvent("scrolldelta", {
        detail: {
          ...delta,
          last: lastDeltas,
        },
      }),
    )
  }

  node.addEventListener("scroll", handleScroll)
  return {
    destroy() {
      node.removeEventListener("scroll", handleScroll)
    },
  }
}
