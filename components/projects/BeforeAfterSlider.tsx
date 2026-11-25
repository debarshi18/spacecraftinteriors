"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { MoveHorizontal } from "lucide-react";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import type { PhotoName } from "@/data/images.generated";

type Photo = { name: PhotoName; alt: string };

/**
 * Drag (or use arrow keys) to compare a space before and after. Only use with a genuine
 * before/after pair of the same space — see data/projects.ts.
 */
export function BeforeAfterSlider({ before, after }: { before: Photo; after: Photo }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromPointer = (e: PointerEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
  };

  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={box}
      className="relative touch-pan-y overflow-hidden rounded-[var(--radius-panel)] select-none"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        fromPointer(e);
      }}
      onPointerMove={(e) => dragging.current && fromPointer(e)}
      onPointerUp={() => (dragging.current = false)}
    >
      <ResponsiveImage {...after} sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-[16/10] w-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <ResponsiveImage {...before} sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-[16/10] h-full w-full object-cover" />
      </div>
      <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white">Before</span>
      <span className="absolute top-3 right-3 rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white">After</span>

      <div className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-white shadow" style={{ left: `${pos}%` }} />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Before and after comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% before image shown`}
        onKeyDown={onKey}
        className="absolute top-1/2 inline-flex size-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-teal shadow-lg ring-4 ring-yellow"
        style={{ left: `${pos}%` }}
      >
        <MoveHorizontal className="size-6" aria-hidden="true" />
      </div>
    </div>
  );
}
