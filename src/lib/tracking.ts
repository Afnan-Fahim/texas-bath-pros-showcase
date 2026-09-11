import { useEffect } from "react";

/* Shared Meta Pixel / CAPI tracking + ad attribution.
   Extracted so /quiz can use it without importing the homepage. */
/* ---------------------------------------------------------------
 * TEMPORARY VERIFICATION LOGGING (safe to delete after QA)
 * Every log below is prefixed with [TBS Pixel] so you can filter the
 * browser console by "TBS Pixel" and confirm:
 *   1. Meta Pixel is initialized (fbq present on window)
 *   2. Lead fires ONLY on successful form completion (once per lead)
 *   3. Contact fires on tel: clicks
 * Remove this block + the pixelLog() calls to clean up.
 * --------------------------------------------------------------- */
const PIXEL_DEBUG = true;
function pixelLog(...args: unknown[]) {
  if (!PIXEL_DEBUG || typeof window === "undefined") return;
  // eslint-disable-next-line no-console
  console.log("[TBS Pixel]", ...args);
}

function getFbq() {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
}

/** TEMP: verifies the base pixel loaded and PageView fired on this page load. */
function usePixelInitCheck() {
  useEffect(() => {
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      if (getFbq()) {
        pixelLog("✅ Meta Pixel initialized — base code loaded, PageView fired on load.");
        window.clearInterval(id);
      } else if (tries > 10) {
        pixelLog(
          "❌ Meta Pixel NOT detected (window.fbq missing). Check the Pixel ID in the site head.",
        );
        window.clearInterval(id);
      }
    }, 500);
    return () => window.clearInterval(id);
  }, []);
}

/* -------- Conversions API (server-side mirror of the browser pixel) -------- */
export type LeadIdentity = { email?: string; phone?: string; name?: string };

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]!) : "";
}

function newEventId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Sends the same event server-side with the shared event_id so Meta de-duplicates. */
function sendServerEvent(
  eventName: "Lead" | "Schedule" | "Contact",
  eventId: string,
  identity: LeadIdentity = {},
  extra: { value?: number; contentName?: string; contentCategory?: string } = {},
) {
  if (typeof window === "undefined") return;
  const [firstName, ...rest] = (identity.name ?? "").trim().split(/\s+/);
  const payload = {
    eventName,
    eventId,
    eventSourceUrl: window.location.href,
    email: identity.email ?? "",
    phone: identity.phone ?? "",
    firstName: firstName ?? "",
    lastName: rest.join(" "),
    fbc: readCookie("_fbc"),
    fbp: readCookie("_fbp"),
    currency: "USD",
    ...(extra.value !== undefined ? { value: extra.value } : {}),
    contentName: extra.contentName ?? "",
    contentCategory: extra.contentCategory ?? "",
  };
  void fetch("/api/meta-capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  })
    .then(() => pixelLog("📡 CAPI server event sent:", eventName, eventId))
    .catch(() => {
      /* CAPI is best-effort; the browser pixel already fired */
    });
}


/**
 * Fires the Meta `Lead` event exactly once per genuine completed submission.
 * `dedupeKey` prevents duplicates from React re-mounts / StrictMode double effects.
 */
const firedLeadKeys = new Set<string>();
export function trackLeadEvent(dedupeKey = "default", identity: LeadIdentity = {}) {
  if (typeof window === "undefined") return;
  if (firedLeadKeys.has(dedupeKey)) {
    pixelLog("↩︎ Lead skipped (already fired for this submission):", dedupeKey);
    return;
  }
  firedLeadKeys.add(dedupeKey);
  const eventId = newEventId("lead");
  const w = getFbq();
  if (w) {
    w(
      "track",
      "Lead",
      {
        value: 150,
        currency: "USD",
        content_name: "Bathroom Estimate Request",
        content_category: "Estimate Form",
      },
      { eventID: eventId },
    );
    pixelLog("🎯 Lead fired — successful form completion only. key:", dedupeKey);
  } else {
    pixelLog("⚠️ Lead NOT sent — window.fbq unavailable. key:", dedupeKey);
  }
  sendServerEvent("Lead", eventId, identity, {
    value: 150,
    contentName: "Bathroom Estimate Request",
    contentCategory: "Estimate Form",
  });
}

function trackContactEvent() {
  if (typeof window === "undefined") return;
  const eventId = newEventId("contact");
  const w = getFbq();
  if (w) {
    w("track", "Contact", {}, { eventID: eventId });
    pixelLog("📞 Contact fired — tel: link clicked.");
  } else {
    pixelLog("⚠️ Contact NOT sent — window.fbq unavailable.");
  }
  sendServerEvent("Contact", eventId);
}

export function trackScheduleEvent(identity: LeadIdentity = {}) {
  if (typeof window === "undefined") return;
  const eventId = newEventId("schedule");
  const w = getFbq();
  if (w) {
    w(
      "track",
      "Schedule",
      { content_name: "Estimate Appointment" },
      { eventID: eventId },
    );
    pixelLog("🗓️ Schedule fired — Calendly booking confirmed.");
  }
  sendServerEvent("Schedule", eventId, identity, {
    contentName: "Estimate Appointment",
  });
}



/* ---------------- Ad attribution (UTM / fbclid) ---------------- */
const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

const ATTRIBUTION_STORAGE_KEY = "tbs_attribution";

/** Captures ad params on first landing so they survive in-page navigation. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const k of ATTRIBUTION_KEYS) {
      const v = params.get(k);
      if (v) found[k] = v;
    }
    if (Object.keys(found).length === 0) return;
    const stored = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    const merged = { ...(stored ? JSON.parse(stored) : {}), ...found };
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    /* storage unavailable — attribution is best-effort */
  }
}

export function getAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const stored = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    const out: Record<string, string> = stored ? JSON.parse(stored) : {};
    for (const k of ATTRIBUTION_KEYS) {
      const v = params.get(k);
      if (v) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function attributionNote(): string {
  const a = getAttribution();
  const entries = Object.entries(a);
  if (entries.length === 0) return "";
  return `\n\nAd attribution: ${entries.map(([k, v]) => `${k}=${v}`).join(", ")}`;
}
