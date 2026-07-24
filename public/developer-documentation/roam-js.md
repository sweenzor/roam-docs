# roam/js

- **Getting Started**
  - roam/js lets you run your own JavaScript inside Roam to automate and customize your graph.
  - To use it, create a block containing `{{[[roam/js]]}}`, then nest a javascript code block underneath it.
    - Like this
    - {{[[roam/js]]}}
      - ```javascript
        console.log("hello from roam/js");```
  - Click "Yes, I know what I'm doing" to run the code — open your browser's developer console to see the logged text.
    - Enabling is per user and per block: your approval is stored in your user settings, not in the graph, so collaborators get the same prompt and decide for themselves.
    - Only enable code you've read and understood, or whose author you trust — scripts run with full access to your graph.
  - `{{[[roam/js]]}}` blocks can live on any page, and the code applies to the whole app, not just the page the block is on.
    - Every `{{[[roam/js]]}}` block links to [[roam/js]], so this page's linked references list every script in your graph.
  - Your code can use the [[Roam Alpha API]] on the `window` object, as well as the [[Available Libraries]] Roam exports.
  - The attributes you can query are documented on the [[Data Model]] page, and its [[Querying tips]] section shows how to query them efficiently.
  - roam/js is best for small scripts you run for yourself — to share your work with others, build a [[Roam Depot/Extensions]] instead.
- **Languages**
  - Code blocks in three languages are run: `javascript`, `jsx`, and `clojure`. See [[roam/cljs]] for clojure.
    - jsx blocks are transformed with Babel using the classic React runtime, so they pair with `window.React`.
    - clojure blocks run as ClojureScript, interpreted in the browser — see [[roam/cljs]] for the environment and its namespaces.
  - `{{[[roam/cljs]]}}` works too and behaves identically — same warning, same approval.
  - Every code block nested anywhere under the `{{[[roam/js]]}}` block counts, not just direct children.
  - Multiple code blocks of the same language are joined in block order and run as a single script.
- **How it works**
  - Enabled blocks run automatically on startup.
    - The load order is `Roam Depot extensions -> roam/js (or roam/cljs) -> roam/render components`.
    - With developer mode enabled, the Roam Depot settings tab has a switch to load roam/js at the same time as Roam Depot extensions instead of after them.
  - Enabling a block runs it immediately — no reload needed.
  - Editing an enabled code block does not re-run it.
    - Refresh the app, or click "Stop this" and enable the block again, to run the new version.
    - Re-running does not undo anything the previous version already did. Any resources created, dom elements added are still there.
  - Code is evaluated in the global scope.
    - Top-level `var` and `function` declarations land on `window` and are visible to every other code block.
    - `let` and `const` declarations stay inside their own code block.
  - Errors are caught and logged to the browser console — a failing block does not stop other blocks or the app from loading.
  - If a script makes your graph unusable, add `?disablejs=true` to the URL to load with all roam/js, roam/render, and Roam Depot extensions turned off until the next refresh.
    - The "Temporarily disable all extensions and css" button in the Roam Depot settings tab does the same, and turns off roam/css too.
- Examples::
  - Open a random page from the command palette — good for rediscovering old notes
    - {{[[roam/js]]}}
      - ```javascript
        window.roamAlphaAPI.ui.commandPalette.addCommand({
          label: "Open random page",
          callback: async () => {
            const uids = window.roamAlphaAPI.q(
              "[:find [?uid ...] :where [?e :node/title] [?e :block/uid ?uid]]");
            const uid = uids[Math.floor(Math.random() * uids.length)];
            await window.roamAlphaAPI.ui.mainWindow.openPage({page: {uid}});
          }
        });```
  - Open a page in the sidebar with a keyboard shortcut
    - {{[[roam/js]]}}
      - ```javascript
        window.roamAlphaAPI.ui.commandPalette.addCommand({
          label: "Open Reading List in sidebar",
          "default-hotkey": "ctrl-shift-7",
          callback: () => {
            const uid = window.roamAlphaAPI.q(
              "[:find ?uid . :in $ ?title :where [?e :node/title ?title] [?e :block/uid ?uid]]",
              "Reading List");
            window.roamAlphaAPI.ui.rightSidebar.addWindow(
              {window: {type: "outline", "block-uid": uid}});
          }
        });```
  - Make sure today's daily note starts with a Journal block — runs on every startup, and shows the guard pattern that keeps a script from creating duplicates
    - {{[[roam/js]]}}
      - ```javascript
        async function ensureTodayHasJournal() {
          const api = window.roamAlphaAPI;
          const todayUid = api.util.dateToPageUid(new Date());
          if (!api.q("[:find ?p . :in $ ?uid :where [?p :block/uid ?uid]]", todayUid)) {
            await api.data.page.create(
              {page: {title: api.util.dateToPageTitle(new Date())}});
          }
          const existing = api.q(
            "[:find ?c . :in $ ?uid ?text :where [?p :block/uid ?uid] [?p :block/children ?c] [?c :block/string ?text]]",
            todayUid, "Journal");
          if (!existing) {
            await api.data.block.create(
              {location: {"parent-uid": todayUid, order: 0}, block: {string: "Journal"}});
          }
        }
        ensureTodayHasJournal();```
  - Define helper functions for your other scripts — top-level function declarations are global, so any code block can call them
    - {{[[roam/js]]}}
      - ```javascript
        function getPageUid(title) {
          return window.roamAlphaAPI.q(
            "[:find ?uid . :in $ ?title :where [?e :node/title ?title] [?e :block/uid ?uid]]",
            title);
        }

        function getChildUids(parentUid) {
          return window.roamAlphaAPI.q(
            "[:find [?uid ...] :in $ ?parent :where [?p :block/uid ?parent] [?p :block/children ?c] [?c :block/uid ?uid]]",
            parentUid);
        }```
- **Good practices**
  - Write scripts so running them twice is harmless — check for existing blocks before creating them, like the journal example above.
  - Prefer the [[Roam Alpha API]] over reading the DOM — class names and DOM structure can change without notice.
  - Keep each script under its own `{{[[roam/js]]}}` block so you can turn them on and off individually.
  - Use the browser console for feedback — `console.log` output and script errors both land there.
  - Test scripts that write to the graph on a test graph first.
