const TOAST_EVENT = "app-toast";

export function showToast(message, type = "success") {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, type } }));
}

export const TOAST_EVENT_NAME = TOAST_EVENT;