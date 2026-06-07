// Directional "curtain" slide transition used for navigating between pages.
// The overlay is appended directly to <body> so it survives the client-side
// route change, then the destination page slides it back out.

const OVERLAY_ID = "page-slide-overlay";
const STYLE_ID = "page-slide-styles";
const DURATION = 520; // ms, keep in sync with the CSS transition below

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ensureSlideStyles() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes pageSlideTitleIn {
      from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
      to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
    }
    @keyframes pageSlideGlowPulse {
      0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
      50%      { opacity: 0.85; transform: translate(-50%, -50%) scale(1.08); }
    }
  `;
  document.head.appendChild(style);
}

function buildAccentLine(): HTMLDivElement {
  const line = document.createElement("div");
  line.style.cssText = [
    "width:3.5rem",
    "height:2px",
    "border-radius:9999px",
    "background:linear-gradient(90deg,transparent,rgba(133,189,255,0.95),transparent)",
    "box-shadow:0 0 18px rgba(43,127,255,0.55)",
  ].join(";");
  return line;
}

function buildOverlay(label?: string): HTMLDivElement {
  ensureSlideStyles();

  const el = document.createElement("div");
  el.id = OVERLAY_ID;
  el.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:99999",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "overflow:hidden",
    "background:linear-gradient(135deg,#020B18 0%,#0a1a33 55%,#13294d 100%)",
    "will-change:transform",
    `transition:transform ${DURATION}ms cubic-bezier(0.76,0,0.24,1)`,
  ].join(";");

  const glow = document.createElement("div");
  glow.style.cssText = [
    "position:absolute",
    "top:50%",
    "left:50%",
    "transform:translate(-50%,-50%)",
    "width:480px",
    "height:480px",
    "border-radius:9999px",
    "background:radial-gradient(circle,rgba(91,164,255,0.28),transparent 70%)",
    "filter:blur(48px)",
    "pointer-events:none",
    label ? "animation:pageSlideGlowPulse 2.4s ease-in-out infinite" : "",
  ].join(";");
  el.appendChild(glow);

  if (label) {
    const wrap = document.createElement("div");
    wrap.style.cssText = [
      "position:relative",
      "z-index:2",
      "display:flex",
      "flex-direction:column",
      "align-items:center",
      "gap:1.1rem",
      "text-align:center",
      "padding:1.5rem",
      "opacity:0",
      "animation:pageSlideTitleIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s forwards",
    ].join(";");

    wrap.appendChild(buildAccentLine());

    const title = document.createElement("p");
    title.textContent = label;
    title.setAttribute("aria-hidden", "true");
    title.style.cssText = [
      "margin:0",
      "font-family:var(--font-cairo,'Cairo',system-ui,sans-serif)",
      "font-size:clamp(2.75rem,9vw,4.75rem)",
      "font-weight:900",
      "letter-spacing:0.03em",
      "line-height:1.2",
      "color:#ffffff",
      "text-shadow:0 0 42px rgba(133,189,255,0.5),0 4px 28px rgba(0,0,0,0.4)",
    ].join(";");

    wrap.appendChild(title);
    wrap.appendChild(buildAccentLine());
    el.appendChild(wrap);
  }

  return el;
}

/**
 * Slide an overlay in from the inline-start side (right in RTL, left in LTR),
 * then run `onCovered` once the screen is fully covered (use it to navigate).
 */
export function startSlideTransition(
  isRtl: boolean,
  onCovered: () => void,
  label?: string
) {
  if (typeof window === "undefined" || prefersReduced()) {
    onCovered();
    return;
  }

  try {
    sessionStorage.setItem("pageSlideDir", isRtl ? "rtl" : "ltr");
  } catch {}

  const existing = document.getElementById(OVERLAY_ID);
  if (existing) existing.remove();

  const overlay = buildOverlay(label);
  overlay.style.transform = `translateX(${isRtl ? "100%" : "-100%"})`;
  document.body.appendChild(overlay);

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
    overlay.style.transform = `translateX(${isRtl ? "-100%" : "100%"})`;
  });

  window.setTimeout(() => overlay.remove(), DURATION + 60);
}
