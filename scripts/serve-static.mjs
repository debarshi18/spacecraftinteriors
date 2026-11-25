// Serves the static export in out/ the way Hostinger will (with the Phase 8 .htaccess):
// gzip for text, long-lived caching for hashed assets, folder index.html, and 404.html for misses.
// PHP is not executed here — the enquiry form endpoint only works on the real server.
//
// Run: npm run build && npm run serve   → http://localhost:4000
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = path.resolve("out");
const PORT = Number(process.env.PORT) || 4000;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
};
const compressible = /^(text\/|application\/(json|xml)|image\/svg)/;

function resolve(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^([/\\])+/, "");
  let file = path.join(ROOT, clean);
  if (!file.startsWith(ROOT)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  return fs.existsSync(file) ? file : null;
}

http
  .createServer((req, res) => {
    const urlPath = req.url || "/";
    // Same trailing-slash behaviour as the site: /about → /about/
    if (!path.extname(urlPath.split("?")[0]) && !urlPath.split("?")[0].endsWith("/")) {
      res.writeHead(301, { Location: urlPath.replace(/^([^?]*)/, "$1/") });
      return res.end();
    }
    let file = resolve(urlPath);
    let status = 200;
    if (!file) {
      file = path.join(ROOT, "404.html");
      status = 404;
    }
    const type = types[path.extname(file)] || "application/octet-stream";
    const headers = {
      "Content-Type": type,
      "Cache-Control": /[/\\](_next[/\\]static|images|og)[/\\]/.test(file) ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    };
    let body = fs.readFileSync(file);
    if (compressible.test(type) && /\bgzip\b/.test(req.headers["accept-encoding"] || "")) {
      body = zlib.gzipSync(body);
      headers["Content-Encoding"] = "gzip";
      headers["Vary"] = "Accept-Encoding";
    }
    res.writeHead(status, headers);
    res.end(body);
  })
  .listen(PORT, () => console.log(`Serving out/ at http://localhost:${PORT}`));
