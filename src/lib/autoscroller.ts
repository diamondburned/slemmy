export type AutoScrollerOpts = {
  threshold?: number // default: 200
  // restoreKey, if set, means the scroll position will be restored from
  // localStorage.
  restoreKey?: string
}

export class AutoScroller<T> {
  items: T[] = []
  offset = 0
  loading: Promise<void> = Promise.resolve()

  constructor(
    readonly scrollContainer: HTMLElement,
    readonly fetch: (all: T[], offset: number) => Promise<T[]>,
    readonly opts: AutoScrollerOpts,
  ) {}
}
