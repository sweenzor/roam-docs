// Tests for the content-negotiation Pages Function (functions/[[path]].js):
// Accept-header parsing per RFC 9110 §12.5.1 and the request handler itself
// (against a mocked ASSETS binding). Run with `node --test` in scripts/.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const fnPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'functions',
  '[[path]].js'
);
const { parseAccept, preferredType, onRequest } = await import(pathToFileURL(fnPath).href);

const HTML = 'text/html';
const MD = 'text/markdown';

// ---------------------------------------------------------------------------
test('parseAccept: q defaults to 1, parses q, ranks specificity', () => {
  const e = parseAccept('text/html, text/*;q=0.5, */*;q=0.1');
  assert.deepEqual(
    e.map(({ type, subtype, q, specificity }) => ({ type, subtype, q, specificity })),
    [
      { type: 'text', subtype: 'html', q: 1, specificity: 2 },
      { type: 'text', subtype: '*', q: 0.5, specificity: 1 },
      { type: '*', subtype: '*', q: 0.1, specificity: 0 },
    ]
  );
});

test('parseAccept: drops malformed entries, tolerates junk q, clamps range', () => {
  assert.equal(parseAccept('gibberish, ;;, text').length, 0);
  assert.equal(parseAccept('text/html;q=abc')[0].q, 1); // malformed q → default
  assert.equal(parseAccept('text/html;q=7')[0].q, 1); // clamped to [0, 1]
  assert.equal(parseAccept('TEXT/HTML')[0].type, 'text'); // case-insensitive
  assert.equal(parseAccept(null).length, 0);
});

test('parseAccept: only the q parameter affects the score', () => {
  const e = parseAccept('text/html;level=1;q=0.4;ext=x');
  assert.equal(e[0].q, 0.4);
});

// ---------------------------------------------------------------------------
test('preferredType: no Accept header is unconstrained → default (first candidate)', () => {
  assert.equal(preferredType(null, [HTML, MD]), HTML);
  assert.equal(preferredType('', [HTML, MD]), HTML);
  assert.equal(preferredType('*/*', [HTML, MD]), HTML);
});

test('preferredType: explicit markdown wins', () => {
  assert.equal(preferredType(MD, [HTML, MD]), MD);
  assert.equal(preferredType('text/markdown;q=0.9, */*;q=0.1', [HTML, MD]), MD);
});

test('preferredType: a browser Accept header gets HTML', () => {
  const chrome = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,*/*;q=0.8';
  assert.equal(preferredType(chrome, [HTML, MD]), HTML);
});

test('preferredType: specificity beats wildcard q (RFC 9110 §12.5.1)', () => {
  // text/html;q=0 excludes HTML even though */* would allow it.
  assert.equal(preferredType('text/html;q=0, */*', [HTML, MD]), MD);
  // Exact match with lower q still defines HTML's score; markdown via */* scores higher.
  assert.equal(preferredType('text/html;q=0.2, */*;q=0.9', [HTML, MD]), MD);
});

test('preferredType: client order breaks q ties', () => {
  assert.equal(preferredType('text/markdown;q=0.8, text/html;q=0.8', [HTML, MD]), MD);
  assert.equal(preferredType('text/html;q=0.8, text/markdown;q=0.8', [HTML, MD]), HTML);
  assert.equal(preferredType('text/*', [HTML, MD]), HTML); // same entry → default order
});

test('preferredType: nothing acceptable → null (caller answers 406)', () => {
  assert.equal(preferredType('application/json', [HTML, MD]), null);
  assert.equal(preferredType('*/*;q=0', [HTML, MD]), null);
  assert.equal(preferredType('text/html;q=0, text/markdown;q=0', [HTML, MD]), null);
});

// ---------------------------------------------------------------------------
// onRequest against a mocked ASSETS binding mirroring the real site layout:
// extensionless HTML pages with .md twins, llms.txt as the landing page twin.
const SITE = {
  '/': ['<!DOCTYPE html><p>home</p>', 'text/html; charset=utf-8'],
  '/llms.txt': ['# Roam Research Docs\n', 'text/plain; charset=utf-8'],
  '/help/start-here': ['<!DOCTYPE html><p>start</p>', 'text/html; charset=utf-8'],
  '/help/start-here.md': ['# Start Here\n', 'text/markdown; charset=utf-8'],
};
const env = {
  ASSETS: {
    fetch: async (req) => {
      const { pathname } = new URL(req.url);
      const hit = SITE[pathname];
      if (!hit) return new Response('not found', { status: 404, headers: { 'Content-Type': 'text/html' } });
      return new Response(hit[0], { headers: { 'Content-Type': hit[1] } });
    },
  },
};
const get = (pathname, accept) =>
  onRequest({
    request: new Request(`https://roamdocs.fyi${pathname}`, {
      headers: accept === undefined ? {} : { Accept: accept },
    }),
    env,
  });

test('onRequest: Accept: text/markdown serves the .md twin from the page URL', async () => {
  const res = await get('/help/start-here', 'text/markdown');
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Content-Type'), 'text/markdown; charset=utf-8');
  assert.equal(res.headers.get('Content-Location'), '/help/start-here.md');
  assert.equal(res.headers.get('Vary'), 'Accept');
  assert.match(res.headers.get('Link'), /rel="alternate"; type="text\/html"/);
  assert.equal(await res.text(), '# Start Here\n');
});

test('onRequest: browsers still get HTML, plus Vary and a markdown alternate Link', async () => {
  const res = await get('/help/start-here', 'text/html,*/*;q=0.8');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('Content-Type'), /text\/html/);
  assert.equal(res.headers.get('Vary'), 'Accept');
  assert.equal(
    res.headers.get('Link'),
    '</help/start-here.md>; rel="alternate"; type="text/markdown"'
  );
  assert.equal(await res.text(), '<!DOCTYPE html><p>start</p>');
});

test('onRequest: no Accept header defaults to HTML', async () => {
  const res = await get('/help/start-here');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('Content-Type'), /text\/html/);
});

test('onRequest: the landing page negotiates to llms.txt', async () => {
  const res = await get('/', 'text/markdown');
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Content-Type'), 'text/markdown; charset=utf-8');
  assert.equal(res.headers.get('Content-Location'), '/llms.txt');
  assert.equal(await res.text(), '# Roam Research Docs\n');
});

test('onRequest: unsupported format on an existing page → 406, not a silent fallback', async () => {
  const res = await get('/help/start-here', 'application/json');
  assert.equal(res.status, 406);
  assert.match(await res.text(), /text\/html, text\/markdown/);
});

test('onRequest: unknown pages still 404 (even when only markdown is acceptable)', async () => {
  assert.equal((await get('/help/no-such-page', 'text/html')).status, 404);
  assert.equal((await get('/help/no-such-page', 'text/markdown')).status, 404);
});

test('onRequest: URLs with extensions are served untouched', async () => {
  const res = await get('/help/start-here.md', 'text/html');
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Content-Type'), 'text/markdown; charset=utf-8');
  assert.equal(res.headers.get('Vary'), null);
});
