"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Mascot } from "@/components/mascot/Mascot";
import { Turnstile } from "./Turnstile";
import { siteConfig, isDev } from "@/data/site-config";
import {
  areaRanges,
  budgetRanges,
  fieldLabels,
  projectTypes,
  validateEnquiry,
  validateField,
  type Enquiry,
  type EnquiryField,
} from "@/lib/validation";

const empty: Enquiry = { name: "", company: "", phone: "", email: "", projectType: "", location: "", area: "", budget: "", message: "" };
const required: EnquiryField[] = ["name", "phone", "email", "projectType", "location", "message"];

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };
/** Shape returned by public/api/contact.php */
type ServerReply = { ok?: boolean; error?: string; fields?: Partial<Record<EnquiryField, string>> };

const turnstileSiteKey = siteConfig.integrations.turnstileSiteKey;

const inputCls =
  "mt-1.5 block w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink shadow-sm transition-colors " +
  "placeholder:text-ink-muted/70 hover:border-ink-muted/40 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25 " +
  "aria-[invalid=true]:border-orange-deep aria-[invalid=true]:ring-orange-deep/20";

export function ContactForm() {
  const [values, setValues] = useState<Enquiry>(empty);
  const [errors, setErrors] = useState<Partial<Record<EnquiryField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<EnquiryField, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [turnstileReset, setTurnstileReset] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);

  // Pre-fill from links such as /contact/?type=retail (service pages, project pages, workspace builder).
  // The URL is only readable after hydration, so this syncs from it once on mount.
  useEffect(() => {
    startedAt.current = Date.now();
    const applyPrefill = (params: URLSearchParams) => {
      const prefill: Partial<Enquiry> = {};
      const type = params.get("type");
      if (type && projectTypes.some((t) => t.value === type)) prefill.projectType = type;
      const area = params.get("area");
      if (area && areaRanges.includes(area)) prefill.area = area;
      const note = params.get("note");
      if (note) prefill.message = note.slice(0, 500);
      if (Object.keys(prefill).length) setValues((v) => ({ ...v, ...prefill }));
    };
    applyPrefill(new URLSearchParams(window.location.search));
  }, []);

  const set = (field: EnquiryField, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    // Re-validate as the user fixes a field they've already been told about
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validateField(field, value) ?? undefined }));
  };

  const blur = (field: EnquiryField) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field]) ?? undefined }));
  };

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateEnquiry(values);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(fieldLabels).map((k) => [k, true])));
    if (Object.keys(found).length) {
      setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }

    setStatus({ kind: "sending" });
    const body = new FormData(e.currentTarget);
    body.set("elapsed_ms", String(Date.now() - startedAt.current));

    try {
      if (isDev) {
        // The PHP endpoint only exists on the server; simulate it locally.
        await new Promise((r) => setTimeout(r, 900));
        console.info("[dev] Enquiry would be sent:", Object.fromEntries(body));
      } else {
        const res = await fetch(siteConfig.integrations.contactEndpoint, {
          method: "POST",
          body,
          headers: { Accept: "application/json" },
        });
        const json = (await res.json().catch(() => null)) as ServerReply | null;
        if (json?.fields && Object.keys(json.fields).length) {
          // Server-side validation disagreed with the browser: show its messages on the fields.
          setErrors(json.fields);
          setTimeout(() => summaryRef.current?.focus(), 0);
        }
        if (!res.ok || !json?.ok) throw new Error(json?.error || "We couldn't send your enquiry just now.");
      }
      setStatus({ kind: "sent" });
      setValues(empty);
      setTimeout(() => successRef.current?.focus(), 0);
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
      setTurnstileReset((n) => n + 1);
    }
  }

  if (status.kind === "sent") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="rounded-[var(--radius-panel)] bg-white p-8 text-center shadow-[var(--shadow-card)] sm:p-12">
        <Mascot pose="celebrate" animated className="mx-auto h-48 w-auto" />
        <h2 className="mt-6 font-display text-3xl font-bold text-teal">Thank you — we&apos;ve got your enquiry!</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-muted">
          Our team will review your project details and get back to you, usually within one working day.
          {isDev && " (Development mode: nothing was actually sent.)"}
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-6 font-semibold text-orange-deep underline-offset-4 hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const errorList = (Object.keys(errors) as EnquiryField[]).filter((k) => errors[k]);
  const describedBy = (f: EnquiryField) => (errors[f] ? `${f}-error` : undefined);
  const field = (f: EnquiryField) => ({
    id: f,
    name: f,
    value: values[f],
    onBlur: () => blur(f),
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": describedBy(f),
    "aria-required": required.includes(f) || undefined,
  });

  return (
    <form noValidate onSubmit={submit} className="rounded-[var(--radius-panel)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-10">
      <h2 className="font-display text-2xl font-bold text-teal">Tell us about your project</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Fields marked <span className="text-orange-deep">*</span> are required. It takes about two minutes.
      </p>

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-6 rounded-xl border border-orange-deep/40 bg-orange/10 p-4">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <AlertCircle className="size-5 text-orange-deep" aria-hidden="true" />
            Please check {errorList.length === 1 ? "this field" : `these ${errorList.length} fields`}:
          </p>
          <ul className="mt-2 ml-7 list-disc space-y-1 text-sm">
            {errorList.map((f) => (
              <li key={f}>
                <a href={`#${f}`} className="text-orange-deeper underline underline-offset-2">
                  {fieldLabels[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field f="name" label={fieldLabels.name} required error={errors.name}>
          <input {...field("name")} type="text" autoComplete="name" onChange={(e) => set("name", e.target.value)} className={inputCls} />
        </Field>
        <Field f="company" label={fieldLabels.company} error={errors.company}>
          <input {...field("company")} type="text" autoComplete="organization" onChange={(e) => set("company", e.target.value)} className={inputCls} />
        </Field>
        <Field f="phone" label={fieldLabels.phone} required error={errors.phone}>
          <input {...field("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98300 12345" onChange={(e) => set("phone", e.target.value)} className={inputCls} />
        </Field>
        <Field f="email" label={fieldLabels.email} required error={errors.email}>
          <input {...field("email")} type="email" inputMode="email" autoComplete="email" placeholder="name@company.com" onChange={(e) => set("email", e.target.value)} className={inputCls} />
        </Field>
        <Field f="projectType" label={fieldLabels.projectType} required error={errors.projectType}>
          <select {...field("projectType")} onChange={(e) => set("projectType", e.target.value)} className={inputCls}>
            <option value="">Choose one…</option>
            {projectTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field f="location" label={fieldLabels.location} required error={errors.location}>
          <input {...field("location")} type="text" autoComplete="address-level2" placeholder="e.g. Salt Lake Sector V" onChange={(e) => set("location", e.target.value)} className={inputCls} />
        </Field>
        <Field f="area" label={fieldLabels.area} error={errors.area}>
          <select {...field("area")} onChange={(e) => set("area", e.target.value)} className={inputCls}>
            <option value="">Select a range…</option>
            {areaRanges.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </Field>
        <Field f="budget" label={fieldLabels.budget} error={errors.budget}>
          <select {...field("budget")} onChange={(e) => set("budget", e.target.value)} className={inputCls}>
            <option value="">Select a range…</option>
            {budgetRanges.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field f="message" label={fieldLabels.message} required error={errors.message} hint="What kind of space is it, what needs to change, and when would you like to start?">
            <textarea {...field("message")} rows={5} maxLength={2000} onChange={(e) => set("message", e.target.value)} className={`${inputCls} resize-y`} />
          </Field>
        </div>
      </div>

      {/* Spam trap: invisible to people, tempting to bots. The server rejects any submission that fills it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {turnstileSiteKey && <Turnstile siteKey={turnstileSiteKey} resetKey={turnstileReset} />}

      {status.kind === "error" && (
        <div role="alert" className="mt-6 rounded-xl border border-orange-deep/40 bg-orange/10 p-4 text-sm">
          <p className="font-semibold text-ink">{status.message}</p>
          <p className="mt-1 text-ink-muted">
            Please try again in a moment
            {siteConfig.contact.phone || siteConfig.contact.email ? ", or contact us directly using the details on this page." : "."}
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-orange-deep px-7 py-3 font-display text-lg font-semibold text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-orange-deeper disabled:cursor-wait disabled:opacity-80"
        >
          {status.kind === "sending" ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Send Enquiry <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </>
          )}
        </button>
        <p className="max-w-xs text-xs text-ink-muted">
          We use your details only to respond to this enquiry. We never share them with third parties.
        </p>
      </div>
    </form>
  );
}

function Field({
  f,
  label,
  required,
  error,
  hint,
  children,
}: {
  f: EnquiryField;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={f} className="block text-sm font-semibold text-ink">
        {label}
        {required && (
          <span className="text-orange-deep" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {hint && <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>}
      {children}
      {error && (
        <p id={`${f}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm text-orange-deep">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
