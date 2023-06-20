const relativeTimes = {
  short: new Intl.RelativeTimeFormat(undefined, {
    style: "short",
    numeric: "auto",
  }),
  long: new Intl.RelativeTimeFormat(undefined, {
    style: "long",
    numeric: "auto",
  }),
}

export const Duration = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
}

export function relative(
  date: Date,
  style: "short" | "long" = "long",
  now = Date.now(),
): string {
  const formatter = relativeTimes[style]

  let delta = date.getTime() - now
  let unit: string
  if (Math.abs(delta) < Duration.minute) {
    delta = Math.round(delta / Duration.second)
    unit = "second"
  } else if (Math.abs(delta) < Duration.hour) {
    delta = Math.round(delta / Duration.minute)
    unit = "minute"
  } else if (Math.abs(delta) < Duration.day) {
    delta = Math.round(delta / Duration.hour)
    unit = "hour"
  } else {
    delta = Math.round(delta / Duration.day)
    unit = "day"
  }

  return formatter.format(delta, unit as any)
}

export function absolute(date: Date): string {
  return date.toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "long",
  })
}
