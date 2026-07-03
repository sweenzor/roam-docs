// Introspects window.roamAlphaAPI in a live (anonymous, read-only) session on the
// public developer-documentation graph. Requires a browser because the API only
// exists in the running app. Writes:
//   data/api-surface.json — every namespace/function with arity info
//   data/api-probes.json  — live return values of safe, side-effect-free getters
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const GRAPH = process.env.ROAM_GRAPH || 'developer-documentation';
const OUT_DIR = process.env.OUT_DIR || path.resolve(import.meta.dirname, '..', 'data');
fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
console.log(`Loading https://roamresearch.com/#/app/${GRAPH} ...`);
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

// ---- API surface ------------------------------------------------------------
const surface = await page.evaluate(() => {
  const seen = new WeakSet();
  const ARITY_RE = /^cljs\$core\$IFn\$_invoke\$arity\$(\d+)$/;
  function describeFn(fn) {
    const arities = [];
    for (const k of Object.getOwnPropertyNames(fn)) {
      const m = k.match(ARITY_RE);
      if (m) arities.push(Number(m[1]));
    }
    return {
      kind: 'function',
      jsLength: fn.length,
      cljsArities: arities.sort((a, b) => a - b),
      variadic: 'cljs$core$IFn$_invoke$arity$variadic' in fn,
    };
  }
  function walk(obj, depth) {
    if (depth > 7) return { kind: 'max-depth' };
    const out = {};
    for (const k of Object.keys(obj)) {
      let v;
      try {
        v = obj[k];
      } catch {
        continue;
      }
      if (typeof v === 'function') out[k] = describeFn(v);
      else if (v && typeof v === 'object') {
        if (seen.has(v)) {
          out[k] = { kind: 'circular' };
          continue;
        }
        seen.add(v);
        out[k] = { kind: 'namespace', children: walk(v, depth + 1) };
      } else out[k] = { kind: typeof v, value: String(v).slice(0, 200) };
    }
    return out;
  }
  return JSON.stringify({ roamAlphaAPI: walk(window.roamAlphaAPI, 0) });
});
fs.writeFileSync(
  path.join(OUT_DIR, 'api-surface.json'),
  JSON.stringify(JSON.parse(surface), null, 1)
);
console.log('Wrote api-surface.json.');

// ---- Live probes of side-effect-free getters --------------------------------
const probes = await page.evaluate(async () => {
  const A = window.roamAlphaAPI;
  const targets = {
    'apiVersion': () => A.apiVersion,
    'graph': () => A.graph,
    'platform': () => A.platform,
    'constants': () => A.constants,
    'depot.getInstalledExtensions()': () => A.depot.getInstalledExtensions(),
    'user.uid()': () => A.user.uid(),
    'user.isAdmin()': () => A.user.isAdmin(),
    'data.semanticSearchEnabled()': () => A.data.semanticSearchEnabled(),
    'util.generateUID()': () => A.util.generateUID(),
    'util.dateToPageTitle(new Date(2026,0,15))': () => A.util.dateToPageTitle(new Date(2026, 0, 15)),
    'util.dateToPageUid(new Date(2026,0,15))': () => A.util.dateToPageUid(new Date(2026, 0, 15)),
    "util.pageTitleToDate('January 15th, 2026')": () => A.util.pageTitleToDate('January 15th, 2026'),
    'ui.rightSidebar.getWindows()': () => A.ui.rightSidebar.getWindows(),
    'ui.getFocusedBlock()': () => A.ui.getFocusedBlock(),
    'ui.filters.getGlobalFilters()': () => A.ui.filters.getGlobalFilters(),
    'ui.multiselect.getSelected()': () => A.ui.multiselect.getSelected(),
    'ui.individualMultiselect.getSelectedUids()': () => A.ui.individualMultiselect.getSelectedUids(),
    'ui.mainWindow.getOpenView()': () => A.ui.mainWindow.getOpenView(),
    'ui.mainWindow.getOpenPageOrBlockUid()': () => A.ui.mainWindow.getOpenPageOrBlockUid(),
    "q('[:find (count ?e) . :where [?e :block/uid]]')": () =>
      A.q('[:find (count ?e) . :where [?e :block/uid]]'),
    "pull(minimal)": () =>
      A.pull('[:block/uid :node/title]', '[:block/uid "nNdE8rkMx"]'),
  };
  const results = {};
  for (const [name, fn] of Object.entries(targets)) {
    try {
      let v = fn();
      if (v && typeof v.then === 'function') {
        v = await Promise.race([v, new Promise((_, rj) => setTimeout(() => rj(new Error('probe timeout')), 5000))]);
        results[name] = { async: true, value: v === undefined ? '<<undefined>>' : v };
      } else {
        results[name] = { async: false, value: v === undefined ? '<<undefined>>' : v };
      }
      if (v instanceof Date) results[name].value = { '<<Date>>': v.toISOString() };
    } catch (e) {
      results[name] = { error: String(e && e.message) };
    }
  }
  // Normalize the one random value so repeated runs produce identical output.
  if (results['util.generateUID()']?.value)
    results['util.generateUID()'].value = '<9-char uid, e.g. "wG2VsyRpi">';
  return JSON.stringify(results, (k, v) => (typeof v === 'function' ? '<<function>>' : v));
});
fs.writeFileSync(
  path.join(OUT_DIR, 'api-probes.json'),
  JSON.stringify(JSON.parse(probes), null, 1)
);
console.log('Wrote api-probes.json.');

await browser.close();
console.log('Done.');
