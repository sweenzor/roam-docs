// Exports public Roam Research graphs to data/graph-<name>.json.
//
// Which graphs: every entry in graphs.json (repo root), or just $ROAM_GRAPH
// when that env var is set.
//
// Two transports, in order of preference:
//   1. Roam Backend API (official REST) — used when the graph has an API token.
//      Requires a read-only roam-graph-token for the graph (only the graph
//      owner can mint one; ask the Roam Research team in #developers on their Slack).
//      The token is read from the env var named by the graph's "tokenEnv" in
//      graphs.json (ROAM_API_TOKEN for graphs not listed there).
//      Plain HTTP: runs anywhere, no browser needed.
//   2. Headless Chromium fallback (anonymous read-only session on the public
//      graph, driving the same datalog API via window.roamAlphaAPI).
//
// Both produce an identical graph JSON so generate.mjs doesn't care which ran.

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

async function exportViaBrowser(graph) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const network = [];
  page.on('request', (r) =>
    network.push({ kind: 'request', method: r.method(), type: r.resourceType(), url: r.url() })
  );
  page.on('websocket', (ws) => network.push({ kind: 'websocket', url: ws.url() }));

  console.log(`Browser fallback: loading https://roamresearch.com/#/app/${graph} ...`);
  await page.goto(`https://roamresearch.com/#/app/${graph}`, {
    waitUntil: 'domcontentloaded',
    timeout: 90_000,
  });
  await page.waitForFunction(
    () => {
      try {
        return (
          window.roamAlphaAPI &&
          window.roamAlphaAPI.q('[:find (count ?e) . :where [?e :node/title]]') > 0
        );
      } catch {
        return false;
      }
    },
    { timeout: 180_000, polling: 2_000 }
  );
  // Wait for sync to finish streaming blocks in.
  let prev = -1;
  for (let i = 0; i < 60; i++) {
    const count = await page.evaluate(() =>
      window.roamAlphaAPI.q('[:find (count ?e) . :where [?e :block/uid]]')
    );
    if (count === prev) break;
    prev = count;
    await page.waitForTimeout(3_000);
  }
  console.log(`Graph loaded: ${prev} entities.`);

  const json = await page.evaluate(
    ([pattern, pagesQ, shortcutsQ]) => {
      const uids = window.roamAlphaAPI.q(pagesQ);
      const pages = uids.map((uid) =>
        window.roamAlphaAPI.pull(pattern, `[:block/uid "${uid}"]`)
      );
      let shortcuts = [];
      try {
        shortcuts = window.roamAlphaAPI.q(shortcutsQ);
      } catch {}
      return JSON.stringify({ shortcuts, pages });
    },
    [PULL_PATTERN, PAGE_UIDS_Q, SHORTCUTS_Q]
  );
  fs.writeFileSync(path.join(OUT_DIR, 'network-log.json'), JSON.stringify(network, null, 1));
  await browser.close();
  return JSON.parse(json);
}

async function exportGraph(graph, token) {
  let result;
  if (token) {
    result = await exportViaBackendApi(graph, token);
  } else {
    console.log(`No API token for ${graph} — falling back to headless browser.`);
    result = await exportViaBrowser(graph);
  }

  const out = {
    graph,
    exportedAt: new Date().toISOString(),
    transport: token ? 'backend-api' : 'browser',
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
  // Graphs without a tokenEnv get no token (an unrelated graph's token would
  // 403); ad-hoc ROAM_GRAPH runs of unlisted graphs fall back to ROAM_API_TOKEN.
  const token = cfg ? cfg.tokenEnv && process.env[cfg.tokenEnv] : process.env.ROAM_API_TOKEN;
  await exportGraph(name, token || undefined);
}
