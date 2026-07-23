# Roam Alpha API (old)

- **Getting Started**
  - The Roam Alpha API is provided in the browser allowing you to read and write data as well as manipulate the UI
    - The methods available in the API are attached to the `window` object in the browser under `roamAlphaAPI`
    - You can see a list of examples below, showcasing the amazing things that can be built using this API, especially when used in combination with [[roam/js]]
    - To learn how to use the API, there are some awesome articles written by our community
- (for the cljs version of the Roam Alpha API, please checkout the [[Reference]] section of [[roam/cljs]])
- Change Log::
  - [[February 20th, 2026]]
    - Added `roamAlphaAPI.ui.callout.addType` / `.removeType` — register custom callout types for the picker menu, styled entirely via CSS
    - Added `roamAlphaAPI.data.block.addComment` — programmatic block commenting with `reply-string` or `reply-markdown`
    - `roamAlphaAPI.data.ai.getGraphGuidelines` now includes `userDisplayPage` field with the requesting user's display page content
  - [[September 16th, 2025]]
    - Updates and additions to `roamAlphaAPI.components` `render` functions
      - new parameters for `window.roamAlphaAPI` `.components` `renderBlock`:
        1. `open?` **optional** 
        2. `zoom-start-after-uid` **optional** 
        - `open?` **optional**
          - optional Boolean
          - values
            - If not passed = whatever the normal open state of that block is in the db/graph
            - `true` = force open the block (show the children if exist)
            - `false` = force close the block (even if the block has children, they are not shown)
        - `zoom-start-after-uid` **optional**
          - Optional boolean
          - only valid when `zoom-path?` is true
            - path compacts to clickable `...` for everything until passed in uid
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2F0UbfHOyucp.png?alt=media&token=100fe5d1-6461-4e4d-986d-3916ef5e914e)
          - block uid __String__
        - Example which showcases all the new stuff: Example:: 
      - ability to render arbitrary strings: `window.roamAlphaAPI` `.components` `renderString`
        - `renderString`
          - Description::
            - Mounts a React component that renders the passed-in string
              - the string can contain existing page titles, block refs and all the elements of roam-flavored markdown
                - in other words, it can contain anything you can keep in a block string
                - Watch out for
                  - If you pass/show `[[Page Title]]` like links for pages that do not exist, those links will not work. Please try not to do that
          - Parameters::
            - `string`
              - The string to be displayed
              - the string can contain existing page titles, block refs and all the elements of roam-flavored markdown
                - in other words, it can contain anything you can keep in a block string
                - Watch out for
                  - If you pass/show `[[Page Title]]` like links for pages that do not exist, those links will not work. Please try not to do that
              - __String__
            - `el`
              - DOM node where React component should be mounted
              - __DOM Node__
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Example:: (shows up in right sidebar)
            - ```javascript
              const newNode = document.createElement('div');
              const wrap = document.getElementById('right-sidebar');

              // insert our new node after the wrap element in the DOM tree
              wrap.insertBefore(newNode, wrap.firstChild)

              window.roamAlphaAPI.ui.components.renderString(
                {
                  el: newNode, 
                  string: "Hello this is via [[Roam Alpha API]]'s `renderString` which ((-PAiIlJ14))"})```
              - [[Screenshot]] (see top right)
                - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FojUSHmwVlU.png?alt=media&token=1d759b50-99e5-4b71-b9cd-0cc46ad17ae9)
  - [[March 6th, 2025]]
    - `q`, `pull`, and variant API functions now have a timeout of 20 seconds
      - Throws an error with message `Query and/or pull expression took too long to run.` when you run into the timeout limit
  - [[June 14th, 2024]]
    - Ability to pin a window **to the top** of the right sidebar programatically
      - you can now pass a new optional `pin-to-top?` parameter to `window.roamAlphaAPI``.ui``.rightSidebar`**`.pinWindow`**
        - `pin-to-top?`
          - optional parameter
          - If `pin-to-top?` is passed, it should be either `true` or `false`
            - If explicit value is not passed, we do not change the state
              - i.e. if a window is pinned to top and we call `.pinWindow` on it again but without specifying an explicit `pin-to-top?`, nothing changes
          - If value is `true`, then we pin the specified `window` to the top of the sidebar. Visually this will make the pin look red.  new sidebar windows will be added below it
            - If another window was already pinned to top, it will be unpinned
      - `window.roamAlphaAPI``.ui``.rightSidebar`**`.getWindows`**'s return value will contain `pinned-to-top?`: `true` if a window is pinned to the top
    - A change in behavior of what happens when you close pinned sidebar windows (both via UI and via roamAlphaAPI.ui.rightSidebar.removeWindow)
      - **Previously**: If we close a window which was pinned, it would disappear for now but would later resurrect (when Roam is reloaded, for instance)
        - we believe this behavior is confusing
      - **New behavior:** If we close a window which is pinned, it will be unpinned & removed. i.e. it will not resurrect
        - If the user initiates the closing, they will get a dialog to confirm if they want to close a pinned window
        - For extensions closing the window via roamAlphaAPI.ui.rightSidebar.removeWindow , a warning will **not **be shown.
      - If you have extensions, the main thing to watch out for is if you’re calling roamAlphaAPI.ui.rightSidebar.removeWindow and then depending on the fact that pinned windows come back
        - We think we've already caught all usages like this from Roam Depot extensions & worked with the Extension devs to fix it
        - If you were relying on this behavior please [let us know](mailto:support@roamresearch.com) so we can quickly merge updates to any extensions effected
  - [[April 23rd, 2024]]
    - You can now create and modify search windows in  `window.roamAlphaAPI` `.ui` `.rightSidebar`  functions
      - new `type`: "search-query"
      - need to pass a `search-query-str` parameter instead of `block-uid`
        - Example usage
          - ```javascript
            // Add a window that searches for "API"
            window.roamAlphaAPI.ui.rightSidebar
              .addWindow({window:
                          {type:'search-query' ,'search-query-str':'API'}})```
  - [[June 5th, 2023]]
    - New file api
  - [[May 9th, 2023]] 
    - **Load remote developer extensions from URL or using "PR-shorthand" format**
      - One can now load developer extensions via URLs or via PR-shorthand format
      - Read more about it here
      - [[Loom video]]
        - {{[[video]]: https://www.loom.com/share/d6ec8341b17e4959b9604957e7212556}}
  - [[February 14th, 2023]]
    - **User configurable hotkeys for commands**
      - new behavior you get without any code change: 
        can specify hotkeys for any command in Settings > Hotkeys
        - if you want to disable that for a command, checkout the param `disable-hotkey`
      - changes to `.addCommand`
        - new parameters
          - `disable-hotkey`
          - `default-hotkey`
        - Examples showing `default-hotkey`
      - [[Roam Depot/Extension API]]
        - exposes new function [extensionAPI.ui.commandPalette.addCommand](`.addCommand`) which has params equivalent to roamAlphaAPI's `.addCommand` + the new parameters
          - only difference is: when you use this version from extensionAPI, the commands are associated with your extension and so you have convenient grouping (in for example the Hotkeys window)
        - also has [extensionAPI.ui.commandPalette.removeCommand](`.removeCommand`), which has same params as `.removeCommand`
          - in contrast to the roamAlphaAPI's version, you do not need to call this on `onunload` - if you call via extensionAPI, will be cleaned automatically on unload
      - [[Loom video]]
        - {{embed: [[Migration Guide]] from roamAlphaAPI.ui.commandPalette.addCommand to extensionAPI's version}}
        - Video going into all the changes
          - {{[[video]]: https://www.loom.com/share/a956af55230d4540806d31dc9ecf6870}}
  - [[February 7th, 2023]]
    - new & updated window.roamAlphaAPI.ui.components + data on block(/s) drag
      - Changes to `window.roamAlphaAPI` `.ui` `.components` 
        - new param added to `renderBlock`: `zoom-path?`**optional**
          - `zoom-path?`**optional**
            - Optional boolean
            - when `zoom-path?` is true, it shows the zoom path i.e. view which looks similar to how linked refs look
          - Example::
            - ```javascript
              const newNode = document.createElement('div');
              const wrap = document.getElementById('right-sidebar');

              // insert our new node after the wrap element in the DOM tree
              wrap.insertBefore(newNode, wrap.firstChild)

              window.roamAlphaAPI.ui.components.renderBlock(
                {
                  "uid": '6-P4ZEbIY', 
                  "el": newNode,

                  // optional args below

                  // open? is for if you want to force open/close the block
                  //   if not passed, uses whatever the normal open state of that block is in the db/graph
                  "open?": false, 

                  // zoom-path? : if you want to show the zoomable path of the block too
                  "zoom-path?": true,
                  // optional addition in zoom-path? mode: path compacts to ... for everything until passed in uid
                  "zoom-start-after-uid": "ImSvJvm1_"
                  })```
        - new functions (for rendering pages and search views)
          - `renderPage`
            - `renderPage`
              - Description::
                - Mounts a React component that renders a given page with children (editable) in a given DOM node.
                - unless you're using specific params (`zoom-path?` for block or `hide-mentions?` for page), you can use this interchangeably with `renderBlock`
              - Parameters::
                - (same as renderBlock except for the new "zoom-path?". has one additional optional param  `hide-mentions?` )
                - `uid`
                  - Block UID of block to display
                  - __String__
                - `el`
                  - DOM node where React component should be mounted
                  - __DOM Node__
                -  `hide-mentions?`
                  - Optional boolean
                  - to show or not to show linked refs at bottom of page
          - `renderSearch`
            - `renderSearch`
              - Description::
                - Mounts a React component that renders search results (first pages then blocks) for a given `search-query-str` in a given DOM node.
                  - the results are the same as the "Find or Create Page" or cmd+u search
                - class is `rm-search-query`. Also uses the existing `rm-query` class
                - this search view is also available as an xparser component `{{[[search]]}}` or `{{[[search]]: Bret Victor}}`
              - Screenshot::
                - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Frs51OdcD-S.png?alt=media&token=e028dfc5-4a5e-4b4c-9f60-b28dc3f955cd)
              - Parameters::
                - `search-query-str`
                  - Required string
                - `el`
                  - Required
                  - DOM node where React component should be mounted
                  - __DOM Node__
                - `closed?`
                  - optional boolean
                    - default is false
                  - whether view is closed or no
                - `group-by-page?`
                  - optional boolean
                    - default is false
                - `hide-paths?`
                  - optional boolean
                    - default is fale
                - `config-changed-callback`
                  - optional function parameter
                  - is called when config is changed as a result of user interaction
              - Example::
                - ```javascript
                  const newNode = document.createElement('div');
                  const wrap = document.getElementById('right-sidebar');

                  // insert our new node after the wrap element in the DOM tree
                  wrap.insertBefore(newNode, wrap.firstChild)

                  window.roamAlphaAPI.ui.components.renderSearch(
                    {"search-query-str": 'Bret Victor',
                     "closed?": false,
                     "group-by-page?": false,
                     "hide-paths?": false,
                     "config-changed-callback": (config) => {console.log("new-config", config);},
                     el: newNode})```
      - adds data to `e.dataTransfer.getData()` for drag events
        - works for blocks dragged and also for pages in the sidebar (the only cases I could remember which had drag)
        - types
          - "text/uri-list"
          - "roam/roam-uri-list"
          - "roam/block-uid-list"
          - "roam/block-uid-list-only-parents"
            - context for this and comparison with "roam/block-uid-list": 
              - In the Example [[Screenshot]] 
                - "roam/block-uid-list" will contain all the selected blocks that are visible. In this case, it will have 5 blocks
                - however, in many cases, we’d probably only want the top level blocks, so for that we have "roam/block-uid-list-only-parents" , which will only have two blocks
        - Example [[Screenshot]] 
          - In this case, I'd selected and tried to move all the blocks on the page
          - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FgaYo6asLSn.png?alt=media&token=a1f07291-9b76-4239-86ea-5e5599479bdf)
  - [[October 1st, 2022]]
    - For the [[Roam Backend API]] write API release, we made the error reporting better. It made sense to reuse this code in the frontend (aka in [[Roam Alpha API]]) so as to make it easier for extension devs to reuse their code too
      - Here are some of the main changes you'd want to check
        - Create page (`roamAlphaAPI.data.page.create` or the older `roamAlphaAPI.createPage`) now throws errors (in the promise) if a page with the provided `title` already exists or if a page with the provided `uid` already exists
        - Update page (`roamAlphaAPI.data.page.update` or the older `roamAlphaAPI.updatePage`) now throws errors (in the promise) if we're trying to change to a title that already exists in the db
        - Moving blocks (`roamAlphaAPI.data.block.move` or the older `roamAlphaAPI.moveBlock`) now throws errors (in the promise) if blocks corresponding to `parent-uid` or `uid` do not exist
        - The error messages for many asserts has been made clearer. You do not need to worry about this unless you've written error handling code which depends upon the `error.message` being a certain string
      - One thing to note is that although there may be a few extra throws, the behavior as a whole has not changed. Previously, for the ones above, although they would not throw errors, they would just fail silently. So, I'm pretty sure that as long as you have proper error checks, no behavior in your extensions would've changed
  - [[April 5th, 2022]]
    - Adds new functions for adding/modifying filters on a page, on linked refs to a page, on sidebar windows (previously could only handle global filters from the api)
      - [[roam/js]]
        - `window.roamAlphaAPI.ui.filters`  ->
          - `.getPageFilters` 
          - `.getPageLinkedRefsFilters` 
          - `.getSidebarWindowFilters` 
          - `.setPageFilters` 
          - `.setPageLinkedRefsFilters` 
          - `.setSidebarWindowFilters`
      - [[roam/cljs]]
        - `roam.ui.filters`
          - `get-page-filters` 
          - `get-page-linked-refs-filter` 
          - `get-sidebar-window-filters` 
          - `set-page-filters` 
          - `set-page-linked-refs-filters` 
          - `set-sidebar-window-filters`
    - Exposes new libraries to [[roam/cljs]]
      - Promesa
      - `applied-science.js-interop`
    - Fixes an issue where sometimes promise returned by roamAlphaAPI would always be pending
  - [[March 8th, 2022]]
    - `.pull_many`
    - `.fast`
  - [[January 28th, 2022]]
    - Adds "main-window" as acceptable param for `.setBlockFocusAndSelection`/Parameters::/`location`/`window-id`
    - Adds a new function: window.roamAlphaAPI.ui.mainWindow.focusFirstBlock
  - [[January 3rd, 2022]]
    - Promisifying the roamAlphaAPI (well, partly)
      - Write functions in roamAlphaAPI now utilize promises.
        - This means no `setTimeout` hacks will be necessary to ensure that a write took place before doing another related write.. you can just await for it.
        - Promises are resolved after the operation has been handled by Roam
          - [[Important Note]] if you're directly manipulating the DOM: 
            - note that promises are resolved after Roam handles the operation, not after React updates/re-renders the DOM. 
              - So, if you're directly manipulating the relevant DOM element right after doing a write operation, you might need a (very small) timeout even after awaiting promise
        - Currently, the promise value once resolved is always `nil` or `null` or `undefined`. 
        - Obviously, you can `.catch()` for errors (or the just use try catch blocks in case you are using `await`)
      - To not break existing stuff that leverage the API, read functions are the same as before (i.e. they do NOT return promises, they return their output values synchronously) 
      - Note about existing code: Since read API is not changing, existing code should not break
        - One possible reason it could break is if it depended on the return value of write functions being true (previously, it was always `true`)
    - Some small additions to the API
      - `window.roamAlphaAPI.ui`
        - `.setBlockFocusAndSelection`
        - `.mainWindow`
          - `.openDailyNotes`
          - `.getOpenPageOrBlockUid`
        - `.leftSidebar`
          - `.open`
          - `.close`

#### Resources::

- [Introduction to the Roam Alpha API](https://www.putyourleftfoot.in/introduction-to-the-roam-alpha-api) by [[Put Your Left Foot In]] #Community #Article
- [Deep Dive Into Roam's Data Structure - Why Roam is Much More Than a Note Taking App](https://www.zsolt.blog/2021/01/Roam-Data-Structure-Query.html) by [[Zsolt Viczian]] #Community #Article
- [Datalog Queries for Roam Research](https://davidbieber.com/snippets/2020-12-22-datalog-queries-for-roam-research/) by [[David Bieber]] #Community #Article
- [JavaScript Functions for Inserting Blocks in Roam](https://davidbieber.com/snippets/2021-02-12-javascript-functions-for-inserting-blocks-in-roam/) by [[David Bieber]] #Community #Article
- [More Datalog Queries for Roam](https://davidbieber.com/snippets/2021-01-04-more-datalog-queries-for-roam/) by [[David Bieber]] #Community #Article
- [Publishing Blog Posts from Roam Research Quickly and Automatically](https://davidbieber.com/snippets/2020-12-28-publishing-blog-posts-from-roam-research-quickly-and-automatically/) by [[David Bieber]] #Community #Article

#### Examples::

- [RoamJS Extensions](https://github.com/dvargas92495/roam-js-extensions) from [[David Vargas]] #[[Open Source]] #JavaScript #TypeScript #roam/js
  - A suite of tools to extend popular workflows in Roam
- [Roam42](https://github.com/roamhacker/roam42) from [[RoamHacker]], now maintained by [[David Vargas]] #[[Open Source]] #JavaScript #roam/js
  - A collection of power user tools for Roam
- [roam/sr](https://github.com/aidam38/roamsr) from [[Adam Krivka]] #[[Open Source]] #JavaScript #TypeScript #roam/js
  - Spaced Repetition in Roam
- [pyroam](https://github.com/aidam38/pyroam) from [[Adam Krivka]] #[[Open Source]] #JavaScript #TypeScript #roam/js
  - Python Notebooks in Roam
- [LittleScripts](https://roamresearch.com/#/app/roam-depot-developers/page/1hRLj21Rg) from [[Adam Krivka]] #[[Open Source]] #JavaScript #roam/js
  - Suite of small Roam scripts 
- [roam-inter](https://github.com/houshuang/roam-inter) from [[Stian Haklev]] #[[Open Source]] #JavaScript #roam/js
  - Cross-graph referencing prototype
- [roam-toolkit](https://github.com/roam-unofficial/roam-toolkit) from [[Vlad Sitalo]] #[[Open Source]] #JavaScript #TypeScript #[[Browser Extension]]
  - A Chrome and Firefox Extension toolkit to extend Roam
- [Fabricius](https://github.com/chronologos/Fabricius) from [[Ian Tay]] #[[Open Source]] #Python #Integration
  - An Anki plugin that bidirectionally syncs with Roam.

#### Reference::

- parameter schema::
  - `location`
    - `parent-uid`
      - Unique Identifier for block parent under which the block should be inserted.
      - __string__
    - `order`
      - Index where the block should be inserted under the parent. 
        - Starts at 0
        - Use `'last'` to append
      - __string__
  - `block`
    - `uid`
      - Unique identifier for the block.
      - __string__
    - `string`
      - Text content of the block.
      - __string__
    - `open`
      - Collapse state of the block.
      - __boolean__
      - `true` by default (if not passed)
    - `children-view-type`
      - Block view type of children blocks
      - __string__
        - `bullet` 
        - `numbered` 
        - `document`
    - `block-view-type`
      - Block view type of the current block
      - __string__
        - `outline`
        - `horizontal-outline`
        - `popout`
        - `tabs`
        - `comment`
        - `side`
        - `vertical`
    - `text-align`
      - The block's alignment
      - __string__
        - `left` 
        - `center` 
        - `right`
        - `justify`
    - `heading`
      - Heading styling of the block
      - __integer__
        - `0` (no heading styling)
        - `1`
        - `2`
        - `3`
  - `page`
    - `uid`
      - Unique identifier for the page.
      - __string__
    - `title`
      - Title of the page.
      - __string__
    - `children-view-type`
      - Block view type of children blocks
      - __string__
        - `bullet` 
        - `numbered` 
        - `document`
  - `window`
    - `collapsed?`
    - `pinned?`
    - `type`
      - View type of window to open in the sidebar
      - Can be one of:
        - "mentions"
        - "block"
        - "outline"
        - "graph"
        - "search-query"
      - __string__
      - See [[Sample Output]] for `.getWindows` to see the types in action
    - `block-uid`
      - Unique identifier for block to open in the right sidebar
      - Depending on the window type, this will be `block-uid`, `mentions-uid`, and `page-uid` in the returned window object. 
      - __string__
    - `order`
      - Order of the window from $$0$$ to $$n$$
      - __integer__
- methods::
  - `window.roamAlphaAPI`
    - `.data`
      - `.q`
        - Description::
          - Query the graph using datomic flavored datalog
          - See the [datomic docs](https://docs.datomic.com/on-prem/query/query.html) for a full explanation of datalog queries
            - Or http://www.learndatalogtoday.org learn how to write them
            - [Datascript tests](https://github.com/tonsky/datascript/tree/master/test/datascript/test) also include great examples
          - `q`, `pull`, and variant API functions now have a timeout of 20 seconds
            - Throws an error with message `Query and/or pull expression took too long to run.` when you run into the timeout limit
        - Parameters::
          - `query`
            - Type::
              - String
          - `& args`
        - Example::
          - ```javascript
            window.roamAlphaAPI.data.q(
              `[:find ?b ?s
                :where 
                [?e :block/uid ?b]
                [?e :block/string ?s]]`);```
            - Find a relation of all block uids and strings in the graph
      - `.pull`
        - Description::
          - A declarative way to make hierarchical (and possibly nested) selections of information about entities. Pull applies a `pattern` to a collection of entities, building a map for each entity.
          - See for the [datomic docs](https://docs.datomic.com/on-prem/query/pull.html) for a good explanation of how to use pull
            - There are slight differences because we use [datascript](https://github.com/tonsky/datascript) internally, but it supports the majority of datomic syntax
            - The main difference is the JS API the pattern is written in a string instead of clojure data structures
          - `q`, `pull`, and variant API functions now have a timeout of 20 seconds
            - Throws an error with message `Query and/or pull expression took too long to run.` when you run into the timeout limit
        - Parameters::
          - `pattern`
            - Type::
              - String
            - Examples::
              - `"[*]"`
              - `"[:block/string {:block/children ...}]"`
          - `eid`
            - [[OR]]
              - a database id `:db/id`
                - Type::
                  - Integer
                - Example::
                  - `24`
              - an entity unique identifier
                - Type::
                  - String | 2-tuple array
                - Example::
                  - `"[:node/title \"hello world\"]"`
                  - `[":block/uid", "xyz"]`
        - Example::
          - ```javascript
            window.roamAlphaAPI.data.pull("[*]", [":block/uid", "xyz"])```
            - Get all of the attributes for this block
          - `window.roamAlphaAPI.data.pull("[:block/string {:block/children ...}]", "[:block/uid \"xyz\"]")`
            - Get the block string for this block and all it's children
      - `.pull_many`
        - Description::
          - Same as `.pull` but for multiple entities
            - May be faster for pulling many entities at the same time
          - `q`, `pull`, and variant API functions now have a timeout of 20 seconds
            - Throws an error with message `Query and/or pull expression took too long to run.` when you run into the timeout limit
        - Parameters::
          - `pattern`
            - Same as pull's `pattern`
          - `eids`
            - an array of `eid`s
        - Example::
          - `roamAlphaAPI.data.pull_many("[*]", [[":block/uid", "_fM7pkQEa"], [":block/uid", "kZHsZniZs"]]);`
      - `.fast`
        - Description::
          - Functions underneath `.fast` use experimental clojurescript to javascript conversion to speed up read access. They tend to be around 33% faster and more comparable to running it in pure clojurescript.
          - Functions accept the same parameters as their regular peers
          - Functions return a cljs object wrapped in a js [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
            - This object should be treated as **read only**
              - and may not print to the console correctly
            - Map/object access may be different
              - Key access will by default include the full namespaced key like this
                - `obj[":block/string"]`
                  - This proxies to the cljs keyword `:block/string`
                - but if you renamed the key in a pull
                  - Like this `"[:block/string :as "string"]"`
                  - Then it should be able to be accessed like this
                    - `obj.string`
            - For a deeper explanation of how this works internally and the trade offs see https://blog.wsscode.com/alternative-to-clj-js/
          - `q`, `pull`, and variant API functions now have a timeout of 20 seconds
            - Throws an error with message `Query and/or pull expression took too long to run.` when you run into the timeout limit
        - functions::
          - `.q`
      - `.search`
        - Description::
          - Searches pages and blocks matching a query string
          - Equivalent to the "Find or Create Page" search algorithm in the UI
          - Results are ranked by relevance using the following priority:
            - **Rank 0**: Page title exactly matches query
            - **Rank 1**: Page title contains query as substring
            - **Rank 2**: Page title contains all query words (multi-word queries only)
            - **Rank 3**: Block contains query as substring
            - **Rank 4**: Block contains all query words (multi-word queries only)
        - Parameters::
          - `search-str` **required**
            - The search query string
          - `search-blocks` **optional**
            - Include block results
            - default: `true`
          - `search-pages` **optional**
            - Include page results
            - default: `true`
          - `hide-code-blocks` **optional**
            - Exclude code blocks from results
            - default: `false`
          - `limit` **optional**
            - Maximum number of results to return
            - default: `300`
            - max: `1000`
          - `pull` **optional**
            - Pull pattern for customizing returned fields
            - Can be a string or array
            - default: `[:block/string :node/title :block/uid]`
        - Example::
          - ```javascript
            roamAlphaAPI.data.search({"search-str": "my query"})```
        - Returns::
          - Array of results matching the pull pattern
      - `.semanticSearchEnabled`
        - Description::
          - Returns whether semantic search is currently usable for this graph — `true` when embeddings are enabled **and** a user is signed in.
          - Synchronous (returns a boolean). Use it to check before calling `roamAlphaAPI.data.async.semanticSearch`, which throws when semantic search isn't available.
        - Parameters::
          - none
        - Example::
          - ```javascript
            roamAlphaAPI.data.semanticSearchEnabled()```
        - Returns::
          - `boolean`
      - `.roamQuery`
        - Description::
          - Execute a Roam query and return matching blocks/pages. Similar to `.search` but for Roam's native query syntax (the same syntax used in `{{[[query]]: ...}}` blocks).
          - Two modes of operation:
            - **UID mode**: Pass the `uid` of an existing query block to use its stored settings
            - **Query mode**: Pass a `query` string directly with optional display settings
          - Returns `{total: number, results: Array}` where results use the specified pull pattern
        - Parameters::
          - `uid` (String) - Block uid of an existing query block. Uses the block's stored display settings.
          - `query` (String) - Direct query string, e.g. `"{and: [[project]] [[active]]}"`. Required if no `uid`.
          - `groupByPage` (Boolean, default: `true`) - Group results by page. Query mode only.
          - `nestUnderParent` (Boolean, default: `false`) - Collapse child matches under parent. Query mode only.
          - `sort` (String) - Sort type. Query mode only.
            - When `groupByPage` is true: `"page-most-recent"` (default), `"page-title"`, `"page-created-date"`, `"daily-note"`
            - When `groupByPage` is false: `"created-date"` (default), `"edited-date"`, `"daily-note-date"`
          - `sortOrder` (String, default: `"desc"`) - `"asc"` or `"desc"`. Query mode only.
          - `offset` (Integer, default: `0`) - Number of results to skip.
          - `limit` (Integer | null, default: `20`) - Max results. Pass `null` for all results.
          - `pull` (String, default: `"[:block/string :node/title :block/uid]"`) - Pull pattern for results.
        - Example::
          - ```javascript
            await window.roamAlphaAPI.data.roamQuery({query: "{and: [[project]] [[active]]}"})```
          - ```javascript
            await window.roamAlphaAPI.data.roamQuery({uid: "abc123def"})```
            - Execute query block's query using its stored settings
      - `.async`
        - Description::
          - The functions under `.async` are equivalent to the non async versions, except they return promises.
          - Eventually Roam will migrate to the async API and the sync functions will be deprecated, **if you are building a new extension you should prefer using these to avoid migrating in the future.**
        - `.q`
        - `.pull`
        - `.pull_many`
        - `.search`
          - Uses **better search** (the indexed search worker) when available, transparently falling back to the standard search otherwise. Same parameters and return shape.
        - `.semanticSearch`
          - Description::
            - Hybrid semantic + keyword search powered by "better search" (embeddings + keyword index), ranked by relevance.
            - Async only — returns a promise. Requires embeddings to be enabled and a signed-in user; it throws when semantic search isn't available, so check `roamAlphaAPI.data.semanticSearchEnabled()` first.
            - While embeddings are still indexing it returns partial results rather than throwing.
          - Parameters::
            - `search-str` **required**
              - The search query string
            - `k` **optional**
              - Number of results (also the search pool size)
              - default: `25`
              - max: `200`
            - `search-blocks` **optional**
              - Include block results
              - default: `true`
            - `search-pages` **optional**
              - Include page results
              - default: `true`
            - `hide-code-blocks` **optional**
              - Exclude code blocks from results
              - default: the user's hide-code-blocks setting
          - Example::
            - ```javascript
              roamAlphaAPI.data.async.semanticSearch({"search-str": "my query"})```
          - Returns::
            - Promise resolving to an array of hit records, each `{type, uid, topUids}`
              - `type`: `"chunk"`, `"block"`, or `"page"`
              - `uid`: the hit's primary block uid (the first of `topUids`)
              - `topUids`: the hit's top-level block uids
            - Array order is the relevance ranking — there is no per-hit score, since results mix semantic and keyword matches
        - `.fast`
          - `.q`
      - `.backend`
        - Description::
          - The functions under `.backend` (currently only `q`) run against the backend (off thread). 
          - This could be useful if you have an expensive query to run.
          - If the backend doesn't exist for a graph or it's unavailable (encrypted or offline), then it will default to running locally.
          - **Warning**: The backend could be a few changes behind the frontend if changes are still syncing
        - `.q`
      - `.addPullWatch`
        - Description::
          - Watches for changes on pull patterns on blocks and pages and provides a callback to execute after changes are recorded, providing the before and after state to operate on
        - Parameters::
          - pull pattern
            - {{[[TODO]]}} 
            - __string__
            - Required
          - entity-id
            - {{[[TODO]]}} 
            - __string__
            - Required
          - callback function
            - Takes two arguments, before and after state of the pull
            - __function__
            - Required
        - Returns::
          - Promise which resolves once operation has completed
            - More details here
        - Usage::
          - ```javascript
            window
              .roamAlphaAPI
              .data
              .addPullWatch(
              	"[:block/children :block/string {:block/children ...}]",
                '[:block/uid "02-21-2021"]',
                 function a(before, after) { console.log("before", before, "after", after); })```
      - `.removePullWatch`
        - Description::
          - Removes pull watch
            - If no callback provided, clears all watches from pull pattern
            - If callback provided, only removes watch with that callback
        - Parameters::
          - pull pattern
            - {{[[TODO]]}} 
            - __string__
            - Required
          - entity-id
            - {{[[TODO]]}} 
            - __string__
            - Required
          - callback function
            - __function__
            - Optional
        - Returns::
          - Promise which resolves once operation has completed
            - More details here
        - Usage::
          - ```javascript
            const pullPattern = '[:block/children :block/string {:block/children ...}]';
            const entity = '[:node/title "Testing Page 2"]';
            const testFn = function a(before, after) { console.log("before", before, "after", after);};

            // first of all, you'd need to add it like the following
            window
              .roamAlphaAPI
              .data
              .addPullWatch(
              	pullPattern,
                entity,
                 testFn);

            console.log("added pull watch")

            // MAIN: how to remove pull watches
            window
              .roamAlphaAPI
              .data
              .removePullWatch(
              	pullPattern,
                entity,
                 testFn); 
            console.log("Removed pull watch")
            ```
      - `.undo`
        - Description::
        - Parameters::
          - None
        - Returns::
          - Promise which resolves once operation has completed
            - More details here
        - Usage::
      - `.redo`
        - Description::
        - Parameters::
          - None
        - Returns::
          - Promise which resolves once operation has completed
            - More details here
        - Usage::
      - `.block`
        - `create`
          - Description::
            - Creates a new block at a location
          - Parameters::
            - `location`
              - `parent-uid` **required**
              - `order` **required**
            - `block`
              - `string` **required**
              - `uid` **optional**
              - `open` **optional**
              - `heading` **optional**
              - `text-align` **optional**
              - `children-view-type` **optional**
              - `block-view-type` **optional**
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - [[roam/js]]
              - ```javascript
                window
                  .roamAlphaAPI
                  .createBlock(
                	{"location": 
                		{"parent-uid": "01-21-2021", 
                		 "order": 0}, 
                	 "block": 
                		{"string": "test"}})```
                - Thank you [[Tyler Wince]] and [[ccc]] for catching the original mistake in the docs :D 
            - [[roam/render]]
              - ```clojure
                (ns demo.usage
                  (:require
                   [reagent.core :as r]
                   [roam.block :as block]))

                (defn create-block-btn [_]
                    [:span
                     {:draggable true
                      :style    {:border "1px solid black"
                                 :cursor "pointer"
                                 :padding "5px"}
                      :on-click (fn [evt] (block/create 
                					{:location {:parent-uid "f8cXfDIRn"
                                                :order 0}
                					 :block {:string "Carthago delenda est"}}))}
                     "create block"])```
              - {{[[roam/render]]: ```clojure
                (ns demo.usage
                  (:require
                   [reagent.core :as r]
                   [roam.block :as block]))

                (defn create-block-btn [_]
                    [:span
                     {:draggable true
                      :style    {:border "1px solid black"
                                 :cursor "pointer"
                                 :padding "5px"}
                      :on-click (fn [evt] (block/create 
                					{:location {:parent-uid "f8cXfDIRn"
                                                :order 0}
                					 :block {:string "Carthago delenda est"}}))}
                     "create block"])```}}
        - `move`
          - Description::
            - Move a block to a new location
          - Parameters::
            - `block`
              - `uid` **required**
            - `location`
              - `parent-uid` **required**
              - `order` **required**
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - [[roam/js]]
              - ```javascript
                window
                  .roamAlphaAPI
                  .moveBlock(
                	{"location": 
                		{"parent-uid": "01-21-2021", 
                		 "order": 0}, 
                	 "block": 
                		{"uid": "f8cXfDIRn"}})```
                - Thank you [[Tyler Wince]] and [[ccc]] for catching the original mistake in the docs :D 
            - [[roam/render]]
              - ```clojure
                (ns demo.usage
                  (:require
                   [reagent.core :as r]
                   [roam.block :as block]))

                (defn move-block-btn [_]
                    [:span
                     {:draggable true
                      :style    {:border "1px solid black"
                                 :cursor "pointer"
                                 :padding "5px"}
                      :on-click (fn [evt] (block/move 
                					{:location {:parent-uid "f8cXfDIRn"
                                                :order 0}
                					 :block {:uid "VCuWBrulO"}}))}
                     "move block"])```
              - {{[[roam/render]]: ```clojure
                (ns demo.usage
                  (:require
                   [reagent.core :as r]
                   [roam.block :as block]))

                (defn move-block-btn [_]
                    [:span
                     {:draggable true
                      :style    {:border "1px solid black"
                                 :cursor "pointer"
                                 :padding "5px"}
                      :on-click (fn [evt] (block/move 
                					{:location {:parent-uid "f8cXfDIRn"
                                                :order 0}
                					 :block {:uid "VCuWBrulO"}}))}
                     "move block"])```}}
        - `update`
          - Description::
            - Updates a block's text and/or other properties like collapsed state, heading, text-align, children-view-type
          - Parameters::
            - `block`
              - `uid` **required**
              - `string` **optional**
              - `open` **optional**
              - `heading` **optional**
              - `text-align` **optional**
              - `children-view-type` **optional**
              - `block-view-type` **optional**
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - [[roam/js]]
              - ```javascript
                window
                  .roamAlphaAPI
                  .updateBlock({"block": 
                                {"uid": "f8cXfDIRn",
                                 "string": "Love"}})```
            - [[roam/render]]
              - ```clojure
                (ns demo.usage
                  (:require
                   [reagent.core :as r]
                   [roam.block :as block]))

                (defn update-block-btn [_]
                    [:span
                     {:draggable true
                      :style    {:border "1px solid black"
                                 :cursor "pointer"
                                 :padding "5px"}
                      :on-click (fn [evt] 
                                  (block/update 
                                   {:block {:uid "VCuWBrulO"
                                            :string "Love"}}))}
                     "update block"])```
              - {{[[roam/render]]: ```clojure
                (ns demo.usage
                  (:require
                   [reagent.core :as r]
                   [roam.block :as block]))

                (defn update-block-btn [_]
                    [:span
                     {:draggable true
                      :style    {:border "1px solid black"
                                 :cursor "pointer"
                                 :padding "5px"}
                      :on-click (fn [evt] 
                                  (block/update 
                                   {:block {:uid "VCuWBrulO"
                                            :string "Love"}}))}
                     "update block"])```}}
        - `delete`
          - Description::
            - Delete a block and all its children, and recalculates order of sibling blocks
          - Parameters::
            - `block`
              - `uid` **required**
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - [[roam/js]]
            - ```javascript
              window
                .roamAlphaAPI
                .updateBlock({"block": 
                              {"uid": "f8cXfDIRn"}})```
              - Thank you [[Tyler Wince]] and [[@ccc]] for catching the original mistake in the docs :D 
          - [[roam/render]]
            - ```clojure
              (ns demo.usage
                (:require
                 [reagent.core :as r]
                 [roam.block :as block]))

              (defn update-block-btn [_]
                  [:span
                   {:draggable true
                    :style    {:border "1px solid black"
                               :cursor "pointer"
                               :padding "5px"}
                    :on-click (fn [evt] 
                                (block/update 
                                 {:block {:uid "VCuWBrulO"}}))}
                   "delete block"])```
            - {{[[roam/render]]: ```clojure
              (ns demo.usage
                (:require
                 [reagent.core :as r]
                 [roam.block :as block]))

              (defn update-block-btn [_]
                  [:span
                   {:draggable true
                    :style    {:border "1px solid black"
                               :cursor "pointer"
                               :padding "5px"}
                    :on-click (fn [evt] 
                                (block/update 
                                 {:block {:uid "VCuWBrulO"}}))}
                   "delete block"])```}}
        - `fromMarkdown`
          - Description::
            - Parses a markdown string into blocks and inserts them at a location
            - Uses the same markdown parsing logic as the file import feature
            - Nested lists become nested blocks
            - Supports standard markdown: headings, lists, code blocks, bold, italic, links, etc.
          - Parameters::
            - `location`
              - `parent-uid` **required**
              - `order` **required**
            - `markdown-string` required
              - The markdown content to parse into blocks
          - Example::
            - ```javascript
              window.roamAlphaAPI.data.block.fromMarkdown({
                  location: { "parent-uid": "4VuwigG1O", "order": "first" },
                  "markdown-string": "# Hello\n\n- Item 1\n- Item 2\n  - Nested"
                });```
          - Returns::
            - Promise which resolves to a map of the top level UIDs created
        - `reorderBlocks`
          - Description::
            - Takes a `parent-uid` and an array of all the direct children of that block, and reorders the blocks according to the order provided in the array. 
          - Parameters::
            - `location`
              - `parent-uid` **required**
            - `blocks`
              - array including all children of `parent-uid`, and no other blocks, with no duplicates, listed in order
              - **required**
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - example blocks
              - 1
              - 2
              - 3
            - ```javascript
              roamAlphaAPI.data.block.reorderBlocks({
                location: {'parent-uid': 'ihu5eUofL'},
                blocks: ['QCE0cNNNL','IATKcVmWE','nC22orMO4']})```
        - `addComment`
          - Description::
            - Adds a comment to a block. Supports either a single reply string or markdown that gets parsed into multiple sibling reply blocks.
          - Parameters::
            - `block-uid`
              - UID of the block to comment on
              - __string__ (required)
            - `reply-string`
              - Plain text for a single reply block
              - __string__ (use this OR `reply-markdown`, not both)
            - `reply-markdown`
              - Markdown string parsed into multiple sibling reply blocks
              - __string__ (use this OR `reply-string`, not both)
          - Returns::
            - Promise which resolves once operation has completed
          - Usage::
            - ````javascript
              // Single reply
              window.roamAlphaAPI.data.block
              .addComment({"block-uid": "abc123",
               "reply-string": "This is a comment"})

              // Markdown reply (parsed into siblings)
              window.roamAlphaAPI.data.block
              .addComment({"block-uid": "abc123",
               "reply-markdown": "First block\n- Nested child"})````
      - `.page`
        - `create`
          - Description::
            - Creates a new page with a given title
            - Pages with title in the format of `January 21st, 2021` will create a new daily note if it does not yet exist
          - Parameters::
            - `page`
              - `title` **required**
              - `uid` **optional**
                - in normal operation, should not be required
              - `children-view-type` **optional**
          - Returns::
            - Promise which resolves once operation has completed
        - `fromMarkdown`
          - Description::
            - Creates a new page with a given title and populates it with blocks parsed from a markdown string
            - Uses the same markdown parsing logic as the file import feature
            - Pages with title in the format of January 21st, 2021 will create a new daily note if it does not yet exist
            - Will error if a page with the given title already exists
          - Parameters::
            - `page`
              - `title` **required**
              - `uid` **optional**
                - in normal operation, should not be required
              - `children-view-type` **optional**
            - `markdown-string` required
              - The markdown content to parse into blocks
              - Supports standard markdown: headings, lists, code blocks, bold, italic, links, etc.
          - Example::
            - ```javascript
              window.roamAlphaAPI.data.page.fromMarkdown({
                  page: {
                    title: "My New Page"
                  },
                  "markdown-string": "# Heading\n\n- Item 1\n- Item 2"
                })```
          - Returns::
            - Promise which resolves once operation has completed
        - `update`
          - Description::
            - Updates a page's title and/or its children-view-type
          - Parameters::
            - `page`
              - `uid` **required**
              - `title` **optional**
              - `children-view-type` **optional**
          - Returns::
            - Promise which resolves once operation has completed
        - `delete`
          - Description::
            - Delete a page and all its children blocks
          - Parameters::
            - `page`
              - `uid` **required**
          - Returns::
            - Promise which resolves once operation has completed
        - `addShortcut`
          - Description::
            - Add page to the left sidebar shortcuts, supply an index to add at a specific place, or none to add at the end
            - Can also use to update the index
          - Parameters::
            - `uid` **required**
            - `index`
          - Example::
            - ```javascript
              roamAlphaAPI.data.page.addShortcut("12-11-2025");
              roamAlphaAPI.data.page.addShortcut("12-11-2025", 4);```
          - Returns::
            - Promise which resolves once operation has completed
        - `removeShortcut`
          - Description::
            - removes page from shortcuts
          - Parameters::
            - `uid` **required**
          - Example::
            - ```javascript
              roamAlphaAPI.data.page.removeShortcut("12-11-2025")```
          - Returns::
            - Promise which resolves once operation has completed
      - `.user`
        - `upsert`
          - Description::
            - Creates and/or updates user entity
          - Parameters::
            - Object
              - Keys
                - `user-uid`
                  - Required
                  - __string__
                - `display-name`
                  - Optional
                  - __string__
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
      - `.ai` [[experimental]]
        - I wouldn't recommend using these functions, they will have breaking changes and are intended to be consumed by AI
    - `.ui`
      - `.getFocusedBlock`
        - Description::
          - Returns metadata about the currently focused block (or null, if no currently selected block). 
          - More robust than using CSS selectors, and works even from a `.commandPalette` callback, even if the block has lost focus in the DOM.
        - Parameters::
          - none
        - return example::
          - ```javascript
            {
              block-uid: "YnatnbZzF"
              window-id: "BBG4fFwolaVlT5FZQdzAI7P40aB3-body-outline-04-15-2021"
            }```
      - `.setBlockFocusAndSelection`
        - Description::
          - Focuses on the given block and window pair (identified using the `location` parameter)
            - (if location is not present, defaults to the currently focused block)
          - Can set cursor position/selection using the `selection` parameter
            - if `selection` is not present, defaults to placing the cursor at the end of the string
            - if `end`  is specified, it becomes a selection, otherwise it becomes a cursor placement before the `start`  element (0-indexed)
        - Parameters::
          - `location`
            - (same structure as the output of roamAlphaAPI.ui.getFocusedBlock)
            - (if location is not present, defaults to the currently focused block)
            - `block-uid`
              - string
            - `window-id`
              - string
              - either 
                - the actual `window-id` 
                  - the type you get from `.rightSidebar`/`.getWindows`
                - or 
                - the string "main-window"
                  - convenience to focus on the main window
          - `selection`
            - `start` 
              - int
            - `end` 
              - int
            - Notes::
              - if `selection` is not present, defaults to placing the cursor at the end of the string
              - if `selection` is present, `start`  is mandatory
              - if `end`  is specified, it becomes a selection, otherwise it becomes a cursor placement before the `start`  element (0-indexed)
              - if  `end`  is less than `start` , then both are treated as the value of `end` 
        - Usage::
          - [[roam/js]]
            - ```javascript
              window.roamAlphaAPI.ui.setBlockFocusAndSelection(
                {location: window.roamAlphaAPI.ui.getFocusedBlock(),
                 selection: {start: 3,
                             end: 7}})```
      - `.mainWindow`
        - `.openBlock`
          - Description::
            - Opens a block with the given uid
            - If pass a page's uid, will open the page
              - for example, `openBlock({block: {uid: "10-16-2021"}})` opens the daily note page for [[October 16th, 2021]]
            - If a block/page with uid does not exist, does nothing
              - but still returns true (NOTE!)
          - Parameters::
            - `block`
              - `uid` **required**
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - [[roam/js]]
              - ```javascript
                // open(zoom into) a block in the main window
                window.roamAlphaAPI.ui.mainWindow
                  .openBlock({block: 
                              {uid: "v9eHoHwqS"}})```
        - `.openPage`
          - Description::
            - Opens a page with the given title (or uid)
            - If a page with given title (or uid) does not exist, does nothing
              - but still returns true (NOTE!)
          - Parameters::
            - `page`
              - Either one of the following
                - `title`
                - `uid`
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - [[roam/js]]
              - ```javascript
                // open a page in the main window using uid
                window.roamAlphaAPI.ui.mainWindow
                  .openPage({page: 
                             {uid: "RZVuh3aZN"}})

                // open a page in the main window using it's title
                window.roamAlphaAPI.ui.mainWindow
                  .openPage({page: 
                             {title: "test-new"}})```
        - `.openDailyNotes`
          - Description::
            - Opens the daily notes / logs in the main window
          - Parameters::
            - none
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
        - `.getOpenView`
          - Description::
            - Returns an object describing what is currently displayed in the main window (outline, log, graph, diagram, pdf, search, or custom component)
          - Parameters::
            - none
          - return example::
            - ```javascript
              // Page outline
              { type: "outline", uid: "Vfht187T1", title: "My Page Title" }

              // Block outline (zoomed into a block)
              { type: "outline", uid: "abc123xyz", "block-string": "Some block content" }

              // Daily notes log
              { type: "log" }

              // Graph view
              { type: "graph" }

              // Diagram
              { type: "diagram", uid: "diagram-uid" }

              // PDF viewer
              { type: "pdf", uid: "pdf-block-uid" }

              // All pages search
              { type: "search" }

              // Custom component
              { type: "custom", id: "component-id", args: [] }```
        - `.getOpenPageOrBlockUid`
          - Description::
            - Returns the uid string of the page/block currently open in the main window
          - Parameters::
            - none
          - return example::
            - ```javascript
              // returns a uid, which is a string like the one below
              'Vfht187T1'```
        - `.focusFirstBlock`
          - Description::
            - Focuses on the first block in the main window
          - Parameters::
            - none
      - `.leftSidebar`
        - `.open`
          - Description::
            - Makes the left sidebar visible
          - Parameters::
            - none
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
        - `.close`
          - Description::
            - closes/hides the left sidebar
          - Parameters::
            - none
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
      - `.rightSidebar`
        - `.open`
          - Description::
            - Makes the right side bar visible. 
          - Parameters::
            - None
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - [[roam/js]]
              - ```javascript
                window.roamAlphaAPI.ui.rightSidebar.open()```
        - `.close`
          - Description::
            - Makes the right sidebar invisible but keeps the open windows. 
          - Parameters::
            - None
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - [[roam/js]]
              - ```javascript
                window.roamAlphaAPI.ui.rightSidebar.close()```
        - `.getWindows`
          - Description::
            - Returns an array of all open windows.
          - Parameters::
            - None
          - Usage::
            - [[roam/js]]
              - ```javascript
                window.roamAlphaAPI.ui.rightSidebar.getWindows()```
          - [[Sample Output]]
            - P.S. We now have ability to pin a sidebar window to the top. These windows will also have a `pinned-to-top?`: `true` in the `.getWindows` output
              - To programmatically pin a window to the top, use the new `pin-to-top?` parameter in `.pinWindow`
            - (shows all 4 kinds of sidebar windows)
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FRboI-gvPtS.png?alt=media&token=b6dff6b6-8421-4f67-80e4-48fae122b561)
        - `.addWindow`
          - Description::
            - Adds a window to the right sidebar. If the sidebar is closed, opens it.
          - Parameters::
            - `window`
              - `type`
                - Required
                - Can be one of:
                  - "mentions"
                  - "block"
                  - "outline"
                  - "graph"
                  - "search-query"
              - `block-uid`
                - Required
                - If `type` = "search-query", then you need to pass `search-query-str` parameter instead of `block-uid`
                  - Example usage
                    - ```javascript
                      // Add a window that searches for "API"
                      window.roamAlphaAPI.ui.rightSidebar
                        .addWindow({window:
                                    {type:'search-query' ,'search-query-str':'API'}})```
              - `order`
                - optional
                - if not specified, new window will be at the top of the right sidebar
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - [[roam/js]]
              - ```javascript
                //Add a block
                window.roamAlphaAPI.ui.rightSidebar
                  .addWindow({window:
                              {type:'block' ,'block-uid':'1fP8LY5ED'}})
                //Add a page
                window.roamAlphaAPI.ui.rightSidebar
                  .addWindow({window:
                              {type:'outline' ,'block-uid':'cArVJL_vg'}})
                //Add mentions of a block
                window.roamAlphaAPI.ui.rightSidebar
                  .addWindow({window:
                              {type:'mentions' ,'block-uid':'vutDCPD8G'}})

                // Add a window that searches for "API"
                window.roamAlphaAPI.ui.rightSidebar
                  .addWindow({window:
                              {type:'search-query' ,'search-query-str':'API'}})```
        - `.removeWindow`
          - Description::
            - Removes a window from the right sidebar. 
          - Parameters::
            - `window`
              - `type`
                - Required
                - Can be one of:
                  - "mentions"
                  - "block"
                  - "outline"
                  - "graph"
                  - "search-query"
              - `block-uid`
                - Required
                - If `type` = "search-query", then you need to pass `search-query-str` parameter instead of `block-uid`
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
        - `.expandWindow`
          - Description::
          - Parameters::
            - `window`
              - `type`
                - Required
                - Can be one of:
                  - "mentions"
                  - "block"
                  - "outline"
                  - "graph"
                  - "search-query"
              - `block-uid`
                - Required
                - If `type` = "search-query", then you need to pass `search-query-str` parameter instead of `block-uid`
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
        - `.collapseWindow`
          - Description::
          - Parameters::
            - `window`
              - `type`
                - Required
                - Can be one of:
                  - "mentions"
                  - "block"
                  - "outline"
                  - "graph"
                  - "search-query"
              - `block-uid`
                - Required
                - If `type` = "search-query", then you need to pass `search-query-str` parameter instead of `block-uid`
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
        - `.pinWindow`
          - Description::
          - Parameters::
            - `window`
              - `type`
                - Required
                - Can be one of:
                  - "mentions"
                  - "block"
                  - "outline"
                  - "graph"
                  - "search-query"
              - `block-uid`
                - Required
                - If `type` = "search-query", then you need to pass `search-query-str` parameter instead of `block-uid`
            - `pin-to-top?`
              - optional parameter
              - If `pin-to-top?` is passed, it should be either `true` or `false`
                - If explicit value is not passed, we do not change the state
                  - i.e. if a window is pinned to top and we call `.pinWindow` on it again but without specifying an explicit `pin-to-top?`, nothing changes
              - If value is `true`, then we pin the specified `window` to the top of the sidebar. Visually this will make the pin look red.  new sidebar windows will be added below it
                - If another window was already pinned to top, it will be unpinned
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
        - `.unpinWindow`
          - Description::
          - Parameters::
            - `window`
              - `type`
                - Required
                - Can be one of:
                  - "mentions"
                  - "block"
                  - "outline"
                  - "graph"
                  - "search-query"
              - `block-uid`
                - Required
                - If `type` = "search-query", then you need to pass `search-query-str` parameter instead of `block-uid`
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
        - `.setWindowOrder`
          - Description::
          - Parameters::
            - `window`
              - `type`
                - Required
                - Can be one of:
                  - "mentions"
                  - "block"
                  - "outline"
                  - "graph"
                  - "search-query"
              - `block-uid`
                - Required
                - If `type` = "search-query", then you need to pass `search-query-str` parameter instead of `block-uid`
              - `order`
                - Required
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
      - `.filters`
        - `.addGlobalFilter`
          - Description::
            - Adds a global filter, similar to clicking on the little globe on the top right of a link in the filter dialogue
          - Parameters::
            - `title`
              - Page title
              - __string__
            - `type`
              - One of "includes" | "removes"
              - __string__
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
        - `.removeGlobalFilter`
          - Description::
            - Removes a global filter
          - Parameters::
            - `title`
              - Page title
              - __string__
            - `type`
              - One of "includes" | "removes"
              - __string__
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
        - `.getGlobalFilters`
          - Description::
            - Returns a list of global filters currently in place, distinguishing between "includes" and "removes"
          - Parameters::
            - __None__
        - `.getPageFilters`
          - Description::
            - Returns a list of filters currently in place for that page for the current user, distinguishing between "includes" and "removes"
          - Parameters::
            - `page`
              - (one of `title` or `uid` is required)
              - `uid`
              - `title`
          - Returns::
            - An object containing keys "includes" and "removes", both of which have a list of page-titles as values
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Froamteam%2FiKeG5RI0CX.png?alt=media&token=17f843dd-9f42-46e8-b7f6-9fcebb3e3aa4)
          - Usage::
            - ```javascript
              window.roamAlphaAPI.ui.filters.getPageFilters(
                {
                  "page": 
                  {
                    "title": "test"
                  }
                })```
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Froamteam%2FiKeG5RI0CX.png?alt=media&token=17f843dd-9f42-46e8-b7f6-9fcebb3e3aa4)
        - `.getPageLinkedRefsFilters`
          - Description::
            - Returns a list of filters currently in place for that page's linked references (aka mentions) for the current user, distinguishing between "includes" and "removes"
          - Parameters::
            - `page`
              - (one of `title` or `uid` is required)
              - `uid`
              - `title`
          - Returns::
            - An object containing keys "includes" and "removes", both of which have a list of page-titles as values
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Froamteam%2FIWWqE5eMAh.png?alt=media&token=49b862e8-a86b-48eb-898b-f9ecdf8f3ba9)
          - Usage::
            - ```javascript
              window.roamAlphaAPI.ui.filters.getPageLinkedRefsFilters(
                {
                  "page": 
                  {
                    "title": "test"
                  }
                })```
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Froamteam%2FIWWqE5eMAh.png?alt=media&token=49b862e8-a86b-48eb-898b-f9ecdf8f3ba9)
        - `.getSidebarWindowFilters`
          - Description::
            - Returns a list of filters currently in place for that page's linked references (aka mentions) for the current user, distinguishing between "includes" and "removes"
          - Parameters::
            - `window` 
              - (similar input as the input of right sidebar functions)
              - `type`
                - Required
              - `block-uid`
                - Required
          - Returns::
            - `.getSidebarWindowFilters`
            - An object containing keys "includes" and "removes", both of which have a list of page-titles as values
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Froamteam%2FH1CpnUwT9D.png?alt=media&token=97e38a67-4c28-469c-9090-32fd885b679f)
          - Usage::
            - ```javascript
              window.roamAlphaAPI.ui.filters.getSidebarWindowFilters(
                {
                  "window": 
                  {
                    "block-uid": "WYlc2nIO9", 
                    "type": "outline"
                  }
                })```
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Froamteam%2FH1CpnUwT9D.png?alt=media&token=97e38a67-4c28-469c-9090-32fd885b679f)
        - `.setPageFilters`
          - Description::
            - Set a pages filters
          - Parameters::
            - `page`
              - (one of `title` or `uid` is required)
              - `uid`
              - `title`
            - `filters`
              - (similar to the Returns:: of `.getPageFilters`)
              - `includes`
                - array of page titles
              - `removes`
                - array of page titles
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - ```javascript
              window.roamAlphaAPI.ui.filters.setPageFilters(
                {
                  "page": {"title": "test"},
                  "filters": {"includes": ["March 11th, 2022"]}
                })

              // the following clears the filters
              window.roamAlphaAPI.ui.filters.setPageFilters(
                {
                  "page": {"title": "test"},
                  "filters": {}
                })```
        - `.setPageLinkedRefsFilters`
          - Description::
            - Set a page linked references' (aka mentions') filters
          - Parameters::
            - `page`
              - (one of `title` or `uid` is required)
              - `uid`
              - `title`
            - `filters`
              - (similar to the Returns:: of `.getPageLinkedRefsFilters`)
              - `includes`
                - array of page titles
              - `removes`
                - array of page titles
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - ```javascript
              window.roamAlphaAPI.ui.filters.setPageLinkedRefsFilters(
                {
                  "page": {"title": "test"},
                  "filters": {"includes": ["Author"]}
                })

              // the following clears the filters
              window.roamAlphaAPI.ui.filters.setPageLinkedRefsFilters(
                {
                  "page": {"title": "test"},
                  "filters": {}
                })```
        - `.setSidebarWindowFilters`
          - Description::
            - Set the filters for a right sidebar window
          - Parameters::
            - `window` 
              - (similar input as the input of right sidebar functions)
              - `type`
                - Required
              - `block-uid`
                - Required
            - `filters`
              - (similar to the Returns:: of `.getSidebarWindowFilters`)
              - `includes`
                - array of page titles
              - `removes`
                - array of page titles
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - ```javascript
              window.roamAlphaAPI.ui.filters.setSidebarWindowFilters(
                {
                  "window": 
                  {
                    "block-uid": "WYlc2nIO9", 
                    "type": "outline"
                  },
                  "filters": {"includes": ["Author"]}
                })

              // the following clears the filters
              window.roamAlphaAPI.ui.filters.setSidebarWindowFilters(
                {
                  "window": 
                  {
                    "block-uid": "WYlc2nIO9", 
                    "type": "outline"
                  },
                  "filters": {}
                })```
      - `.commandPalette`
        - `.addCommand`
          - Description::
            - Adds a command to the [[Command Palette]] (Cmd+P), and calls the provided callback when the user selects that command. 
            - If called again with the same `label`, will not add a second command, but will update the first command with the new callback.
          - Parameters::
            - `label`
              - Text displayed in the Command Palette
                - Should preferably include a plugin prefix to ensure global uniqueness if user has more than one plugin installed
                  - for example `"RoamRS: Start review session"`
              - __string__
            - `callback`
              - Function called with no parameters when the user selects the command in the Command Palette
              - __function__
            - `disable-hotkey`
              - __boolean__
            - `default-hotkey`
              - it should be a __string__ or vectors of strings are for multi step hotkeys
                - __string__
                  - __string__ should be of the form "super-shift-d". should have at least one modifier. Modifiers are listed in table below
                    - {{[[table]]}}
                      - **modifier-str**
                        - **key in Windows/Linux**
                          - **key in MacOS**
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
                      - "defmod" (default modifier for OS X is cmd and for others is ctrl)
                        - ctrl
                          - cmd
                - __vector of __string__s__
                  - vectors of strings are for multi step hotkeys
                    - An example of a native hotkey like that is `["ctrl-c", "ctrl-m"]` for going to next block
                  - limit is 5 
              - if this has not been provided but `disable-hotkey` is absent or false, no hotkey is set up but user can customize it from settings. **So, most commands should NOT have default-hotkey** 
              - user can customize this from the "Hotkeys" menu
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - [[roam/js]]
              - ```javascript
                window.roamAlphaAPI.ui
                  .commandPalette
                  .addCommand({label: 'hi', 
                               callback: () => console.log('Hello World!')})```
            - Examples showing `default-hotkey`
              - example 1:
                - ```javascript
                  window.roamAlphaAPI.ui
                    .commandPalette
                    .addCommand({label: 'example1', 
                                 callback: () => console.log('Hello World!'),
                                 "disable-hotkey": false,
                                 // this is the default hotkey, and can be customized by the user. 
                                 // in most cases, you DO NOT want to be setting a default hotkey
                                 "default-hotkey": "ctrl-cmd-l"})```
              - example 2: 
                - ```javascript
                  window.roamAlphaAPI.ui
                    .commandPalette
                    .addCommand({label: 'example2', 
                                 callback: () => console.log('Hello World2!'),
                                 // this is the default hotkey, and can be customized by the user
                                 // in most cases, you DO NOT want to be setting a default hotkey
                                 "default-hotkey": ["ctrl-c", "ctrl-x"]})```
              - 
        - `.removeCommand`
          - Description::
            - Removes a command with the given `label` from the Command Palette
          - Parameters::
            - `label`
              - Label provided when using `.addCommand`
              - __string__
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - [[roam/js]]
              - ```javascript
                window.roamAlphaAPI.ui
                  .commandPalette
                  .removeCommand({label: 'hi'})```
      - `.slashCommand`
        - `.addCommand`
          - Description::
            - Adds a command to the [[Slash Command]], and calls the provided callback when the user selects that command. 
            - If called again with the same `label`, will not add a second command, but will update the first command with the new callback.
          - Parameters::
            - `label`: __string__
              - Text displayed in the Slash Command
            - `display-conditional`: __function__, optional
              - Function called with `context` but without the `indexes` which should return true if the command should be shown or false if not.
                - `context`
                  - ```javascript
                    {
                      block-uid: "YnatnbZzF",
                      window-id: "BBG4fFwolaVlT5FZQdzAI7P40aB3-body-outline-04-15-2021",
                      indexes: [1 10]
                    }```
            - `callback`: __function__
              - Function called with `context` when the user selects the command in block context menu. 
              - It should return either
                - a string to insert at the current location
                - null to handle insertion manually (e.g., via custom logic, this will not remove the search string)
          - Returns::
            - null
          - Usage::
            - ```javascript
              window.roamAlphaAPI.ui.slashCommand.addCommand({
                label: "Quick Test",
                'display-conditional': (args) => {
                  console.log("display:", args);
                },
                callback: (args) => {
                  console.log("Callback received:", args);
                  return "It works! 🎉";
                }
              });```
        - `.removeCommand`
          - Description::
            - Removes a command with the given `label` from the Block Context Menu
          - Parameters::
            - `label`: __string__
              - Label provided when using `.addCommand`
          - Returns::
            - null
      - `.multiselect`
        - `.getSelected`
          - Description::
            - Returns an array of objects representing the currently drag-selected blocks in the main window
          - Parameters::
            - none
          - return example::
            - ```javascript
              // Returns an array of selected blocks with their uid and window-id
              [
                { "block-uid": "Vfht187T1", "window-id": "main-window" },
                { "block-uid": "abc123xyz", "window-id": "main-window" }
              ]

              // Empty array if no blocks are selected
              []```
      - `.individualMultiselect`
        - `getSelectedUids`
          - Description::
            - Gets the uids currently selected by individual multiselect (usually triggered by `cmd-m`)
          - Example::
            - ```javascript
              window.roamAlphaAPI.ui.getSelectedUids()```
      - `.blockContextMenu`
        - `.addCommand`
          - Description::
            - Adds a menu item to the [[Block Context Menu]] (what comes up if you right click on the bullet of a single block), and calls the provided callback when the user selects that command.
            - All custom commands are nested under the Plugins menu item.
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Fa87mH7hqIQ.png?alt=media&token=b9dcb514-470c-44fb-8f32-f6b8f11cc7ce)
            - If called again with the same `label`, will not add a second command, but will update the first command with the new callback.
            - You can optionally provide a conditional function, which runs every time the menu is opened, with context about the current block, and returns a boolean of whether this menu item should be included for this particular block.
          - Parameters::
            - `label`: __string__
              - Text displayed in the Command Palette
                - Should preferably include a plugin prefix to ensure global uniqueness if user has more than one plugin installed
                  - for example `"RoamRS: Start review session"`
            - `display-conditional`: __function__, optional
              - Function called with `block-context` which should return true if the command should be shown or false if not.
                - `block-context`
                  - ```javascript
                    {
                      block-string: "Todos"
                      block-uid: "YnatnbZzF"
                      heading: null
                      page-uid: "04-15-2021"
                      read-only?: false
                      window-id: "BBG4fFwolaVlT5FZQdzAI7P40aB3-body-outline-04-15-2021"
                    }```
            - `callback`: __function__
              - Function called with `block-context` when the user selects the command in block context menu. 
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Usage::
            - ```javascript
              roamAlphaAPI.ui.blockContextMenu.addCommand(
                {label: "Debug: Console Log", 
                 'display-conditional': 
                   (e) => e['block-string'].includes("Test Block"), 
                 callback: (e)=>console.log(e)
                }
              )```
        - `.removeCommand`
          - Description::
            - Removes a command with the given `label` from the Block Context Menu
          - Parameters::
            - `label`: __string__
              - Label provided when using `.addCommand`
          - Returns::
            - null
      - `.pageContextMenu`
        - `.addCommand`
          - Description::
            - See `.blockContextMenu` description, this is identical but for the page context menu when right clicking on titles.
          - Parameters::
            - `label`: __string__
              - Text displayed in the Command Palette
                - Should preferably include a plugin prefix to ensure global uniqueness if user has more than one plugin installed
                  - for example `"RoamRS: Start review session"`
            - `display-conditional`: __function__, optional
              - Function called with `page-context` which should return true if the command should be shown or false if not.
                - `page-context`
                  - ```javascript
                    {
                      page-uid: "YnatnbZzF"
                      page-title: "title"
                      window-id: "BBG4fFwolaVlT5FZQdzAI7P40aB3-body-outline-04-15-2021"
                    }```
            - `callback`: __function__
              - Function called with `page-context` when the user selects the command in block context menu. 
          - Returns::
            - null
          - Usage::
            - ```javascript
              roamAlphaAPI.ui.pageContextMenu.addCommand(
                {label: "Debug: Console Log",  
                 callback: (e)=>console.log(e)
                }
              )```
        - `.removeCommand`
          - Description::
            - Removes a command with the given `label` from the Block Context Menu
          - Parameters::
            - `label`: __string__
              - Label provided when using `.addCommand`
          - Returns::
            - null
      - `.pageLinkContextMenu`
        - `.addCommand`
          - Description::
            - For all places that are not the main page title or in a block reference
            - Currently this is only in linked references / query results when grouping by page
          - Parameters::
            - `label`: __string__
              - Text displayed in the context menu
            - `display-conditional`: __function__, optional
              - Function called with `ref-context` which should return true if the command should be shown or false if not.
                - `ref-context`
                  - ```javascript
                    {
                      page-uid: "YnatnbZzF",
                      page-title: "title"
                    }```
            - `callback`: __function__
              - Function called with `ref-context` when the user selects the command in block context menu. 
          - Returns::
            - null
          - Usage::
            - ```javascript
              roamAlphaAPI.ui.pageLinkContextMenu.addCommand(
                {label: "Debug: Console Log",  
                 callback: (e)=>console.log(e)
                }
              )```
        - `.removeCommand`
          - Description::
            - Removes a command with the given `label` from the Block Context Menu
          - Parameters::
            - `label`: __string__
              - Label provided when using `.addCommand`
          - Returns::
            - null
      - `.pageRefContextMenu`
        - `.addCommand`
          - Description::
            - See `.blockContextMenu` description, this is identical but for the page ref context menu when right clicking on a page reference.
          - Parameters::
            - `label`: __string__
              - Text displayed in the context menu
            - `display-conditional`: __function__, optional
              - Function called with `ref-context` which should return true if the command should be shown or false if not.
                - `ref-context`
                  - ```javascript
                    {
                      ref-uid: "YnatnbZzF"
                      block-uid: "xyz" // containing block uid
                      window-id: "BBG4fFwolaVlT5FZQdzAI7P40aB3-body-outline-04-15-2021"
                      indexes: [0 9] //outer indexes
                      type: "attribute"
                    }```
                - `type`
                  - "page-ref": `[[test]]`
                  - "attribute": `test::`
                  - "tag": `#test`
                  - "multitag": `#[[Test]]`
                  - "inline-link": `[t]([[Test]])`
            - `callback`: __function__
              - Function called with `ref-context` when the user selects the command in block context menu. 
          - Returns::
            - null
          - Usage::
            - ```javascript
              roamAlphaAPI.ui.pageRefContextMenu.addCommand(
                {label: "Debug: Console Log",  
                 callback: (e)=>console.log(e)
                }
              )```
        - `.removeCommand`
          - Description::
            - Removes a command with the given `label` from the Block Context Menu
          - Parameters::
            - `label`: __string__
              - Label provided when using `.addCommand`
          - Returns::
            - null
      - `.blockRefContextMenu`
        - `.addCommand`
          - Description::
            - See `.blockContextMenu` description, this is identical but for the block ref context menu when clicking on a block reference.
          - Parameters::
            - `label`: __string__
              - Text displayed in the Command Palette
                - Should preferably include a plugin prefix to ensure global uniqueness if user has more than one plugin installed
                  - for example `"RoamRS: Start review session"`
            - `display-conditional`: __function__, optional
              - Function called with `ref-context` which should return true if the command should be shown or false if not.
                - `ref-context`
                  - ```javascript
                    {
                      ref-uid: "YnatnbZzF"
                      block-uid: "YnatnbZzF" // containing block uid
                      window-id: "BBG4fFwolaVlT5FZQdzAI7P40aB3-body-outline-04-15-2021"
                      indexes: [0 9] //outer indexes
                    }```
            - `callback`: __function__
              - Function called with `ref-context` when the user selects the command in block context menu. 
          - Returns::
            - null
          - Usage::
            - ```javascript
              roamAlphaAPI.ui.blockRefContextMenu.addCommand(
                {label: "Debug: Console Log",  
                 callback: (e)=>console.log(e)
                }
              )```
        - `.removeCommand`
          - Description::
            - Removes a command with the given `label` from the Block Context Menu
          - Parameters::
            - `label`: __string__
              - Label provided when using `.addCommand`
          - Returns::
            - null
      - `.msContextMenu`
        - **What is this?** - MultiSelect Context Menu
          - For adding, removing and executing callbacks on the block context menu when multiple blocks are selected
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Fs7cSCoo1Ti.png?alt=media&token=584a7843-f870-4c6c-aa6d-e1204d2e1da0)
        - `addCommand`
          - Parameters::
            - `label`
              - __string__
            - `display-conditional`
              - __function__
              - Optional
            - `callback`
              - __function__
          - Example::
            - ```javascript
              window.roamAlphaAPI.ui.msContextMenu.addCommand(
                {
                  "label": "test",
                  "callback": () => { console.log("hey") }
                }
              )```
        - `removeCommand`
          - Parameters::
            - `label`
              - __string__
          - Example::
            - ```javascript
              window.roamAlphaAPI.ui.msContextMenu.removeCommand(
                {"label": "test"}
              )```
      - `.graphView`
        - `addCallback`
          - Description::
            - Adds a callback that gets called whenever a graph view is loaded. There are two types of graph views - "all-pages" (the entire database) and "page" (a specific page and its components). Using the optional `type` parameter, you can request to only trigger callbacks on a specific type of graphs.
            - The graph view is rendered using [[Cytoscape]], and by exposing the Cytoscape object, we hope to enable experimentation with various Cytoscape plugins, alternative UIs, etc.
          - Parameters::
            - `label`
              - String label used to upsert or remove listener
              - __string__
            - `callback`
              - Function called with `context` when the user selects the command in the Command Palette
              - `context`:
                - `cytoscape` holds a reference to the [[Cytoscape]] graph object
                - `elements` is an array of the nodes and edges in the graph
                - `type` is "page" | "all-pages"
                - ```javascript
                  { cytoscape: Core {_private: {…}},
                    elements: [
                      {id: "eTCpkG-HI", name: "B", weight: 7}
                      {id: "05-04-2021", name: "May 4th, 2021", weight: 10}
                      {id: "FrW4nHLat", name: "A", weight: 7}
                      {id: "eTCpkG-HI-FrW4nHLat", source: "eTCpkG-HI", target: "FrW4nHLat"}
                      {id: "eTCpkG-HI-eTCpkG-HI", source: "eTCpkG-HI", target: "eTCpkG-HI"}
                      {id: "05-04-2021-eTCpkG-HI", source: "05-04-2021", target: "eTCpkG-HI"}
                    ],
                  type: "page" }```
              - __function__
            - `type`
              - Optionally specify the type of graph (`page` | `all-pages` to trigger on, if undefined, the callback triggers on all graphs
              - __string__: "page" | "all-pages"
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
        - `removeCallback`
          - Description::
            - Removes a callback with the given `label`
          - Parameters::
            - `label`
              - Label provided when using `addCallback`
              - __string__
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
        - {{[[TODO]]}} document `wholeGraph`
          - New API for the new graph overview - old addCallback will not work with new graph overview
          - examples
            - ```javascript
              roamAlphaAPI.ui.graphView.wholeGraph.addCallback({
                "label": "test",
                "callback": (x) => {
                  console.log(x);
                }
              })

              roamAlphaAPI.ui.graphView.wholeGraph.removeCallback({"label": "test"});

              roamAlphaAPI.ui.graphView.wholeGraph.setExplorePages(['a']);
              const x = roamAlphaAPI.ui.graphView.wholeGraph.getExplorePages();
              console.log(x);

              roamAlphaAPI.ui.graphView.wholeGraph.setMode("Whole Graph");
              roamAlphaAPI.ui.graphView.wholeGraph.setMode("Explore");```
      - `.components`
        - `renderBlock`
          - Description::
            - Mounts a React component that renders a given block with children (editable) in a given DOM node.
          - Parameters::
            - `uid`
              - Block UID of block to display
              - __String__
            - `el`
              - DOM node where React component should be mounted
              - __DOM Node__
            - `open?` **optional**
              - optional Boolean
              - values
                - If not passed = whatever the normal open state of that block is in the db/graph
                - `true` = force open the block (show the children if exist)
                - `false` = force close the block (even if the block has children, they are not shown)
            - `zoom-path?`**optional**
              - Optional boolean
              - when `zoom-path?` is true, it shows the zoom path i.e. view which looks similar to how linked refs look
            - `zoom-start-after-uid` **optional**
              - Optional boolean
              - only valid when `zoom-path?` is true
                - path compacts to clickable `...` for everything until passed in uid
                  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2F0UbfHOyucp.png?alt=media&token=100fe5d1-6461-4e4d-986d-3916ef5e914e)
              - block uid __String__
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Example::
            - ```javascript
              const newNode = document.createElement('div');
              const wrap = document.getElementById('right-sidebar');

              // insert our new node after the wrap element in the DOM tree
              wrap.insertBefore(newNode, wrap.firstChild)

              window.roamAlphaAPI.ui.components.renderBlock(
                {
                  "uid": '6-P4ZEbIY', 
                  "el": newNode,

                  // optional args below

                  // open? is for if you want to force open/close the block
                  //   if not passed, uses whatever the normal open state of that block is in the db/graph
                  "open?": false, 

                  // zoom-path? : if you want to show the zoomable path of the block too
                  "zoom-path?": true,
                  // optional addition in zoom-path? mode: path compacts to ... for everything until passed in uid
                  "zoom-start-after-uid": "ImSvJvm1_"
                  })```
        - `renderPage`
          - Description::
            - Mounts a React component that renders a given page with children (editable) in a given DOM node.
            - unless you're using specific params (`zoom-path?` for block or `hide-mentions?` for page), you can use this interchangeably with `renderBlock`
          - Parameters::
            - (same as renderBlock except for the new "zoom-path?". has one additional optional param  `hide-mentions?` )
            - `uid`
              - Block UID of block to display
              - __String__
            - `el`
              - DOM node where React component should be mounted
              - __DOM Node__
            -  `hide-mentions?`
              - Optional boolean
              - to show or not to show linked refs at bottom of page
        - `renderSearch`
          - Description::
            - Mounts a React component that renders search results (first pages then blocks) for a given `search-query-str` in a given DOM node.
              - the results are the same as the "Find or Create Page" or cmd+u search
            - class is `rm-search-query`. Also uses the existing `rm-query` class
            - this search view is also available as an xparser component `{{[[search]]}}` or `{{[[search]]: Bret Victor}}`
          - Screenshot::
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Frs51OdcD-S.png?alt=media&token=e028dfc5-4a5e-4b4c-9f60-b28dc3f955cd)
          - Parameters::
            - `search-query-str`
              - Required string
            - `el`
              - Required
              - DOM node where React component should be mounted
              - __DOM Node__
            - `closed?`
              - optional boolean
                - default is false
              - whether view is closed or no
            - `group-by-page?`
              - optional boolean
                - default is false
            - `hide-paths?`
              - optional boolean
                - default is fale
            - `config-changed-callback`
              - optional function parameter
              - is called when config is changed as a result of user interaction
          - Example::
            - ```javascript
              const newNode = document.createElement('div');
              const wrap = document.getElementById('right-sidebar');

              // insert our new node after the wrap element in the DOM tree
              wrap.insertBefore(newNode, wrap.firstChild)

              window.roamAlphaAPI.ui.components.renderSearch(
                {"search-query-str": 'Bret Victor',
                 "closed?": false,
                 "group-by-page?": false,
                 "hide-paths?": false,
                 "config-changed-callback": (config) => {console.log("new-config", config);},
                 el: newNode})```
        - `renderString`
          - Description::
            - Mounts a React component that renders the passed-in string
              - the string can contain existing page titles, block refs and all the elements of roam-flavored markdown
                - in other words, it can contain anything you can keep in a block string
                - Watch out for
                  - If you pass/show `[[Page Title]]` like links for pages that do not exist, those links will not work. Please try not to do that
          - Parameters::
            - `string`
              - The string to be displayed
              - the string can contain existing page titles, block refs and all the elements of roam-flavored markdown
                - in other words, it can contain anything you can keep in a block string
                - Watch out for
                  - If you pass/show `[[Page Title]]` like links for pages that do not exist, those links will not work. Please try not to do that
              - __String__
            - `el`
              - DOM node where React component should be mounted
              - __DOM Node__
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Example:: (shows up in right sidebar)
            - ```javascript
              const newNode = document.createElement('div');
              const wrap = document.getElementById('right-sidebar');

              // insert our new node after the wrap element in the DOM tree
              wrap.insertBefore(newNode, wrap.firstChild)

              window.roamAlphaAPI.ui.components.renderString(
                {
                  el: newNode, 
                  string: "Hello this is via [[Roam Alpha API]]'s `renderString` which ((-PAiIlJ14))"})```
              - [[Screenshot]] (see top right)
                - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FojUSHmwVlU.png?alt=media&token=1d759b50-99e5-4b71-b9cd-0cc46ad17ae9)
        - `unmountNode`
          - Description::
            - Unmounts a React component from a certain DOM node.
          - Returns::
            - Promise which resolves once operation has completed
              - More details here
          - Parameters::
            - `el`
              - DOM node where React component was mounted
              - __DOM Node__
      - `.react`
        - `Block`
          - Description::
            - A React component that renders a given block with children (editable). Can be used declaratively in JSX.
          - Props::
            - `uid`
              - Block UID of block to display
              - __String__ (required)
            - `open` **optional**
              - Optional boolean
              - values
                - If not passed = whatever the normal open state of that block is in the db/graph
                - `true` = force open the block (show the children if exist)
                - `false` = force close the block (even if the block has children, they are not shown)
            - `zoomPath` **optional**
              - Optional boolean
              - when `zoomPath` is true, it shows the zoom path i.e. view which looks similar to how linked refs look
            - `zoomStartAfterUid` **optional**
              - Optional string
              - only valid when `zoomPath` is true
                - path compacts to clickable `...` for everything until passed in uid
              - block uid __String__
          - Example::
            - ```javascript
              const { Block } = window.roamAlphaAPI.ui.react;

              // Basic usage
              <Block uid="6-P4ZEbIY" />

              // Force closed
              <Block uid="6-P4ZEbIY" open={false} />

              // With zoom path
              <Block
                uid="6-P4ZEbIY"
                zoomPath={true}
                zoomStartAfterUid="ImSvJvm1_"
              />```
        - `Page`
          - Description::
            - A React component that renders a given page. Can be used declaratively in JSX.
          - Props::
            - `uid` **optional**
              - Page UID to display
              - __String__ (either `uid` or `title` is required)
            - `title` **optional**
              - Page title (alternative to UID)
              - __String__ (either `uid` or `title` is required)
            - `hideMentions` **optional**
              - Optional boolean
              - When `true`, hides the linked references section at the bottom of the page
          - Example::
            - ```javascript
              const { Page } = window.roamAlphaAPI.ui.react;

              // By UID
              <Page uid="page-uid-123" />

              // By title
              <Page title="My Page" />

              // Hide mentions
              <Page uid="page-uid-123" hideMentions={true} />```
        - `Search`
          - Description::
            - A React component that renders search results for a given query string. Can be used declaratively in JSX.
          - Props::
            - `searchQueryStr`
              - The search query string
              - __String__ (required)
            - `closed` **optional**
              - Optional boolean
              - When `true`, the view is collapsed
            - `groupByPage` **optional**
              - Optional boolean
              - When `true`, groups search results by their parent page
            - `hidePaths` **optional**
              - Optional boolean
              - When `true`, hides the block paths in results
            - `onConfigChange` **optional**
              - Optional callback function
              - Called when the user changes the search configuration (grouping, etc.)
              - Receives the new config object as an argument
          - Example::
            - ```javascript
              const { Search } = window.roamAlphaAPI.ui.react;

              // Basic search
              <Search searchQueryStr="Bret Victor" />

              // Grouped by page with callback
              <Search
                searchQueryStr="Bret Victor"
                groupByPage={true}
                onConfigChange={(config) => console.log('Config changed:', config)}
              />

              // Hide paths
              <Search
                searchQueryStr="TODO"
                hidePaths={true}
              />```
        - `BlockString`
          - Description::
            - A React component that renders a Roam-markdown string. This includes rendering `[[page links]]`, `((block refs))`, and other Roam formatting. The rendered content is **not** editable.
          - Props::
            - `string`
              - The Roam-markdown string to render
              - __String__ (required)
          - Example::
            - ```javascript
              const { BlockString } = window.roamAlphaAPI.ui.react;

              // Render text with page link
              <BlockString string="Hello [[World]]" />

              // Render text with block reference
              <BlockString string="See also: ((abc123def))" />

              // Render formatted text
              <BlockString string="This is **bold** and __italic__" />```
      - `.callout`
        - `.addType`
          - Description::
            - Registers a custom callout type so it appears in the callout type picker menu. The type will show up when a user clicks the icon on a callout block. Icons and colors are provided entirely via CSS — the extension styles `.rm-callout--{type}` for color and `.rm-callout--{type} .rm-callout__icon` for the icon. A built-in default icon is shown as fallback until extension CSS loads.
          - Parameters::
            - `type`
              - The string used in `[!type]` callout syntax
              - __string__ (required)
          - Returns::
            - `null`
          - Usage::
            - ```javascript
              window.roamAlphaAPI.ui.callout
              .addType({type: "recipe"})```
            - Then provide CSS via `roam/css` or extension stylesheet:
              - ```css
                /* Emoji icon */
                .rm-callout--recipe {
                --callout-color: #f778ba;
                }
                .rm-callout--recipe .rm-callout__icon::before {
                content: "🍪";
                font-family: initial;
                }```
        - `.removeType`
          - Description::
            - Removes a previously registered custom callout type from the picker menu.
          - Parameters::
            - `type`
              - The type string to remove
              - __string__ (required)
          - Returns::
            - `null`
          - Usage::
            - [[roam/js]]
              - ```javascript
                window.roamAlphaAPI.ui.callout
                .removeType({type: "recipe"})```
    - `.util`
      - `.generateUID`
        - Description::
          - Generates a roam block UID which is a random string of length nine. 
        - Parameters::
          - None
        - Usage::
          - ```javascript
            window.roamAlphaAPI.util.generateUID()```
      - `.pageTitleToDate`
        - Description::
          - Convert a daily note page title to a date
        - Parameters::
          - a daily note title string, `"June 16th, 2022"`, any non daily note title string will return nil, instead of a date
      - `.dateToPageTitle`
        - Description::
          - Convert a date to a daily note page title
        - Parameters::
          - a [javascript date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
      - `.dateToPageUid`
        - Description::
          - Convert a date to a daily note page uid (`06-16-2022`)
          - Use this instead of `.generateUID` if you are programmatically generating a daily note page and need the uid ahead of time
        - Parameters::
          - a [javascript date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
    - `.platform`
      - All below are boolean variables that are true if the user's device is that platform
        - If you find out that any of the following have some edge cases for which they're failing, please [[Contact Us]]
      - `.isDesktop` #property
        - true if client is Roam [[Desktop App]]
      - `.isMobileApp` #property
        - true if client is Roam [[Mobile App]]
      - `.isMobile` #property
        - Note that this is only a check on the screen size
          - just uses a media query `max-width: 450px`
      - `.isIOS` #property
        - true if client is iphone, ipad or ipod
      - `.isPC` #property
        - true if client is a PC 
        - useful if you want to have different shortcuts on PC vs Mac 
      - `.isTouchDevice` #property
        - true if client is a touch device
    - `.graph`
      - `.name` #property
        - The name of the current graph
      - `.type` #property
        - `"hosted"` or `"offline"`
      - `.isEncrypted` #property
        - Whether the graph is encrypted or not
    - `.file`
      - `.upload`
        - Description::
          - Upload a file to Roam
          - This also exists as `roamAlphaAPI.util.uploadFile`, prefer using the new version, but the old function will not be removed
        - Parameters::
          - `file`
          - `toast` #optional
            - `hide`
              - To show / hide the upload toast, default to `false`
        - Returns::
          - Promise that resolve to a firebase download url
        - Usage::
          - ```javascript
            roamAlphaAPI.file.upload({file: new File([""], "test"), toast: {hide: true}})

            roamAlphaAPI.file.upload({file: new File([""], "blah")})```
      - `.get`
        - Description::
          - Fetch a file hosted on Roam
          - You could also fetch the file yourself with `fetch`, but `.get` handles decrypting the file for encrypted graphs, and fetches the original file name and file type metadata for creating the file object
        - Parameters::
          - `url`
            - A firebase storage url, obtained from `.upload`, or from a block
        - Returns::
          - A promise that resolve to a [File object](https://developer.mozilla.org/en-US/docs/Web/API/File)
        - Usage::
          - ```javascript
            roamAlphaAPI.file.get({url: "https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Ftest103%2FGVfB6XBcMR.pdf?alt=media&token=0e0495c7-fbe9-4e13-b9a2-9ffb2c32cd26"})```
      - `.delete`
        - Description::
          - Delete a file hosted on Roam
        - Parameters::
          - `url`
            - A firebase storage url, obtained from `.upload`, or from a block
        - Returns::
          - Promise that resolves to `undefined`
        - Usage::
          - ```javascript
            roamAlphaAPI.file.delete({url: "https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Ftest103%2FVxMoWmo8pI.jpeg?alt=media&token=39af97c0-32f5-46f9-a198-90481b29d974"})```
    - `.user`
      - `.uid`
        - Description::
          - Function which returns the current user's uid
          - Use this in conjunction with pull to get the user's display page and other meta data about the user
        - Returns::
          - A string or null
        - Usage::
          - ```javascript
            roamAlphaAPI.user.uid()

            // pull all info about a user
            roamAlphaAPI.pull("[*]", [":user/uid", window.roamAlphaAPI.user.uid()]);```
      - `isAdmin`
        - Description::
          - Function that returns whether the current user is an admin or not (an admin is the graph owner)
        - Returns::
          - boolean
    - `depot`
      - `getInstalledExtensions`
        - Description::
          - Function that returns a map of the extensions currently installed through Roam Depot or dev mode
        - Returns::
          - Object of {ext-id ext-map}
            - Example::
              - ```javascript
                {ccc+ccc-roam-pdf-2: 
                 {id: 'ccc+ccc-roam-pdf-2', 
                  name: 'Roam PDF Highlighter 2', 
                  enabled: false,
                  version: '1' //version 'DEV' is for developer loaded extensions
                 }
                ...}```
    - `.constants`
      - `.corsAnywhereProxyUrl`
        - (added on [[November 23rd, 2024]])
        - the url for a [CORS-anywhere proxy](https://github.com/Rob--W/cors-anywhere) hosted by the Roam team
        - This can be useful when you're querying an external API in your extension but it has CORS restrictions
        - **How to use it**
          - pretty easy, instead of `fetch`ing the `url`, instead fetch (`roamAlphaAPI.constants.corsAnywhereProxyUrl` + "/" + `url`)
          - Some sample JS code
            - ```javascript
              let urlToFetch = "https://google.com"

              await fetch(`${roamAlphaAPI.constants.corsAnywhereProxyUrl}/${urlToFetch}`)
                .then(a=>a.text())```
          - Note that to prevent misuse, this proxy only works when the request originates from Roam domains `https://roamresearch.com`
