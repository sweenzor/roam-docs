# roam/agent guidelines

- This graph is Roam's public developer documentation: the frontend API ([[Roam Alpha API]]), [[Roam Depot/Extension API]], the backend/HTTP APIs, [[roam/js]], [[roam/css]], and related pages. Readers are extension developers — human and AI.
- For agents reading this graph, start with the starred pages or [[Developer Hub]]
  - Reading efficiently
    - On [[Roam Alpha API]], every method heading is its full dotted path (`roamAlphaAPI.data.block.create`) — search that string and fetch just that block instead of loading the whole page.
    - [[Roam Alpha API (old)]] is the pre-2026 archive holding the historical change log — don't edit it and there is no need to read that page.
- Only for agents writing to this graph (ignore if you are just reading documentation)
  - Accuracy is the prime rule
    - These docs describe the Roam codebase. Verify behavioral claims against the source (or by live-testing) before writing them.
    - Implementations outrank code comments and docstrings, which can be stale.
  - Style
    - One fact per block; nest details under a short lead block instead of writing long blocks.
    - Code examples show their return values as comments.
    - Don't duplicate content across blocks or pages — link with `((block refs))` or `[[page refs]]` instead.
