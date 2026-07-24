# roam/css

- How it works
  - Every css code block on this page — at any nesting depth — is applied to the app, in visual order
  - Changes apply live as you type
  - Click a color value inside a css code block and Roam shows an inline color picker — no need to know hex codes
  - Only code blocks whose language is set to css count. You can switch the language to temporarily disable that css block, or store css on this page for later.
  - This page's filters apply and change what css is applied
    - Filter the page to toggle css blocks on and off (e.g. tag each theme's blocks and switch themes by filtering)
    - You can use this to have css blocks that are only applied for certain users by having each user apply different filters
  - To apply css from any other page, nest the css code block under a `{{[[roam/css]]}}` component block
    - Each such block has to be enabled by each user of your graph.
    - **If you want the css to be applied for everyone write directly on this page**
  - Escape hatch: if bad css makes the app unusable, add `?disablecss=true` to the URL (before the `#`) — all roam/css is disabled until the next refresh. You can also disable all js and css from the "Roam Depot" tab in settings
- Finding what to target
  - Right-click any element and choose Inspect — your browser's DevTools open with that element selected, showing its classes
  - To inspect UI that only appears on hover (bullet controls, tooltips), run `setTimeout(() => { debugger }, 3000)` in the DevTools console, then hover the element — the page freezes in the debugger so you can inspect it
  - Roam's own classes are prefixed `rm-` (a few older structural ones use `roam-`)
    - `bp3-` classes come from [Blueprint](https://blueprintjs.com/docs/versions/3/), the UI library Roam uses — you can target them too, but prefer `rm-` classes when both match
  - Test a selector from the DevTools console
    - `document.querySelectorAll(".rm-page-ref")` returns every element it matches
- Useful selectors
  - Layout
    - `.roam-body`, `.roam-app`, `.roam-main` — the app shell
    - `.roam-article` — the main window's page content
    - `.roam-sidebar-container` — the left sidebar
    - `.rm-sidebar-outline` — a page open in the right sidebar
    - `.roam-log-container` — the daily notes view
    - `.rm-title-display` — page titles
  - Blocks
    - `.rm-block` (also `.roam-block-container`) — a block together with its children
    - `.rm-block-main` (also `.rm-block__self`) — just the block's own line
    - `.rm-block__children` — the block's children
    - `.rm-block__input` (also `.roam-block`) — the rendered block text; while editing it is the `textarea.rm-block-input`
    - Modifier classes on `.rm-block`: `rm-heading-level-1` / `-2` / `-3`, `rm-block--open` / `rm-block--closed`, `rm-block--mine` / `rm-block--others`, `rm-block--editable` / `rm-block--readonly`, `rm-focused`
  - References
    - `.rm-page-ref` — every page reference
      - `.rm-page-ref--link` for bracketed links, `.rm-page-ref--tag` for tags
    - `.rm-block-ref` — block references
    - `.rm-reference-main` — the linked references section (query results use it too)
- Styling specific tags and blocks
  - Every page ref carries data attributes: `data-tag` (tags) or `data-link-title` (links), plus `data-link-uid`
  - The block container carries `data-page-links` — a JSON array of every page linked in the block — and `data-path-page-links` for pages linked in its ancestors
  - Add your own class to a block by tagging it with a page whose title starts with a dot and contains no spaces, e.g. `#.aside`. The tag will be automatically be hidden and appear on hover.
    - The class (minus the dot) is added to that block's `.rm-block` container
    - Most of [Tailwind's utility classes](https://v2.tailwindcss.com/docs) ship with Roam, so many dot-tags style a block with no css at all
      - This block is tagged with #.bg-blue-400 #.rounded #.p-2
      - And this one with #.font-bold #.italic
  - The block container also carries `data-block-uid`, `data-page-title`, and `data-create-display-name` / `data-edit-display-name`
- **Some of the examples below you need to switch the code block type to __css__ in the bottom right to enable**
- Examples::
  - Change the app font
    - ```javascript
      .roam-app {
        font-family: "iA Writer Quattro", "Helvetica Neue", sans-serif;
      }```
    - `@import` (e.g. a Google Fonts URL or a shared theme stylesheet) only works from the very first css block on this page — all blocks are concatenated into one stylesheet, and css requires `@import` at the top. Hosting a long theme on GitHub and importing it also keeps those lines out of your graph's search results
  - Widen the page
    - ```javascript
      /* the width setting in the ... menu adds rm-spacing--small or --medium here */
      .rm-article-wrapper.rm-spacing--small {
        padding-left: calc((100% - 1100px) / 2);
        padding-right: calc((100% - 1100px) / 2);
      }```
  - **Color the headings**
    - ```javascript
      /* the > path matters: a plain descendant selector would also hit the heading's child blocks */
      .rm-heading-level-1 > .rm-block-main .rm-block__input { color: #1c5b8f; }
      .rm-heading-level-2 > .rm-block-main .rm-block__input { color: #2e7d32; }
      .rm-heading-level-3 > .rm-block-main .rm-block__input { color: #8a6d1d; }```
  - Tags with emoji and prefix matching #idea #project/css
    - ```css
      /* an emoji before every #idea tag */
      .rm-page-ref[data-tag="idea"]::before {
        content: "💡 ";
      }
      /* style every tag starting with "project/" */
      .rm-page-ref[data-tag^="project/"] {
        color: #7b2d8b;
        font-weight: 600;
      }```
  - Style one page's links everywhere [[Projects]]
    - ```css
      span[data-link-title="Projects"] {
        font-weight: 600;
        text-transform: uppercase;
      }```
  - Highlight blocks that link a specific page [[urgent]]
    - ```css
      /* highlight every block that links [[urgent]] */
      .rm-block[data-page-links*='"urgent"'] > .rm-block-main {
        background: #fff6f6;
      }```
  - Style blocks you've tagged with a dot-class like `#.aside` #.aside
    - ```css
      /* tag a block with #.aside to style it */
      .rm-block.aside > .rm-block-main {
        opacity: 0.6;
        font-style: italic;
      }
      /* hide the #.aside tag itself */
      .rm-page-ref[data-tag=".aside"] {
        display: none;
      }```
  - Bigger TODO checkboxes, crossed-out DONE blocks
    - {{[[TODO]]}} do this
    - {{[[DONE]]}} do this
    - ```javascript
      /* {{[[TODO]]}} renders .rm-checkbox.rm-todo, {{[[DONE]]}} renders .rm-checkbox.rm-done */
      /* the native input is hidden — the visible box is the .checkmark inside .check-container */
      .rm-checkbox .check-container {
        display: inline-block;
        transform: scale(1.15);
        transform-origin: center left;
      }
      /* cross out blocks with a checked box (needs a browser with :has support) */
      .rm-block__input:has(.rm-done) {
        text-decoration: line-through;
        opacity: 0.6;
      }```
  - Change the ^^highlight^^ color
    - ```javascript
      /* ^^highlighted^^ text */
      .rm-highlight {
        background: #d8f0e0;
      }```
  - > Style block quotes
    - ```javascript
      /* blocks starting with > */
      blockquote.rm-bq {
        border-left: 3px solid #c9b458;
        background: #faf6ea;
        font-style: italic;
      }```
  - Mark [external links](https://blueprintjs.com/docs/versions/3/)
    - ```javascript
      /* [alias](url) links to the outside world get an arrow */
      .rm-alias--external::after {
        content: " ↗";
        font-size: 0.8em;
      }```
  - Limit image height
    - ```javascript
      .rm-inline-img {
        max-height: 300px;
      }```
  - Follow the system's light/dark mode
    - ```javascript
      /* define your colors twice and the theme switches with the OS setting */
      @media (prefers-color-scheme: dark) {
        .roam-app { background: #1d2125; color: #d6d8da; }
      }
      @media (prefers-color-scheme: light) {
        .roam-app { background: #ffffff; color: #202b33; }
      }```
- Good practices
  - Prefer `rm-` classes and data attributes; avoid structural selectors like `:nth-child` if you can
  - Use CSS for presentation only — if you find yourself trying to add elements or change behavior, you want JavaScript instead (an extension, or [[roam/js]])
  - If an override doesn't take — common when adjusting an imported theme — add `!important` to the declaration
  - Roam's markup changes between releases and class names are not a formal API, so expect to revisit your css occasionally
- Roam Team Videos::
  - **Applying Custom Themes for your RoamResearch Knowledge Graph by [[Conor White-Sullivan]]**
    - {{[[video]]: https://youtu.be/UY-sAC2eGyI}}
- Community Videos::
  - **How to Create and Edit Roam CSS: Interview with [[Abhay Prasanna]]**
    - {{[[video]]: https://www.youtube.com/watch?v=Cz07-oZlPzA&t=3s&ab_channel=MikeGiannulis}}
- Articles::
  - [Painting Roam with Custom CSS](https://maggieappleton.com/paintingroam) by [[Maggie Appleton]]
  - [Roam themes: how to style Roam Research with custom CSS](https://nesslabs.com/roam-research-themes-custom-styling-css) by [[Anne-Laure Le Cunff]]
- Check out our [community-built themes for inspiration](https://roamresearch.com/#/app/help/page/dZV0KPRqu)
