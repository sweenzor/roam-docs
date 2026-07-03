// Exports the public Roam Research developer-documentation graph to data/graph.json.
//
// Two transports, in order of preference:
//   1. Roam Backend API (official REST) — used when ROAM_API_TOKEN is set.
//      Requires a read-only roam-graph-token for the graph (only the graph
//      owner can mint one; ask the Roam Research team in #developers on their Slack).
//      Plain HTTP: runs anywhere, no browser needed.
//   2. Headless Chromium fallback (anonymous read-only session on the public
//      graph, driving the same datalog API via window.roamAlphaAPI).
//
// Both produce an identical graph.json so generate.mjs doesn't care which ran.

import fs from 'node:fs';
import path from 'node:path';

const GRAPH = process.env.ROAM_GRAPH || 'developer-documentation';
const TOKEN = process.env.ROAM_API_TOKEN;
const OUT_DIR = process.env.OUT_DIR || path.resolve(import.meta.dirname, '..', 'data');
fs.mkdirSync(OUT_DIR, { recursive: true });

const PULL_PATTERN =
  '[:block/uid :node/title :block/string :block/order :block/heading :children/view-type {:block/refs [:block/uid]} {:block/children ...}]';
const PAGE_UIDS_Q = '[:find [?uid ...] :where [?e :node/title] [?e :block/uid ?uid]]';
const SHORTCUTS_Q =
  '[:find ?title ?order :where [?e :page/sidebar ?order] [?e :node/title ?title]]';

async function exportViaBackendApi() {
  const base = `https://api.roamresearch.com/api/graph/${GRAPH}`;
  const post = async (route, body) => {
    const res = await fetch(`${base}/${route}`, {
      method: 'POST',
      redirect: 'follow', // api.roamresearch.com redirects to the graph's shard
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        // X-Authorization survives cross-origin redirects (Authorization is stripped)
        'x-authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST /${route} -> ${res.status}: ${(await res.text()).slice(0, 500)}`);
    return (await res.json()).result;
  };

  const uids = await post('q', { query: PAGE_UIDS_Q });
  console.log(`Backend API: ${uids.length} pages, pulling trees...`);
  const pages = [];
  const CONCURRENCY = 4;
  for (let i = 0; i < uids.length; i += CONCURRENCY) {
    const batch = uids.slice(i, i + CONCURRENCY);
    const pulled = await Promise.all(
      batch.map((uid) =>
        post('pull', { selector: PULL_PATTERN, eid: `[:block/uid "${uid}"]` })
      )
    );
    pages.push(...pulled.filter(Boolean));
    if (i % 100 < CONCURRENCY) console.log(`  ${Math.min(i + CONCURRENCY, uids.length)}/${uids.length}`);
  }
  let shortcuts = [];
  try {
    shortcuts = await post('q', { query: SHORTCUTS_Q });
  } catch (e) {
    console.warn('shortcuts query failed:', e.message);
  }
  return { shortcuts, pages };
}

async function exportViaBrowser() {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const network = [];
  page.on('request', (r) =>
    network.push({ kind: 'request', method: r.method(), type: r.resourceType(), url: r.url() })
  );
  page.on('websocket', (ws) => network.push({ kind: 'websocket', url: ws.url() }));

  console.log(`Browser fallback: loading https://roamresearch.com/#/app/${GRAPH} ...`);
  await page.goto(`https://roamresearch.com/#/app/${GRAPH}`, {
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

let result;
if (TOKEN) {
  result = await exportViaBackendApi();
} else {
  console.log('ROAM_API_TOKEN not set — falling back to headless browser.');
  result = await exportViaBrowser();
}

const out = {
  graph: GRAPH,
  exportedAt: new Date().toISOString(),
  transport: TOKEN ? 'backend-api' : 'browser',
  shortcuts: result.shortcuts,
  pages: result.pages,
};
fs.writeFileSync(path.join(OUT_DIR, 'graph.json'), JSON.stringify(out, null, 1));
console.log(`Wrote graph.json (${out.pages.length} pages) via ${out.transport}.`);
