import { useAuthStore } from '../store/authStore';

function isEditableElement(el: HTMLElement | null): el is HTMLElement {
  if (!el) return false;
  return (
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'SELECT' ||
    el.isContentEditable
  );
}

/**
 * Manual recovery when inputs feel frozen (Electron drag region, stuck loading, etc.).
 * Resets known stuck store flags and re-focuses the active or first visible field.
 */
export function recoverInputs(focusSelector?: string): void {
  const auth = useAuthStore.getState();
  if (auth.isLoading) {
    auth.resetStuckState();
  }

  document.body.style.pointerEvents = '';
  document.documentElement.style.pointerEvents = '';

  const active = document.activeElement as HTMLElement | null;
  const remembered =
    isEditableElement(active) ? active : null;

  if (remembered) {
    remembered.blur();
  }

  window.setTimeout(() => {
    let target: HTMLElement | null = null;

    if (focusSelector) {
      target = document.querySelector<HTMLElement>(focusSelector);
    } else if (remembered && document.contains(remembered)) {
      target = remembered;
    } else {
      target = document.querySelector<HTMLElement>(
        'input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'
      );
    }

    if (!target) return;

    target.focus({ preventScroll: true });

    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      const len = target.value.length;
      try {
        target.setSelectionRange(len, len);
      } catch {
        // Some input types (e.g. number) do not support selection ranges.
      }
    }
  }, 60);
}
