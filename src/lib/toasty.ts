import type { ToastStore } from "@skeletonlabs/skeleton"

let toastStoreInstance: ToastStore | null = null

export function setToastStore(store: ToastStore) {
  toastStoreInstance = store
}

export function errorToast(message: string, { autohide } = { autohide: true }) {
  toastStoreInstance?.trigger({
    message,
    autohide,
    background: "variant-filled-error",
  })
}

export function successToast(
  message: string,
  { autohide } = { autohide: true },
) {
  toastStoreInstance?.trigger({
    message,
    autohide,
    background: "variant-filled-success",
  })
}

export function infoToast(message: string, { autohide } = { autohide: true }) {
  toastStoreInstance?.trigger({
    message,
    autohide,
    background: "variant-filled",
  })
}
