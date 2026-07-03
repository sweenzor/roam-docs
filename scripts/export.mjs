// Exports public Roam Research graphs to data/graph-<name>.json via the official
// Roam Backend API (plain HTTP — no browser needed; the browser lives only in
// introspect.mjs, because window.roamAlphaAPI exists only in the running app).
//
// Which graphs: every entry in graphs.json (repo root), or just $ROAM_GRAPH
// when that env var is set.
//
// Auth: every graph needs a read-only roam-graph-token (only the graph owner
// can mint one; ask the Roam Research team in #developers on their Slack).
// The token is read from the env var named by the graph's "tokenEnv" in
// graphs.json (ROAM_API_TOKEN for ad-hoc graphs not listed there).

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = process.env.OUT_DIR || path.join(ROOT, 'data');
fs.mkdirSync(OUT_DIR, { recursive: true });

const GRAPH_CONFIGS = JSON.parse(fs.readFileSync(path.join(ROOT, 'graphs.json'), 'utf8'));

const PULL_PATTERN =
  '[:block/uid :node/title :block/string :block/order :block/heading :children/view-type {:block/refs [:block/uid]} {:block/children ...}]';
const PAGE_UIDS_Q = '[:find [?uid ...] :where [?e :node/title] [?e :block/uid ?uid]]';
const SHORTCUTS_Q =
  '[:find ?title ?order :where [?e :page/sidebar ?order] [?e :node/title ?title]]';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function exportViaBackendApi(graph, token) {
  const base = `https://api.roamresearch.com/api/graph/${graph}`;
  const post = async (route, body, attempt = 0) => {
    const res = await fetch(`${base}/${route}`, {
      method: 'POST',
      redirect: 'follow', // api.roamresearch.com redirects to the graph's shard
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        // X-Authorization survives cross-origin redirects (Authorization is stripped)
        'x-authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (res.status === 429 && attempt < 5) {
      console.warn(`  429 on /${route} — waiting 65s for the quota window to reset...`);
      await sleep(65_000);
      return post(route, body, attempt + 1);
    }
    if (!res.ok) throw new Error(`POST /${route} -> ${res.status}: ${(await res.text()).slice(0, 500)}`);
    return (await res.json()).result;
  };

  const uids = await post('q', { query: PAGE_UIDS_Q });
  console.log(`Backend API: ${uids.length} pages, pulling trees...`);
  const pages = [];
  // Quota is 500 req/min/graph; pace batches to stay safely under it.
  const CONCURRENCY = 4;
  const BATCH_INTERVAL_MS = 700; // ≈340 req/min
  for (let i = 0; i < uids.length; i += CONCURRENCY) {
    const batchStarted = Date.now();
    const batch = uids.slice(i, i + CONCURRENCY);
    const pulled = await Promise.all(
      batch.map((uid) =>
        post('pull', { selector: PULL_PATTERN, eid: `[:block/uid "${uid}"]` })
      )
    );
    pages.push(...pulled.filter(Boolean));
    if (i % 100 < CONCURRENCY) console.log(`  ${Math.min(i + CONCURRENCY, uids.length)}/${uids.length}`);
    const elapsed = Date.now() - batchStarted;
    if (elapsed < BATCH_INTERVAL_MS && i + CONCURRENCY < uids.length)
      await sleep(BATCH_INTERVAL_MS - elapsed);
  }
  let shortcuts = [];
  try {
    shortcuts = await post('q', { query: SHORTCUTS_Q });
  } catch (e) {
    console.warn('shortcuts query failed:', e.message);
  }
  return { shortcuts, pages };
}

async function exportGraph(graph, token) {
  const result = await exportViaBackendApi(graph, token);
  const out = {
    graph,
    exportedAt: new Date().toISOString(),
    transport: 'backend-api',
    shortcuts: result.shortcuts,
    pages: result.pages,
  };
  const outFile = `graph-${graph}.json`;
  fs.writeFileSync(path.join(OUT_DIR, outFile), JSON.stringify(out, null, 1));
  console.log(`Wrote ${outFile} (${out.pages.length} pages) via ${out.transport}.`);
}

const names = process.env.ROAM_GRAPH
  ? [process.env.ROAM_GRAPH]
  : GRAPH_CONFIGS.map((g) => g.name);
for (const name of names) {
  const cfg = GRAPH_CONFIGS.find((g) => g.name === name);
  const tokenEnv = cfg?.tokenEnv || 'ROAM_API_TOKEN';
  const token = process.env[tokenEnv];
  if (!token)
    throw new Error(`Missing read-only API token for graph "${name}": set ${tokenEnv}.`);
  await exportGraph(name, token);
}
