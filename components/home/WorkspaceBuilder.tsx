"use client";

import { useRef, useState, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building, BuildingComplex, Check, Coffee, Info, RotateCcw, Store, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Mascot, type MascotPose } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects, type DesignStyle, type ProjectCategory } from "@/data/projects";
import { areaRanges } from "@/lib/validation";

/**
 * "Build Your Workspace" — three quick choices (space → size → style) that end in matching
 * example spaces and a consultation link with the answers pre-filled on the contact form.
 */

const spaces: { id: ProjectCategory; label: string; hint: string; Icon: LucideIcon; service: string }[] = [
  { id: "office", label: "Office", hint: "Workstations, cabins, meeting rooms", Icon: Building, service: "/services/#office-interiors" },
  { id: "retail", label: "Retail or showroom", hint: "Shops, display spaces, brand stores", Icon: Store, service: "/services/#retail-shop-interiors" },
  { id: "restaurant", label: "Café or restaurant", hint: "Dining, counters, lounges", Icon: Coffee, service: "/services/#cafe-restaurant-interiors" },
  { id: "commercial", label: "Other commercial", hint: "Receptions, lobbies, renovations", Icon: BuildingComplex, service: "/services/#commercial-renovation" },
];

const styles: { id: DesignStyle; label: string; hint: string; swatch: [string, string, string] }[] = [
  { id: "minimal", label: "Modern & minimal", hint: "Clean lines, light palette, hidden storage", swatch: ["#F5F5F4", "#D6D3D1", "#1F2937"] },
  { id: "warm", label: "Warm & natural", hint: "Timber, soft fabrics, warm lighting", swatch: ["#B07A4A", "#E7D8C3", "#5B6B4E"] },
  { id: "bold", label: "Bold & branded", hint: "Brand colours, feature walls, statement lights", swatch: ["#0F4C43", "#FF6A00", "#FFC857"] },
  { id: "industrial", label: "Industrial", hint: "Exposed services, metal, concrete textures", swatch: ["#6B7280", "#374151", "#B45309"] },
];

// The contact form's area options, so the answer pre-fills exactly.
const sizes = areaRanges;

type Answers = { space?: ProjectCategory; size?: string; style?: DesignStyle };

const steps = [
  { key: "space", question: "What kind of space are you planning?", pose: "point" },
  { key: "size", question: "Roughly how big is it?", pose: "blueprint" },
  { key: "style", question: "Which look feels right?", pose: "think" },
] as const satisfies readonly { key: keyof Answers; question: string; pose: MascotPose }[];

const mascotNotes = ["Let's start!", "Good choice!", "Nearly there!", "Here's your plan!"];

export function WorkspaceBuilder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const headingRef = useRef<HTMLHeadingElement>(null);

  const goTo = (next: number) => {
    setStep(next);
    // Move focus to the new question so keyboard and screen-reader users follow along.
    setTimeout(() => headingRef.current?.focus(), 0);
  };

  const choose = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    goTo(step + 1);
  };

  const done = step >= steps.length;
  const pose: MascotPose = done ? "thumbsUp" : steps[step].pose;

  return (
    <section id="workspace-builder" aria-labelledby="builder-heading" className="bg-beige py-16 sm:py-20">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div className="flex items-center gap-5 lg:flex-col lg:items-start">
            <div className="relative w-28 shrink-0 sm:w-36 lg:w-40">
              <Mascot key={pose} pose={pose} animated className="h-auto w-full animate-[fade-in_0.35s_ease]" />
            </div>
            <div>
              <h2 id="builder-heading" className="heading-bar font-display text-3xl font-bold text-teal sm:text-4xl">
                Build Your Workspace
              </h2>
              <p className="mt-5 text-ink-muted-strong">
                Answer three quick questions and we&apos;ll show you spaces like yours — then send your answers straight to our
                team.
              </p>
              <p className="mt-3 hidden font-script text-2xl text-orange-deep lg:block" aria-hidden="true">
                {mascotNotes[Math.min(step, mascotNotes.length - 1)]}
              </p>
            </div>
          </div>

          <div className="rounded-[var(--radius-panel)] bg-cream p-5 shadow-[var(--shadow-card)] sm:p-8">
            <Progress step={step} />

            {!done ? (
              <div className="mt-6">
                <h3 ref={headingRef} tabIndex={-1} id="builder-question" className="font-display text-xl font-bold text-ink focus:outline-none sm:text-2xl">
                  <span className="sr-only">
                    Step {step + 1} of {steps.length}:{" "}
                  </span>
                  {steps[step].question}
                </h3>

                <div role="group" aria-labelledby="builder-question" className="mt-5">
                  {steps[step].key === "space" && (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {spaces.map(({ id, label, hint, Icon }) => (
                        <li key={id}>
                          <Choice selected={answers.space === id} onClick={() => choose("space", id)}>
                            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal text-white">
                              <Icon className="size-6" aria-hidden="true" />
                            </span>
                            <span>
                              <span className="block font-semibold text-ink">{label}</span>
                              <span className="block text-sm text-ink-muted">{hint}</span>
                            </span>
                          </Choice>
                        </li>
                      ))}
                    </ul>
                  )}

                  {steps[step].key === "size" && (
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {sizes.map((s) => (
                        <li key={s}>
                          <Choice selected={answers.size === s} onClick={() => choose("size", s)} center>
                            <span className="font-semibold text-ink">{s}</span>
                          </Choice>
                        </li>
                      ))}
                    </ul>
                  )}

                  {steps[step].key === "style" && (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {styles.map(({ id, label, hint, swatch }) => (
                        <li key={id}>
                          <Choice selected={answers.style === id} onClick={() => choose("style", id)}>
                            <span className="flex shrink-0 -space-x-2" aria-hidden="true">
                              {swatch.map((c) => (
                                <span key={c} className="size-7 rounded-full ring-2 ring-cream" style={{ backgroundColor: c }} />
                              ))}
                            </span>
                            <span>
                              <span className="block font-semibold text-ink">{label}</span>
                              <span className="block text-sm text-ink-muted">{hint}</span>
                            </span>
                          </Choice>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-teal hover:text-orange-deep"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" /> Back
                  </button>
                )}
              </div>
            ) : (
              <Result
                answers={answers as Required<Answers>}
                headingRef={headingRef}
                onRestart={() => {
                  setAnswers({});
                  goTo(0);
                }}
                onEdit={() => goTo(steps.length - 1)}
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Progress({ step }: { step: number }) {
  const labels = ["Space", "Size", "Style"];
  return (
    <ol className="flex gap-2" aria-label="Progress">
      {labels.map((l, i) => {
        const state = i < step ? "done" : i === step ? "current" : "todo";
        return (
          <li key={l} className="flex-1" aria-current={state === "current" ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full transition-colors ${state === "todo" ? "bg-ink/10" : state === "done" ? "bg-teal" : "bg-orange-deep"}`} />
            <span className={`mt-2 flex items-center gap-1 text-xs font-semibold ${state === "todo" ? "text-ink-muted" : "text-ink"}`}>
              {state === "done" && <Check className="size-3.5 text-teal" aria-hidden="true" />}
              {l}
              <span className="sr-only">{state === "done" ? " (completed)" : state === "current" ? " (current)" : ""}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Choice({ selected, onClick, center, children }: { selected: boolean; onClick: () => void; center?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex h-full min-h-16 w-full items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-teal hover:shadow-[var(--shadow-card)] ${
        center ? "justify-center text-center" : ""
      } ${selected ? "border-teal shadow-[var(--shadow-card)]" : "border-transparent"}`}
    >
      {children}
    </button>
  );
}

function Result({
  answers,
  headingRef,
  onRestart,
  onEdit,
}: {
  answers: Required<Answers>;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onRestart: () => void;
  onEdit: () => void;
}) {
  const space = spaces.find((s) => s.id === answers.space)!;
  const style = styles.find((s) => s.id === answers.style)!;

  // Same type of space first, best style match first; fall back to other styles of that space.
  const matches = projects
    .filter((p) => p.category === answers.space)
    .sort((a, b) => Number(b.styles?.includes(answers.style) ?? 0) - Number(a.styles?.includes(answers.style) ?? 0))
    .slice(0, 2);

  const sizeText = answers.size === "Not sure yet" ? "size to be confirmed" : answers.size;
  const summary = `${space.label} · ${sizeText} · ${style.label}`;
  const note = `Workspace Builder: ${space.label.toLowerCase()}, ${sizeText}, ${style.label.toLowerCase()} style.`;
  const params = new URLSearchParams({ type: answers.space, note });
  if (answers.size) params.set("area", answers.size);

  return (
    <div className="mt-6 animate-[fade-in_0.4s_ease]">
      <h3 ref={headingRef} tabIndex={-1} className="font-display text-xl font-bold text-ink focus:outline-none sm:text-2xl">
        Your workspace plan
      </h3>
      <p className="mt-2 inline-flex flex-wrap items-center gap-x-2 rounded-full bg-teal px-4 py-1.5 text-sm font-semibold text-white">{summary}</p>
      <p className="mt-4 text-ink-muted-strong">
        A {style.label.toLowerCase()} look usually means {style.hint.toLowerCase()}. We&apos;ll shape that around how your{" "}
        {space.label.toLowerCase()} needs to work — layout and services first, then finishes.
      </p>

      {matches.length > 0 && (
        <>
          <h4 className="mt-6 text-sm font-bold tracking-wide text-ink-muted-strong uppercase">Spaces like yours</h4>
          <ul className="mt-3 grid gap-5 sm:grid-cols-2">
            {matches.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw" />
              </li>
            ))}
          </ul>
          {matches.some((p) => p.status === "illustrative") && (
            <p className="mt-3 flex items-start gap-2 text-xs text-ink-muted">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Illustrative images show the type of space, not completed SpaceCraft projects.
            </p>
          )}
        </>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Button href={`/contact/?${params.toString()}`} arrow>
          Get a Free Consultation
        </Button>
        <Link href={space.service} className="group inline-flex items-center gap-1.5 font-semibold text-teal hover:text-orange-deep">
          About this service <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-4 text-sm">
        <button type="button" onClick={onEdit} className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink-muted-strong hover:text-teal">
          <ArrowLeft className="size-4" aria-hidden="true" /> Change style
        </button>
        <button type="button" onClick={onRestart} className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink-muted-strong hover:text-teal">
          <RotateCcw className="size-4" aria-hidden="true" /> Start over
        </button>
      </div>
    </div>
  );
}
