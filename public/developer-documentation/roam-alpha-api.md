# Roam Alpha API

- **Getting Started**
  - The Roam Alpha API is provided in the browser, letting you read and write data and drive the UI. It lives on the `window` object as `window.roamAlphaAPI` and is available from [[roam/js]]/[[roam/cljs]] code blocks, Roam Depot extensions, [[roam/render]], and the browser console.
  - Despite the name, the API is no longer really "alpha" — we just can't change the name at this point. Breaking changes are rare and announced in the **Change Log**.
  - For the ClojureScript version of this API, see the Reference section of [[roam/cljs]].
  - Missing something? If the API doesn't have a function you think it should, reach out on Slack ([[Contact Us]]) — we're happy to make additions.
- **Conventions**
  - Write promises resolve once Roam has applied the operation — after the triggering event and all of its descendant events are handled.
    - The promise resolves before React re-renders, so if you manipulate the DOM right after a write you may still need a very small timeout.
    - Failures reject the promise — use `.catch()`, or `try`/`catch` with `await`.
  - Rate limit: rate-limited functions (all writes, plus a number of UI functions) share a budget of 1500 calls per 60 seconds; exceeding it throws.
    - This is to protect your graph from runaway loops.
    - If you are adding a lot of data at once, prefer creating from markdown.
  - `q`, `pull`, `pull_many` and their variants time out after 20 seconds, throwing `Query and/or pull expression took too long to run.`
  - uids
    - Block and page uids are random 9-character strings — see `roamAlphaAPI.util.generateUID`.
    - Daily note pages use the date as their uid, in `MM-DD-YYYY` format (e.g. `07-16-2026` for July 16th, 2026) — see `roamAlphaAPI.util.dateToPageUid`.
    - uids can technically be any length and they don't have to be random, but some extensions might rely on it being 9 chars
- **Reference**
  - `roamAlphaAPI.apiVersion` (string) — the API version, e.g. "1.1.3"; use it for feature detection
  - `roamAlphaAPI.data`
    - Description::
      - Queries and reads, plus the write API for blocks, pages, and users.
    - `roamAlphaAPI.data.q`
      - Description::
        - Query the graph with Datomic-flavored datalog. Synchronous.
        - See the [datomic docs](https://docs.datomic.com/query/query-data-reference.html) for the query syntax, [learndatalogtoday.org](http://www.learndatalogtoday.org) to learn it, and the [datascript tests](https://github.com/tonsky/datascript/tree/master/test/datascript/test) for good examples.
        - The attributes you can query are documented on [[Data Model]].
        - Legacy alias: `roamAlphaAPI.q` (older top-level name; prefer this namespaced path)
        - Times out after 20 seconds by default; include a `:timeout <ms>` clause in the query to override.
        - Datalog rules are supported — pass a rule set as an input bound to `%` in the `:in` clause; rules can be recursive.
        - Function and predicate clauses are limited to DataScript's built-ins — comparisons, arithmetic, logic, collection helpers (`count`, `contains?`, `get`, ...), string helpers (`str`, `subs`, `clojure.string/includes?`/`starts-with?`/`ends-with?`/`blank?`), and regex (`re-find`, `re-matches`, `re-seq`, `re-pattern`). Custom functions can't be resolved from JS query strings.
      - Parameters::
        - `query` (string, required) — the datalog query
        - `...args` (optional) — additional inputs, bound to the query's `:in` clauses (the database itself is passed implicitly)
      - Return::
        - Array of result tuples
      - Example::
        - ```javascript
          // all block uids and strings in the graph
          window.roamAlphaAPI.data.q(
            `[:find ?b ?s
              :where
              [?e :block/uid ?b]
              [?e :block/string ?s]]`);
          // => [["y3LFc4rFd", "some block text"], ["09sbCUlgt", "another block"], ...]

          // with an :in argument
          window.roamAlphaAPI.data.q(
            `[:find ?s
              :in $ ?uid
              :where
              [?e :block/uid ?uid]
              [?e :block/string ?s]]`,
            "abc123xyz");
          // => [["the block's text"]]```
    - `roamAlphaAPI.data.pull`
      - Description::
        - Declaratively fetch a (possibly nested) selection of attributes for one entity. Synchronous.
        - See the [datomic pull docs](https://docs.datomic.com/query/query-pull.html) — Roam uses [datascript](https://github.com/tonsky/datascript) internally, which supports the majority of datomic syntax. In the JS API the pattern is a string rather than clojure data.
        - The attributes you can pull are documented on [[Data Model]].
        - Legacy alias: `roamAlphaAPI.pull` (older top-level name; prefer this namespaced path)
      - Parameters::
        - `pattern` (string, required) — pull pattern, e.g. `"[*]"` or `"[:block/string {:block/children ...}]"`
        - `eid` (required) — one of:
          - a `:db/id` integer, e.g. `24`
          - a lookup ref as a string, e.g. `"[:node/title \"hello world\"]"`
          - a lookup ref as a 2-element array, e.g. `[":block/uid", "xyz"]`
        - `opts` (object, optional) — `{timeout: <ms>}` overrides the default 20-second timeout
      - Return::
        - Object of the pulled attributes
      - Example::
        - ```javascript
          // all attributes of this block
          window.roamAlphaAPI.data.pull("[*]", [":block/uid", "xyz"])
          // =>
          {":block/uid": "xyz",
           ":block/string": "the block's text",
           ":block/order": 0,
           ":block/open": true,
           ":create/time": 1610031973159,
           ":edit/time": 1610031974560,
           ":block/children": [{":db/id": 1234}],
           ":db/id": 1041}

          // this block's string and all of its descendants
          window.roamAlphaAPI.data.pull("[:block/string {:block/children ...}]", "[:block/uid \"xyz\"]")
          // =>
          {":block/string": "the block's text",
           ":block/children": [{":block/string": "child text"}]}```
    - `roamAlphaAPI.data.pull_many`
      - Description::
        - Same as `roamAlphaAPI.data.pull`, but for many entities at once — faster than pulling in a loop. Synchronous.
      - Parameters::
        - `pattern` (string, required) — same as `roamAlphaAPI.data.pull`'s `pattern`
        - `eids` (array, required) — array of eids, each in any of the forms `roamAlphaAPI.data.pull`'s `eid` accepts
        - `opts` (object, optional) — `{timeout: <ms>}` overrides the default 20-second timeout
      - Return::
        - Array of pulled objects
      - Example::
        - ```javascript
          roamAlphaAPI.data.pull_many("[*]",
            [[":block/uid", "_fM7pkQEa"], [":block/uid", "kZHsZniZs"]]);
          // =>
          [{":block/uid": "_fM7pkQEa",
            ":block/string": "first block",
            ...},
           {":block/uid": "kZHsZniZs",
            ":block/string": "second block",
            ...}]```
    - `roamAlphaAPI.data.fast.q`
      - Description::
        - Same signature as `roamAlphaAPI.data.q`, using an experimental clojurescript→javascript conversion that makes read access roughly 33% faster.
      - Return::
        - A cljs object wrapped in a JS [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Treat it as **read only**; it may not print to the console correctly.
        - Key access includes the full namespaced key: `obj[":block/string"]`. If you rename a key in the pull (`[:block/string :as "string"]`), access it as `obj.string`.
        - For the internals and trade-offs, see https://blog.wsscode.com/alternative-to-clj-js/
      - Example::
        - ```javascript
          window.roamAlphaAPI.data.fast.q(
            `[:find ?b ?s
              :where
              [?e :block/uid ?b]
              [?e :block/string ?s]]`);
          // => proxy-wrapped results — index like a regular array, treat as read only```
    - `roamAlphaAPI.data.backend.q`
      - Description::
        - Same signature as `roamAlphaAPI.data.q`, but runs the query on the backend, off the main thread — useful for expensive queries.
        - Falls back to running locally when the graph's backend is unavailable (encrypted graphs, offline graphs).
        - **Warning**: the backend can be a few changes behind the frontend while local changes are still syncing.
      - Return::
        - Promise resolving to the query results
      - Example::
        - ```javascript
          await window.roamAlphaAPI.data.backend.q(
            `[:find ?b ?s
              :where
              [?e :block/uid ?b]
              [?e :block/string ?s]]`);
          // => [["y3LFc4rFd", "some block text"], ...]```
    - `roamAlphaAPI.data.async`
      - Description::
        - Promise-returning read functions. Most mirror a synchronous peer (`q`, `pull`, `pull_many`, `search`, `fast.q`); `semanticSearch` is async-only.
        - Eventually Roam may migrate to the async API and deprecate the synchronous reads — **prefer these when building new extensions**.
      - `roamAlphaAPI.data.async.q`
        - Description::
          - Promise-returning version of `roamAlphaAPI.data.q`. Same 20-second timeout, overridable with a `:timeout` clause in the query.
        - Parameters::
          - Same as `roamAlphaAPI.data.q`
        - Return::
          - Promise resolving to an array of result tuples
        - Example::
          - ```javascript
            await roamAlphaAPI.data.async.q(
              `[:find ?s
                :in $ ?uid
                :where
                [?e :block/uid ?uid]
                [?e :block/string ?s]]`,
              "abc123xyz")
            // => [["the block's text"]]```
      - `roamAlphaAPI.data.async.pull`
        - Description::
          - Promise-returning version of `roamAlphaAPI.data.pull`.
        - Parameters::
          - Same as `roamAlphaAPI.data.pull`
        - Return::
          - Promise resolving to the pulled attributes object
        - Example::
          - ```javascript
            await roamAlphaAPI.data.async.pull("[*]", [":block/uid", "xyz"], {timeout: 60000})
            // => {":block/uid": "xyz", ":block/string": "the block's text", ...}```
      - `roamAlphaAPI.data.async.pull_many`
        - Description::
          - Promise-returning version of `roamAlphaAPI.data.pull_many`.
        - Parameters::
          - Same as `roamAlphaAPI.data.pull_many`
        - Return::
          - Promise resolving to an array of pulled objects
        - Example::
          - ```javascript
            await roamAlphaAPI.data.async.pull_many("[*]",
              [[":block/uid", "_fM7pkQEa"], [":block/uid", "kZHsZniZs"]], {timeout: 60000})
            // => [{":block/uid": "_fM7pkQEa", ...}, {":block/uid": "kZHsZniZs", ...}]```
      - `roamAlphaAPI.data.async.search`
        - Description::
          - Promise-returning version of `roamAlphaAPI.data.search`. Uses the search worker when available, transparently falling back to the standard search — same parameters and return shape.
          - Priority returned from the search worker is different than synchronous version
        - Parameters::
          - Same as `roamAlphaAPI.data.search`
        - Return::
          - Promise resolving to an array of results matching the pull pattern
        - Example::
          - ```javascript
            await roamAlphaAPI.data.async.search({"search-str": "my query", limit: 50})
            // => [{":node/title": "My Query Notes", ":block/uid": "aBc123xYz"}, ...]```
      - `roamAlphaAPI.data.async.semanticSearch`
        - Description::
          - Hybrid semantic + keyword search, ranked by relevance.
          - See [the docs](https://roamresearch.com/#/app/help/page/CslZS1zBh) for how to set it up
          - Requires embeddings to be enabled and a signed-in user — throws when unavailable, so check `roamAlphaAPI.data.semanticSearchEnabled` first. While embeddings are still indexing, it returns partial results rather than throwing.
        - Parameters::
          - `search-str` (string, required) — the search query (`search-string` is accepted as an alias)
          - `k` (number, optional, default 25, max 200) — number of results (also the search pool size)
          - `search-blocks` (boolean, optional, default true) — include block results
          - `search-pages` (boolean, optional, default true) — include page results
          - `hide-code-blocks` (boolean, optional, default: the user's hide-code-blocks setting) — exclude code blocks
        - Return::
          - Promise resolving to an array of hit records `{type, uid, topUids}`:
            - `type` — "chunk", "block", or "page"
            - `uid` — the hit's primary block uid (the first of `topUids`)
            - `topUids` — the hit's top-level block uids
          - Array order is the relevance ranking — there is no per-hit score, since results mix semantic and keyword matches.
        - Example::
          - ```javascript
            await roamAlphaAPI.data.async.semanticSearch({"search-str": "my query"})
            // =>
            [{type: "chunk",
              uid: "aBc123xYz",
              topUids: ["aBc123xYz", "dEf456uVw"]},
             {type: "page",
              uid: "gHi789jKl",
              topUids: ["gHi789jKl"]},
             ...]```
      - `roamAlphaAPI.data.async.fast.q`
        - Description::
          - Promise-returning version of `roamAlphaAPI.data.fast.q` — same proxy-wrapped, read-only result.
        - Parameters::
          - Same as `roamAlphaAPI.data.q`
        - Return::
          - Promise resolving to the proxy-wrapped results
        - Example::
          - ```javascript
            await roamAlphaAPI.data.async.fast.q(
              `[:find ?b :where [?e :block/uid ?b]]`)
            // => proxy-wrapped results (read only)```
    - `roamAlphaAPI.data.search`
      - Description::
        - Search pages and blocks by text — the same algorithm as the [Find or Create Page](https://roamresearch.com/#/app/help/page/dZJfiNHj1) search in the UI. Synchronous.
        - Results are ranked by relevance using the following priority:
          - **Rank 0**: Page title exactly matches query
          - **Rank 1**: Page title contains query as substring
          - **Rank 2**: Page title contains all query words (multi-word queries only)
          - **Rank 3**: Block contains query as substring
          - **Rank 4**: Block contains all query words (multi-word queries only)
      - Parameters::
        - `search-str` (string, required) — the search query (`search-string` is accepted as an alias)
        - `search-blocks` (boolean, optional, default true) — include block results
        - `search-pages` (boolean, optional, default true) — include page results
        - `hide-code-blocks` (boolean, optional, default: the user's hide-code-blocks setting) — exclude code blocks from results
        - `limit` (number, optional, default 300, max 1000) — maximum number of results
        - `pull` (string | array, optional, default `[:block/string :node/title :block/uid]`) — pull pattern for the returned fields
      - Return::
        - Array of results matching the pull pattern
      - Example::
        - ```javascript
          roamAlphaAPI.data.search({"search-str": "my query"})
          // =>
          [{":node/title": "My Query Notes",
            ":block/uid": "aBc123xYz"},
           {":block/string": "a block mentioning my query",
            ":block/uid": "dEf456uVw"},
           ...]```
    - `roamAlphaAPI.data.semanticSearchEnabled`
      - Description::
        - Whether semantic search is currently usable for this graph — `true` when embeddings are enabled **and** a user is signed in. Synchronous.
        - Check this before calling `roamAlphaAPI.data.async.semanticSearch`, which throws when semantic search isn't available.
      - Parameters::
        - None
      - Return::
        - boolean
      - Example::
        - ```javascript
          roamAlphaAPI.data.semanticSearchEnabled()
          // => true```
    - `roamAlphaAPI.data.roamQuery`
      - Description::
        - Execute a Roam query — the same syntax used in `{{[[query]]: ...}}` blocks — and return matching blocks/pages.
        - Two modes of operation:
          - **UID mode**: Pass the `uid` of an existing query block to use its stored settings
          - **Query mode**: Pass a `query` string directly with optional display settings
        - Note: unlike the rest of `roamAlphaAPI`, the parameters are camelCase.
      - Parameters::
        - `uid` (string) — block uid of an existing query block; uses that block's stored display settings
        - `query` (string, required if no `uid`) — a query string, e.g. `"{and: [[project]] [[active]]}"`
        - `groupByPage` (boolean, optional, default true) — group results by page (query mode only)
        - `nestUnderParent` (boolean, optional, default false) — collapse child matches under their parent (query mode only)
        - `sort` (string, optional; query mode only)
          - with `groupByPage`: "page-most-recent" (default) | "page-title" | "page-created-date" | "daily-note"
          - without: "created-date" (default) | "edited-date" | "daily-note-date"
        - `sortOrder` (string, optional, default "desc") — "asc" or "desc" (query mode only)
        - `offset` (integer, optional, default 0) — number of results to skip
        - `limit` (integer | null, optional, default 20) — maximum results; pass null for all
        - `pull` (string, optional, default `"[:block/string :node/title :block/uid]"`) — pull pattern for the results
      - Return::
        - Promise resolving to `{total: <number>, results: <array of pulled results>}`
      - Example::
        - ```javascript
          await window.roamAlphaAPI.data.roamQuery({query: "{and: [[project]] [[active]]}"})
          // => {total: 42, results: [{":block/string": "...", ":block/uid": "aBc123xYz"}, ...]}

          // run an existing query block with its stored settings
          await window.roamAlphaAPI.data.roamQuery({uid: "abc123def"})
          // => {total: 7, results: [...]}```
    - `roamAlphaAPI.data.addPullWatch`
      - Description::
        - Watch a pull pattern on an entity: the callback fires after changes are recorded, with the before and after state. Changes are debounced (~100ms). Takes positional arguments.
      - Parameters::
        - `pattern` (string, required) — the pull pattern to watch
        - `entity-id` (string, required) — the entity to watch, e.g. `'[:block/uid "02-21-2021"]'`
        - `callback` (function, required) — called with `(before, after)` pull results
      - Return::
        - Promise resolving to `null` once the watch is registered
      - Example::
        - ```javascript
          window.roamAlphaAPI.data.addPullWatch(
            "[:block/children :block/string {:block/children ...}]",
            '[:block/uid "02-21-2021"]',
            (before, after) => { console.log("before", before, "after", after); })
          // resolves to null; the callback later fires with the before/after pull results```
    - `roamAlphaAPI.data.removePullWatch`
      - Description::
        - Remove pull watches. With all three arguments, removes only the watch with that callback; without `callback`, removes every watch for that pattern + entity; **with no arguments at all, removes all pull watches**. Takes positional arguments.
      - Parameters::
        - `pattern` (string, optional) — the same value passed to `roamAlphaAPI.data.addPullWatch`
        - `entity-id` (string, optional) — the same value passed to `roamAlphaAPI.data.addPullWatch`
        - `callback` (function, optional) — the callback to remove
      - Return::
        - Promise resolving to `null` (the two-argument form resolves to `true`)
      - Example::
        - ```javascript
          window.roamAlphaAPI.data.removePullWatch(
            "[:block/children :block/string {:block/children ...}]",
            '[:block/uid "02-21-2021"]',
            myCallbackFn)
          // resolves to null```
    - `roamAlphaAPI.data.undo`
      - Description::
        - Undo the latest change made in this session — the same operation as the Undo command (`cmd-z`).
      - Parameters::
        - None
      - Return::
        - Promise resolving to `undefined`
    - `roamAlphaAPI.data.redo`
      - Description::
        - Redo the last undone change — the same operation as the Redo command (`cmd-shift-z`).
      - Parameters::
        - None
      - Return::
        - Promise resolving to `undefined`
    - `roamAlphaAPI.data.block`
      - `roamAlphaAPI.data.block.create`
        - Description::
          - Create a new block at a location.
          - Legacy alias: `roamAlphaAPI.createBlock` (older top-level name; prefer this namespaced path)
        - Parameters::
          - `location` (object, required)
            - `parent-uid` (string, required) — uid of the parent block or page
            - `order` (number | "first" | "last", required) — position among the parent's children, 0-indexed
          - `block` (object, required)
            - `string` (string, required) — text content of the block
            - `uid` (string, optional) — autogenerated if omitted; pass one (see `roamAlphaAPI.util.generateUID`) only when you need to know it ahead of time
            - `open` (boolean, optional, default true) — collapse state
            - `heading` (integer, optional) — heading styling, 0 (none) to 3
            - `text-align` (string, optional) — "left" | "center" | "right" | "justify"
            - `children-view-type` (string, optional) — view type of the block's children: "bullet" | "numbered" | "document"
            - `block-view-type` (string, optional) — view type of the block itself: "outline" | "horizontal-outline" | "popout" | "tabs" | "comment" | "side" | "vertical"
        - Return::
          - Promise resolving to `undefined`; rejects if `parent-uid` doesn't exist or `uid` is already taken
        - Example::
          - ```javascript
            await window.roamAlphaAPI.data.block.create(
              {"location": {"parent-uid": "01-21-2021", "order": 0},
               "block": {"string": "test"}})
            // => undefined```
      - `roamAlphaAPI.data.block.update`
        - Description::
          - Update a block's text and/or display properties. Only the keys you pass are changed.
          - Legacy alias: `roamAlphaAPI.updateBlock` (older top-level name; prefer this namespaced path)
        - Parameters::
          - `block` (object, required)
            - `uid` (string, required) — block to update
            - `string` (string, optional) — new text content
            - `open` (boolean, optional) — collapse state
            - `heading` (integer, optional) — heading styling, 0 (none) to 3
            - `text-align` (string, optional) — "left" | "center" | "right" | "justify"
            - `children-view-type` (string, optional) — view type of the block's children: "bullet" | "numbered" | "document"
            - `block-view-type` (string, optional) — view type of the block itself: "outline" | "horizontal-outline" | "popout" | "tabs" | "comment" | "side" | "vertical"
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            await window.roamAlphaAPI.data.block.update(
              {"block": {"uid": "f8cXfDIRn", "string": "Love"}})
            // => undefined```
      - `roamAlphaAPI.data.block.move`
        - Description::
          - Move a block (together with its children) to a new location.
          - Legacy alias: `roamAlphaAPI.moveBlock` (older top-level name; prefer this namespaced path)
        - Parameters::
          - `block` (object, required)
            - `uid` (string, required) — block to move
          - `location` (object, required)
            - `parent-uid` (string, required) — uid of the new parent block or page
            - `order` (number | "first" | "last", required) — position among the new parent's children
        - Return::
          - Promise resolving to `undefined`; rejects if the block or `parent-uid` doesn't exist
        - Example::
          - ```javascript
            await window.roamAlphaAPI.data.block.move(
              {"location": {"parent-uid": "01-21-2021", "order": 0},
               "block": {"uid": "f8cXfDIRn"}})
            // => undefined```
      - `roamAlphaAPI.data.block.delete`
        - Description::
          - Delete a block and all of its children; the order of the remaining siblings is recalculated.
          - Legacy alias: `roamAlphaAPI.deleteBlock` (older top-level name; prefer this namespaced path)
        - Parameters::
          - `block` (object, required)
            - `uid` (string, required) — block to delete
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            await window.roamAlphaAPI.data.block.delete(
              {"block": {"uid": "f8cXfDIRn"}})
            // => undefined```
      - `roamAlphaAPI.data.block.reorderBlocks`
        - Description::
          - Reorder the direct children of a block. Pass **all** current children of `parent-uid` — no other blocks, no duplicates — in the desired order.
        - Parameters::
          - `location` (object, required)
            - `parent-uid` (string, required) — uid of the new parent block or page
            - `order` (number | "first" | "last", required) — position among the new parent's children
          - `blocks` (array of strings, required) — every child uid of `parent-uid`, listed in the new order
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            await roamAlphaAPI.data.block.reorderBlocks(
              {location: {"parent-uid": "ihu5eUofL"},
               blocks: ["QCE0cNNNL", "IATKcVmWE", "nC22orMO4"]})
            // => undefined```
      - `roamAlphaAPI.data.block.fromMarkdown`
        - Description::
          - Parse a markdown string into blocks and insert them at a location. Uses the same parser as file import: nested lists become nested blocks; headings, code blocks, bold, italic, links, etc. are supported.
          - Note: in **document-shaped** markdown, a heading nests the content that follows it — e.g. `# Hello` followed by a two-item list parses to **one** top-level block with the list as its children. In **outliner-shaped** input (every non-blank line a `- ` bullet or an indented continuation), headings stay flat labels — the same content written as `- # Hello` plus bullet items parses to flat siblings. (File import and paste always nest.)
        - Parameters::
          - `location` (object, required)
            - `parent-uid` (string, required) — uid of the new parent block or page
            - `order` (number | "first" | "last", required) — position among the new parent's children
          - `markdown-string` (string, required) — the markdown content to parse into blocks
        - Return::
          - Promise resolving to `{uids: [...]}` — the uids of the top-level blocks created
        - Example::
          - ```javascript
            await window.roamAlphaAPI.data.block.fromMarkdown({
              location: {"parent-uid": "4VuwigG1O", "order": "first"},
              "markdown-string": "# Hello\n\n- Item 1\n- Item 2\n  - Nested"})
            // => {uids: ["aBc123xYz"]}
            // (one top-level block: the heading nests the list under it)```
      - `roamAlphaAPI.data.block.addComment`
        - Description::
          - Add a comment to a block. Pass either a single plain-text reply or markdown that is parsed into multiple sibling reply blocks.
        - Parameters::
          - `block-uid` (string, required) — block to comment on
          - `reply-string` (string) — plain text for a single reply block (use this **or** `reply-markdown`, not both)
          - `reply-markdown` (string) — markdown parsed into multiple sibling reply blocks
          - `reply-uid` (string, optional) — uid for the created reply block; autogenerated if omitted
          - `open-comment` (boolean, optional, default false) — open the block's comments in the sidebar after adding the reply
        - Return::
          - Promise resolving to `{uids: [...], parentUid: "..."}` — uids of the created reply block(s) and the uid of the comments block they live under
        - Example::
          - ```javascript
            // single reply
            await window.roamAlphaAPI.data.block.addComment(
              {"block-uid": "abc123", "reply-string": "This is a comment"})
            // => {uids: ["aBc123xYz"], parentUid: "dEf456uVw"}

            // markdown reply (parsed into siblings)
            await window.roamAlphaAPI.data.block.addComment(
              {"block-uid": "abc123", "reply-markdown": "First block\n- Nested child"})
            // => {uids: ["gHi789jKl"], parentUid: "dEf456uVw"}```
    - `roamAlphaAPI.data.page`
      - `roamAlphaAPI.data.page.create`
        - Description::
          - Create a new page. A title in daily-note format (`January 21st, 2021`) creates that daily note if it doesn't exist yet.
          - Legacy alias: `roamAlphaAPI.createPage` (older top-level name; prefer this namespaced path)
        - Parameters::
          - `page` (object, required)
            - `title` (string, required)
            - `uid` (string, optional) — autogenerated if omitted; in normal operation you shouldn't pass one
            - `children-view-type` (string, optional) — "bullet" | "numbered" | "document"
        - Return::
          - Promise resolving to `undefined`; rejects if a page with the given `title` or `uid` already exists
        - Example::
          - ```javascript
            await window.roamAlphaAPI.data.page.create({page: {title: "My New Page"}})
            // => undefined```
      - `roamAlphaAPI.data.page.fromMarkdown`
        - Description::
          - Create a new page and populate it with blocks parsed from a markdown string (same parser as file import). A daily-note title creates that daily note if it doesn't exist yet.
          - Note: in **document-shaped** markdown, a heading nests the content that follows it — e.g. `# Hello` followed by a two-item list parses to **one** top-level block with the list as its children. In **outliner-shaped** input (every non-blank line a `- ` bullet or an indented continuation), headings stay flat labels — the same content written as `- # Hello` plus bullet items parses to flat siblings. (File import and paste always nest.)
        - Parameters::
          - `page` (object, required)
            - `title` (string, required)
            - `uid` (string, optional) — autogenerated if omitted; in normal operation you shouldn't pass one
            - `children-view-type` (string, optional) — "bullet" | "numbered" | "document"
          - `markdown-string` (string, required) — the markdown content to parse into blocks
        - Return::
          - Promise resolving to `{uid: <page-uid>}`; rejects if a page with the given title already exists
        - Example::
          - ```javascript
            await window.roamAlphaAPI.data.page.fromMarkdown({
              page: {title: "My New Page"},
              "markdown-string": "# Heading\n\n- Item 1\n- Item 2"})
            // => {uid: "mK9pQ2rTw"}```
      - `roamAlphaAPI.data.page.update`
        - Description::
          - Update a page's title and/or children-view-type. Only the keys you pass are changed.
          - Legacy alias: `roamAlphaAPI.updatePage` (older top-level name; prefer this namespaced path)
        - Parameters::
          - `page` (object, required)
            - `uid` (string, required)
            - `title` (string, optional) — new title
            - `children-view-type` (string, optional) — "bullet" | "numbered" | "document"
        - Return::
          - Promise resolving to `undefined`; rejects when renaming to a title that already exists in the graph
        - Example::
          - ```javascript
            await window.roamAlphaAPI.data.page.update(
              {page: {uid: "RZVuh3aZN", title: "New Title"}})
            // => undefined```
      - `roamAlphaAPI.data.page.delete`
        - Description::
          - Delete a page and all of its blocks.
          - Legacy alias: `roamAlphaAPI.deletePage` (older top-level name; prefer this namespaced path)
        - Parameters::
          - `page` (object, required)
            - `uid` (string, required)
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            await window.roamAlphaAPI.data.page.delete({page: {uid: "RZVuh3aZN"}})
            // => undefined```
      - `roamAlphaAPI.data.page.addShortcut`
        - Description::
          - Add a page to the left-sidebar shortcuts, or move it if it's already there. Takes positional arguments.
        - Parameters::
          - `uid` (string, required) — page uid
          - `index` (number, optional) — position in the shortcut list; defaults to the end (capped to the valid range)
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            await roamAlphaAPI.data.page.addShortcut("12-11-2025");
            await roamAlphaAPI.data.page.addShortcut("12-11-2025", 4);
            // each => undefined```
      - `roamAlphaAPI.data.page.removeShortcut`
        - Description::
          - Remove a page from the left-sidebar shortcuts. Takes a positional argument.
        - Parameters::
          - `uid` (string, required) — page uid
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            await roamAlphaAPI.data.page.removeShortcut("12-11-2025")
            // => undefined```
    - `roamAlphaAPI.data.user`
      - `roamAlphaAPI.data.user.upsert`
        - Description::
          - Create and/or update a user entity.
        - Parameters::
          - `user-uid` (string, required)
          - `display-name` (string, optional)
          - `photo-url` (string, optional) — url of the user's photo
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            await window.roamAlphaAPI.data.user.upsert(
              {"user-uid": "BBG4fFwolaVlT5FZQdzAI7P40aB3",
               "display-name": "Josh"})
            // => undefined```
    - `roamAlphaAPI.data.ai`
      - Description::
        - Internal namespace backing Roam's MCP server tools (`getPage`, `getBlock`, `getBacklinks`, `roamQuery`, `search`, `semanticSearch`, `suggestLinks`, `searchTemplates`, `getGraphGuidelines`, `getComments`). Not a stable public surface — breaking changes land without notice; don't build on it. #[[experimental]]
  - `roamAlphaAPI.ui`
    - Description::
      - Everything that drives the interface: focus, windows, sidebars, filters, menus, and custom components.
    - `roamAlphaAPI.ui.getFocusedBlock`
      - Description::
        - Metadata about the currently focused block, or `null` if none. Synchronous.
        - More robust than CSS selectors — works even from a `roamAlphaAPI.ui.commandPalette` callback, after the block has lost focus in the DOM.
      - Parameters::
        - None
      - Return::
        - ```javascript
          {"block-uid": "YnatnbZzF",
           "window-id": "BBG4fFwolaVlT5FZQdzAI7P40aB3-body-outline-04-15-2021"}```
      - Example::
        - ```javascript
          window.roamAlphaAPI.ui.getFocusedBlock()
          // =>
          {"block-uid": "YnatnbZzF",
           "window-id": "BBG4fFwolaVlT5FZQdzAI7P40aB3-body-outline-04-15-2021"}```
    - `roamAlphaAPI.ui.setBlockFocusAndSelection`
      - Description::
        - Focus a block in a specific window, and optionally set the cursor position or selection.
      - Parameters::
        - `location` (object, optional) — same shape as `roamAlphaAPI.ui.getFocusedBlock`'s return value
          - If omitted, defaults to the currently focused block.
          - `block-uid` (string, required)
          - `window-id` (string, required) — either:
            - an actual window id, as returned by `roamAlphaAPI.ui.rightSidebar.getWindows`
            - the string "main-window" — convenience for focusing the main window
        - `selection` (object, optional)
          - If omitted, the cursor is placed at the end of the string.
          - `start` (integer, required) — 0-indexed
          - `end` (integer, optional)
            - If specified, `start`–`end` becomes a selection; otherwise the cursor is placed before the `start`-th character.
            - If `end` is less than `start`, both are treated as the value of `end`.
      - Return::
        - Promise resolving to `undefined`
      - Example::
        - ```javascript
          window.roamAlphaAPI.ui.setBlockFocusAndSelection(
            {location: window.roamAlphaAPI.ui.getFocusedBlock(),
             selection: {start: 3, end: 7}})
          // resolves to undefined```
    - `roamAlphaAPI.ui.mainWindow`
      - `roamAlphaAPI.ui.mainWindow.openBlock`
        - Description::
          - Zoom into a block in the main window. Passing a page's uid opens the page.
          - If no block or page with that uid exists, nothing happens — the promise still resolves.
        - Parameters::
          - `block` (object, required)
            - `uid` (string, required)
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            await window.roamAlphaAPI.ui.mainWindow.openBlock({block: {uid: "v9eHoHwqS"}})
            // => undefined```
      - `roamAlphaAPI.ui.mainWindow.openPage`
        - Description::
          - Open a page in the main window, by title or uid. If the page doesn't exist, nothing happens — the promise still resolves.
        - Parameters::
          - `page` (object, required) — one of:
            - `title` (string)
            - `uid` (string)
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            await window.roamAlphaAPI.ui.mainWindow.openPage({page: {title: "test-new"}})
            await window.roamAlphaAPI.ui.mainWindow.openPage({page: {uid: "RZVuh3aZN"}})
            // each => undefined```
      - `roamAlphaAPI.ui.mainWindow.openDailyNotes`
        - Description::
          - Open the daily notes log in the main window.
        - Parameters::
          - None
        - Return::
          - Promise resolving to `undefined`
      - `roamAlphaAPI.ui.mainWindow.focusFirstBlock`
        - Description::
          - Focus the first block in the main window.
          - Rejects if no first block is rendered yet — e.g. immediately after navigation, or on an empty view.
        - Parameters::
          - None
        - Return::
          - Promise resolving to `undefined`
      - `roamAlphaAPI.ui.mainWindow.getOpenPageOrBlockUid`
        - Description::
          - The uid of the page or block currently open in the main window.
        - Parameters::
          - None
        - Return::
          - Promise resolving to the uid string, or `null` when no page/block is open (e.g. the daily notes log)
        - Example::
          - ```javascript
            await window.roamAlphaAPI.ui.mainWindow.getOpenPageOrBlockUid()
            // => "Vfht187T1" (or null on the daily notes log)```
      - `roamAlphaAPI.ui.mainWindow.getOpenView`
        - Description::
          - Describes what is currently displayed in the main window.
        - Parameters::
          - None
        - Return::
          - Promise resolving to one of:
          - ```javascript
            // page
            {type: "outline",
             uid: "Vfht187T1",
             title: "My Page Title"}

            // zoomed into a block
            {type: "outline",
             uid: "abc123xyz",
             "block-string": "Some block content"}

            // daily notes
            {type: "log",
             uids: ["07-17-2026", "07-16-2026"]}

            // graph view
            {type: "graph"}

            // diagram
            {type: "diagram",
             uid: "diagram-uid"}

            // PDF viewer
            {type: "pdf",
             uid: "pdf-block-uid",
             url: "https://firebasestorage.googleapis.com/..."}

            // all pages search
            {type: "search"}

            // custom component, see registerComponent
            {type: "custom",
             id: "component-id",
             args: []}```
      - `roamAlphaAPI.ui.mainWindow.registerComponent`
        - Description::
          - Register a custom main-window view: a React component that can be opened as a full main-window view. Takes positional arguments.
        - Parameters::
          - `id` (string, required) — identifier for the component
          - `component` (React component, required)
        - Return::
          - Synchronous; the return value is internal state — treat it as void
        - Example::
          - ```javascript
            const MyView = () => React.createElement("h1", null, "Hello from my view");
            window.roamAlphaAPI.ui.mainWindow.registerComponent("my-view", MyView)
            // (return value is not meaningful)```
      - `roamAlphaAPI.ui.mainWindow.unregisterComponent`
        - Description::
          - Unregister a custom main-window view. Takes a positional argument.
        - Parameters::
          - `id` (string, required)
        - Return::
          - Synchronous; the return value is internal state — treat it as void
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.mainWindow.unregisterComponent("my-view")
            // (return value is not meaningful)```
      - `roamAlphaAPI.ui.mainWindow.openComponent`
        - Description::
          - Open a registered custom component in the main window. Takes positional arguments. Extra arguments are passed to the component and reported by `roamAlphaAPI.ui.mainWindow.getOpenView` as `args`.
        - Parameters::
          - `id` (string, required)
          - `...args` (optional) — arguments for the component
        - Return::
          - Synchronous; the return value is internal state — treat it as void
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.mainWindow.openComponent("my-view", "arg1", 42)
            // getOpenView() now reports
            // {type: "custom", id: "my-view", args: ["arg1", 42]}```
      - `roamAlphaAPI.ui.mainWindow.closeComponent`
        - Description::
          - Close the open custom component. Takes a positional argument.
        - Parameters::
          - `id` (string, required)
        - Return::
          - Synchronous; the return value is internal state — treat it as void
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.mainWindow.closeComponent("my-view")
            // (return value is not meaningful)```
    - `roamAlphaAPI.ui.leftSidebar`
      - `roamAlphaAPI.ui.leftSidebar.open`
        - Description::
          - Make the left sidebar visible.
        - Parameters::
          - None
        - Return::
          - Promise resolving to `null`
      - `roamAlphaAPI.ui.leftSidebar.close`
        - Description::
          - Hide the left sidebar.
        - Parameters::
          - None
        - Return::
          - Promise resolving to `null`
    - `roamAlphaAPI.ui.rightSidebar`
      - Description::
        - Sidebar windows are identified by `type` plus target uid — there is no window-id argument. The `window-id` string from `roamAlphaAPI.ui.rightSidebar.getWindows` is only used with `roamAlphaAPI.ui.setBlockFocusAndSelection`.
        - The target is normalized for you: passing a **page's** uid as `block-uid` with type "block" opens/matches an `outline` window for that page, and a mentions window becomes block- or page-mentions depending on the uid.
      - `roamAlphaAPI.ui.rightSidebar.open`
        - Description::
          - Make the right sidebar visible.
        - Parameters::
          - None
        - Return::
          - Promise resolving to `undefined`
      - `roamAlphaAPI.ui.rightSidebar.close`
        - Description::
          - Hide the right sidebar, keeping its open windows.
        - Parameters::
          - None
        - Return::
          - Promise resolving to `undefined`
      - `roamAlphaAPI.ui.rightSidebar.getWindows`
        - Description::
          - All open sidebar windows. Synchronous.
        - Parameters::
          - None
        - Return::
          - Array of window objects with keys:
            - `type` — "block" | "outline" | "mentions" | "graph" | "search-query"
            - `window-id` (string)
            - `order` (number), `collapsed?`, `pinned?`, `pinned-to-top?` (booleans)
            - the window's target, depending on `type`:
              - `block-uid` (plus `block-string`)
              - `page-uid` (plus `title`)
              - `mentions-uid`
                - a **page** mentions window reports `page-uid` plus `title` instead
              - `search-query-str`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.rightSidebar.getWindows()
            // =>
            [{type: "outline",
              "window-id": "sidebar-outline-mK9pQ2rTw",
              "page-uid": "mK9pQ2rTw",
              title: "My Page",
              order: 0,
              "collapsed?": false,
              "pinned?": false,
              "pinned-to-top?": false},
             {type: "block",
              "window-id": "sidebar-block-aBc123xYz",
              "block-uid": "aBc123xYz",
              "block-string": "some block text",
              order: 1,
              "collapsed?": true,
              "pinned?": false,
              "pinned-to-top?": false}]```
      - `roamAlphaAPI.ui.rightSidebar.addWindow`
        - Description::
          - Add a window to the right sidebar. If the sidebar is closed, opens it.
        - Parameters::
          - `window` (object, required)
            - `type` (string, required) — "block" | "outline" | "mentions" | "graph" | "search-query"
            - `block-uid` (string, required) — uid of the block or page the window shows; "search-query" windows take `search-query-str` instead
            - `order` (number, optional) — position in the sidebar; if not specified, the new window is added at the top
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            // a block
            window.roamAlphaAPI.ui.rightSidebar
              .addWindow({window: {type: "block", "block-uid": "1fP8LY5ED"}})

            // a page outline
            window.roamAlphaAPI.ui.rightSidebar
              .addWindow({window: {type: "outline", "block-uid": "cArVJL_vg"}})

            // linked references of a block or page
            window.roamAlphaAPI.ui.rightSidebar
              .addWindow({window: {type: "mentions", "block-uid": "vutDCPD8G"}})

            // a graph view of a page
            window.roamAlphaAPI.ui.rightSidebar
              .addWindow({window: {type: "graph", "block-uid": "cArVJL_vg"}})

            // a window that searches for "API"
            window.roamAlphaAPI.ui.rightSidebar
              .addWindow({window: {type: "search-query", "search-query-str": "API"}})

            // each resolves to undefined```
      - `roamAlphaAPI.ui.rightSidebar.removeWindow`
        - Description::
          - Remove a window from the right sidebar. Removing a pinned window unpins and removes it — it will not come back on reload, and no confirmation dialog is shown for API calls (the UI shows one when the user closes a pinned window).
        - Parameters::
          - `window` (object, required)
            - `type` (string, required) — "block" | "outline" | "mentions" | "graph" | "search-query"
            - `block-uid` (string, required) — uid of the block or page the window shows; "search-query" windows take `search-query-str` instead
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.rightSidebar
              .removeWindow({window: {type: "block", "block-uid": "1fP8LY5ED"}})
            // resolves to undefined```
      - `roamAlphaAPI.ui.rightSidebar.expandWindow`
        - Description::
          - Expand a collapsed sidebar window.
        - Parameters::
          - `window` (object, required)
            - `type` (string, required) — "block" | "outline" | "mentions" | "graph" | "search-query"
            - `block-uid` (string, required) — uid of the block or page the window shows; "search-query" windows take `search-query-str` instead
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.rightSidebar
              .expandWindow({window: {type: "outline", "block-uid": "cArVJL_vg"}})
            // resolves to undefined```
      - `roamAlphaAPI.ui.rightSidebar.collapseWindow`
        - Description::
          - Collapse a sidebar window.
        - Parameters::
          - `window` (object, required)
            - `type` (string, required) — "block" | "outline" | "mentions" | "graph" | "search-query"
            - `block-uid` (string, required) — uid of the block or page the window shows; "search-query" windows take `search-query-str` instead
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.rightSidebar
              .collapseWindow({window: {type: "outline", "block-uid": "cArVJL_vg"}})
            // resolves to undefined```
      - `roamAlphaAPI.ui.rightSidebar.pinWindow`
        - Description::
          - Pin a sidebar window; optionally pin it to the top of the sidebar.
        - Parameters::
          - `window` (object, required)
            - `type` (string, required) — "block" | "outline" | "mentions" | "graph" | "search-query"
            - `block-uid` (string, required) — uid of the block or page the window shows; "search-query" windows take `search-query-str` instead
          - `pin-to-top?` (boolean, optional) — `true` pins the window to the top: the pin turns red, new windows are added below it, and a previously top-pinned window is unpinned. When omitted, the pin-to-top state is left unchanged.
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.rightSidebar
              .pinWindow({window: {type: "block", "block-uid": "1fP8LY5ED"}})

            // pin to the top of the sidebar
            window.roamAlphaAPI.ui.rightSidebar
              .pinWindow({window: {type: "block", "block-uid": "1fP8LY5ED"},
                          "pin-to-top?": true})

            // each resolves to undefined```
      - `roamAlphaAPI.ui.rightSidebar.unpinWindow`
        - Description::
          - Unpin a sidebar window.
        - Parameters::
          - `window` (object, required)
            - `type` (string, required) — "block" | "outline" | "mentions" | "graph" | "search-query"
            - `block-uid` (string, required) — uid of the block or page the window shows; "search-query" windows take `search-query-str` instead
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.rightSidebar
              .unpinWindow({window: {type: "block", "block-uid": "1fP8LY5ED"}})
            // resolves to undefined```
      - `roamAlphaAPI.ui.rightSidebar.setWindowOrder`
        - Description::
          - Move a sidebar window to a specific position.
        - Parameters::
          - `window` (object, required)
            - `type` (string, required) — "block" | "outline" | "mentions" | "graph" | "search-query"
            - `block-uid` (string, required) — uid of the block or page the window shows; "search-query" windows take `search-query-str` instead
            - `order` (number, required) — new position, `0` to `n`
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.rightSidebar
              .setWindowOrder({window: {type: "block", "block-uid": "1fP8LY5ED", order: 0}})
            // resolves to undefined```
    - `roamAlphaAPI.ui.filters`
      - Description::
        - Filters are per-user. The get functions are synchronous; the set functions return promises. Filters have the shape `{"includes": [...page titles], "removes": [...page titles]}`.
      - `roamAlphaAPI.ui.filters.addGlobalFilter`
        - Description::
          - Add a global filter — like clicking the globe icon on a link in the filter dialog.
        - Parameters::
          - `title` (string, required) — page title
          - `type` (string, required) — "includes" | "removes"
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.filters
              .addGlobalFilter({title: "TODO", type: "removes"})
            // resolves to undefined```
      - `roamAlphaAPI.ui.filters.removeGlobalFilter`
        - Description::
          - Remove a global filter.
        - Parameters::
          - `title` (string, required) — page title
          - `type` (string, required) — "includes" | "removes"
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.filters
              .removeGlobalFilter({title: "TODO", type: "removes"})
            // resolves to undefined```
      - `roamAlphaAPI.ui.filters.getGlobalFilters`
        - Description::
          - The global filters currently in place. Synchronous.
        - Parameters::
          - None
        - Return::
          - `{"includes": [...], "removes": [...]}` — lists of page titles
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.filters.getGlobalFilters()
            // => {"includes": [], "removes": ["TODO"]}```
      - `roamAlphaAPI.ui.filters.getPageFilters`
        - Description::
          - The current user's filters for a page. Synchronous.
        - Parameters::
          - `page` (object, required) — one of:
            - `title` (string)
            - `uid` (string)
        - Return::
          - `{"includes": [...], "removes": [...]}` — lists of page titles
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.filters.getPageFilters({page: {title: "test"}})
            // => {"includes": ["March 11th, 2022"], "removes": []}```
      - `roamAlphaAPI.ui.filters.setPageFilters`
        - Description::
          - Set a page's filters for the current user. Pass `{}` as `filters` to clear them.
        - Parameters::
          - `page` (object, required) — one of:
            - `title` (string)
            - `uid` (string)
          - `filters` (object, required)
            - `includes` (array of page titles, optional)
            - `removes` (array of page titles, optional)
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.filters.setPageFilters(
              {page: {title: "test"},
               filters: {includes: ["March 11th, 2022"]}})

            // clear the filters
            window.roamAlphaAPI.ui.filters.setPageFilters(
              {page: {title: "test"}, filters: {}})

            // each resolves to undefined```
      - `roamAlphaAPI.ui.filters.getPageLinkedRefsFilters`
        - Description::
          - The current user's filters on a page's linked references (mentions). Synchronous.
        - Parameters::
          - `page` (object, required) — one of:
            - `title` (string)
            - `uid` (string)
        - Return::
          - `{"includes": [...], "removes": [...]}` — lists of page titles
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.filters.getPageLinkedRefsFilters({page: {title: "test"}})
            // => {"includes": ["Author"], "removes": []}```
      - `roamAlphaAPI.ui.filters.setPageLinkedRefsFilters`
        - Description::
          - Set the filters on a page's linked references (mentions) for the current user. Pass `{}` as `filters` to clear them.
        - Parameters::
          - `page` (object, required) — one of:
            - `title` (string)
            - `uid` (string)
          - `filters` (object, required)
            - `includes` (array of page titles, optional)
            - `removes` (array of page titles, optional)
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.filters.setPageLinkedRefsFilters(
              {page: {title: "test"},
               filters: {includes: ["Author"]}})
            // resolves to undefined```
      - `roamAlphaAPI.ui.filters.getSidebarWindowFilters`
        - Description::
          - The filters on a right-sidebar window. Synchronous.
        - Parameters::
          - `window` (object, required)
            - `type` (string, required) — "block" | "outline" | "mentions" | "graph" ("search-query" windows don't support filters)
            - `block-uid` (string, required) — uid of the block or page the window shows
        - Return::
          - `{"includes": [...], "removes": [...]}` — lists of page titles
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.filters.getSidebarWindowFilters(
              {window: {"block-uid": "WYlc2nIO9", type: "outline"}})
            // => {"includes": ["Author"], "removes": []}```
      - `roamAlphaAPI.ui.filters.setSidebarWindowFilters`
        - Description::
          - Set the filters on a right-sidebar window. Pass `{}` as `filters` to clear them.
        - Parameters::
          - `window` (object, required)
            - `type` (string, required) — "block" | "outline" | "mentions" | "graph" ("search-query" windows don't support filters)
            - `block-uid` (string, required) — uid of the block or page the window shows
          - `filters` (object, required)
            - `includes` (array of page titles, optional)
            - `removes` (array of page titles, optional)
        - Return::
          - Promise resolving to `undefined`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.filters.setSidebarWindowFilters(
              {window: {"block-uid": "WYlc2nIO9", type: "outline"},
               filters: {includes: ["Author"]}})
            // resolves to undefined```
    - `roamAlphaAPI.ui.commandPalette`
      - `roamAlphaAPI.ui.commandPalette.addCommand`
        - Description::
          - Add a command to the Command Palette (`cmd-p`).
          - Calling again with the same `label` updates the existing command instead of adding a second one.
          - Users can assign their own hotkey to any command in Settings → Hotkeys.
        - Parameters::
          - `label` (string, required) — text shown in the Command Palette
            - Prefix it with your plugin name for global uniqueness, e.g. "RoamRS: Start review session"
          - `callback` (function, required) — called with no arguments when the user runs the command
          - `disable-hotkey` (boolean, optional) — don't allow a hotkey for this command
          - `default-hotkey` (string | array of strings, optional) — **most commands should NOT set this**
            - Without it (and unless `disable-hotkey` is set), no hotkey is preassigned but the user can add one in Settings → Hotkeys.
            - A hotkey string looks like "super-shift-d" — at least one modifier plus a key.
            - An array of strings (max 5) defines a multi-step hotkey, e.g. `["ctrl-c", "ctrl-m"]` (like the native "go to next block").
            - Modifiers ("defmod" is the OS default modifier — `cmd` on macOS, `ctrl` elsewhere):
              - {{[[table]]}}
                - **modifier-str**
                  - **Windows/Linux**
                    - **macOS**
                - "shift"
                  - shift
                    - shift
                - "ctrl"
                  - ctrl
                    - ctrl
                - "alt"
                  - alt
                    - option
                - "super"
                  - win
                    - cmd
                - "defmod"
                  - ctrl
                    - cmd
        - Return::
          - Promise resolving to `null`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.commandPalette.addCommand(
              {label: "hi",
               callback: () => console.log("Hello World!")})

            // with a default hotkey — in most cases you do NOT want this;
            // the user can customize it in Settings → Hotkeys
            window.roamAlphaAPI.ui.commandPalette.addCommand(
              {label: "example1",
               callback: () => console.log("Hello World!"),
               "default-hotkey": "ctrl-cmd-l"})

            // each resolves to null```
      - `roamAlphaAPI.ui.commandPalette.removeCommand`
        - Description::
          - Remove a command with the given `label` from the Command Palette.
        - Parameters::
          - `label` (string, required) — the label passed to `roamAlphaAPI.ui.commandPalette.addCommand`
        - Return::
          - Promise resolving to `null`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.commandPalette.removeCommand({label: "hi"})
            // resolves to null```
    - `roamAlphaAPI.ui.slashCommand`
      - `roamAlphaAPI.ui.slashCommand.addCommand`
        - Description::
          - Add a command to the `/` slash menu. Calling again with the same `label` updates the existing command.
        - Parameters::
          - `label` (string, required) — text shown in the slash menu
          - `display-conditional` (function, optional) — called with the context object (without `indexes`); return `true` to show the command
          - `callback` (function, required)
            - called with the context object when the user selects the command.
            - context object:
              - ```javascript
                {"block-uid": "YnatnbZzF",
                 "window-id": "BBG4fFwolaVlT5FZQdzAI7P40aB3-body-outline-04-15-2021",
                 indexes: [1, 10]}```
            - Return a string to insert at the current location, or `null` to handle insertion yourself (the typed search string is not removed).
        - Return::
          - `null`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.slashCommand.addCommand({
              label: "Quick Test",
              callback: (context) => "It works! 🎉"
            });
            // => null```
      - `roamAlphaAPI.ui.slashCommand.removeCommand`
        - Description::
          - Remove a command with the given `label` from the slash menu.
        - Parameters::
          - `label` (string, required) — the label passed to `roamAlphaAPI.ui.slashCommand.addCommand`
        - Return::
          - `null`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.slashCommand.removeCommand({label: "Quick Test"})
            // => null```
    - `roamAlphaAPI.ui.blockContextMenu`
      - `roamAlphaAPI.ui.blockContextMenu.addCommand`
        - Description::
          - Add a command to the menu shown when right-clicking a block's bullet.
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Fa87mH7hqIQ.png?alt=media&token=b9dcb514-470c-44fb-8f32-f6b8f11cc7ce)
          - Custom commands are nested under the **Plugins** menu item.
          - Calling again with the same `label` updates the existing command instead of adding a second one.
        - Parameters::
          - `label` (string, required) — text shown in the menu
            - Prefix it with your plugin name for global uniqueness, e.g. "RoamRS: Start review session"
          - `display-conditional` (function, optional) — called with the block context every time the menu opens; return `true` to include the command for that block
          - `callback` (function, required)
            - called with the block context when the user selects the command
            - block context:
              - ```javascript
                {"block-string": "Todos",
                 "block-uid": "YnatnbZzF",
                 heading: null,
                 "page-uid": "04-15-2021",
                 "read-only?": false,
                 "window-id": "BBG4fFwolaVlT5FZQdzAI7P40aB3-body-outline-04-15-2021"}```
        - Return::
          - Promise resolving to `null`
        - Example::
          - ```javascript
            roamAlphaAPI.ui.blockContextMenu.addCommand(
              {label: "Debug: Console Log",
               "display-conditional": (e) => e["block-string"].includes("Test Block"),
               callback: (e) => console.log(e)})
            // resolves to null```
      - `roamAlphaAPI.ui.blockContextMenu.removeCommand`
        - Description::
          - Remove a command with the given `label`.
        - Parameters::
          - `label` (string, required)
        - Return::
          - Promise resolving to `null`
        - Example::
          - ```javascript
            roamAlphaAPI.ui.blockContextMenu.removeCommand({label: "Debug: Console Log"})
            // resolves to null```
    - `roamAlphaAPI.ui.pageContextMenu`
      - `roamAlphaAPI.ui.pageContextMenu.addCommand`
        - Description::
          - Add a command to the menu shown when right-clicking a page title.
          - Calling again with the same `label` updates the existing command instead of adding a second one.
        - Parameters::
          - `label` (string, required) — text shown in the menu
            - Prefix it with your plugin name for global uniqueness, e.g. "RoamRS: Start review session"
          - `display-conditional` (function, optional) — called with the context object; return `true` to show the command
          - `callback` (function, required)
            - called with the context object when the user selects the command
            - context object:
              - ```javascript
                {"page-uid": "YnatnbZzF",
                 "page-title": "title",
                 "window-id": "BBG4fFwolaVlT5FZQdzAI7P40aB3-body-outline-04-15-2021"}```
        - Return::
          - `null`
        - Example::
          - ```javascript
            roamAlphaAPI.ui.pageContextMenu.addCommand(
              {label: "Debug: Console Log", callback: (e) => console.log(e)})
            // => null```
      - `roamAlphaAPI.ui.pageContextMenu.removeCommand`
        - Description::
          - Remove a command with the given `label`.
        - Parameters::
          - `label` (string, required)
        - Return::
          - `null`
        - Example::
          - ```javascript
            roamAlphaAPI.ui.pageContextMenu.removeCommand({label: "Debug: Console Log"})
            // => null```
    - `roamAlphaAPI.ui.pageRefContextMenu`
      - `roamAlphaAPI.ui.pageRefContextMenu.addCommand`
        - Description::
          - Add a command to the menu shown when right-clicking a page reference inside a block.
          - Calling again with the same `label` updates the existing command instead of adding a second one.
        - Parameters::
          - `label` (string, required) — text shown in the menu
            - Prefix it with your plugin name for global uniqueness, e.g. "RoamRS: Start review session"
          - `display-conditional` (function, optional) — called with the context object; return `true` to show the command
          - `callback` (function, required)
            - called with the context object when the user selects the command
            - context object:
              - ```javascript
                {"ref-uid": "YnatnbZzF",
                 "block-uid": "xyz",       // containing block
                 "window-id": "BBG4fFwolaVlT5FZQdzAI7P40aB3-body-outline-04-15-2021",
                 indexes: [0, 9],          // outer indexes in the block string
                 type: "attribute"}```
              - `type` values:
                - "page-ref" — `[[test]]`
                - "attribute" — `test::`
                - "tag" — `#test`
                - "multitag" — `#[[Test]]`
                - "inline-link" — `[t]([[Test]])`
        - Return::
          - `null`
        - Example::
          - ```javascript
            roamAlphaAPI.ui.pageRefContextMenu.addCommand(
              {label: "Debug: Console Log", callback: (e) => console.log(e)})
            // => null```
      - `roamAlphaAPI.ui.pageRefContextMenu.removeCommand`
        - Description::
          - Remove a command with the given `label`.
        - Parameters::
          - `label` (string, required) — the label passed to `roamAlphaAPI.ui.pageRefContextMenu.addCommand`
        - Return::
          - `null`
        - Example::
          - ```javascript
            roamAlphaAPI.ui.pageRefContextMenu.removeCommand({label: "Debug: Console Log"})
            // => null```
    - `roamAlphaAPI.ui.blockRefContextMenu`
      - `roamAlphaAPI.ui.blockRefContextMenu.addCommand`
        - Description::
          - Add a command to the menu shown when clicking a block reference.
          - Calling again with the same `label` updates the existing command instead of adding a second one.
        - Parameters::
          - `label` (string, required) — text shown in the menu
            - Prefix it with your plugin name for global uniqueness, e.g. "RoamRS: Start review session"
          - `display-conditional` (function, optional) — called with the context object; return `true` to show the command
          - `callback` (function, required)
            - called with the context object when the user selects the command
            - context object:
              - ```javascript
                {"ref-uid": "YnatnbZzF",
                 "block-uid": "abc123xyz", // containing block
                 "window-id": "BBG4fFwolaVlT5FZQdzAI7P40aB3-body-outline-04-15-2021",
                 indexes: [0, 9]}          // outer indexes in the block string```
        - Return::
          - `null`
        - Example::
          - ```javascript
            roamAlphaAPI.ui.blockRefContextMenu.addCommand(
              {label: "Debug: Console Log", callback: (e) => console.log(e)})
            // => null```
      - `roamAlphaAPI.ui.blockRefContextMenu.removeCommand`
        - Description::
          - Remove a command with the given `label`.
        - Parameters::
          - `label` (string, required)
        - Return::
          - `null`
        - Example::
          - ```javascript
            roamAlphaAPI.ui.blockRefContextMenu.removeCommand({label: "Debug: Console Log"})
            // => null```
    - `roamAlphaAPI.ui.pageLinkContextMenu`
      - `roamAlphaAPI.ui.pageLinkContextMenu.addCommand`
        - Description::
          - Add a command to the menu on page links that are neither a page title nor inside a block — currently linked references and query results grouped by page.
          - Calling again with the same `label` updates the existing command instead of adding a second one.
        - Parameters::
          - `label` (string, required) — text shown in the menu
            - Prefix it with your plugin name for global uniqueness, e.g. "RoamRS: Start review session"
          - `display-conditional` (function, optional) — called with the context object; return `true` to show the command
          - `callback` (function, required)
            - called with the context object when the user selects the command
            - context object:
              - ```javascript
                {"page-uid": "YnatnbZzF",
                 "page-title": "title"}```
        - Return::
          - `null`
        - Example::
          - ```javascript
            roamAlphaAPI.ui.pageLinkContextMenu.addCommand(
              {label: "Debug: Console Log", callback: (e) => console.log(e)})
            // => null```
      - `roamAlphaAPI.ui.pageLinkContextMenu.removeCommand`
        - Description::
          - Remove a command with the given `label`.
        - Parameters::
          - `label` (string, required)
        - Return::
          - `null`
        - Example::
          - ```javascript
            roamAlphaAPI.ui.pageLinkContextMenu.removeCommand({label: "Debug: Console Log"})
            // => null```
    - `roamAlphaAPI.ui.msContextMenu`
      - `roamAlphaAPI.ui.msContextMenu.addCommand`
        - Description::
          - Add a command to the context menu shown when multiple blocks are selected (multiselect).
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Fs7cSCoo1Ti.png?alt=media&token=584a7843-f870-4c6c-aa6d-e1204d2e1da0)
          - Calling again with the same `label` updates the existing command instead of adding a second one.
        - Parameters::
          - `label` (string, required) — text shown in the menu
            - Prefix it with your plugin name for global uniqueness, e.g. "RoamRS: Start review session"
          - `display-conditional` (function, optional) — return `true` to show the command
          - `callback` (function, required) — called when the user selects the command
        - Return::
          - `null`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.msContextMenu.addCommand(
              {label: "test", callback: () => { console.log("hey") }})
            // => null```
      - `roamAlphaAPI.ui.msContextMenu.removeCommand`
        - Description::
          - Remove a command with the given `label`.
        - Parameters::
          - `label` (string, required)
        - Return::
          - `null`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.msContextMenu.removeCommand({label: "test"})
            // => null```
    - `roamAlphaAPI.ui.multiselect.getSelected`
      - Description::
        - The blocks currently drag-selected (highlighted) in the main window. Synchronous.
      - Parameters::
        - None
      - Return::
        - Array of `{"block-uid", "window-id"}` objects; empty array if nothing is selected
      - Example::
        - ```javascript
          window.roamAlphaAPI.ui.multiselect.getSelected()
          // => [{"block-uid": "Vfht187T1", "window-id": "main-window"},
          //     {"block-uid": "abc123xyz", "window-id": "main-window"}]```
    - `roamAlphaAPI.ui.individualMultiselect.getSelectedUids`
      - Description::
        - The uids currently selected with single block multiselect (checkbox selection, usually triggered by `cmd-m`). Synchronous.
      - Parameters::
        - None
      - Return::
        - Array of block uids
      - Example::
        - ```javascript
          window.roamAlphaAPI.ui.individualMultiselect.getSelectedUids()
          // => ["Vfht187T1", "abc123xyz"]```
    - `roamAlphaAPI.ui.graphView`
      - `roamAlphaAPI.ui.graphView.addCallback`
        - Description::
          - Register a callback that fires when a **page-level** graph view loads. Does **not** fire for the whole-graph overview — see `roamAlphaAPI.ui.graphView.wholeGraph`.
          - The **page-level** graph view is rendered with [[Cytoscape]]; the callbacks expose the Cytoscape object to enable plugins, alternative UIs, and other experimentation.
        - Parameters::
          - `label` (string, required) — used to upsert or remove the callback
          - `callback` (function, required)
            - Function called with `context` when the user selects the command in the Command Palette
            - context:
              - `cytoscape` — the [[Cytoscape]] graph object
              - `elements` — array of the nodes and edges in the graph
              - `type` — "page" | "all-pages" (only "page" occurs now)
              - ```javascript
                {cytoscape: Core {_private: {…}},
                 elements: [
                   {id: "eTCpkG-HI", name: "B", weight: 7},
                   {id: "05-04-2021", name: "May 4th, 2021", weight: 10},
                   {id: "eTCpkG-HI-FrW4nHLat", source: "eTCpkG-HI", target: "FrW4nHLat"}
                 ],
                 type: "page"}```
          - `type` (string, deprecated) — only "page" views fire anymore, so this filter is pointless; omit it
        - Return::
          - Synchronous; usually `null`, but the return value is internal — treat it as void
        - Example::
          - ```javascript
            roamAlphaAPI.ui.graphView.addCallback({
              label: "my-extension: graph loaded",
              type: "page",
              callback: ({cytoscape, elements, type}) => console.log(type, elements)})
            // (return value is not meaningful)```
      - `roamAlphaAPI.ui.graphView.removeCallback`
        - Description::
          - Remove a callback with the given `label`.
        - Parameters::
          - `label` (string, required)
        - Return::
          - `null` (synchronous)
        - Example::
          - ```javascript
            roamAlphaAPI.ui.graphView.removeCallback({label: "my-extension: graph loaded"})
            // => null```
      - `roamAlphaAPI.ui.graphView.wholeGraph`
        - Description::
          - API for the whole-graph overview, rendered with [[Sigma]]
        - `roamAlphaAPI.ui.graphView.wholeGraph.setMode`
          - Description::
            - Set the overview mode. Takes a positional argument.
          - Parameters::
            - `mode` (string, required) — "Whole Graph" | "Explore"
          - Return::
            - Synchronous; the return value is internal state — treat it as void
          - Example::
            - ```javascript
              roamAlphaAPI.ui.graphView.wholeGraph.setMode("Explore")
              // (return value is not meaningful)```
        - `roamAlphaAPI.ui.graphView.wholeGraph.setExplorePages`
          - Description::
            - Set the pages shown in Explore mode. Takes a positional argument.
          - Parameters::
            - `pages` (array of page titles, required) — throws if any title doesn't exist in the graph
          - Return::
            - Synchronous; the return value is internal state — treat it as void
          - Example::
            - ```javascript
              roamAlphaAPI.ui.graphView.wholeGraph.setExplorePages(["My Project"])
              // (return value is not meaningful)```
        - `roamAlphaAPI.ui.graphView.wholeGraph.getExplorePages`
          - Description::
            - The page titles currently shown in Explore mode.
          - Parameters::
            - None
          - Return::
            - Array of the page titles currently explored
          - Example::
            - ```javascript
              roamAlphaAPI.ui.graphView.wholeGraph.getExplorePages()
              // => ["My Project"]```
        - `roamAlphaAPI.ui.graphView.wholeGraph.addCallback`
          - Description::
            - Register a callback for when the whole-graph view loads.
          - Parameters::
            - `label` (string, required) — used to upsert or remove the callback
            - `callback` (function, required) — called with `{"sigma-renderer": <Sigma renderer>}` when the overview mounts
          - Return::
            - `null`
          - Example::
            - ```javascript
              roamAlphaAPI.ui.graphView.wholeGraph.addCallback({
                label: "test",
                callback: ({"sigma-renderer": renderer}) => console.log(renderer)})
              // => null```
        - `roamAlphaAPI.ui.graphView.wholeGraph.removeCallback`
          - Description::
            - Remove a callback with the given `label`.
          - Parameters::
            - `label` (string, required)
          - Return::
            - `null`
          - Example::
            - ```javascript
              roamAlphaAPI.ui.graphView.wholeGraph.removeCallback({label: "test"})
              // => null```
    - `roamAlphaAPI.ui.components`
      - Description::
        - Imperatively render Roam views into DOM nodes you provide — no React needed on your side. Unmount them with `roamAlphaAPI.ui.components.unmountNode`; for declarative React/JSX components, see `roamAlphaAPI.ui.react`.
      - `roamAlphaAPI.ui.components.renderBlock`
        - Description::
          - Render a block with its children (editable) into a DOM node.
        - Parameters::
          - `uid` (string, required) — block to display
          - `el` (DOM node, required) — where to mount the component
          - `open?` (boolean, optional) — `true` forces the block open (children shown), `false` forces it closed; omitted = whatever the block's open state is in the graph
          - `zoom-path?` (boolean, optional) — show the zoom path above the block (similar to how linked references look)
          - `zoom-start-after-uid` (string, optional; only valid with `zoom-path?`)
            - the path is compacted to a clickable `...` for everything before this uid
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2F0UbfHOyucp.png?alt=media&token=100fe5d1-6461-4e4d-986d-3916ef5e914e)
        - Return::
          - Promise resolving to `null`
        - Example::
          - ```javascript
            const newNode = document.createElement("div");
            const wrap = document.getElementById("right-sidebar");
            wrap.insertBefore(newNode, wrap.firstChild);

            window.roamAlphaAPI.ui.components.renderBlock(
              {uid: "6-P4ZEbIY",
               el: newNode,
               "open?": false,
               "zoom-path?": true,
               "zoom-start-after-uid": "ImSvJvm1_"})
            // resolves to null once mounted```
      - `roamAlphaAPI.ui.components.renderPage`
        - Description::
          - Render a page with its children (editable) into a DOM node. Interchangeable with `roamAlphaAPI.ui.components.renderBlock` unless you need `zoom-path?` (block-only) or `hide-mentions?` (page-only).
        - Parameters::
          - `uid` (string, required) — page to display
          - `el` (DOM node, required)
          - `hide-mentions?` (boolean, optional) — hide the linked references at the bottom of the page
        - Return::
          - Promise resolving to `null`
        - Example::
          - ```javascript
            const newNode = document.createElement("div");
            document.body.appendChild(newNode);

            window.roamAlphaAPI.ui.components.renderPage(
              {uid: "mK9pQ2rTw",
               el: newNode,
               "hide-mentions?": true})
            // resolves to null once mounted```
      - `roamAlphaAPI.ui.components.renderSearch`
        - Description::
          - Render search results (pages first, then blocks — the same results as the `cmd-u` search) into a DOM node. Also available as the `{{[[search]]: query}}` component. CSS classes: `rm-search-query`, plus the existing `rm-query`.
          - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FFU6QA0OUCw.png?alt=media&token=25c62297-7fa2-4f71-b05a-060050781d8b)
        - Parameters::
          - `search-query-str` (string, required) — the search query
          - `el` (DOM node, required)
          - `closed?` (boolean, optional, default false) — collapse the view
          - `group-by-page?` (boolean, optional, default false) — group results by page
          - `hide-paths?` (boolean, optional, default false) — hide block paths in results
          - `config-changed-callback` (function, optional) — called with the new config when the user changes the view's configuration
        - Return::
          - Promise resolving to `null`
        - Example::
          - ```javascript
            const newNode = document.createElement("div");
            const wrap = document.getElementById("right-sidebar");
            wrap.insertBefore(newNode, wrap.firstChild);

            window.roamAlphaAPI.ui.components.renderSearch(
              {"search-query-str": "Bret Victor",
               el: newNode,
               "group-by-page?": false,
               "config-changed-callback": (config) => console.log("new config", config)})
            // resolves to null once mounted```
      - `roamAlphaAPI.ui.components.renderString`
        - Description::
          - Render a string of Roam-flavored markdown into a DOM node — anything a block string can contain: page links, block refs, formatting, components.
          - Avoid rendering `[[Page Title]]` links for pages that don't exist — those links won't work.
        - Parameters::
          - `string` (string, required) — the string to render
          - `el` (DOM node, required)
        - Return::
          - Promise resolving to `null`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.components.renderString(
              {el: newNode,
               string: "Hello via [[Roam Alpha API]]'s `renderString` — supports ((abc123xyz)) refs too"})
            // resolves to null once mounted```
      - `roamAlphaAPI.ui.components.unmountNode`
        - Description::
          - Unmount a previously rendered view from a DOM node.
        - Parameters::
          - `el` (DOM node, required) — the node the component was mounted in
        - Return::
          - Promise resolving to `null`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.components.unmountNode({el: newNode})
            // resolves to null```
    - `roamAlphaAPI.ui.react`
      - Description::
        - React components for declarative JSX use — equivalents of `roamAlphaAPI.ui.components`. Note the props are camelCase, unlike its kebab-case keys.
      - `roamAlphaAPI.ui.react.Block`
        - Description::
          - Renders a block with its children (editable).
        - Parameters::
          - `uid` (string, required) — block to display
          - `open` (boolean, optional) — force open/closed; omitted = the block's open state in the graph
          - `zoomPath` (boolean, optional) — show the zoom path
          - `zoomStartAfterUid` (string, optional; only valid with `zoomPath`) — compact the path to `...` before this uid
        - Example::
          - ```javascript
            const { Block } = window.roamAlphaAPI.ui.react;

            <Block uid="6-P4ZEbIY" />
            <Block uid="6-P4ZEbIY" open={false} />
            <Block uid="6-P4ZEbIY" zoomPath={true} zoomStartAfterUid="ImSvJvm1_" />```
      - `roamAlphaAPI.ui.react.Page`
        - Description::
          - Renders a page (editable).
        - Parameters::
          - `uid` (string) / `title` (string) — one of the two is required
          - `hideMentions` (boolean, optional) — hide the linked references section at the bottom
        - Example::
          - ```javascript
            const { Page } = window.roamAlphaAPI.ui.react;

            <Page uid="page-uid-123" />
            <Page title="My Page" hideMentions={true} />```
      - `roamAlphaAPI.ui.react.Search`
        - Description::
          - Renders search results for a query.
        - Parameters::
          - `searchQueryStr` (string, required) — the search query
          - `closed` (boolean, optional) — collapse the view
          - `groupByPage` (boolean, optional) — group results by their page
          - `hidePaths` (boolean, optional) — hide block paths in results
          - `onConfigChange` (function, optional) — called with the new config object when the user changes grouping etc.
        - Example::
          - ```javascript
            const { Search } = window.roamAlphaAPI.ui.react;

            <Search searchQueryStr="Bret Victor" groupByPage={true}
                    onConfigChange={(config) => console.log(config)} />```
      - `roamAlphaAPI.ui.react.BlockString`
        - Description::
          - Renders a Roam-markdown string — `[[page links]]`, `((block refs))`, formatting. The rendered content is **not** editable.
        - Parameters::
          - `string` (string, required) — the Roam-markdown string to render
        - Example::
          - ```javascript
            const { BlockString } = window.roamAlphaAPI.ui.react;

            <BlockString string="Hello [[World]]" />
            <BlockString string="This is **bold** and __italic__" />```
    - `roamAlphaAPI.ui.callout`
      - `roamAlphaAPI.ui.callout.addType`
        - Description::
          - Register a custom callout type so it appears in the callout picker menu (shown when clicking a callout block's icon) and can be used in `[!type]` syntax.
          - Icon and color come entirely from CSS: style `.rm-callout--{type}` for the color and `.rm-callout--{type} .rm-callout__icon` for the icon. A built-in default icon shows until your CSS loads.
        - Parameters::
          - `type` (string, required) — the string used in the `[!type]` callout syntax
        - Return::
          - `null`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.callout.addType({type: "recipe"})
            // => null```
          - Then provide CSS via `roam/css` or an extension stylesheet:
            - ```css
              .rm-callout--recipe {
                --callout-color: #f778ba;
              }
              .rm-callout--recipe .rm-callout__icon::before {
                content: "🍪";
                font-family: initial;
              }```
      - `roamAlphaAPI.ui.callout.removeType`
        - Description::
          - Remove a previously registered custom callout type from the picker menu.
        - Parameters::
          - `type` (string, required) — the type string to remove
        - Return::
          - `null`
        - Example::
          - ```javascript
            window.roamAlphaAPI.ui.callout.removeType({type: "recipe"})
            // => null```
  - `roamAlphaAPI.util`
    - `roamAlphaAPI.util.generateUID`
      - Description::
        - Generate a Roam block uid — a random string of length nine.
      - Parameters::
        - None
      - Return::
        - string
      - Example::
        - ```javascript
          window.roamAlphaAPI.util.generateUID()
          // => "aB3xK9mP2"```
    - `roamAlphaAPI.util.pageTitleToDate`
      - Description::
        - Convert a daily note page title to a date.
      - Parameters::
        - `title` (string, required) — a daily note title like "June 16th, 2022"
      - Return::
        - A [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date), or `null` for anything that isn't a daily note title
      - Example::
        - ```javascript
          roamAlphaAPI.util.pageTitleToDate("June 16th, 2022")
          // => Date Thu Jun 16 2022 00:00:00

          roamAlphaAPI.util.pageTitleToDate("not a daily note title")
          // => null```
    - `roamAlphaAPI.util.dateToPageTitle`
      - Description::
        - Convert a date to a daily note page title ("June 16th, 2022").
      - Parameters::
        - `date` (Date, required) — a [JavaScript Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
      - Return::
        - string
      - Example::
        - ```javascript
          roamAlphaAPI.util.dateToPageTitle(new Date(2022, 5, 16))
          // => "June 16th, 2022"```
    - `roamAlphaAPI.util.dateToPageUid`
      - Description::
        - Convert a date to a daily note page uid ("06-16-2022"). Use this instead of `roamAlphaAPI.util.generateUID` when programmatically creating a daily note page and you need its uid ahead of time.
      - Parameters::
        - `date` (Date, required) — a [JavaScript Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
      - Return::
        - string
      - Example::
        - ```javascript
          roamAlphaAPI.util.dateToPageUid(new Date(2022, 5, 16))
          // => "06-16-2022"```
  - `roamAlphaAPI.file`
    - `roamAlphaAPI.file.upload`
      - Description::
        - Upload a file to Roam.
        - Also exists as the legacy alias `roamAlphaAPI.util.uploadFile` — prefer this version; the old one won't be removed.
      - Parameters::
        - `file` (File, required) — a [File object](https://developer.mozilla.org/en-US/docs/Web/API/File)
        - `toast` (object, optional)
          - `hide` (boolean, optional, default false) — hide the upload toast
      - Return::
        - Promise resolving to a Roam block string embedding the file — `![](url)` for images, `{{[[pdf]]: url}}` / `{{[[audio]]: url}}` / `{{[[video]]: url}}` for those media types — or the bare download url (string) for other file types
      - Example::
        - ```javascript
          await roamAlphaAPI.file.upload({file: myImageFile, toast: {hide: true}})
          // => "![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fmy-graph%2FaB3xK9mP2.png?alt=media&token=...)"

          await roamAlphaAPI.file.upload({file: new File([""], "notes.txt")})
          // => "https://firebasestorage.googleapis.com/..." (bare url — not a recognized media type)```
    - `roamAlphaAPI.file.get`
      - Description::
        - Fetch a file hosted on Roam. You could also `fetch` the url yourself, but `get` handles decryption on encrypted graphs and restores the original file name and type metadata.
      - Parameters::
        - `url` (string, required) — a firebase storage url, obtained from `roamAlphaAPI.file.upload` or from a block
        - `format` (string, optional) — pass "base64" to resolve with `{base64, filename, mimetype}` instead of a File object
      - Return::
        - Promise resolving to a [File object](https://developer.mozilla.org/en-US/docs/Web/API/File) — or, with `format: "base64"`, to `{base64, filename, mimetype}`
      - Example::
        - ```javascript
          await roamAlphaAPI.file.get({url: "https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/..."})
          // => File {name: "GVfB6XBcMR.pdf", type: "application/pdf", size: 183424, ...}```
    - `roamAlphaAPI.file.delete`
      - Description::
        - Delete a file hosted on Roam.
      - Parameters::
        - `url` (string, required) — a firebase storage url, obtained from `roamAlphaAPI.file.upload` or from a block
      - Return::
        - Promise resolving to `undefined`
      - Example::
        - ```javascript
          await roamAlphaAPI.file.delete({url: "https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/..."})
          // => undefined```
  - `roamAlphaAPI.user`
    - `roamAlphaAPI.user.uid`
      - Description::
        - The current user's uid. Synchronous. Use it with `roamAlphaAPI.data.pull` to get the user's display page and other metadata.
      - Parameters::
        - None
      - Return::
        - string, or `null` when not signed in
      - Example::
        - ```javascript
          roamAlphaAPI.user.uid()
          // => "BBG4fFwolaVlT5FZQdzAI7P40aB3" (or null when signed out)

          // pull all info about the current user
          roamAlphaAPI.data.pull("[*]", [":user/uid", window.roamAlphaAPI.user.uid()]);
          // => {":user/uid": "BBG4fFwolaVlT5FZQdzAI7P40aB3", ":user/display-name": "Josh", ...}```
    - `roamAlphaAPI.user.isAdmin`
      - Description::
        - Whether the current user is an admin of this graph (the graph owner). Synchronous.
      - Parameters::
        - None
      - Return::
        - boolean
  - `roamAlphaAPI.graph`
    - Description::
      - Properties (not functions) describing the current graph.
    - `roamAlphaAPI.graph.name` (string) — the name of the current graph
    - `roamAlphaAPI.graph.type` (string) — "hosted" | "offline"
    - `roamAlphaAPI.graph.isEncrypted` (boolean) — whether the graph is encrypted
  - `roamAlphaAPI.platform`
    - Description::
      - Properties (not functions) describing the client.
    - `roamAlphaAPI.platform.isDesktop` (boolean) — `true` in the Roam Desktop App
    - `roamAlphaAPI.platform.isMobileApp` (boolean) — `true` in the Roam Mobile App
    - `roamAlphaAPI.platform.isMobile` (boolean) — `true` on small screens; purely a screen-size check (media query `max-width: 450px`)
    - `roamAlphaAPI.platform.isIOS` (boolean) — `true` on iPhone, iPad, or iPod
    - `roamAlphaAPI.platform.isPC` (boolean) — `true` on a PC; useful for offering different shortcuts on PC vs Mac
    - `roamAlphaAPI.platform.isTouchDevice` (boolean) — `true` on touch devices
  - `roamAlphaAPI.depot`
    - `roamAlphaAPI.depot.getInstalledExtensions`
      - Description::
        - A map of the extensions currently installed through Roam Depot or dev mode. Synchronous.
      - Parameters::
        - None
      - Return::
        - Object of `{ext-id: ext-map}`; `version` is "DEV" for developer-loaded extensions
      - Example::
        - ```javascript
          roamAlphaAPI.depot.getInstalledExtensions()
          // =>
          {"ccc+ccc-roam-pdf-2":
            {id: "ccc+ccc-roam-pdf-2",
             name: "Roam PDF Highlighter 2",
             enabled: false,
             adminEnabled: true,
             version: "1"},
           ...}```
    - `roamAlphaAPI.depot.reloadDeveloperExtensions`
      - Description::
        - Reload all developer-mode extensions — the same operation as the "Reload developer extensions" command (`ctrl-d ctrl-r`).
      - Parameters::
        - None
      - Return::
        - Promise resolving to a summary of the reloaded developer extensions
      - Example::
        - ```javascript
          await roamAlphaAPI.depot.reloadDeveloperExtensions()
          // => {reloaded: [{id: "dev-extension-id", name: "My Dev Extension"}]}```
  - `roamAlphaAPI.constants`
    - `roamAlphaAPI.constants.corsAnywhereProxyUrl`
      - Description::
        - The url of a [CORS-anywhere proxy](https://github.com/Rob--W/cors-anywhere) hosted by the Roam team — useful when your extension queries an external API with CORS restrictions.
        - Instead of fetching `url` directly, fetch ``${roamAlphaAPI.constants.corsAnywhereProxyUrl}/${url}``.
        - To prevent misuse, the proxy only works for requests originating from `https://roamresearch.com`.
      - Example::
        - ```javascript
          let urlToFetch = "https://google.com"

          await fetch(`${roamAlphaAPI.constants.corsAnywhereProxyUrl}/${urlToFetch}`)
            .then(a => a.text())
          // => "<!doctype html><html ...>" (the fetched page's body as text)```
- **Drag and drop**
  - When the user drags blocks (or a page from the left sidebar), Roam attaches data to the browser drag event — read it with `event.dataTransfer.getData(type)` in your own drop handlers.
  - Multi-value payloads are newline-separated strings.
  - Types:
    - "roam/block-uid-list" — uids of all selected visible blocks
    - "roam/block-uid-list-only-parents" — uids of only the top-level selected blocks (usually what you want)
    - "roam/roam-uri-list" — Roam URL(s) for the dragged item(s)
    - "text/uri-list" — standard URL list for the dragged item(s)
  - Example::
    - ```javascript
      myPanel.addEventListener("drop", (e) => {
        const uids = e.dataTransfer.getData("roam/block-uid-list-only-parents").split("\n")
        console.log("dropped blocks:", uids)
      })
      // dragging a page from the left sidebar carries its page uid instead```
- **Resources**
  - [Deep Dive Into Roam's Data Structure - Why Roam is Much More Than a Note Taking App](https://www.zsolt.blog/2021/01/Roam-Data-Structure-Query.html) by [[Zsolt Viczian]]
  - [Datalog Queries for Roam Research](https://davidbieber.com/snippets/2020-12-22-datalog-queries-for-roam-research/) by [[David Bieber]]
  - [JavaScript Functions for Inserting Blocks in Roam](https://davidbieber.com/snippets/2021-02-12-javascript-functions-for-inserting-blocks-in-roam/) by [[David Bieber]]
  - [More Datalog Queries for Roam](https://davidbieber.com/snippets/2021-01-04-more-datalog-queries-for-roam/) by [[David Bieber]]
  - [Publishing Blog Posts from Roam Research Quickly and Automatically](https://davidbieber.com/snippets/2020-12-28-publishing-blog-posts-from-roam-research-quickly-and-automatically/) by [[David Bieber]]
- **Examples**
  - [Roam Depot extensions](https://github.com/Roam-Research/roam-depot/tree/main/extensions) — the largest list of extensions; each entry's metadata file points to its source repo
  - [RoamJS](https://github.com/dvargasfuertes/roamjs-com) from [[David Vargas]] — a suite of tools to extend popular workflows in Roam
  - [Roam42, now WorkBench](https://github.com/RoamJS/workbench) from [[RoamHacker]], now maintained by [[David Vargas]] — a collection of power user tools for Roam
  - [roam/sr](https://github.com/akrivka/roamsr) from [[Adam Krivka]] — spaced repetition in Roam
  - [pyroam](https://github.com/akrivka/pyroam) from [[Adam Krivka]] — Python notebooks in Roam
  - [roam-inter](https://github.com/houshuang/roam-inter) from [[Stian Haklev]] — cross-graph referencing prototype
  - [roam-toolkit](https://github.com/roam-unofficial/roam-toolkit) from [[Vlad Sitalo]] — a Chrome and Firefox extension toolkit to extend Roam
  - [Fabricius](https://github.com/chronologos/Fabricius) from [[Ian Tay]] — an Anki plugin that bidirectionally syncs with Roam
- **Change Log**
  - See Change Log:: for older changes
