// Generates the social share image and raster icons from SVG sources.
//
//   assets/photos/hero-…jpg + text  →  public/og/spacecraft-interiors.jpg   (1200×630 share card)
//   app/icon.svg                    →  app/favicon.ico (16/32/48), app/apple-icon.png (180),
//                                      public/icon-512.png (logo for structured data)
//
// Run: npm run og   (re-run after changing the brand icon, tagline or hero photo)
import fs from "node:fs";
import sharp from "sharp";

const teal = "#0F4C43";
const yellow = "#FFC857";
const orangeDeep = "#C44600";
const cream = "#FFF9F1";
const font = "Segoe UI, Helvetica Neue, Arial, sans-serif";

const iconSvg = fs.readFileSync("app/icon.svg");
// The icon artwork, cream tile included so the teal tower stays visible on the teal card.
const iconInner = iconSvg.toString().replace(/<svg[^>]*>/, "").replace("</svg>", "");

/* ------------------------------------------------------------ share card */

const W = 1200;
const H = 630;

const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="fade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${teal}" stop-opacity="1"/>
      <stop offset="0.52" stop-color="${teal}" stop-opacity="0.97"/>
      <stop offset="0.72" stop-color="${teal}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${teal}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fade)"/>

  <g transform="translate(72 66) scale(1.5)">${iconInner}</g>
  <text x="156" y="124" font-family="${font}" font-size="38" font-weight="700" fill="#ffffff">Space<tspan fill="${yellow}">Craft</tspan></text>
  <text x="158" y="152" font-family="${font}" font-size="18" font-weight="600" letter-spacing="5" fill="#d7e4e1">INTERIORS</text>

  <text x="72" y="272" font-family="${font}" font-size="68" font-weight="800" fill="#ffffff">Office Interior</text>
  <text x="72" y="350" font-family="${font}" font-size="68" font-weight="800" fill="#ffffff">Designer in <tspan fill="${yellow}">Kolkata</tspan></text>
  <rect x="72" y="378" width="96" height="8" rx="4" fill="${yellow}"/>

  <text x="72" y="440" font-family="${font}" font-size="26" font-weight="500" fill="#d7e4e1">Offices · Retail · Showrooms · Cafés · Turnkey execution</text>

  <rect x="72" y="486" width="356" height="64" rx="32" fill="${orangeDeep}"/>
  <text x="250" y="527" text-anchor="middle" font-family="${font}" font-size="25" font-weight="700" fill="#ffffff">Book a free consultation</text>
</svg>`;

fs.mkdirSync("public/og", { recursive: true });
await sharp("assets/photos/hero-office-workstations-wood-shelving.jpg")
  .resize(W, H, { fit: "cover", position: "right" })
  .composite([{ input: Buffer.from(overlay) }])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile("public/og/spacecraft-interiors.jpg");

/* ----------------------------------------------------------------- icons */

const png = (size) => sharp(iconSvg, { density: 72 * (size / 48) * 2 }).resize(size, size).png().toBuffer();

fs.writeFileSync("app/apple-icon.png", await sharp(iconSvg, { density: 600 }).resize(180, 180).flatten({ background: cream }).png().toBuffer());
fs.writeFileSync("public/icon-512.png", await png(512));

// ICO container holding PNG images (supported by every current browser).
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
fs.writeFileSync("app/favicon.ico", Buffer.concat([header, ...images]));

console.log("Wrote public/og/spacecraft-interiors.jpg, app/favicon.ico, app/apple-icon.png, public/icon-512.png");
