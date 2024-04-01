// numeral formats numbers into a human readable format, rounding to the
// nearest 1000, 1000^2, 1000^3, etc.
export function numeral(n: number): string {
  if (n < 1000) {
    return n.toString()
  }

  const base = Math.floor(Math.log10(n) / 3)
  const suffix = ["k", "M", "B"][base - 1]
  const divisor = Math.pow(1000, base)
  const rounded = Math.round((n / divisor) * 10) / 10

  return `${rounded}${suffix}`
}
