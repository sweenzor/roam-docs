# Data Model

- Your graph is a [DataScript](https://github.com/tonsky/datascript) database.
  - DataScript is an in-memory triple store: every fact is an `[entity attribute value]` datom.
    - (Datoms technically also carry a transaction id — but with no history kept, it isn't useful through the API.)
  - It's modeled on [Datomic](https://www.datomic.com/) — same datalog queries and pull syntax — but without built-in history.
  - Every page, block, and user is an entity with attributes, queryable via `roamAlphaAPI.data.q` and `roamAlphaAPI.data.pull`.
- Addressing entities
  - Lookup refs work anywhere an entity id is accepted
    - a `[unique-attribute value]` pair: 
      - `[:block/uid "abc123xyz"]`
      - `[:node/title "My Page"]`
      - `[:user/uid "BBG4fFwol..."]`
      - `[:window/id ""]`
  - `:db/id` (number) — the internal entity id you see in query and pull results.
    - Stable within a live graph, but not across export/import — persist `:block/uid`s, never entity ids.
  - Reverse refs: prefix the name with `_` to traverse a ref attribute backwards
    - `:block/_refs` (blocks referencing this entity = backlinks)
    - `:block/_children` (the direct parent).
- [[Querying tips]]
  - **Always use `roamAlphaAPI.data.pull` directly when you know the entity** — a pull with a lookup ref is direct index access, many times faster than a query.
    - ```javascript
      // don't q for a block's children — pull them
      window.roamAlphaAPI.data.pull(
        "[{:block/children [:block/uid :block/string]}]",
        [":block/uid", "aBc123xYz"])```
  - Clause ordering is huge for performance: `:where` clauses run top to bottom.
    - Put the most selective clause first — one anchored by a constant, a lookup ref, or an `:in` input.
    - A clause whose variables aren't bound yet scans its entire index — a leading unselective clause can make the same query drastically slower.
    - Predicate clauses (`[(...)]`) run once per remaining row — put them after the narrowing clauses.
  - Pass values through `:in` parameters instead of interpolating them into the query string.
  - For backlinks and parents, reverse-ref pulls (`:block/_refs`, `:block/_children`) are cheaper than joins.
  - All descendants of a block in one clause — no recursion needed, because `:block/parents` holds every ancestor:
    - ```javascript
      window.roamAlphaAPI.data.q(
        `[:find ?uid
          :in $ ?ancestor-uid
          :where
          [?a :block/uid ?ancestor-uid]
          [?d :block/parents ?a]
          [?d :block/uid ?uid]]`,
        "aBc123xYz")
      // => the uid of every block anywhere under it```
  - Narrow your pull patterns — `[*]` combined with recursive `{:block/children ...}` pulls entire subtrees; select only the attributes you need.
  - Fetching many entities? `roamAlphaAPI.data.pull_many` beats pulling in a loop.
  - For genuinely expensive queries: `roamAlphaAPI.data.backend.q` runs off the main thread, and `roamAlphaAPI.data.fast.q` is ~33% faster for read access — and remember the 20-second timeout.
- Entities
  - **Page**
    - Description::
      - A page is an entity with a unique `:node/title`
      - Its content lives in `:block/children`. There is no `:block/string`.
    - Attributes::
      - `:node/title` (string, unique) — the page title
      - `:block/uid` (string, unique) — the page's uid (daily notes use `MM-DD-YYYY`)
      - `:log/id` (number) — present on daily note pages; treat it as a presence flag ("is this a daily note?")
        - The value resembles the date in ms, but timezone offsets can skew it — don't use it for sorting or date math. Derive the date from the page's `MM-DD-YYYY` uid or its title via `roamAlphaAPI.util.pageTitleToDate`.
      - `:block/children` (refs, many) — the page's top-level blocks
      - `:children/view-type` (string, optional) — "bullet" | "numbered" | "document"
      - `:page/edit-time` (number) — rollup: time of the most recent edit anywhere on the page (this powers "recently edited")
      - `:page/edit-user` (ref) — rollup: who made that most recent edit
      - `:page/word-count` (number) — rollup: word count of the page's content
      - `:page/sidebar` (number) — present when the page is in the left-sidebar shortcuts; the value is its position (see `roamAlphaAPI.data.page.addShortcut`)
      - `:create/time` (number) — creation time, ms since epoch
      - `:create/user` (ref) — the creating user
      - `:edit/time` (number) — last edit of the page entity itself
      - `:edit/user` (ref) — who made that edit
      - PDF pages — created when a PDF is uploaded (titled from the file) — additionally carry:
        - `:pdf/url` (string) — the uploaded file's url in Roam's storage (fetch it via `roamAlphaAPI.file.get`)
        - `:pdf/fingerprints` (strings, unique, __deprecated__) — the PDF's fingerprint(s), used to recognize the same file again
        - `:pdf/content-hash` (string, unique) — hash of the file's content, also used to match re-uploads
    - Example::
      - ```javascript
        window.roamAlphaAPI.data.pull("[*]", '[:node/title "unreads"]')
        // =>
        {":db/id": 8656,
         ":node/title": "unreads",
         ":block/uid": "hvZX-ANLE",
         ":block/children": [{":db/id": 11436}, {":db/id": 11440}, {":db/id": 43580}],
         ":page/sidebar": 4,
         ":page/word-count": 12,
         ":page/edit-time": 1773242490630,
         ":page/edit-user": {":db/id": 1},
         ":create/user": {":db/id": 1},
         ":create/time": 1773242490630}```
      - ```javascript
        // a page's top-level blocks, with their text and order
        window.roamAlphaAPI.data.pull(
          "[{:block/children [:block/uid :block/string :block/order]}]",
          '[:node/title "My Page"]')
        // =>
        {":block/children": [{":block/uid": "aBc123xYz",
                              ":block/string": "first block",
                              ":block/order": 0},
                             ...]}```
  - **Block**
    - Description::
      - A block is an entity with a `:block/string`
      - It lives under a parent block or page via the parent's `:block/children`.
    - Attributes::
      - `:block/uid` (string, unique) — the block's uid
      - `:block/string` (string) — the block's text, in Roam-flavored markdown
      - `:block/order` (number) — position among siblings, 0-indexed
      - `:block/open` (boolean) — collapse state
      - `:block/children` (refs, many) — direct child blocks
      - `:block/parents` (refs, many) — **all** ancestors, from the page down to the direct parent — not just the parent
      - `:block/page` (ref) — the page the block lives on
      - `:block/refs` (refs, many) — every page or block this block references
        - `[[links]]`, `#tags`, `attribute::`, and `((block refs))` all create identical `:block/refs` datoms — the syntax only changes rendering. Check refs; don't parse strings.
        - Backlinks are the reverse: `:block/_refs`.
      - `:block/heading` (number, optional) — 1–3 when the block is styled as a heading; absent otherwise (the write API accepts 0 to clear it)
      - `:block/text-align` (string, optional) — "left" | "center" | "right" | "justify"
      - `:children/view-type` (string, optional) — "bullet" | "numbered" | "document" — note the `children` namespace
      - `:block/view-type` (string, optional) — same values as the API's block-view-type
      - `:block/props` (map, optional) — per-block component state: image/iframe sizing, slider positions, query and table settings, ...; treat as internal
      - `:create/time` (number) — creation time, ms since epoch
      - `:create/user` (ref) — the creating user
      - `:edit/time` (number) — last edit time
      - `:edit/user` (ref) — who made that edit
      - `:edit/seen-by` (refs, many) — the **User** entities who have seen this block since its last edit; powers unread indicators ("mark unread" retracts the user)
      - `:create/seen-by` (refs, many) — same, tracked from the block's creation
      - `:ent/emojis` (vector, optional) — emoji reactions on the block: `[{emoji: {native: "👍"}, users: [{uid, time}, ...]}, ...]`
      - `:annotation/origin` (ref) — on PDF highlight blocks: the PDF **Page** the highlight came from
    - Example::
      - ```javascript
        window.roamAlphaAPI.data.pull("[*]", [":block/uid", "6LMkuKL-Y"])
        // =>
        {":db/id": 16810,
         ":block/uid": "6LMkuKL-Y",
         ":block/string": "[[Developer Notes]] 🧑‍💻",
         ":block/order": 1,
         ":block/open": true,
         ":block/heading": 3,
         ":block/children": [{":db/id": 16811}],
         ":block/parents": [{":db/id": 16287}, {":db/id": 16289},
                            {":db/id": 16609}, {":db/id": 16804}],
         ":block/page": {":db/id": 16287},
         ":block/refs": [{":db/id": 17691}],
         ":create/user": {":db/id": 1},
         ":create/time": 1692372881926,
         ":edit/user": {":db/id": 1},
         ":edit/time": 1692372881926}```
      - ```javascript
        // backlinks: every block referencing a page
        window.roamAlphaAPI.data.q(
          `[:find ?s
            :in $ ?title
            :where
            [?page :node/title ?title]
            [?b :block/refs ?page]
            [?b :block/string ?s]]`,
          "My Page")
        // => [["a block referencing [[My Page]]"], ...]```
  - **User**
    - Description::
      - A member of the graph — referenced by `:create/user` and `:edit/user` on every block and page.
    - Attributes::
      - `:user/uid` (string, unique) — the user's uid; see `roamAlphaAPI.user.uid`
      - `:user/display-name` (string)
      - `:user/display-page` (ref) — the user's display page
      - `:user/email` (string, unique)
      - `:user/photo-url` (string)
      - `:user/color` (string) — the user's display color (multiplayer presence)
      - `:user/settings` (map) — the user's client settings; treat as internal
    - Example::
      - ```javascript
        // everything about the current user
        roamAlphaAPI.data.pull("[*]", [":user/uid", roamAlphaAPI.user.uid()])
        // =>
        {":db/id": 1,
         ":user/uid": "BBG4fFwolaVlT5FZQdzAI7P40aB3",
         ":user/display-name": "Josh",
         ":user/display-page": {":db/id": 42}}```
  - **Diagram**
    - Description::
      - A `{{[[diagram]]}}` block is itself the diagram entity — alongside its normal **Block** attributes, it carries the canvas's nodes and edges as component sub-entities.
    - Attributes::
      - `:diagram/nodes` (refs, many) — the diagram's nodes; each node is its own entity (with its own `:block/uid`):
        - `:diagram.node/block` (ref) — the **Block** displayed in the node
        - `:diagram.node/parent-node` (ref) — the group node containing this node, when nested
        - `:diagram.node/data` (map) — layout: `type` ("block" | "group"), `position` / `positionAbsolute` ({x, y}), `width`, `height`
      - `:diagram/edges` (refs, many) — the diagram's edges; each edge is its own entity:
        - `:diagram.edge/source` (ref) — the node the edge starts from
        - `:diagram.edge/target` (ref) — the node the edge points to
        - `:diagram.edge/data` (map, optional) — edge styling/metadata
    - Example::
      - ```javascript
        window.roamAlphaAPI.data.pull(
          `[:block/uid :block/string
            {:diagram/nodes [:diagram.node/data
                             {:diagram.node/block [:block/uid]}
                             {:diagram.node/parent-node [:db/id]}]}
            {:diagram/edges [{:diagram.edge/source [:db/id]}
                             {:diagram.edge/target [:db/id]}]}]`,
          [":block/uid", "4mJpKhngc"])
        // =>
        {":block/uid": "4mJpKhngc",
         ":block/string": "{{[[diagram]]}}",
         ":diagram/nodes": [{":diagram.node/block": {":block/uid": "gJN3BDpEy"},
                             ":diagram.node/parent-node": {":db/id": 29759},
                             ":diagram.node/data": {":type": "block",
                                                    ":position": {":x": 41, ":y": 55},
                                                    ":width": 54, ":height": 49}},
                            ...],
         ":diagram/edges": [{":diagram.edge/source": {":db/id": 29757},
                             ":diagram.edge/target": {":db/id": 29760}}]}```
  - **Attributes (`attr::`)**
    - Description::
      - The triples created by `attribute::` syntax live in `:entity/attrs` and `:attrs/lookup`. The current model is explained on [[Attributes Data Model]] — but it **will be removed** and replaced by a new attributes system, so don't build on it.
  - **Window**
    - Description::
      - A window stores one user's view state for one "window" — a page outline, its linked or unlinked references, or a sidebar window. This is where filters live.
      - `:window/id` embeds the viewing user, the window kind, and the target — e.g. "<user-uid>-body-outline-<page-uid>", "<user-uid>-mentions-page-<page-uid>", "<user-uid>-unreffed-links-<page-uid>". That's why filters are per-user.
    - Attributes::
      - `:window/id` (string, unique) — user + window kind + target
      - `:window/filters` (map) — `{includes: [...], removes: [...]}` of page uids; `roamAlphaAPI.ui.filters` reads and writes these as page titles
      - `:window/mentions-state` (map) — the window's linked-references display settings: sort, grouping, show-paths
      - windows also have their own `:block/uid`
    - Example::
      - ```javascript
        window.roamAlphaAPI.data.pull("[*]", [":window/id", "<user-uid>-mentions-page-Do97zfpcF"])
        // =>
        {":window/id": "<user-uid>-mentions-page-Do97zfpcF",
         ":block/uid": "TcokCXcKg",
         ":window/filters": {":includes": [], ":removes": []},
         ":window/mentions-state": {":sort": ["page-date", "desc"],
                                    ":show-paths": true,
                                    ":not-by-page?": false,
                                    ":nest-under-parent-results?": false}}```
  - **Internal**
    - Description::
      - Entity families for internal machinery — subject to change without notice; don't build on them: `:graph/*`, `:version/*`, `:token/*`, `:harc/*`, `:vc/*`, `:restrictions/*`, `:append-api/*`, `:last-used/time`.
