// Builds the Cloudflare Pages site (public/) from data/graph-*.json + data/api-surface.json:
//   public/llms.txt           — llms.txt index for the whole site (https://llmstxt.org)
//   public/llms-full.txt      — developer docs graph, full export + API inventory
//   public/docs/<slug>.md     — one markdown file per developer docs page
//   public/help/llms-full.txt — help (user documentation) graph, full export
//   public/help/<slug>.md     — one markdown file per help page
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
const BASE = (process.env.BASE_URL || 'https://roamdocs.fyi').replace(/\/$/, '');
const REPO_URL = 'https://github.com/sweenzor/roam-docs';

const surface = JSON.parse(fs.readFileSync(path.join(DATA, 'api-surface.json'), 'utf8'));
const API_VERSION = surface.roamAlphaAPI.apiVersion?.value || '?';

const DNP_RE = /^\d{2}-\d{2}-\d{4}$/;
const JUNK_TITLE_RE = /^(test\b|random test|writing \d)/i;

const slug = (t) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// ---------------------------------------------------------------------------
// Graph processing (everything scoped per graph: uid resolution must not leak
// across graphs).
function processGraph(graphFile, outDir) {
  const graph = JSON.parse(fs.readFileSync(path.join(DATA, graphFile), 'utf8'));

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

  const EMBED_RE =
    /\{\{\s*(?:\[\[)?embed(?:-children)?(?:\]\])?\s*:\s*\(\(([A-Za-z0-9_-]+)\)\)\s*\}\}/;

  function resolveOutsideCode(text, fn) {
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

  function renderBlock(block, depth, out) {
    let s = block[':block/string'] || '';
    const em = s.trim().match(new RegExp(`^${EMBED_RE.source}$`));
    if (em && uidMap.get(em[1])) {
      renderBlock(uidMap.get(em[1]), depth, out);
      return;
    }
    s = resolveText(s);
    const heading = block[':block/heading'];
    if (heading >= 1 && heading <= 3 && depth === 0) {
      out.push('', `${'#'.repeat(heading + 1)} ${s}`, '');
      for (const c of kids(block)) renderBlock(c, 0, out);
      return;
    }
    const indent = '  '.repeat(depth);
    const lines = s.split('\n');
    const first = heading >= 1 ? `**${lines[0]}**` : lines[0];
    out.push(`${indent}- ${first}`);
    for (const line of lines.slice(1)) out.push(line ? `${indent}  ${line}` : '');
    for (const c of kids(block)) renderBlock(c, depth + 1, out);
  }

  function renderPage(page) {
    const out = [`# ${page[':node/title']}`, ''];
    for (const c of kids(page)) renderBlock(c, 0, out);
    return out.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
  }

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
  const shortcutTitles = [...(graph.shortcuts || [])]
    .sort((a, z) => a[1] - z[1])
    .map(([t]) => t)
    .filter((t) => byTitle.has(t) && nonEmpty(byTitle.get(t)));

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

  // ---- write per-page markdown ----
  fs.mkdirSync(path.join(PUBLIC, outDir), { recursive: true });
  const pageMeta = [];
  for (const p of ordered) {
    const title = p[':node/title'];
    const s = slug(title);
    fs.writeFileSync(path.join(PUBLIC, outDir, `${s}.md`), renderPage(p));
    const firstBlock = kids(p)[0];
    pageMeta.push({
      title,
      slug: s,
      blocks: countBlocks(p),
      first: resolveText(firstBlock?.[':block/string'] || '')
        .replace(/\{\{[^}]*\}\}/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[*`#]|\[\[|\]\]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 140),
    });
  }

  let releaseNotes = null;
  if (changelogDnps.length) {
    const out = [`# Release notes (daily-note updates from the ${graph.graph} graph)`, ''];
    for (const p of changelogDnps) {
      out.push(`## ${p[':node/title']}`, '');
      for (const c of kids(p)) renderBlock(c, 0, out);
      out.push('');
    }
    releaseNotes = out.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
    fs.writeFileSync(path.join(PUBLIC, outDir, 'release-notes.md'), releaseNotes);
  }

  return { graph, ordered, pageMeta, changelogDnps, releaseNotes, renderPage };
}

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
fs.rmSync(PUBLIC, { recursive: true, force: true });
fs.mkdirSync(PUBLIC, { recursive: true });

const dev = processGraph('graph-developer-documentation.json', 'docs');
const help = processGraph('graph-help.json', 'help');

// ---- copy types/ and examples/ ----
for (const dir of ['types', 'examples']) {
  const src = path.join(ROOT, dir);
  if (!fs.existsSync(src)) continue;
  fs.mkdirSync(path.join(PUBLIC, dir), { recursive: true });
  for (const f of fs.readdirSync(src))
    fs.copyFileSync(path.join(src, f), path.join(PUBLIC, dir, f));
}

// ---- .d.ts coverage check ----
const dtsPath = path.join(ROOT, 'types', 'roam-alpha-api.d.ts');
let dtsNote = '';
{
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
// llms-full.txt (developer docs + API inventory)
{
  const out = [
    '# Roam Research Developer Documentation — full export',
    '',
    `> Complete markdown export of Roam Research's official developer-documentation graph`,
    `> (https://roamresearch.com/#/app/developer-documentation), plus a live-introspected`,
    `> inventory of window.roamAlphaAPI v${API_VERSION}.`,
    `> Exported ${dev.graph.exportedAt}. Notation: [[Page]] = Roam Research page link, ((uid)) refs are resolved inline.`,
    `> Help / user documentation is exported separately: ${BASE}/help/llms-full.txt`,
    '',
    '## Table of contents',
    '',
    ...dev.pageMeta.map((m) => `- ${m.title}`),
    '- Release notes (daily-note updates)',
    '- Appendix: window.roamAlphaAPI function inventory',
    '',
  ];
  for (const p of dev.ordered) {
    out.push('---', '');
    out.push(dev.renderPage(p));
  }
  if (dev.releaseNotes) out.push('---', '', dev.releaseNotes);
  out.push(
    '---',
    '',
    '# Appendix: window.roamAlphaAPI function inventory (live-introspected)',
    '',
    'Every callable on `window.roamAlphaAPI`, captured from a running Roam Research session.',
    `Full TypeScript signatures: ${BASE}/types/roam-alpha-api.d.ts`,
    '',
    ...fnInventory.map(
      (f) => `- window.roamAlphaAPI.${f.path}(${'…'.repeat(Math.min(f.args, 1))}) — ${f.args} arg(s)`
    ),
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
// help/llms-full.txt (user documentation)
{
  const out = [
    '# Roam Research Help & User Documentation — full export',
    '',
    `> Complete markdown export of Roam Research's official help graph`,
    `> (https://roamresearch.com/#/app/help): the product's user documentation.`,
    `> Exported ${help.graph.exportedAt}. Notation: [[Page]] = Roam Research page link, ((uid)) refs are resolved inline.`,
    `> Developer/API documentation is exported separately: ${BASE}/llms-full.txt`,
    '',
    '## Table of contents',
    '',
    ...help.pageMeta.map((m) => `- ${m.title}`),
    ...(help.releaseNotes ? ['- Release notes (daily-note updates)'] : []),
    '',
  ];
  for (const p of help.ordered) {
    out.push('---', '');
    out.push(help.renderPage(p));
  }
  if (help.releaseNotes) out.push('---', '', help.releaseNotes);
  fs.writeFileSync(path.join(PUBLIC, 'help', 'llms-full.txt'), out.join('\n'));
}

// ---------------------------------------------------------------------------
// llms.txt (site-wide index)
const DEV_DESCRIPTIONS = {
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
  const devMain = dev.pageMeta.filter((m) => DEV_DESCRIPTIONS[m.title]);
  const devOther = dev.pageMeta.filter((m) => !DEV_DESCRIPTIONS[m.title]);
  const helpShortcuts = new Set(
    [...(help.graph.shortcuts || [])].map(([t]) => t)
  );
  const helpMain = help.pageMeta.filter((m) => helpShortcuts.has(m.title));
  const helpOther = help.pageMeta.filter((m) => !helpShortcuts.has(m.title));
  const out = [
    '# Roam Research Documentation (developer + user docs)',
    '',
    '> Markdown mirror of Roam Research\'s official developer-documentation and help graphs,',
    `> refreshed automatically, plus live-introspected TypeScript definitions for`,
    `> window.roamAlphaAPI (v${API_VERSION}) and copy-pasteable examples. Sources of truth: the`,
    '> public graphs and a running Roam Research session; regenerated on a schedule.',
    `> Source & contributions: ${REPO_URL}`,
    '',
    `Last export: ${dev.graph.exportedAt}`,
    '',
    '## Developer documentation',
    '',
    ...devMain.map((m) => link(m.title, `/docs/${m.slug}.md`, DEV_DESCRIPTIONS[m.title])),
    '',
    '## API reference',
    '',
    link(
      'roam-alpha-api.d.ts',
      '/types/roam-alpha-api.d.ts',
      `TypeScript definitions for window.roamAlphaAPI — all ${fnInventory.length} live-introspected functions${dtsNote}`
    ),
    link('llms-full.txt', '/llms-full.txt', 'All developer docs in one file: every page + release notes + full API inventory'),
    '',
    '## Examples',
    '',
    ...fs.readdirSync(path.join(ROOT, 'examples')).map((f) => link(f, `/examples/${f}`, '')),
    '',
    '## Help & user documentation',
    '',
    ...helpMain.map((m) => link(m.title, `/help/${m.slug}.md`, m.first)),
    link('help/llms-full.txt', '/help/llms-full.txt', 'All user documentation in one file'),
    '',
    '## Optional',
    '',
    ...devOther.map((m) => link(m.title, `/docs/${m.slug}.md`, m.first)),
    ...(dev.releaseNotes
      ? [link('Developer release notes', '/docs/release-notes.md', 'Dated updates from the developer graph (newest first)')]
      : []),
    ...helpOther.map((m) => link(m.title, `/help/${m.slug}.md`, m.first)),
    ...(help.releaseNotes
      ? [link('Help release notes', '/help/release-notes.md', 'Dated updates from the help graph (newest first)')]
      : []),
    '',
  ];
  fs.writeFileSync(path.join(PUBLIC, 'llms.txt'), out.join('\n'));
}

// ---------------------------------------------------------------------------
// Landing page
{
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const pageList = (meta, dir) =>
    meta.map((m) => `  <li><a href="/${dir}/${m.slug}.md">${esc(m.title)}</a></li>`).join('\n');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Machine-friendly mirror of Roam Research's official developer and help documentation: llms.txt, full markdown exports, and TypeScript definitions for window.roamAlphaAPI.">
<title>Roam Research Docs — llms.txt mirror (developer + help)</title>
<style>
  body { font: 16px/1.6 system-ui, sans-serif; max-width: 44rem; margin: 3rem auto; padding: 0 1rem; color: #1a1a1a; }
  @media (prefers-color-scheme: dark) { body { background: #16181d; color: #d6d8dd; } a { color: #8ab4f8; } }
  code { background: rgba(127,127,127,.15); padding: .1em .3em; border-radius: 4px; }
  li { margin: .3em 0; }
</style>
</head>
<body>
<h1>Roam Research Docs</h1>
<p>A machine-friendly mirror of Roam Research's official
<a href="https://roamresearch.com/#/app/developer-documentation">developer-documentation</a> and
<a href="https://roamresearch.com/#/app/help">help</a> graphs,
regenerated on a schedule. Point your AI coding tool here.</p>
<ul>
  <li><a href="/llms.txt"><code>llms.txt</code></a> — index of everything on this site</li>
  <li><a href="/llms-full.txt"><code>llms-full.txt</code></a> — all developer docs in one file</li>
  <li><a href="/help/llms-full.txt"><code>help/llms-full.txt</code></a> — all user documentation in one file</li>
  <li><a href="/types/roam-alpha-api.d.ts"><code>roam-alpha-api.d.ts</code></a> — TypeScript definitions for <code>window.roamAlphaAPI</code> (${fnInventory.length} functions, live-introspected)</li>
</ul>
<p><a href="${REPO_URL}">Contributions welcome</a></p>
<h2>Developer documentation</h2>
<ul>
${pageList(dev.pageMeta, 'docs')}
${dev.releaseNotes ? '  <li><a href="/docs/release-notes.md">Release notes</a></li>' : ''}
</ul>
<h2>Help &amp; user documentation</h2>
<ul>
${pageList(help.pageMeta, 'help')}
${help.releaseNotes ? '  <li><a href="/help/release-notes.md">Release notes</a></li>' : ''}
</ul>
<p>Last export: ${dev.graph.exportedAt} · <a href="${REPO_URL}">source on GitHub</a></p>
</body>
</html>
`;
  fs.writeFileSync(path.join(PUBLIC, 'index.html'), html);

  // With a 404.html present, Pages returns real 404s instead of serving
  // index.html as an SPA fallback for unknown paths.
  fs.writeFileSync(
    path.join(PUBLIC, '404.html'),
    `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>404 — Roam Research Docs</title></head>
<body style="font: 16px/1.6 system-ui, sans-serif; max-width: 44rem; margin: 3rem auto; padding: 0 1rem;">
<h1>404 — not found</h1>
<p>Try the index: <a href="/llms.txt">/llms.txt</a> or the <a href="/">homepage</a>.</p>
</body>
</html>
`
  );
}

console.log(
  `Generated: dev ${dev.pageMeta.length} pages, help ${help.pageMeta.length} pages, ` +
    `llms.txt, llms-full.txt (${(fs.statSync(path.join(PUBLIC, 'llms-full.txt')).size / 1024).toFixed(0)} KB), ` +
    `help/llms-full.txt (${(fs.statSync(path.join(PUBLIC, 'help', 'llms-full.txt')).size / 1024).toFixed(0)} KB), index.html`
);
