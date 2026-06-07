// Directional "curtain" slide transition used for navigating between pages.
// The overlay is appended directly to <body> so it survives the client-side
// route change, then the destination page slides it back out.

const OVERLAY_ID = "page-slide-overlay";
const DURATION = 520; // ms, keep in sync with the CSS transition below

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function buildOverlay(): HTMLDivElement {
  const el = document.createElement("div");
  el.id = OVERLAY_ID;
  el.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:99999",
    "background:linear-gradient(135deg,#020B18 0%,#0a1a33 55%,#13294d 100%)",
    "will-change:transform",
    `transition:transform ${DURATION}ms cubic-bezier(0.76,0,0.24,1)`,
  ].join(";");

  // Brand glow accent so the curtain feels premium, not flat.
  const glow = document.createElement("div");
  glow.style.cssText = [
    "position:absolute",
    "top:50%",
    "left:50%",
    "transform:translate(-50%,-50%)",
    "width:420px",
    "height:420px",
    "border-radius:9999px",
    "background:radial-gradient(circle,rgba(91,164,255,0.25),transparent 70%)",
    "filter:blur(40px)",
  ].join(";");
  el.appendChild(glow);

  return el;
}

/**
 * Slide an overlay in from the inline-start side (right in RTL, left in LTR),
 * then run `onCovered` once the screen is fully covered (use it to navigate).
 */
export function startSlideTransition(isRtl: boolean, onCovered: () => void) {
  if (typeof window === "undefined" || prefersReduced()) {
    onCovered();
    return;
  }

  // Remember the entry direction so the destination page exits consistently.
  try {
    sessionStorage.setItem("pageSlideDir", isRtl ? "rtl" : "ltr");
  } catch {}

  const existing = document.getElementById(OVERLAY_ID);
  if (existing) existing.remove();

  const overlay = buildOverlay();
  // Start off-screen on the inline-start side.
  overlay.style.transform = `translateX(${isRtl ? "100%" : "-100%"})`;
  document.body.appendChild(overlay);

  // Force reflow so the initial transform is committed before animating.
  void overlay.offsetWidth;

  requestAnimationFrame(() => {
    overlay.style.transform = "translateX(0)";
  });

  window.setTimeout(onCovered, DURATION);
}

/**
 * Slide the overlay (if any) out toward the inline-end side, revealing the
 * freshly mounted destination page. Safe to call when no overlay exists.
 */
export function endSlideTransition() {
  if (typeof window === "undefined") return;

  const overlay = document.getElementById(OVERLAY_ID) as HTMLDivElement | null;
  if (!overlay) return;

  let isRtl = false;
  try {
    isRtl = sessionStorage.getItem("pageSlideDir") === "rtl";
  } catch {}

  requestAnimationFrame(() => {
    // Exit toward the inline-end side (opposite of where it entered).
    overlay.style.transform = `translateX(${isRtl ? "-100%" : "100%"})`;
  });

  window.setTimeout(() => overlay.remove(), DURATION + 60);
}
