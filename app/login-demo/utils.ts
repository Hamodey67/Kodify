import type { DemoScenario } from "./data/demo";

export type UrlHighlight = { text: string; suspicious?: boolean };

export function parseUrlDisplay(url: string): {
  isSecure: boolean;
  protocol: string;
  hostParts: UrlHighlight[];
  path: string;
} {
  const isSecure = url.startsWith("https://");
  const protocol = isSecure ? "https://" : "http://";
  const rest = url.slice(protocol.length);
  const slash = rest.indexOf("/");
  const host = slash === -1 ? rest : rest.slice(0, slash);
  const path = slash === -1 ? "" : rest.slice(slash);

  return {
    isSecure,
    protocol,
    hostParts: buildHostHighlights(host),
    path,
  };
}

function buildHostHighlights(host: string): UrlHighlight[] {
  const markers = new Set<number>();

  for (let i = 0; i < host.length - 4; i++) {
    const slice = host.slice(i, i + 6).toLowerCase();
    if (slice.startsWith("paypa") && host[i + 5] === "I") {
      markers.add(i + 5);
    }
  }

  if (/bit\.ly/i.test(host)) {
    for (let i = 0; i < host.length; i++) markers.add(i);
  }

  if (/security\.support|support-login|wa-support/i.test(host)) {
    const match = host.match(/security\.support|support-login|wa-support/i);
    if (match?.index != null) {
      for (let i = match.index; i < match.index + match[0].length; i++) markers.add(i);
    }
  }

  if (host.includes("-security-check") || host.includes("com-security")) {
    const match = host.match(/-security-check|com-security/);
    if (match?.index != null) {
      for (let i = match.index; i < match.index + match[0].length; i++) markers.add(i);
    }
  }

  const parts: UrlHighlight[] = [];
  let buffer = "";
  let bufferSuspicious = false;

  for (let i = 0; i < host.length; i++) {
    const suspicious = markers.has(i);
    if (buffer && suspicious !== bufferSuspicious) {
      parts.push({ text: buffer, suspicious: bufferSuspicious });
      buffer = "";
    }
    buffer += host[i];
    bufferSuspicious = suspicious;
  }

  if (buffer) parts.push({ text: buffer, suspicious: bufferSuspicious });
  if (!parts.length) parts.push({ text: host });

  return parts;
}

export function getActiveCluesForScenario(scenario: DemoScenario): Set<string> {
  const active = new Set<string>();
  const url = scenario.shownUrl.toLowerCase();

  if (!scenario.shownUrl.startsWith("https://")) active.add("http");
  if (scenario.isPhishing) {
    active.add("domain");
    active.add("branding");
  }
  if (scenario.kind === "whatsapp" && scenario.isPhishing) {
    active.add("pressure");
    active.add("cta");
  }
  if (url.includes("bit.ly") || url.includes("redirect=")) active.add("cta");
  if (scenario.kind === "login" && scenario.isPhishing) active.add("cta");

  return active;
}
