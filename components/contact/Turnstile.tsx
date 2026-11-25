"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile widget (explicit rendering). The widget adds a hidden
 * `cf-turnstile-response` input to the surrounding form, which the PHP endpoint verifies.
 * Only rendered when `integrations.turnstileSiteKey` is set.
 */

type TurnstileApi = {
  render: (el: HTMLElement, opts: { sitekey: string; theme?: string; size?: string }) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile() {
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile unavailable")));
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/** `resetKey` — change it to get a fresh token (tokens are single-use, so reset after a failed send). */
export function Turnstile({ siteKey, resetKey }: { siteKey: string; resetKey: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !ref.current) return;
        widgetId.current = api.render(ref.current, { sitekey: siteKey, theme: "light", size: "flexible" });
      })
      .catch(() => {
        /* The server rejects the submission and the form shows its error message. */
      });
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetKey > 0 && widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  }, [resetKey]);

  return <div ref={ref} className="mt-6 min-h-[65px]" />;
}
