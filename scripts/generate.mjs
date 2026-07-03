// Builds the Cloudflare Pages site (public/) from data/graph.json + data/api-surface.json:
//   public/llms.txt           — llms.txt index (https://llmstxt.org)
//   public/llms-full.txt      — full markdown export of the docs graph + API inventory
//   public/docs/<slug>.md     — one markdown file per docs page
//   public/types/…            — TypeScript definitions (copied from types/)
//   public/examples/…         — copy-pasteable examples (copied from examples/)
//   public/index.html         — landing page
// Also checks that every introspected API function appears in the .d.ts.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA = path.join(ROOT, 'data');
const PUBLIC = path.join(ROOT, 'public');
// Base URL for absolute links in llms.txt (BASE_URL env overrides).
const BASE = (process.env.BASE_URL || 'https://roam-docs.pages.dev').replace(/\/$/, '');

const graph = JSON.parse(fs.readFileSync(path.join(DATA, 'graph.json'), 'utf8'));
const surface = JSON.parse(fs.readFileSync(path.join(DATA, 'api-surface.json'), 'utf8'));

// ---------------------------------------------------------------------------
// Block/uid index across ALL pages (incl. daily notes) for ((ref)) resolution.
const uidMap = new Map();
for (const p of graph.pages) {
  (function walk(node) {
    if (node[':block/uid']) uidMap.set(node[':block/uid'], node);
    for (const c of node[':block/children'] || []) walk(c);
  })(p);
}

const kids = (b) =>
  [...(b[':block/children'] || [])].sort(
    (a, z) => (a[':block/order'] ?? 0) - (z[':block/order'] ?? 0)
  );

// ---------------------------------------------------------------------------
// Text resolution. Substitutions apply outside code fences / inline code only.
const EMBED_RE =
  /\{\{\s*(?:\[\[)?embed(?:-children)?(?:\]\])?\s*:\s*\(\(([A-Za-z0-9_-]+)\)\)\s*\}\}/;

function resolveOutsideCode(text, fn) {
  // Split on fenced code first, then inline code; transform only prose parts.
  return text
    .split(/(```[\s\S]*?```)/)
    .map((seg, i) =>
      i % 2 ? seg : seg.split(/(`[^`\n]*`)/).map((s, j) => (j % 2 ? s : fn(s))).join('')
    )
    .join('');
}

function resolveText(text, depth = 0) {
  if (!text) return '';
  return resolveOutsideCode(text, (prose) =>
    prose
      // [label](((uid))) alias-to-block-ref: keep the visible label only.
      .replace(/\[([^\]]*)\]\(\(\(([A-Za-z0-9_-]+)\)\)\)/g, '$1')
      .replace(/\(\(([A-Za-z0-9_-]+)\)\)/g, (m, uid) => {
        const target = uidMap.get(uid);
        if (!target || depth >= 3) return m;
        return resolveText(target[':block/string'] || '', depth + 1);
      })
  );
}

// ---------------------------------------------------------------------------
// Markdown rendering
function renderBlock(block, depth, out) {
  let s = block[':block/string'] || '';

  // A block that is nothing but an embed: splice the referenced subtree here.
  const em = s.trim().match(new RegExp(`^${EMBED_RE.source}$`));
  if (em && uidMap.get(em[1])) {
    renderBlock(uidMap.get(em[1]), depth, out);
    return;
  }

  s = resolveText(s);
  const heading = block[':block/heading'];

  if (heading >= 1 && heading <= 3 && depth === 0) {
    // Top-level heading blocks become real markdown sections.
    out.push('', `${'#'.repeat(heading + 1)} ${s}`, '');
    for (const c of kids(block)) renderBlock(c, 0, out);
    return;
  }

  const indent = '  '.repeat(depth);
  const lines = s.split('\n');
  const first = heading >= 1 ? `**${lines[0]}**` : lines[0];
  out.push(`${indent}- ${first}`);
  // Continuation lines (incl. code fences) stay inside the list item.
  for (const line of lines.slice(1)) out.push(line ? `${indent}  ${line}` : '');
  for (const c of kids(block)) renderBlock(c, depth + 1, out);
}

function renderPage(page, { titleOverride } = {}) {
  const out = [`# ${titleOverride || page[':node/title']}`, ''];
  for (const c of kids(page)) renderBlock(c, 0, out);
  return out.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
}

// ---------------------------------------------------------------------------
// Page selection & ordering
const DNP_RE = /^\d{2}-\d{2}-\d{4}$/;
const isDnp = (p) => DNP_RE.test(p[':block/uid'] || '');
const nonEmpty = (p) => (p[':block/children'] || []).length > 0;
const countBlocks = (p) => {
  let n = 0;
  (function rec(b) {
    for (const c of b[':block/children'] || []) {
      n++;
      rec(c);
    }
  })(p);
  return n;
};

const byTitle = new Map(graph.pages.map((p) => [p[':node/title'], p]));
const shortcutTitles = [...graph.shortcuts]
  .sort((a, z) => a[1] - z[1])
  .map(([t]) => t)
  .filter((t) => byTitle.has(t) && nonEmpty(byTitle.get(t)));

// Drop test scraps and near-empty stub pages (attribute markers, person pages…);
// sidebar-shortcut pages are always kept.
const JUNK_TITLE_RE = /^(test\b|random test|writing \d)/i;
const isSubstantive = (p) => {
  const title = p[':node/title'] || '';
  if (shortcutTitles.includes(title)) return true;
  if (JUNK_TITLE_RE.test(title)) return false;
  return countBlocks(p) >= 3 && renderPage(p).length >= 250;
};

const substantive = graph.pages.filter((p) => !isDnp(p) && nonEmpty(p) && isSubstantive(p));
const rest = substantive
  .filter((p) => !shortcutTitles.includes(p[':node/title']))
  .sort((a, z) => countBlocks(z) - countBlocks(a));
const ordered = [...shortcutTitles.map((t) => byTitle.get(t)), ...rest];

const changelogDnps = graph.pages
  .filter((p) => isDnp(p) && nonEmpty(p))
  .sort((a, z) => {
    const key = (u) => u.slice(6, 10) + u.slice(0, 2) + u.slice(3, 5);
    return key(z[':block/uid']).localeCompare(key(a[':block/uid']));
  });

const slug = (t) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// ---------------------------------------------------------------------------
// API inventory (from introspection)
function apiPaths(node, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(node)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v.kind === 'namespace') out.push(...apiPaths(v.children || {}, p));
    else if (v.kind === 'function') out.push({ path: p, args: v.jsLength });
    else out.push({ path: p, value: v.value, type: v.kind });
  }
  return out;
}
const inventory = apiPaths(surface.roamAlphaAPI).sort((a, z) => a.path.localeCompare(z.path));
const fnInventory = inventory.filter((i) => i.args !== undefined);

// ---------------------------------------------------------------------------
// Write per-page docs
fs.rmSync(PUBLIC, { recursive: true, force: true });
fs.mkdirSync(path.join(PUBLIC, 'docs'), { recursive: true });

const pageMeta = [];
for (const p of ordered) {
  const title = p[':node/title'];
  const s = slug(title);
  fs.writeFileSync(path.join(PUBLIC, 'docs', `${s}.md`), renderPage(p));
  const firstBlock = kids(p)[0];
  pageMeta.push({
    title,
    slug: s,
    blocks: countBlocks(p),
    first: resolveText(firstBlock?.[':block/string'] || '')
      .replace(/\{\{[^}]*\}\}/g, ' ')
      .replace(/[*`#]|\[\[|\]\]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 140),
  });
}

// Changelog: all non-empty daily-note pages, newest first, in one file.
{
  const out = ['# Release notes (daily-note updates from the developer graph)', ''];
  for (const p of changelogDnps) {
    out.push(`## ${p[':node/title']}`, '');
    for (const c of kids(p)) renderBlock(c, 0, out);
    out.push('');
  }
  fs.writeFileSync(
    path.join(PUBLIC, 'docs', 'release-notes.md'),
    out.join('\n').replace(/\n{3,}/g, '\n\n') + '\n'
  );
}

// ---------------------------------------------------------------------------
// Copy types/ and examples/
for (const dir of ['types', 'examples']) {
  const src = path.join(ROOT, dir);
  if (!fs.existsSync(src)) continue;
  fs.mkdirSync(path.join(PUBLIC, dir), { recursive: true });
  for (const f of fs.readdirSync(src))
    fs.copyFileSync(path.join(src, f), path.join(PUBLIC, dir, f));
}

// Coverage check: every introspected function's terminal name should appear in the .d.ts.
const dtsPath = path.join(ROOT, 'types', 'roam-alpha-api.d.ts');
let dtsNote = '';
if (fs.existsSync(dtsPath)) {
  const dts = fs.readFileSync(dtsPath, 'utf8');
  const missing = fnInventory.filter(({ path: p }) => {
    const leaf = p.split('.').pop();
    return !new RegExp(`\\b${leaf}\\b`).test(dts);
  });
  if (missing.length) {
    console.warn(`WARNING: ${missing.length} introspected API function(s) missing from .d.ts:`);
    for (const m of missing) console.warn(`  window.roamAlphaAPI.${m.path}`);
    dtsNote = ` (${missing.length} newly-discovered functions not yet typed — see llms-full.txt inventory)`;
  } else {
    console.log(`.d.ts coverage OK: all ${fnInventory.length} functions present.`);
  }
}

// ---------------------------------------------------------------------------
// llms-full.txt
{
  const out = [
    '# Roam Research Developer Documentation — full export',
    '',
    `> Complete markdown export of Roam Research's official developer-documentation graph`,
    `> (https://roamresearch.com/#/app/developer-documentation), plus a live-introspected`,
    `> inventory of window.roamAlphaAPI v${surface.roamAlphaAPI.apiVersion?.value || ''}.`,
    `> Exported ${graph.exportedAt}. Notation: [[Page]] = Roam Research page link, ((uid)) refs are resolved inline.`,
    '',
    '## Table of contents',
    '',
    ...pageMeta.map((m) => `- ${m.title}`),
    '- Release notes (daily-note updates)',
    '- Appendix: window.roamAlphaAPI function inventory',
    '',
  ];
  for (const p of ordered) {
    out.push('---', '');
    out.push(renderPage(p));
  }
  out.push('---', '', fs.readFileSync(path.join(PUBLIC, 'docs', 'release-notes.md'), 'utf8'));
  out.push(
    '---',
    '',
    '# Appendix: window.roamAlphaAPI function inventory (live-introspected)',
    '',
    'Every callable on `window.roamAlphaAPI`, captured from a running Roam Research session.',
    'Full TypeScript signatures: /types/roam-alpha-api.d.ts',
    '',
    ...fnInventory.map((f) => `- window.roamAlphaAPI.${f.path}(${'…'.repeat(Math.min(f.args, 1))}) — ${f.args} arg(s)`),
    '',
    '## Non-function properties',
    '',
    ...inventory
      .filter((i) => i.args === undefined)
      .map((i) => `- window.roamAlphaAPI.${i.path} : ${i.type} = ${i.value}`),
    ''
  );
  fs.writeFileSync(path.join(PUBLIC, 'llms-full.txt'), out.join('\n'));
}

// ---------------------------------------------------------------------------
// llms.txt (index)
const DESCRIPTIONS = {
  'Developer Hub': 'Entry point / map of all Roam Research developer documentation',
  'Roam Alpha API': 'The frontend JS API (window.roamAlphaAPI): datalog q/pull, block & page CRUD, UI control, file storage',
  'Roam Depot/Extension API': 'Extension API passed to Depot extensions (settings panels, commands, lifecycle)',
  'Roam Depot/Extensions': 'How to build, test and publish Roam Depot extensions',
  'roam/css': 'Theming Roam Research with custom CSS via the roam/css page',
  'roam/js': 'Running custom JavaScript in a graph via roam/js blocks',
  'roam/cljs': 'Running ClojureScript in a graph',
  'roam/render': 'Custom components rendered inside blocks (ClojureScript/Reagent)',
  'Roam Backend API (Beta)': 'Official REST API: datalog q / pull / pull-many + write actions over HTTP with roam-graph-tokens',
  'Roam Append API': 'Append-only HTTP API for capture (works with encrypted graphs)',
  'Yet-to-release updates': 'API changes announced but not yet released',
  'Available Libraries': 'Official SDKs and community libraries',
  'Contact Us': 'How to reach the Roam Research developer team',
  'Local API': 'Local HTTP API exposed by the Roam Research desktop app',
};
{
  const link = (label, href, desc) => `- [${label}](${BASE}${href})${desc ? `: ${desc}` : ''}`;
  const main = pageMeta.filter((m) => DESCRIPTIONS[m.title]);
  const other = pageMeta.filter((m) => !DESCRIPTIONS[m.title]);
  const out = [
    '# Roam Research Developer Documentation',
    '',
    '> Markdown mirror of the official Roam Research developer docs graph, refreshed automatically,',
    `> plus live-introspected TypeScript definitions for window.roamAlphaAPI (v${surface.roamAlphaAPI.apiVersion?.value || '?'})`,
    '> and copy-pasteable examples. Sources of truth: the public developer-documentation',
    '> graph and a running Roam Research session; regenerated on a schedule.',
    '',
    `Last export: ${graph.exportedAt}`,
    '',
    '## Docs',
    '',
    ...main.map((m) => link(m.title, `/docs/${m.slug}.md`, DESCRIPTIONS[m.title])),
    '',
    '## API reference',
    '',
    link(
      'roam-alpha-api.d.ts',
      '/types/roam-alpha-api.d.ts',
      `TypeScript definitions for window.roamAlphaAPI — all ${fnInventory.length} live-introspected functions${dtsNote}`
    ),
    link('llms-full.txt', '/llms-full.txt', 'Everything in one file: all docs pages + release notes + full API inventory'),
    '',
    '## Examples',
    '',
    ...(fs.existsSync(path.join(ROOT, 'examples'))
      ? fs
          .readdirSync(path.join(ROOT, 'examples'))
          .map((f) => link(f, `/examples/${f}`, ''))
      : []),
    '',
    '## Optional',
    '',
    ...other.map((m) => link(m.title, `/docs/${m.slug}.md`, m.first)),
    link('Release notes', '/docs/release-notes.md', 'Dated updates from the developer graph (newest first)'),
    '',
  ];
  fs.writeFileSync(path.join(PUBLIC, 'llms.txt'), out.join('\n'));
}

// ---------------------------------------------------------------------------
// Landing page
{
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Roam Research Developer Docs — llms.txt mirror</title>
<style>
  body { font: 16px/1.6 system-ui, sans-serif; max-width: 44rem; margin: 3rem auto; padding: 0 1rem; color: #1a1a1a; }
  @media (prefers-color-scheme: dark) { body { background: #16181d; color: #d6d8dd; } a { color: #8ab4f8; } }
  code { background: rgba(127,127,127,.15); padding: .1em .3em; border-radius: 4px; }
  li { margin: .3em 0; }
</style>
</head>
<body>
<h1>Roam Research Developer Docs</h1>
<p>A machine-friendly mirror of Roam Research's official
<a href="https://roamresearch.com/#/app/developer-documentation">developer-documentation graph</a>,
regenerated on a schedule. Point your AI coding tool here.</p>
<ul>
  <li><a href="/llms.txt"><code>llms.txt</code></a> — index of the docs</li>
  <li><a href="/llms-full.txt"><code>llms-full.txt</code></a> — everything in one file</li>
  <li><a href="/types/roam-alpha-api.d.ts"><code>roam-alpha-api.d.ts</code></a> — TypeScript definitions for <code>window.roamAlphaAPI</code> (${fnInventory.length} functions, live-introspected)</li>
</ul>
<h2>Docs pages</h2>
<ul>
${pageMeta.map((m) => `  <li><a href="/docs/${m.slug}.md">${esc(m.title)}</a></li>`).join('\n')}
  <li><a href="/docs/release-notes.md">Release notes</a></li>
</ul>
<p>Last export: ${graph.exportedAt} · <a href="https://github.com/sweenzor/roam-docs">source</a></p>
</body>
</html>
`;
  fs.writeFileSync(path.join(PUBLIC, 'index.html'), html);
}

console.log(
  `Generated: ${pageMeta.length} docs pages, release notes (${changelogDnps.length} days), llms.txt, llms-full.txt (${(
    fs.statSync(path.join(PUBLIC, 'llms-full.txt')).size / 1024
  ).toFixed(0)} KB), index.html`
);
