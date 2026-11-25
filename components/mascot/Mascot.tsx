/**
 * The SpaceCraft builder mascot — an original character drawn as a modular SVG rig.
 *
 * Every pose shares the same head, helmet, torso, belt, legs and boots (so proportions and
 * colours can never drift between sections); only the arms, eyes and props change per pose.
 *
 * Distinguishing features: yellow helmet with a teal band and "building" badge, pencil tucked
 * behind the ear, light-blue shirt with rolled sleeves and teal collar, set-square in the
 * pocket, tape measure on the belt, teal work trousers. (Deliberately no overalls, cap or
 * moustache — it must not resemble any existing cartoon builder.)
 *
 * To swap in commissioned artwork later, render <img src={`/images/mascot/${pose}.webp`}>
 * here instead — callers only ever use <Mascot pose="..." />.
 */

import type { ReactNode } from "react";

export type MascotPose = "point" | "blueprint" | "think" | "thumbsUp" | "celebrate" | "drawing";

// Illustration palette: brand tokens plus the few natural tones a character needs.
const C = {
  ink: "#1F2937",
  skin: "#F4B98F",
  skinShade: "#DE9772",
  blush: "#F28C7A",
  hair: "#3A2A22",
  shirt: "#A9D2EE",
  shirtShade: "#86B9DE",
  trousers: "var(--color-teal)",
  trousersShade: "var(--color-teal-dark)",
  belt: "#7A4A2A",
  beltLight: "#9C6239",
  boot: "#6B3F22",
  bootSole: "#3E2414",
  helmet: "var(--color-yellow)",
  helmetShade: "#E9AC3A",
  band: "var(--color-teal)",
  orange: "var(--color-orange)",
  white: "#FFFFFF",
  paper: "#FFF9F1",
  mouth: "#7C2121",
  tongue: "#E8706A",
};

const SW = 3; // outline weight

type Pt = readonly [number, number];
type HandType = "fist" | "point" | "thumb" | "pinch";

function Arm({ shoulder, elbow, hand, type, angle = 0 }: { shoulder: Pt; elbow: Pt; hand: Pt; type: HandType; angle?: number }) {
  const sleeve = `M${shoulder[0]} ${shoulder[1]} L${elbow[0]} ${elbow[1]}`;
  const forearm = `M${elbow[0]} ${elbow[1]} L${hand[0]} ${hand[1]}`;
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={forearm} stroke={C.ink} strokeWidth={15 + SW * 2} />
      <path d={sleeve} stroke={C.ink} strokeWidth={25 + SW * 2} />
      <path d={forearm} stroke={C.skin} strokeWidth={15} />
      <path d={sleeve} stroke={C.shirt} strokeWidth={25} />
      {/* rolled cuff */}
      <circle cx={elbow[0]} cy={elbow[1]} r={13} fill={C.shirtShade} stroke={C.ink} strokeWidth={SW} />
      <Hand at={hand} type={type} angle={angle} />
    </g>
  );
}

/** Hands are drawn in a local frame where the forearm arrives from the left (-x). */
function Hand({ at, type, angle }: { at: Pt; type: HandType; angle: number }) {
  const common = { fill: C.skin, stroke: C.ink, strokeWidth: SW, strokeLinejoin: "round" as const };
  if (type === "thumb") {
    // Upright thumbs-up, drawn screen-aligned
    return (
      <g transform={`translate(${at[0]} ${at[1]})`}>
        <rect x={-6} y={-30} width={11} height={22} rx={5.5} {...common} />
        <rect x={-13} y={-12} width={26} height={24} rx={9} {...common} />
        <path d="M-12 -3 H8 M-12 4 H8" stroke={C.skinShade} strokeWidth={2} strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g transform={`translate(${at[0]} ${at[1]}) rotate(${angle})`}>
      {type === "point" && <rect x={2} y={-10} width={25} height={9} rx={4.5} {...common} />}
      {type === "pinch" && <rect x={4} y={-9} width={14} height={7} rx={3.5} {...common} />}
      <ellipse cx={0} cy={0} rx={13} ry={12} {...common} />
      {type === "fist" && <path d="M6 -7 Q10 -3 6 1 M6 1 Q10 5 6 8" stroke={C.skinShade} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {/* thumb */}
      <ellipse cx={1} cy={-9} rx={6} ry={4.5} transform="rotate(-20)" {...common} />
    </g>
  );
}

function Legs() {
  return (
    <g stroke={C.ink} strokeWidth={SW} strokeLinejoin="round">
      <path d="M76 244 L82 312 L116 312 L120 266 L124 312 L158 312 L164 244 Z" fill={C.trousers} />
      <path d="M140 262 L142 306" stroke={C.trousersShade} strokeWidth={2.5} fill="none" />
      <path d="M100 262 L99 306" stroke={C.trousersShade} strokeWidth={2.5} fill="none" />
      {/* boots */}
      <path d="M82 308 H117 V322 Q117 332 107 332 H72 Q64 332 64 325 Q64 310 82 308 Z" fill={C.boot} />
      <path d="M123 308 H158 Q176 310 176 325 Q176 332 168 332 H133 Q123 332 123 322 Z" fill={C.boot} />
      <path d="M64 327 H117 M123 327 H176" stroke={C.bootSole} strokeWidth={4} />
    </g>
  );
}

function Torso() {
  return (
    <g stroke={C.ink} strokeWidth={SW} strokeLinejoin="round">
      <rect x={109} y={138} width={22} height={18} fill={C.skinShade} />
      <path d="M78 152 Q120 140 162 152 Q174 158 172 178 L168 242 H72 L68 178 Q66 158 78 152 Z" fill={C.shirt} />
      <path d="M150 150 Q168 154 170 178 L166 242 H146 Z" fill={C.shirtShade} stroke="none" />
      {/* collar */}
      <path d="M120 162 L104 146 L96 158 L110 170 Z" fill="var(--color-teal)" />
      <path d="M120 162 L136 146 L144 158 L130 170 Z" fill="var(--color-teal)" />
      {/* placket + buttons */}
      <path d="M120 164 V236" fill="none" strokeWidth={2} />
      <circle cx={126} cy={182} r={2} fill={C.ink} stroke="none" />
      <circle cx={126} cy={202} r={2} fill={C.ink} stroke="none" />
      <circle cx={126} cy={222} r={2} fill={C.ink} stroke="none" />
      {/* pocket with set-square */}
      <path d="M140 180 L152 168 L152 182 Z" fill={C.helmet} strokeWidth={2} />
      <path d="M134 180 H158 V198 Q146 204 134 198 Z" fill={C.shirtShade} strokeWidth={2.5} />
      {/* belt */}
      <rect x={70} y={232} width={100} height={15} rx={4} fill={C.belt} />
      <rect x={112} y={232} width={16} height={15} rx={3} fill={C.helmet} strokeWidth={2.5} />
      {/* tool pouch with screwdriver handles */}
      <rect x={78} y={226} width={6} height={14} rx={2} fill={C.orange} strokeWidth={2} />
      <rect x={87} y={224} width={6} height={16} rx={2} fill="var(--color-teal)" strokeWidth={2} />
      <path d="M74 238 H98 V258 Q86 266 74 258 Z" fill={C.beltLight} />
      {/* tape measure */}
      <circle cx={154} cy={252} r={11} fill={C.helmet} />
      <circle cx={154} cy={252} r={4} fill={C.ink} stroke="none" />
      <path d="M163 258 H170" strokeWidth={3} />
    </g>
  );
}

type Eyes = "front" | "right" | "up" | "down" | "happy";

function Head({ eyes = "front", mouth = "smile", browRaise = false }: { eyes?: Eyes; mouth?: "smile" | "open"; browRaise?: boolean }) {
  const look: Record<Exclude<Eyes, "happy">, Pt> = { front: [0, 1], right: [4, 0], up: [3, -4], down: [0, 4] };
  return (
    <g stroke={C.ink} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round">
      {/* ears */}
      <circle cx={68} cy={110} r={11} fill={C.skin} />
      <circle cx={172} cy={110} r={11} fill={C.skin} />
      {/* pencil behind ear */}
      <g transform="rotate(28 176 96)">
        <rect x={168} y={80} width={8} height={36} fill={C.helmet} strokeWidth={2.5} />
        <path d="M168 116 L172 126 L176 116 Z" fill={C.skin} strokeWidth={2.5} />
        <rect x={168} y={76} width={8} height={6} fill={C.blush} strokeWidth={2.5} />
      </g>
      {/* face */}
      <ellipse cx={120} cy={110} rx={52} ry={50} fill={C.skin} />
      {/* hair under helmet */}
      <path d="M70 94 Q72 116 80 118 Q78 100 84 92 Z M170 94 Q168 116 160 118 Q162 100 156 92 Z" fill={C.hair} strokeWidth={2} />
      <ellipse cx={88} cy={134} rx={9} ry={5.5} fill={C.blush} opacity={0.55} stroke="none" />
      <ellipse cx={152} cy={134} rx={9} ry={5.5} fill={C.blush} opacity={0.55} stroke="none" />

      {/* brows */}
      <path d={browRaise ? "M90 92 Q100 82 110 90" : "M90 96 Q100 89 110 95"} fill="none" stroke={C.hair} strokeWidth={4.5} />
      <path d="M130 95 Q140 89 150 96" fill="none" stroke={C.hair} strokeWidth={4.5} />

      {/* eyes */}
      {eyes === "happy" ? (
        <g fill="none" strokeWidth={4}>
          <path d="M91 114 Q100 104 109 114" />
          <path d="M131 114 Q140 104 149 114" />
        </g>
      ) : (
        <g className="mascot-eyes">
          <ellipse cx={100} cy={112} rx={10.5} ry={12.5} fill={C.white} />
          <ellipse cx={140} cy={112} rx={10.5} ry={12.5} fill={C.white} />
          <circle cx={100 + look[eyes][0]} cy={113 + look[eyes][1]} r={5.5} fill={C.ink} stroke="none" />
          <circle cx={140 + look[eyes][0]} cy={113 + look[eyes][1]} r={5.5} fill={C.ink} stroke="none" />
          <circle cx={102 + look[eyes][0]} cy={110 + look[eyes][1]} r={1.8} fill={C.white} stroke="none" />
          <circle cx={142 + look[eyes][0]} cy={110 + look[eyes][1]} r={1.8} fill={C.white} stroke="none" />
        </g>
      )}

      {/* nose */}
      <ellipse cx={120} cy={127} rx={7} ry={5.5} fill={C.skinShade} strokeWidth={2.5} />

      {/* mouth */}
      {mouth === "smile" ? (
        <g>
          <path d="M98 138 Q120 162 142 138 Q120 144 98 138 Z" fill={C.mouth} />
          <path d="M101 139.5 Q120 144.5 139 139.5 L137 144 Q120 148 103 144 Z" fill={C.white} stroke="none" />
          <path d="M110 152 Q120 147 130 152 Q120 157 110 152 Z" fill={C.tongue} stroke="none" />
        </g>
      ) : (
        <g>
          <path d="M100 136 Q120 172 140 136 Q120 141 100 136 Z" fill={C.mouth} />
          <path d="M103 137.5 Q120 142 137 137.5 L135 142.5 Q120 146 105 142.5 Z" fill={C.white} stroke="none" />
          <path d="M108 156 Q120 148 132 156 Q120 163 108 156 Z" fill={C.tongue} stroke="none" />
        </g>
      )}

      {/* helmet */}
      <path d="M64 88 Q62 26 120 22 Q178 26 176 88 Z" fill={C.helmet} />
      <path d="M150 34 Q174 50 172 86 L156 86 Q158 56 146 38 Z" fill={C.helmetShade} stroke="none" />
      <path d="M112 23 Q108 50 110 86 H130 Q132 50 128 23" fill={C.helmetShade} strokeWidth={2.5} />
      <rect x={60} y={80} width={120} height={10} fill={C.band} />
      <path d="M52 92 Q120 82 188 92 Q190 100 182 101 Q120 93 58 101 Q50 100 52 92 Z" fill={C.helmet} />
      {/* helmet badge: tiny building */}
      <circle cx={120} cy={56} r={13} fill={C.band} strokeWidth={2.5} />
      <path d="M113 63 V52 H118 V47 H123 V63 M123 55 H127 V63 Z" fill={C.helmet} stroke="none" />
      <path d="M111 63.5 H129" stroke={C.helmet} strokeWidth={2} />
    </g>
  );
}

function RolledBlueprint({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`} stroke={C.ink} strokeWidth={SW} strokeLinejoin="round">
      <rect x={-48} y={-10} width={96} height={20} rx={4} fill={C.paper} />
      <path d="M-30 -10 V10 M-6 -10 V10 M18 -10 V10" stroke="#C9DCEB" strokeWidth={2} />
      <ellipse cx={48} cy={0} rx={6} ry={10} fill={C.paper} />
      <path d="M48 -4 Q52 0 48 4" fill="none" strokeWidth={2} stroke={C.shirtShade} />
    </g>
  );
}

function BlueprintSheet() {
  return (
    <g transform="rotate(-4 120 232)" stroke={C.ink} strokeWidth={SW} strokeLinejoin="round">
      <rect x={66} y={198} width={108} height={74} rx={4} fill="var(--color-teal)" />
      <g stroke={C.white} strokeWidth={2} fill="none" opacity={0.9}>
        <rect x={76} y={208} width={88} height={54} />
        <path d="M76 232 H118 V262 M118 232 V208 M140 208 V236 H164" />
        <path d="M96 232 Q96 222 106 222" />
        <rect x={146} y={244} width={10} height={10} />
      </g>
      <path d="M126 246 h10 v10 h-10 z" fill="var(--color-yellow)" stroke="none" />
    </g>
  );
}

function Tablet() {
  return (
    <g transform="rotate(-12 100 228)" stroke={C.ink} strokeWidth={SW} strokeLinejoin="round">
      <rect x={70} y={202} width={62} height={48} rx={6} fill={C.ink} />
      <rect x={76} y={207} width={50} height={38} rx={2} fill="var(--color-teal)" stroke="none" />
      <path d="M82 214 H120 V238 H82 Z M100 214 V226 H120" stroke={C.white} strokeWidth={1.8} fill="none" />
      <rect x={86} y={230} width={8} height={5} fill="var(--color-yellow)" stroke="none" />
    </g>
  );
}

function Lightbulb() {
  return (
    <g stroke={C.ink} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" className="mascot-pop">
      <path d="M206 54 Q186 54 186 34 Q186 14 206 14 Q226 14 226 34 Q226 54 206 54 Z" fill="var(--color-yellow)" />
      <rect x={198} y={52} width={16} height={12} rx={2} fill="#C9CED6" />
      <path d="M200 30 Q206 24 212 30" fill="none" stroke={C.orange} />
      <path d="M232 22 L240 18 M234 36 H243 M180 22 L172 18 M206 4 V-4" stroke={C.orange} strokeWidth={3} />
    </g>
  );
}

function Drill() {
  return (
    <g transform="rotate(8 46 230)" stroke={C.ink} strokeWidth={SW} strokeLinejoin="round">
      <rect x={4} y={226} width={14} height={5} fill="#C9CED6" />
      <path d="M18 216 H66 Q72 216 72 222 V232 Q72 238 66 238 H18 Z" fill={C.orange} />
      <path d="M52 236 L56 262 H72 L66 236 Z" fill={C.ink} />
      <circle cx={58} cy={226} r={3} fill={C.white} stroke="none" />
    </g>
  );
}

function Confetti() {
  const bits: [number, number, number, string][] = [
    [20, 30, 20, "var(--color-yellow)"],
    [218, 20, -25, "var(--color-orange)"],
    [8, 120, 40, "var(--color-teal)"],
    [232, 110, 15, "var(--color-yellow)"],
    [60, 6, -10, "var(--color-teal)"],
    [184, 0, 30, "var(--color-yellow)"],
    [228, 170, -30, "var(--color-orange)"],
    [12, 190, 25, "var(--color-orange)"],
  ];
  return (
    <g className="mascot-pop">
      {bits.map(([x, y, r, fill], i) => (
        <rect key={i} x={x} y={y} width={10} height={5} rx={1.5} fill={fill} transform={`rotate(${r} ${x + 5} ${y + 2.5})`} />
      ))}
    </g>
  );
}

function DrawingTable() {
  return (
    <g stroke={C.ink} strokeWidth={SW} strokeLinejoin="round">
      <path d="M40 270 L30 334 M200 270 L210 334" stroke="#8B5A33" strokeWidth={8} strokeLinecap="round" />
      <path d="M14 232 L226 232 L238 268 L2 268 Z" fill="#B57A47" />
      <path d="M2 268 H238 V278 H2 Z" fill="#8B5A33" />
      {/* paper with a floor plan sketch */}
      <path d="M44 236 L184 236 L192 264 L36 264 Z" fill={C.paper} strokeWidth={2.5} />
      <path d="M62 240 H160 L166 260 H56 Z M108 240 L106 260 M60 250 H107" fill="none" stroke="var(--color-teal)" strokeWidth={2} />
      <rect x={130} y={246} width={14} height={8} fill="var(--color-yellow)" stroke="none" />
    </g>
  );
}

/** Pencil held in the drawing hand. */
function HeldPencil() {
  return (
    <g transform="rotate(35 156 238)" stroke={C.ink} strokeWidth={2.5} strokeLinejoin="round">
      <rect x={152} y={208} width={8} height={32} fill="var(--color-yellow)" />
      <path d="M152 240 L156 250 L160 240 Z" fill={C.skin} />
    </g>
  );
}

const L: Pt = [80, 160];
const R: Pt = [160, 160];

const poses: Record<MascotPose, { viewBox: string; render: () => ReactNode }> = {
  point: {
    viewBox: "20 10 236 330",
    render: () => (
      <>
        <Legs />
        <Torso />
        <Arm shoulder={L} elbow={[58, 206]} hand={[84, 216]} type="fist" angle={-20} />
        {/* roll sits across the forearm, gripped by a hand drawn on top */}
        <RolledBlueprint x={84} y={210} angle={-58} />
        <Hand at={[84, 216]} type="fist" angle={-20} />
        <Head eyes="right" />
        <Arm shoulder={R} elbow={[196, 150]} hand={[222, 124]} type="point" angle={-40} />
      </>
    ),
  },
  blueprint: {
    viewBox: "24 10 192 330",
    render: () => (
      <>
        <Legs />
        <Torso />
        <Head eyes="front" />
        <BlueprintSheet />
        <Arm shoulder={L} elbow={[60, 204]} hand={[74, 204]} type="fist" angle={-40} />
        <Arm shoulder={R} elbow={[180, 200]} hand={[166, 196]} type="fist" angle={210} />
      </>
    ),
  },
  think: {
    viewBox: "24 -10 224 350",
    render: () => (
      <>
        <Legs />
        <Torso />
        <Tablet />
        <Arm shoulder={L} elbow={[58, 210]} hand={[86, 232]} type="fist" angle={10} />
        <Head eyes="up" browRaise />
        <Arm shoulder={R} elbow={[184, 214]} hand={[150, 164]} type="point" angle={-100} />
        <Lightbulb />
      </>
    ),
  },
  thumbsUp: {
    viewBox: "0 10 232 330",
    render: () => (
      <>
        <Legs />
        <Torso />
        <Drill />
        <Arm shoulder={L} elbow={[52, 196]} hand={[48, 230]} type="fist" angle={100} />
        <Head eyes="front" />
        <Arm shoulder={R} elbow={[198, 188]} hand={[204, 150]} type="thumb" />
      </>
    ),
  },
  celebrate: {
    viewBox: "0 -14 250 354",
    render: () => (
      <>
        <Confetti />
        <Legs />
        <Torso />
        <Arm shoulder={L} elbow={[44, 128]} hand={[40, 80]} type="fist" angle={-100} />
        <Arm shoulder={R} elbow={[196, 128]} hand={[200, 80]} type="fist" angle={-80} />
        <Head eyes="happy" mouth="open" />
      </>
    ),
  },
  drawing: {
    viewBox: "0 10 240 332",
    render: () => (
      <>
        <Torso />
        <Head eyes="down" />
        <DrawingTable />
        <Arm shoulder={L} elbow={[56, 214]} hand={[78, 246]} type="fist" angle={30} />
        <HeldPencil />
        <Arm shoulder={R} elbow={[188, 214]} hand={[156, 240]} type="pinch" angle={160} />
      </>
    ),
  },
};

export function Mascot({
  pose,
  className = "",
  title,
  animated = false,
}: {
  pose: MascotPose;
  className?: string;
  /** Accessible description; omit when the mascot is purely decorative. */
  title?: string;
  /** Gentle idle bob + blink (disabled automatically for reduced-motion users). */
  animated?: boolean;
}) {
  const { viewBox, render } = poses[pose];
  return (
    <svg
      viewBox={viewBox}
      className={`mascot overflow-visible ${animated ? "mascot-animated" : ""} ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx={120} cy={334} rx={66} ry={6} fill={C.ink} opacity={0.12} />
      <g className="mascot-body">{render()}</g>
    </svg>
  );
}
