import * as store from "svelte/store";

type writableClass<T> = ReturnType<typeof store.writable<T>>;

export function writable<T>(
  key: string,
  def?: T,
  start?: store.StartStopNotifier<T>
): store.Writable<T> {
  const v = localStorage.getItem(key);
  if (v) {
    try {
      def = JSON.parse(v);
    } catch (err) {
      console.log(`cannot restore ${key} from localStorage, will use default`);
    }
  }

  const w = store.writable<T>(
    def,
    start
      ? (set) =>
          start((v) => {
            set(v);
            localStorage.setItem(key, JSON.stringify(v));
          })
      : undefined
  );

  return {
    subscribe: w.subscribe,
    set(v) {
      w.set(v);
      localStorage.setItem(key, JSON.stringify(v));
    },
    update(fn) {
      w.update((v) => {
        v = fn(v);
        localStorage.setItem(key, JSON.stringify(v));
        return v;
      });
    },
  };
}

// Workaround for Svelte not exporting this shit. How do they expect us to just
// implement the interface bro if we can't refer to the types?
type Stores = Parameters<typeof store.derived>[0];
type StoresValues<S extends Stores, T> = Parameters<
  Parameters<typeof store.derived<S, T>>[1]
>[0];

export function derived<S extends Stores, T>(
  stores: S,
  key: string,
  def: T,
  start: (
    values: StoresValues<S, T>,
    set: (value: T) => void
  ) => store.Unsubscriber | void
) {
  const v = localStorage.getItem(key);
  if (v) {
    try {
      def = JSON.parse(v);
    } catch (err) {
      console.log(`cannot restore ${key} from localStorage, will use default`);
    }
  }

  return store.derived<S, T>(stores, (values, set) => {
    return start(values, (value) => {
      set(value);
      localStorage.setItem(key, JSON.stringify(v));
    });
  });
}
