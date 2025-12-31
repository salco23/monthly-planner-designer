import type { PlannerSettings } from "@/lib/settings";

function base64UrlEncode(str: string) {
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(str: string) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  const decoded = decodeURIComponent(escape(atob(b64)));
  return decoded;
}

export function encodeSettings(settings: PlannerSettings) {
  return base64UrlEncode(JSON.stringify(settings));
}

export function decodeSettings(encoded: string): PlannerSettings | null {
  try {
    const json = base64UrlDecode(encoded);
    return JSON.parse(json) as PlannerSettings;
  } catch {
    return null;
  }
}
