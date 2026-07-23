# Roam Backend API

- **Description**
  - An HTTP API for reading and writing your Roam graphs from your own code
  - Encrypted graphs are not supported (and will not be in the future)
    - If you want to capture to both unencrypted & encrypted graphs, please checkout the [[Roam Append API]] instead
  - [[Postman]] Public workspace to play around with
    - https://www.postman.com/roamresearch/workspace/roam-research-backend-api/collection/27948971-ac6bd2a2-c0f0-4259-abc1-78bde0a01958
      - A walkthrough [[Loom video]]: https://www.loom.com/share/2f14c2331b65439a81632b9b94400160
  - Please report any issues in the #developers channel in the [[Roam Slack]] or via email to [support@roamresearch.com](mailto:support@roamresearch.com)
- **SDKs**
  - Please prefer using [our sdks](https://github.com/Roam-Research/backend-sdks)
    - [typescript](https://www.npmjs.com/package/@roam-research/roam-api-sdk)
    - [clojure](https://github.com/Roam-Research/backend-sdks/tree/master/clojure)
    - [python](https://github.com/Roam-Research/backend-sdks/tree/master/python)
    - [java](https://github.com/Roam-Research/backend-sdks/tree/master/java)
    - [rust](https://crates.io/crates/roam-sdk)
- **Authentication**
  - Requests to the API use graph specific tokens for authentication
  - You can only get/create these if you own the graph i.e. if you're the admin of the graph
  - These start with `roam-graph-token-`
  - You can create and edit roam-graph-tokens from a new section "API tokens" in the "Graph" tab in the Settings
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Froamteam%2FkqaM1ePPbV.png?alt=media&token=e113f2b5-4fbe-4b75-8d30-a114a6aa0f8d)
  - How to pass the tokens in the request?
    - pass them in the `X-Authorization` header
      - you can use the `Authorization` header too (would be more secure) but you have to make sure that your code/library handles redirect properly and passes the authorization header when redirect has been followed (and the latter is generally not default behavior for most network libraries) 
    - Make sure they're prefixed with a `Bearer `
    - An example
      - `Bearer roam-graph-token-t_OjqgIAH1JZphzP4HxjJNad55lLFKpsqIM7x3bW`
  - To use the Backend API, you need a roam-graph-token with either a "read+edit" or a "read-only" role
    - roam-graph-tokens with "append-only" roles can only be used with the [[Roam Append API]]
  - A [[cURL]] request example
    - ```shell
      curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/q" --location-trusted \
      -H "Accept: application/json" \
      -H "X-Authorization: Bearer roam-graph-token-XXX" \
      -H "Content-Type: application/json" \
      -d "{\"query\": \"[:find ?block-uid ?block-str :in \$ ?search-string :where [?b :block/uid ?block-uid] [?b :block/string ?block-str] [(clojure.string/includes? ?block-str ?search-string)]]\", \"args\": [\"apple\"]}"
      # =>
      # {"result": [["hjt3Bwqp2", "apple pie recipe"], ["e1Xp7HELP", "Bought apples at the farmers market"]]}```
    - Some important points
      - `--location-trusted` is required because your request is redirected to the actual machine doing the work. 
        - There is a sharding mechanism in place (such that different graphs run on different machines)
        - `https://api.roamresearch.com/` abstracts away this from the developer point of view, by redirecting messages to the actual machine doing the work
      - As mentioned earlier in, you have to make sure that the tokens are prefixed with a `Bearer ` and are passed in the Authorization header
- **Reference**
  - **Endpoint base url:** https://api.roamresearch.com/
  - Read requests (`q`, `pull`, `pull-many`) have a __20 second__ time limit. If a request exceeds it, it fails with a 500 whose message contains "took too long to run"
  - **API routes**
    - `/api/graph/{graph-name}/q` (POST)
      - Description::
        - Runs a datalog query against the graph and returns the matching results
        - The backend version of `roamAlphaAPI.data.q`
        - parameters are passed as a JSON request body
      - Parameters::
        - `query` (string, required) — the datalog query, as an EDN string
        - `args` (array, optional) — inputs for the query, bound in order to the extra `:in` variables (the ones after `$`)
      - Return::
        - 200 with body `{"result": [...]}` — the array of query results
          - maps produced by pull expressions in the query have keys prefixed with ":", e.g. ":block/uid"
        - for error responses, see **What does response look like?** (with **HTTP status codes**)
        - sample output structure
          - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Foz9l5Y0q7B.png?alt=media&token=7c7dffd4-6729-4f75-99bc-a0d00589fa3b)
      - Example::
        - Finds the uid and string of every block whose text contains "apple"
        - Request body (JSON)
          - ```javascript
            {
              "query": "[:find ?block-uid ?block-str :in $ ?search-string :where [?b :block/uid ?block-uid] [?b :block/string ?block-str] [(clojure.string/includes? ?block-str ?search-string)]]",
              "args": ["apple"]
            }```
        - [[cURL]] request
          - ```shell
            curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/q" --location-trusted \
            -H "Accept: application/json" \
            -H "X-Authorization: Bearer roam-graph-token-XXX" \
            -H "Content-Type: application/json" \
            -d "{\"query\": \"[:find ?block-uid ?block-str :in \$ ?search-string :where [?b :block/uid ?block-uid] [?b :block/string ?block-str] [(clojure.string/includes? ?block-str ?search-string)]]\", \"args\": [\"apple\"]}"
            # =>
            # {"result": [["hjt3Bwqp2", "apple pie recipe"], ["e1Xp7HELP", "Bought apples at the farmers market"]]}```
        - [[TypeScript]] — using the [official SDK](https://github.com/Roam-Research/backend-sdks)
          - ```typescript
            import { initializeGraph, q } from "@roam-research/roam-api-sdk";

            const graph = initializeGraph({
              token: "roam-graph-token-XXX",
              graph: "MY-GRAPH",
            });

            const result = await q(
              graph,
              "[:find ?block-uid ?block-str :in $ ?search-string :where [?b :block/uid ?block-uid] [?b :block/string ?block-str] [(clojure.string/includes? ?block-str ?search-string)]]",
              ["apple"]
            );
            // => [["hjt3Bwqp2", "apple pie recipe"], ["e1Xp7HELP", "Bought apples at the farmers market"]]```
          - the SDK resolves to the `result` value directly and throws on error responses
    - `/api/graph/{graph-name}/pull` (POST)
      - Description::
        - Pulls the requested attributes for one entity, given a pull selector and an entity id
        - The backend version of `roamAlphaAPI.data.pull`
        - parameters are passed as a JSON request body
      - Parameters::
        - `selector` (string, required) — the pull pattern, as an EDN string
        - `eid` (string, required) — the entity to pull, as an EDN string: an entity id number or a lookup ref like [:block/uid "abc123xyz"]
      - Return::
        - 200 with body `{"result": {...}}` — the pulled map, containing only the attributes the entity actually has
          - keys are prefixed with ":", e.g. ":block/uid"
        - for error responses, see **What does response look like?** (with **HTTP status codes**)
        - sample output structure
          - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Fb-o1HKrX_N.png?alt=media&token=7e6c9ef0-1162-4478-8cba-f0bf3c419deb)
      - Example::
        - Pulls a daily note page's uid and title, plus the uid and string of its children and the title/string/uid of everything they reference
        - Request body (JSON)
          - ```javascript
            {
              "eid": "[:block/uid \"08-30-2022\"]",
              "selector": "[:block/uid :node/title :block/string {:block/children [:block/uid :block/string]} {:block/refs [:node/title :block/string :block/uid]}]"
            }```
        - [[cURL]] request
          - ```shell
            curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/pull" --location-trusted \
            -H "Accept: application/json" \
            -H "X-Authorization: Bearer roam-graph-token-XXX" \
            -H "Content-Type: application/json" \
            -d "{\"eid\": \"[:block/uid \\\"08-30-2022\\\"]\", \"selector\": \"[:block/uid :node/title :block/string {:block/children [:block/uid :block/string]} {:block/refs [:node/title :block/string :block/uid]}]\"}"
            # =>
            # {"result": {":block/uid": "08-30-2022", ":node/title": "August 30th, 2022", ":block/children": [{":block/uid": "hjt3Bwqp2", ":block/string": "apple pie recipe"}, ...]}}```
        - [[TypeScript]] — using the [official SDK](https://github.com/Roam-Research/backend-sdks)
          - ```typescript
            import { initializeGraph, pull } from "@roam-research/roam-api-sdk";

            const graph = initializeGraph({
              token: "roam-graph-token-XXX",
              graph: "MY-GRAPH",
            });

            const result = await pull(
              graph,
              "[:block/uid :node/title :block/string {:block/children [:block/uid :block/string]} {:block/refs [:node/title :block/string :block/uid]}]",
              '[:block/uid "08-30-2022"]'
            );
            // =>
            // {":block/uid": "08-30-2022",
            //  ":node/title": "August 30th, 2022",
            //  ":block/children": [{":block/uid": "hjt3Bwqp2", ":block/string": "apple pie recipe"}, ...]}```
          - the SDK resolves to the `result` value directly and throws on error responses
    - `/api/graph/{graph-name}/pull-many` (POST)
      - Description::
        - Pulls the requested attributes for multiple entities in one request — the many-entity version of `/api/graph/{graph-name}/pull` (POST)
        - The backend version of `roamAlphaAPI.data.pull_many`
        - parameters are passed as a JSON request body
      - Parameters::
        - `selector` (string, required) — the pull pattern, as an EDN string, applied to every eid
        - `eids` (required) — the entities to pull
          - either one EDN string containing a list of eids (as in the example), or a JSON array whose elements are individual eids
      - Return::
        - 200 with body `{"result": [...]}` — an array of pulled maps, one per eid, in the same order
          - keys are prefixed with ":", e.g. ":block/uid"
        - for error responses, see **What does response look like?** (with **HTTP status codes**)
      - Example::
        - Pulls the uid, title, and children of two daily note pages in one request
        - Request body (JSON)
          - ```javascript
            {
              "eids": "[[:block/uid \"08-30-2022\"] [:block/uid \"08-31-2022\"]]",
              "selector": "[:block/uid :node/title {:block/children [:block/uid :block/string]}]"
            }```
        - [[cURL]] request
          - ```shell
            curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/pull-many" --location-trusted \
            -H "Accept: application/json" \
            -H "X-Authorization: Bearer roam-graph-token-XXX" \
            -H "Content-Type: application/json" \
            -d "{\"eids\": \"[[:block/uid \\\"08-30-2022\\\"] [:block/uid \\\"08-31-2022\\\"]]\", \"selector\": \"[:block/uid :node/title {:block/children [:block/uid :block/string]}]\"}"
            # =>
            # {"result": [{":block/uid": "08-30-2022", ":node/title": "August 30th, 2022", ":block/children": [...]}, {":block/uid": "08-31-2022", ":node/title": "August 31st, 2022", ":block/children": [...]}]}```
        - [[TypeScript]] — using the [official SDK](https://github.com/Roam-Research/backend-sdks)
          - ```typescript
            import { initializeGraph, pull_many } from "@roam-research/roam-api-sdk";

            const graph = initializeGraph({
              token: "roam-graph-token-XXX",
              graph: "MY-GRAPH",
            });

            const result = await pull_many(
              graph,
              "[:block/uid :node/title {:block/children [:block/uid :block/string]}]",
              '[[:block/uid "08-30-2022"] [:block/uid "08-31-2022"]]'
            );
            // =>
            // [{":block/uid": "08-30-2022", ":node/title": "August 30th, 2022", ":block/children": [...]},
            //  {":block/uid": "08-31-2022", ":node/title": "August 31st, 2022", ":block/children": [...]}]```
          - the SDK resolves to the `result` value directly and throws on error responses
    - `/api/graph/{graph-name}/search` (POST)
      - Description::
        - Ranked text search over page titles and block strings — the same search that powers the app's "Find or Create Page" search box
        - results are ranked: exact title matches first, then substring matches, then multi-word (spread) matches; pages come before blocks, and newer entities win ties
        - parameters are passed as a JSON request body
      - Parameters::
        - `search-str` (string, required) — the text to search for
          - `search-string` is accepted as an alias
        - `search-pages` (boolean, optional, default true) — include page results
        - `search-blocks` (boolean, optional, default true) — include block results
        - `hide-code-blocks` (boolean, optional, default false) — exclude code blocks from block results
        - `limit` (number, optional, default 300, max 1000) — maximum number of results
        - `pull` (string, optional) — pull pattern applied to each result, as an EDN string; default [:block/string :node/title :block/uid]
      - Return::
        - 200 with body `{"result": [...], "search-str": "..."}` — result is an array of pulled maps
          - keys are prefixed with ":", e.g. ":block/uid"
        - for error responses, see **What does response look like?** (with **HTTP status codes**)
      - Example::
        - Searches pages and blocks for "apple"
        - Request body (JSON)
          - ```javascript
            {
              "search-str": "apple",
              "hide-code-blocks": true,
              "limit": 20
            }```
        - [[cURL]] request
          - ```shell
            curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/search" --location-trusted \
            -H "Accept: application/json" \
            -H "X-Authorization: Bearer roam-graph-token-XXX" \
            -H "Content-Type: application/json" \
            -d "{\"search-str\": \"apple\", \"hide-code-blocks\": true, \"limit\": 20}"
            # =>
            # {"result": [{":node/title": "apple", ":block/uid": "x83-jseuA"}, {":block/string": "apple pie recipe", ":block/uid": "hjt3Bwqp2"}], "search-str": "apple"}```
        - [[TypeScript]] — plain `fetch` (this route is not in the SDK yet)
          - ```typescript
            const response = await fetch("https://api.roamresearch.com/api/graph/MY-GRAPH/search", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Authorization": "Bearer roam-graph-token-XXX",
              },
              body: JSON.stringify({ "search-str": "apple", "hide-code-blocks": true, "limit": 20 }),
            });
            const { result } = await response.json();
            // => [{":node/title": "apple", ":block/uid": "x83-jseuA"}, {":block/string": "apple pie recipe", ":block/uid": "hjt3Bwqp2"}]```
    - `/api/graph/{graph-name}/roam-query` (POST)
      - Description::
        - Runs a Roam query — the same syntax used in `{{[[query]]: ...}}` blocks — and returns the matching blocks and pages
        - The backend version of `roamAlphaAPI.data.roamQuery`
          - unlike the frontend version, there are no grouping or sorting options — results come back as a flat array
        - blocks that themselves contain a query are excluded from the results (matching the app's behavior)
        - parameters are passed as a JSON request body
      - Parameters::
        - `query` (string, required) — the query string, e.g. `{and: [[project]] [[active]]}`
        - `current-date` (string, required) — the client's current date, as "yyyy-MM-dd"
          - used as the reference date for `{between: }` clauses; required even if the query has none
        - `block-uid` (string, optional) — uid of an existing block to treat as the query's location
          - if that block is on a daily note page, the page's date is used for `{between: }` clauses instead of `current-date`
          - the block itself is excluded from the results
        - `limit` (number, optional) — maximum number of results
        - `pull` (string, optional) — pull pattern applied to each result, as an EDN string; default [:block/string :node/title :block/uid]
      - Return::
        - 200 with body `{"result": [...]}` — an array of pulled maps
          - keys are prefixed with ":", e.g. ":block/uid"
        - for error responses, see **What does response look like?** (with **HTTP status codes**)
      - Example::
        - Finds everything tagged with both `[[project]]` and `[[active]]`
        - Request body (JSON)
          - ```javascript
            {
              "query": "{and: [[project]] [[active]]}",
              "current-date": "2023-07-29",
              "limit": 20
            }```
        - [[cURL]] request
          - ```shell
            curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/roam-query" --location-trusted \
            -H "Accept: application/json" \
            -H "X-Authorization: Bearer roam-graph-token-XXX" \
            -H "Content-Type: application/json" \
            -d "{\"query\": \"{and: [[project]] [[active]]}\", \"current-date\": \"2023-07-29\", \"limit\": 20}"
            # =>
            # {"result": [{":block/string": "kick off [[project]] review #active", ":block/uid": "hjt3Bwqp2"}, ...]}```
        - [[TypeScript]] — plain `fetch` (this route is not in the SDK yet)
          - ```typescript
            const response = await fetch("https://api.roamresearch.com/api/graph/MY-GRAPH/roam-query", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Authorization": "Bearer roam-graph-token-XXX",
              },
              body: JSON.stringify({
                "query": "{and: [[project]] [[active]]}",
                "current-date": "2023-07-29",
                "limit": 20,
              }),
            });
            const { result } = await response.json();
            // => [{":block/string": "kick off [[project]] review #active", ":block/uid": "hjt3Bwqp2"}, ...]```
    - `/api/graph/{graph-name}/write` (POST)
      - Description::
        - A single endpoint for all write actions — pass the action's name as the `action` key in the JSON request body, alongside that action's own parameters
        - each available action, with its full parameters, is documented below
        - to run several actions in one request, use `batch-actions`
      - Parameters::
        - `action` (string, required) — one of: `create-block`, `move-block`, `update-block`, `delete-block`, `create-page`, `update-page`, `delete-page`, `batch-actions`
        - the rest of the body is the chosen action's own parameters — written out under each action below
      - Actions::
        - `create-block`
          - Description::
            - creates a new block at the given location
            - equivalent to `roamAlphaAPI.data.block.create`
          - Parameters::
            - `location` (map, required)
              - `parent-uid` (string) — uid of the parent block or page the new block goes under
              - `page-title` — target a page by title instead of uid; creates the page if it does not exist
                - either a title string, or a map `{"daily-note-page": "MM-DD-YYYY"}` for daily note pages
              - pass exactly one of parent-uid or page-title
              - `order` (number | "first" | "last", required) — position among the parent's children
            - `block` (map, required)
              - `string` (string, required) — the block's text
              - `uid` (string, optional) — uid for the new block, autogenerated if omitted
              - `open` (boolean, optional, default true) — expanded or collapsed
              - `heading` (number, optional) — 0, 1, 2, or 3, where 0 means normal text (no heading)
              - `text-align` (string, optional) — left, center, right, or justify
              - `children-view-type` (string, optional) — bullet, numbered, or document
        - `move-block`
          - Description::
            - moves an existing block (together with its children) to a new location
            - equivalent to `roamAlphaAPI.data.block.move`
          - Parameters::
            - `block` (map, required)
              - `uid` (string, required) — the block to move
            - `location` (map, required)
              - `parent-uid` (string) — uid of the new parent block or page
              - `page-title` — target a page by title instead of uid; creates the page if it does not exist
                - either a title string, or a map `{"daily-note-page": "MM-DD-YYYY"}` for daily note pages
              - pass exactly one of parent-uid or page-title
              - `order` (number | "first" | "last", required) — position among the new parent's children
        - `update-block`
          - Description::
            - updates a block's text and/or display properties; only the keys you pass are changed
            - equivalent to `roamAlphaAPI.data.block.update`
          - Parameters::
            - `block` (map, required)
              - `uid` (string, required) — the block to update
              - `string` (string, optional) — the new text
              - `open` (boolean, optional) — expanded or collapsed
              - `heading` (number, optional) — 0, 1, 2, or 3, where 0 means normal text (no heading)
              - `text-align` (string, optional) — left, center, right, or justify
              - `children-view-type` (string, optional) — bullet, numbered, or document
        - `delete-block`
          - Description::
            - deletes a block and all of its children
            - equivalent to `roamAlphaAPI.data.block.delete`
          - Parameters::
            - `block` (map, required)
              - `uid` (string, required) — the block to delete
        - `create-page`
          - Description::
            - creates a new page
            - equivalent to `roamAlphaAPI.data.page.create`
          - Parameters::
            - `page` (map, required)
              - `title` (string, required) — the page's title
              - `uid` (string, optional) — uid for the new page, autogenerated if omitted
              - `children-view-type` (string, optional) — bullet, numbered, or document
        - `update-page`
          - Description::
            - renames a page and/or updates its display properties; only the keys you pass are changed
            - equivalent to `roamAlphaAPI.data.page.update`
          - Parameters::
            - `page` (map, required)
              - `uid` (string, required) — the page to update
              - `title` (string, optional) — the new title
              - `children-view-type` (string, optional) — bullet, numbered, or document
        - `delete-page`
          - Description::
            - deletes a page and all of its blocks
            - equivalent to `roamAlphaAPI.data.page.delete`
          - Parameters::
            - `page` (map, required)
              - `uid` (string, required) — the page to delete
        - `batch-actions`
          - Description::
            - runs several write actions, in order, in one request
            - **tempids**: in place of real uids, you can pass negative integers in `uid` and `parent-uid` values and reuse them across the batch — e.g. create a page with uid -1, then create blocks under parent-uid -1
              - the response maps each tempid to the real uid it was assigned: `{"tempids-to-uids": {"-1": "EBiw8LzPb"}}`
            - if an action fails, the actions before it stay transacted and the rest are skipped
              - the error body's `num-actions-successfully-transacted-before-failure` tells you how many succeeded, alongside `message` and `batch-error-message`
          - Parameters::
            - `actions` (array, required) — a list of action maps, each shaped exactly like the individual actions above
              - cannot contain another batch-actions
      - Return::
        - 200 with an empty body — the write completed
          - exception: `batch-actions` responds with `{"tempids-to-uids": {...}}` when tempids are used
        - for error responses, see **What does response look like?** (with **HTTP status codes**)
      - Example::
        - A full `create-block` request — creates a new block as the last child of the September 28th, 2022 daily note page
          - Request body (JSON)
            - ```javascript
              {
                "action": "create-block",
                "location": {
                    "parent-uid": "09-28-2022",
                    "order": "last"
                },
                "block": {
                    "string": "new block created via the backend"
                }
              }```
          - [[cURL]] request
            - ```shell
              curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/write" --location-trusted \
              -H "Accept: application/json" \
              -H "X-Authorization: Bearer roam-graph-token-XXX" \
              -H "Content-Type: application/json" \
              -d "{\"action\":\"create-block\",\"location\":{\"parent-uid\":\"09-28-2022\",\"order\":\"last\"},\"block\":{\"string\":\"new block created via the backend\"}}"
              # => 200 OK (empty body)```
          - [[TypeScript]] — using the [official SDK](https://github.com/Roam-Research/backend-sdks)
            - ```typescript
              import { initializeGraph, createBlock } from "@roam-research/roam-api-sdk";

              const graph = initializeGraph({
                token: "roam-graph-token-XXX",
                graph: "MY-GRAPH",
              });

              const ok = await createBlock(graph, {
                location: { "parent-uid": "09-28-2022", order: "last" },
                block: { string: "new block created via the backend" },
              });
              // => true```
            - the SDK has one function per action (createBlock, moveBlock, updateBlock, deleteBlock, createPage, updatePage, deletePage) — each fills in `action` for you and resolves to true on success
        - A single `batch-actions` request that uses every action — creates pages and blocks (reusing tempids), captures to a daily note page, then moves, updates, and deletes
          - ```javascript
            {
              "action": "batch-actions",
              "actions": [
                {
                  "action": "create-page",
                  "page": { "title": "Batch action test page", "uid": -1 }
                },
                {
                  "action": "create-block",
                  "location": { "parent-uid": -1, "order": "last" },
                  "block": { "string": "First" }
                },
                {
                  "action": "create-block",
                  "location": { "parent-uid": -1, "order": "last" },
                  "block": { "string": "Second", "uid": -2, "heading": 2, "open": false }
                },
                {
                  "action": "create-block",
                  "location": { "page-title": {"daily-note-page": "07-29-2023"}, "order": "first" },
                  "block": { "string": "captured to a daily note page" }
                },
                {
                  "action": "move-block",
                  "block": { "uid": -2 },
                  "location": { "parent-uid": -1, "order": 0 }
                },
                {
                  "action": "update-block",
                  "block": { "uid": -2, "string": "Second (updated)", "heading": 0 }
                },
                {
                  "action": "create-page",
                  "page": { "title": "Scratch page", "uid": -3, "children-view-type": "numbered" }
                },
                {
                  "action": "update-page",
                  "page": { "uid": -3, "title": "Scratch page (renamed)" }
                },
                {
                  "action": "delete-page",
                  "page": { "uid": -3 }
                },
                {
                  "action": "delete-block",
                  "block": { "uid": -2 }
                }
              ]
            }
            // =>
            // {"tempids-to-uids": {"-1": "EBiw8LzPb", "-2": "X4DelKvsP", "-3": "mR7wJq2Lc"}}```
  - **What does response look like?** (with **HTTP status codes**)
    - (If you're building an integration, be sure to implement at least the response codes below)
    - 200 OK #important
      - if successful
      - If q request , see sample output structure
      - if pull request, see sample output structure
      - if write request, 200 status code in response means all done
    - 308 PERMANENT REDIRECT
      - the API endpoint for backend API i.e. **Endpoint base url:** https://api.roamresearch.com/ actually returns the actual URL you want to hit for your read/write requests
      - In many cases, the network tool/library you're using will follow the redirect without additional config on your side
    - 4XX BAD REQUEST (with error message specifying what went wrong)
      - 400 BAD REQUEST #important
        - this error code is returned in many cases. So, please checkout response body's `message` value
        - some cases
          - When input format error / invalid parameter values
            - Example:: if we pass `"order": 2` in an update-block request
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FCYOavPuw7p.png?alt=media&token=a1a7301b-e12a-4385-983f-3d6489a7916f)
          - If write request fails
            - For `batch-actions` especially, You have to carefully handle this (to know how many requests suceeded)
              - Please checkout if an action fails, the actions before it stay transacted and the rest are skipped
                - if an action fails, the actions before it stay transacted and the rest are skipped
                  - the error body's `num-actions-successfully-transacted-before-failure` tells you how many succeeded, alongside `message` and `batch-error-message`
          - When one is trying to use an Encrypted graph
            - Encrypted graphs are NOT supported by the [[Roam Backend API]]
          - When no graph name in request, or invalid graph name
          - If invalid write action
          - When token cannot be verified or improperly formatted
      - 401 UNAUTHORIZED #important
        - If one is unauthorized or if one does not have required access to the graph (read/write)
        - Please note that in some cases, When token cannot be verified or improperly formatted returns a 400 BAD REQUEST #important
          - this is a bug on our part, but changing it now could break existing integrations, so leaving it like this for this version of the API
      - 404 NOT FOUND
        - If the API route you're calling is not found
          - i.e. if you request an API route NOT in **API routes**
      - 429 TOO MANY REQUESTS #important
        - When you run into the per graph limit/quota. See **Graph-specific Usage Quotas**
          - Quotas are per minute, per graph, and depend on the type of request
    - 500 INTERNAL SERVER ERROR #important ( default fallback code for errors  )
      - default fallback code for errors 
        - So, please checkout response body's `message` value
      - If you get this & message does not make clarify, please contact us at support@roamresearch.com or in the #developers channel in the [[Roam Slack]] 
      - Some cases
        - If message contains "**took too long to run**", then the query/pull request is running into our time limit (20 seconds for now). In this case, you want to request less data or add limits. 
          - You might want to add limited recursion limits to pull specs: https://docs.datomic.com/pro/query/pull.html#recursive-specifications
    - 503 SERVICE UNAVAILABLE #important
      - if graph is not ready for requests yet or is unavailable at the moment. If you get this, please try again in a bit
        - a common cause: the graph isn’t loaded on our servers yet (brand new, or not accessed in a while) — your request triggers the load, so retrying after a few seconds usually succeeds
      - Example
        - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FOFF0WgypQ2.png?alt=media&token=99704237-587c-4046-ab08-67b03a0143a3)
  - **Graph-specific Usage Quotas**
    - Quotas are per minute, per graph, and depend on the type of request
      - __500 requests/minute__ for `pull` and `pull-many` requests
      - __200 requests/minute__ (shared) for `q`, `search`, and `roam-query` requests
      - __100 requests/minute__ for `write` requests
        - a `batch-actions` request counts as the number of actions in it, not as 1 request
      - If you run into the limits regularly even when using the strategies mentioned below, please let us know
    - When you run into the limit/quota, server will respond with a 429 TOO MANY REQUESTS #important
      - so please account for that in your code by using timeouts etc
    - Batch writes save round trips but do __not__ reduce quota usage — a `batch-actions` request counts as the number of actions in it
- FAQ::
  - Q:: How do I do the --location-trusted if I'm using something other than [[cURL]]?
    - The two main things
      - You want the request library to automatically follow redirects
        - this is generally the default in most libraries and applications
      - You want the authorization header to be passed when redirect has been followed
        - This is generally not default behavior, so this will probably need extra configuration
        - another approach would be to use the `X-Authorization` header instead of the `Authorization` header
          - pass them in the `X-Authorization` header
            - you can use the `Authorization` header too (would be more secure) but you have to make sure that your code/library handles redirect properly and passes the authorization header when redirect has been followed (and the latter is generally not default behavior for most network libraries) 
    - Examples
      - [[Python]] 
        - some examples, courtesy of [[Matt Vogel]]: https://gist.github.com/8bitgentleman/75561ac116b5b925fd58ff595389d591
      - [[Postman]] client: https://www.postman.com/
        - Postman already fulfills criteria 1: it automatically follows redirects
          - If it doesn't for you, you have to go to the settings and enable "Automatically follow redirects"
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Fe-TlApoRVQ.png?alt=media&token=4a136983-a944-4000-98ee-84057b2c2f16)
        - For criteria 2 i..e passing authorization header on redirect, that is a per "request" setting and it can be enabled in the request level settings > Follow Authorization Header
          - If you don't do this, you will get a `"message": "You are not authenticated"` response from the server, which is super confusing unless you go to the console and really look at the requests
          - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FnC3atvLkRc.png?alt=media&token=4ed94fa2-fcaf-420e-b2ad-ee3315aa7f40)
  - Q:: I can't get the request to work using `fetch` or equivalent in my roam/js (i.e. in the browser)
    - A:: This works now — you can `fetch` directly from the browser. Just make sure you pass your token in the `X-Authorization` header, not `Authorization` (browsers drop the `Authorization` header when following the cross-origin redirect)
      - From inside Roam, you can also use `roamAlphaAPI.data.backend.q` — a client-side wrapper that makes this same request for you
- **Change Log**
  - [[Roam Backend API Change Log]]
