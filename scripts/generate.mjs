// Builds the Cloudflare Pages site (public/) from graphs.json + data/graph-*.json
// + data/api-surface.json:
//   public/llms.txt              — llms.txt index for the whole site (https://llmstxt.org)
//   public/<graph>/llms-full.txt — one full markdown export per graph
//   public/<graph>/<slug>.md     — one markdown file per page of each graph
//   public/types/…               — TypeScript definitions (copied from types/)
//   public/examples/…            — copy-pasteable examples (copied from examples/)
//   public/index.html            — landing page
//   public/_redirects            — legacy-URL redirects (Cloudflare Pages)
// The graphs to publish are listed in graphs.json at the repo root; the graph
// name is the first URL path segment. Also checks that every introspected API
// function appears in the .d.ts, and updates data/api-history.json in place
// (dated diffs of the function inventory, rendered as a changelog appendix).

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA = path.join(ROOT, 'data');
const PUBLIC = path.join(ROOT, 'public');
// Base URL for absolute links in llms.txt (BASE_URL env overrides).
const BASE = (process.env.BASE_URL || 'https://roamdocs.fyi').replace(/\/$/, '');
const REPO_URL = 'https://github.com/sweenzor/roam-docs';

const GRAPH_CONFIGS = JSON.parse(fs.readFileSync(path.join(ROOT, 'graphs.json'), 'utf8'));

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
// across graphs). Pages are published under public/<graph name>/.
function processGraph(cfg) {
  const graph = JSON.parse(fs.readFileSync(path.join(DATA, `graph-${cfg.name}.json`), 'utf8'));
  const outDir = cfg.name;

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

  return { cfg, graph, ordered, pageMeta, changelogDnps, releaseNotes, renderPage };
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

const graphs = GRAPH_CONFIGS.map((cfg) => processGraph(cfg));
const exportedAt = graphs[0].graph.exportedAt;

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
const dts = fs.readFileSync(dtsPath, 'utf8');
let dtsNote = '';
{
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

// ---- API changelog (state persisted in data/api-history.json) ----
// Compares the current introspected function inventory against the last
// recorded one and appends a dated entry when something changed. CI commits
// data/, so the history accumulates across scheduled refreshes.
const HISTORY_PATH = path.join(DATA, 'api-history.json');
const history = fs.existsSync(HISTORY_PATH)
  ? JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'))
  : { apiVersion: null, functions: [], entries: [] };
{
  const date = exportedAt.slice(0, 10);
  const fnPaths = fnInventory.map((f) => f.path);
  const prev = new Set(history.functions);
  const cur = new Set(fnPaths);
  const added = fnPaths.filter((p) => !prev.has(p));
  const removed = history.functions.filter((p) => !cur.has(p));
  if (!history.entries.length) {
    history.entries.push({ date, apiVersion: API_VERSION, baseline: true, total: fnPaths.length });
  } else if (added.length || removed.length || history.apiVersion !== API_VERSION) {
    history.entries.push({ date, apiVersion: API_VERSION, added, removed, total: fnPaths.length });
  }
  history.apiVersion = API_VERSION;
  history.functions = fnPaths;
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 1));
}

// ---------------------------------------------------------------------------
// Mirror-generated appendices, attached to the llms-full.txt of graphs flagged
// apiAppendices in graphs.json (the developer docs). Every appendix is an
// addition by this mirror and is labeled as such — never official graph content.
const fenceFor = (s) =>
  '`'.repeat(Math.max(3, (s.match(/`+/g) || ['']).sort((a, z) => z.length - a.length)[0].length + 1));
const appendices = [];

appendices.push({
  toc: 'window.roamAlphaAPI function inventory',
  lines: [
    '# Appendix: window.roamAlphaAPI function inventory (live-introspected)',
    '',
    `> This appendix is generated by the mirror (${REPO_URL}); it is not part of the`,
    '> official graph. It lists every callable on `window.roamAlphaAPI`, captured from a',
    '> running Roam Research session.',
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
  ],
});

appendices.push({
  toc: 'window.roamAlphaAPI changelog',
  lines: [
    '# Appendix: window.roamAlphaAPI changelog (tracked by this mirror)',
    '',
    `> Generated by the mirror (${REPO_URL}); not part of the official graph. Functions`,
    "> added or removed in the live-introspected inventory across this mirror's scheduled",
    `> refreshes, newest first. Tracking began ${history.entries[0].date}; earlier changes are`,
    '> not recorded.',
    '',
    ...[...history.entries].reverse().flatMap((e) =>
      e.baseline
        ? [`## ${e.date} — v${e.apiVersion} — baseline inventory of ${e.total} functions`]
        : [
            `## ${e.date} — v${e.apiVersion} (${e.total} functions)`,
            '',
            ...e.added.map((p) => `- Added: window.roamAlphaAPI.${p}`),
            ...e.removed.map((p) => `- Removed: window.roamAlphaAPI.${p}`),
            '',
          ]
    ),
  ],
});

{
  const probes = JSON.parse(fs.readFileSync(path.join(DATA, 'api-probes.json'), 'utf8'));
  appendices.push({
    toc: 'probed return values',
    lines: [
      '# Appendix: probed return values (live-introspected)',
      '',
      `> Generated by the mirror (${REPO_URL}); not part of the official graph. Observed`,
      '> return values of safe, side-effect-free window.roamAlphaAPI calls in an anonymous',
      '> read-only session — real shapes, not documentation.',
      '',
      ...Object.entries(probes).map(([name, p]) => {
        if (p.error) return `- ${name} → throws: ${p.error}`;
        const v = JSON.stringify(p.value);
        return `- ${name}${p.async ? ' (async)' : ''} → ${v.length > 300 ? v.slice(0, 297) + '…' : v}`;
      }),
    ],
  });
}

{
  const ATTRS = path.join(DATA, 'datalog-attributes.json');
  if (fs.existsSync(ATTRS)) {
    const { graph: attrsGraph, attributes } = JSON.parse(fs.readFileSync(ATTRS, 'utf8'));
    appendices.push({
      toc: 'datalog attribute inventory',
      lines: [
        '# Appendix: datalog attribute inventory (live-introspected)',
        '',
        `> Generated by the mirror (${REPO_URL}); not part of the official graph. Every`,
        `> datascript attribute observed in the public ${attrsGraph} graph, with entity`,
        '> count, value type, and an example value. These names are exactly what q/pull',
        '> patterns accept (frontend and Backend API alike) — an attribute not listed here',
        '> does not exist, so do not invent attribute names. Examples that are bare numbers',
        '> on ref-type attributes (children, refs, user, …) are datascript entity ids.',
        '',
        ...attributes.map((a) =>
          a.error
            ? `- ${a.attr} — enumeration failed: ${a.error}`
            : `- ${a.attr} — ${a.entities} entities, ${a.type}, e.g. ${a.example}`
        ),
      ],
    });
  } else {
    console.warn('data/datalog-attributes.json missing — run introspect.mjs to include the attribute appendix.');
  }
}

{
  const LANG = { '.js': 'javascript', '.sh': 'bash' };
  const lines = [
    '# Appendix: examples',
    '',
    `> Written for this mirror (${REPO_URL}); not part of the official graph. Each file`,
    `> is also served individually: ${BASE}/examples/<name>`,
  ];
  for (const f of fs.readdirSync(path.join(ROOT, 'examples')).sort()) {
    const src = fs.readFileSync(path.join(ROOT, 'examples', f), 'utf8');
    const fence = fenceFor(src);
    lines.push('', `## ${f}`, '', `${fence}${LANG[path.extname(f)] || ''}`, src.trimEnd(), fence);
  }
  appendices.push({ toc: 'examples', lines });
}

appendices.push({
  toc: 'TypeScript definitions (roam-alpha-api.d.ts)',
  lines: [
    '# Appendix: TypeScript definitions (roam-alpha-api.d.ts)',
    '',
    `> Also generated by the mirror (${REPO_URL}), not part of the official graph:`,
    '> hand-maintained TypeScript definitions, coverage-verified on every refresh against the',
    '> live-introspected inventory above.',
    `> Canonical URL: ${BASE}/types/roam-alpha-api.d.ts`,
    '',
    `${fenceFor(dts)}typescript`,
    dts.trimEnd(),
    fenceFor(dts),
  ],
});

// ---------------------------------------------------------------------------
// <graph>/llms-full.txt — one full export per graph, collected for the
// site-wide concatenation at /llms-full.txt below
const fullExports = [];
for (const g of graphs) {
  const others = graphs.filter((o) => o !== g);
  const out = [
    `# ${g.cfg.title} — full export`,
    '',
    `> Complete markdown export of the public Roam Research graph "${g.cfg.name}"`,
    `> (https://roamresearch.com/#/app/${g.cfg.name}). ${g.cfg.description || ''}`,
    ...(g.cfg.apiAppendices
      ? [
          '> The appendices at the end of this file are generated by this mirror and are NOT',
          `> part of the official graph: ${appendices.map((a) => a.toc).join('; ')}.`,
        ]
      : []),
    `> Exported ${g.graph.exportedAt}. Notation: [[Page]] = Roam Research page link, ((uid)) refs are resolved inline.`,
    ...others.map(
      (o) => `> Also on this site: ${o.cfg.title} — ${BASE}/${o.cfg.name}/llms-full.txt`
    ),
    '',
    '## Table of contents',
    '',
    ...g.pageMeta.map((m) => `- ${m.title}`),
    ...(g.releaseNotes ? ['- Release notes (daily-note updates)'] : []),
    ...(g.cfg.apiAppendices ? appendices.map((a) => `- Appendix: ${a.toc}`) : []),
    '',
  ];
  for (const p of g.ordered) {
    out.push('---', '');
    out.push(g.renderPage(p));
  }
  if (g.releaseNotes) out.push('---', '', g.releaseNotes);
  if (g.cfg.apiAppendices) {
    for (const a of appendices) out.push('---', '', ...a.lines, '');
  }
  const text = out.join('\n');
  fs.writeFileSync(path.join(PUBLIC, g.cfg.name, 'llms-full.txt'), text);
  fullExports.push(text);
}

// ---------------------------------------------------------------------------
// /llms-full.txt — the llms-full.txt convention expects everything at the site
// root, so concatenate every graph's export (each section keeps its own header
// and provenance notes).
{
  const header = [
    '# Roam Research Documentation — full export (all graphs)',
    '',
    `> All ${graphs.length} graphs on this site in one file: ${graphs.map((g) => g.cfg.name).join(', ')}.`,
    '> Each graph section below starts with its own header and provenance notes; the',
    '> per-graph files are smaller if you only need one:',
    ...graphs.map((g) => `> - ${BASE}/${g.cfg.name}/llms-full.txt`),
    `> Index of individual pages: ${BASE}/llms.txt`,
    '',
  ].join('\n');
  fs.writeFileSync(
    path.join(PUBLIC, 'llms-full.txt'),
    header + fullExports.map((text) => `\n---\n\n${text}`).join('')
  );
}

// ---------------------------------------------------------------------------
// llms.txt (site-wide index)
{
  const link = (label, href, desc) => `- [${label}](${BASE}${href})${desc ? `: ${desc}` : ''}`;
  const out = [
    '# Roam Research Documentation',
    '',
    `> Markdown mirror of public Roam Research graphs (${graphs.map((g) => g.cfg.name).join(', ')}),`,
    `> refreshed automatically, plus live-introspected TypeScript definitions for`,
    `> window.roamAlphaAPI (v${API_VERSION}) and copy-pasteable examples. Sources of truth: the`,
    '> public graphs and a running Roam Research session; regenerated on a schedule.',
    `> Source & contributions: ${REPO_URL}`,
    '',
    `Last export: ${exportedAt}`,
    '',
  ];
  const optional = [];
  for (const g of graphs) {
    const descs = g.cfg.descriptions || {};
    const shortcuts = new Set([...(g.graph.shortcuts || [])].map(([t]) => t));
    // Main section: curated pages (with a description) plus the graph's own
    // sidebar shortcuts; everything else goes under Optional.
    const isMain = (m) => descs[m.title] !== undefined || shortcuts.has(m.title);
    const main = g.pageMeta.filter(isMain);
    const other = g.pageMeta.filter((m) => !isMain(m));
    out.push(
      `## ${g.cfg.title}`,
      '',
      ...main.map((m) => link(m.title, `/${g.cfg.name}/${m.slug}.md`, descs[m.title] || m.first)),
      link(
        `${g.cfg.name}/llms-full.txt`,
        `/${g.cfg.name}/llms-full.txt`,
        `All of the ${g.cfg.name} graph in one file`
      ),
      ''
    );
    if (g.cfg.apiInventory) {
      out.push(
        '## API reference',
        '',
        link(
          'roam-alpha-api.d.ts',
          '/types/roam-alpha-api.d.ts',
          `TypeScript definitions for window.roamAlphaAPI — all ${fnInventory.length} live-introspected functions${dtsNote}`
        ),
        '',
        '## Examples',
        '',
        ...fs.readdirSync(path.join(ROOT, 'examples')).map((f) => link(f, `/examples/${f}`, '')),
        ''
      );
    }
    optional.push(
      ...other.map((m) => link(m.title, `/${g.cfg.name}/${m.slug}.md`, m.first)),
      ...(g.releaseNotes
        ? [
            link(
              `${g.cfg.title} release notes`,
              `/${g.cfg.name}/release-notes.md`,
              'Dated daily-note updates (newest first)'
            ),
          ]
        : [])
    );
  }
  out.push(
    '## Optional',
    '',
    ...optional,
    link('llms-full.txt (all graphs)', '/llms-full.txt', 'Every graph concatenated into one large file'),
    ''
  );
  fs.writeFileSync(path.join(PUBLIC, 'llms.txt'), out.join('\n'));
}

// ---------------------------------------------------------------------------
// Landing page
{
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const pageList = (g) =>
    [
      ...g.pageMeta.map(
        (m) => `  <li><a href="/${g.cfg.name}/${m.slug}.md">${esc(m.title)}</a></li>`
      ),
      ...(g.releaseNotes
        ? [`  <li><a href="/${g.cfg.name}/release-notes.md">Release notes</a></li>`]
        : []),
    ].join('\n');
  const graphLinks = graphs.map(
    (g) => `<a href="https://roamresearch.com/#/app/${g.cfg.name}"><code>${g.cfg.name}</code></a>`
  );
  const prose =
    graphLinks.length > 1
      ? `${graphLinks.slice(0, -1).join(', ')} and ${graphLinks.at(-1)}`
      : graphLinks[0];
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Machine-friendly mirror of public Roam Research documentation graphs: llms.txt, full markdown exports, and TypeScript definitions for window.roamAlphaAPI.">
<title>Roam Research Docs — llms.txt mirror</title>
<style>
  body { font: 16px/1.6 system-ui, sans-serif; max-width: 44rem; margin: 3rem auto; padding: 0 1rem; color: #1a1a1a; }
  @media (prefers-color-scheme: dark) { body { background: #16181d; color: #d6d8dd; } a { color: #8ab4f8; } }
  code { background: rgba(127,127,127,.15); padding: .1em .3em; border-radius: 4px; }
  li { margin: .3em 0; }
  summary { cursor: pointer; }
  summary h2 { display: inline; }
</style>
</head>
<body>
<h1>Roam Research Docs</h1>
<p>A machine-friendly mirror of the public Roam Research graphs
${prose},
regenerated on a schedule. Point your AI coding tool here.</p>
<ul>
  <li><a href="/llms.txt"><code>llms.txt</code></a> — index of everything on this site
    <ul>
${graphs
  .map(
    (g) =>
      `      <li>graph <code>${g.cfg.name}</code> (${esc(g.cfg.title)}): <a href="/${g.cfg.name}/llms-full.txt"><code>llms-full.txt</code></a> — every page in one file</li>`
  )
  .join('\n')}
      <li>everything: <a href="/llms-full.txt"><code>llms-full.txt</code></a> — all graphs in one file</li>
    </ul>
  </li>
</ul>
${graphs
  .map(
    (g) => `<details>
<summary><h2>${esc(g.cfg.title)}</h2></summary>
<ul>
${pageList(g)}
</ul>
</details>`
  )
  .join('\n')}
<p>Last export: ${exportedAt} · <a href="${REPO_URL}">source on GitHub</a></p>
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

  // Legacy URLs from before the graph name became the first path segment
  // (developer docs lived at /docs/).
  fs.writeFileSync(
    path.join(PUBLIC, '_redirects'),
    ['/docs/* /developer-documentation/:splat 301', ''].join('\n')
  );
}

console.log(
  `Generated: ${graphs
    .map(
      (g) =>
        `${g.cfg.name} ${g.pageMeta.length} pages (llms-full.txt ${(fs.statSync(path.join(PUBLIC, g.cfg.name, 'llms-full.txt')).size / 1024).toFixed(0)} KB)`
    )
    .join(', ')}, llms.txt, index.html`
);
