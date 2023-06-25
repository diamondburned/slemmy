import { toastStore } from "@skeletonlabs/skeleton"

export function errorToast(message: string, { autohide } = { autohide: true }) {
  toastStore.trigger({
    message,
    autohide,
    background: "variant-filled-error",
  })
}

export function successToast(
  message: string,
  { autohide } = { autohide: true },
) {
  toastStore.trigger({
    message,
    autohide,
    background: "variant-filled-success",
  })
}

export function infoToast(message: string, { autohide } = { autohide: true }) {
  toastStore.trigger({
    message,
    autohide,
    background: "variant-filled",
  })
}
