# roam-docs

A machine-friendly mirror of Roam Research's official
[developer-documentation graph](https://roamresearch.com/#/app/developer-documentation),
built for AI coding tools (Claude, ChatGPT, Cursor, …) that can't read docs that live
inside a Roam graph. Served as a static site on Cloudflare Pages.

## What's published (everything under `public/`)

| Path | What it is |
| --- | --- |
| `/llms.txt` | [llms.txt](https://llmstxt.org) index of the docs |
| `/llms-full.txt` | Full markdown export: every docs page + release notes + a live-introspected inventory of all `window.roamAlphaAPI` functions |
| `/docs/<page>.md` | One markdown file per docs page |
| `/types/roam-alpha-api.d.ts` | TypeScript definitions for `window.roamAlphaAPI` — coverage verified against live introspection, including functions missing from the official docs (e.g. `depot.getInstalledExtensions`) |
| `/examples/*` | Short copy-pasteable examples (queries, writes, extension skeleton, Backend API) |

## How it works

```
scripts/export.mjs      pulls every page of the public graph
                        → Backend API (plain HTTP) if ROAM_API_TOKEN is set
                        → else headless Chromium driving window.roamAlphaAPI.q/pull
                          (the graph is public; anonymous read-only session)
scripts/introspect.mjs  walks window.roamAlphaAPI in a live session → full function
                        inventory + probed return shapes (needs the browser by nature)
scripts/generate.mjs    data/*.json → public/ (llms.txt, llms-full.txt, docs/, index.html)
                        + verifies every introspected function appears in the .d.ts
```

`data/graph.json` and `data/api-surface.json` are committed so the site can be rebuilt
without network access. A scheduled GitHub Action (`.github/workflows/refresh.yml`)
re-runs the pipeline daily and pushes only when content actually changed; Cloudflare
Pages deploys on push.

Everything runs in the Playwright Docker image — no local installs:

```sh
docker run --rm -v "$PWD":/work -w /work/scripts mcr.microsoft.com/playwright:v1.53.0-noble \
  bash -lc "npm install && node export.mjs && node introspect.mjs && node generate.mjs"
```

## Cloudflare Pages setup (one-time)

1. Cloudflare dashboard → Workers & Pages → Create → Pages → connect this repo.
2. Build command: *(none)* · Build output directory: `public`.
3. Optionally set the repo variable `BASE_URL` (e.g. `https://roam-docs.pages.dev`) so
   `llms.txt` links are absolute, and re-run the workflow.

## Notes

- The graph is pulled via datalog (`q`/recursive `pull`), not DOM scraping; the browser
  is only the runtime that hosts the API. With a read-only `roam-graph-token` for the
  graph (only Roam can mint one — ask in #developers on their Slack), `export.mjs`
  switches to the official REST API automatically via the `ROAM_API_TOKEN` secret.
- `types/roam-alpha-api.d.ts` is hand-maintained; CI warns when Roam ships a new
  function that isn't typed yet (the generator's coverage check).
