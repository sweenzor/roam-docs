// Content negotiation for the whole site (Cloudflare Pages Function).
//
// Implements https://acceptmarkdown.com/start: every extensionless page URL
// serves HTML to browsers and markdown to agents that ask for it via the
// Accept header — same URL, no .md suffix needed.
//
//   1. Parse Accept properly: sort by q-value, break ties by specificity
//      (RFC 9110 §12.5.1) — no substring matching.
//   2. Answer with the matching Content-Type, Vary: Accept (so caches key on
//      the request header), and a Link: rel="alternate" pointing at the other
//      representation. If the client rules out both formats, answer 406.
//   3. Verified by scripts/accept.test.mjs and the curl checks in the README.
//
// Every negotiable URL already has a markdown twin on disk: /<graph>/<page>
// pairs with /<graph>/<page>.md, and / (the landing page) pairs with
// /llms.txt — so negotiation is a URL rewrite, never a conversion. URLs with
// an extension (.md, .txt, .html, …) are served untouched; public/_routes.json
// keeps known static-only paths from invoking this function at all.

const HTML = 'text/html';
const MD = 'text/markdown';

// Parse an Accept header into entries: { type, subtype, q, specificity, order }.
// specificity: */* = 0, type/* = 1, type/subtype = 2. Malformed entries are
// dropped; a malformed q-value falls back to the default of 1.
export function parseAccept(header) {
  const entries = [];
  const TOKEN = "[A-Za-z0-9!#$%&'*+.^_`|~-]+";
  const RANGE = new RegExp(`^(\\*|${TOKEN})/(\\*|${TOKEN})$`);
  let order = 0;
  for (const part of String(header ?? '').split(',')) {
    const [range, ...params] = part.split(';');
    const m = RANGE.exec(range.trim());
    if (!m) continue;
    const type = m[1].toLowerCase();
    const subtype = m[2].toLowerCase();
    let q = 1;
    for (const p of params) {
      const eq = p.indexOf('=');
      if (eq === -1) continue;
      if (p.slice(0, eq).trim().toLowerCase() !== 'q') continue;
      const n = Number.parseFloat(p.slice(eq + 1).trim());
      if (Number.isFinite(n)) q = Math.min(Math.max(n, 0), 1);
      break; // q ends the media-type parameters; the rest are accept-ext
    }
    const specificity = type === '*' ? 0 : subtype === '*' ? 1 : 2;
    entries.push({ type, subtype, q, specificity, order: order++ });
  }
  return entries;
}

// Pick the candidate the client prefers. Each candidate is scored by the
// q-value of its most specific matching entry (exact beats type/* beats */*,
// regardless of q — RFC 9110 §12.5.1); highest q wins, client order breaks
// ties, and candidate order breaks what's left (so list the default first).
// Returns null when every candidate is excluded (q=0 or no match) — the
// caller should answer 406 rather than silently fall back.
export function preferredType(header, candidates) {
  const entries = parseAccept(header);
  if (entries.length === 0) return candidates[0]; // no (parseable) Accept → unconstrained
  let best = null;
  for (const candidate of candidates) {
    const [type, subtype] = candidate.split('/');
    let match = null;
    for (const e of entries) {
      const applies =
        (e.type === type && e.subtype === subtype) ||
        (e.type === type && e.subtype === '*') ||
        (e.type === '*' && e.subtype === '*');
      if (applies && (!match || e.specificity > match.specificity)) match = e;
    }
    if (!match || match.q === 0) continue;
    if (!best || match.q > best.match.q || (match.q === best.match.q && match.order < best.match.order))
      best = { candidate, match };
  }
  return best ? best.candidate : null;
}

// The markdown twin of a negotiable path (the landing page's twin is llms.txt).
const markdownPath = (pathname) => (pathname === '/' ? '/llms.txt' : `${pathname}.md`);

export async function onRequest({ request, env }) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return env.ASSETS.fetch(request);

  const url = new URL(request.url);
  const last = url.pathname.split('/').pop();
  const negotiable = url.pathname === '/' || (last !== '' && !last.includes('.'));
  if (!negotiable) return env.ASSETS.fetch(request);

  const accept = request.headers.get('Accept');
  const want = preferredType(accept, [HTML, MD]);
  const mdPath = markdownPath(url.pathname);

  if (want === MD) {
    const asset = await env.ASSETS.fetch(new Request(new URL(mdPath, url), request));
    if (asset.ok) {
      const res = new Response(asset.body, asset);
      res.headers.set('Content-Type', 'text/markdown; charset=utf-8');
      res.headers.set('Content-Location', mdPath);
      res.headers.set('Link', `<${url.pathname}>; rel="alternate"; type="text/html"`);
      res.headers.append('Vary', 'Accept');
      return res;
    }
    // No markdown twin (unknown page): fall through to the HTML/404 path
    // below when HTML is acceptable, else 406 only for pages that do exist.
    if (preferredType(accept, [HTML]) === null) {
      const html = await env.ASSETS.fetch(request);
      if (html.ok) return notAcceptable();
      return withVary(html);
    }
  } else if (want === null) {
    return notAcceptable();
  }

  const asset = await env.ASSETS.fetch(request);
  const res = withVary(asset);
  if (asset.ok && (asset.headers.get('Content-Type') || '').includes(HTML))
    res.headers.set('Link', `<${mdPath}>; rel="alternate"; type="text/markdown"`);
  return res;
}

const withVary = (asset) => {
  const res = new Response(asset.body, asset);
  res.headers.append('Vary', 'Accept');
  return res;
};

const notAcceptable = () =>
  new Response('406 Not Acceptable\nAvailable: text/html, text/markdown\n', {
    status: 406,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', Vary: 'Accept' },
  });
