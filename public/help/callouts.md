# Callouts

- Callouts are styled [[Blockquote]]s with a type-specific icon and color. 
- Start any block with `[[>]] [[!NOTE]]` to create one (or `> [!NOTE]`).
- You can also use the **/Callout** slash command to quickly insert one. 
- Click the callout's icon to change its type.
- **Types**
  - [[>]] [[!NOTE]] This is a basic note callout
    Notes are great for highlighting general information you want to draw attention to.
  - [[>]] [[!INFO]] Informational callout with an info icon
    Use these for additional context or background details.
  - [[>]] [[!SUMMARY]] A summary or abstract callout
    Perfect for executive summaries, TLDRs, or condensed overviews.
    - Aliases: `abstract`, `tldr`
  - [[>]] [[!TIP]] Helpful tip — try using callouts for emphasis!
    Combine callouts with **bold**, *italic*, and `code` formatting in both the title and body.
    - Aliases: `hint`, `important`
  - [[>]] [[!SUCCESS]] Operation completed successfully
    All 47 tests passed. The deployment to staging is live.
    - Aliases: `check`, `done`
  - [[>]] [[!QUESTION]] How do callouts work in Roam?
    The first line after `[[!TYPE]]` is the title. Add body text on the next line with **Shift+Enter**.
    - Aliases: `help`, `faq`
  - [[>]] [[!WARNING]] Be careful when editing shared pages
    Other users may be viewing or editing at the same time.
    - Aliases: `caution`, `attention`
  - [[>]] [[!FAILURE]] Build failed due to missing dependencies
    Run `npm install` and check that all peer dependencies are satisfied.
    - Aliases: `fail`, `missing`
  - [[>]] [[!DANGER]] Do NOT delete this page — critical data
    This page contains production configuration values referenced by multiple systems.
    - Alias: `error`
  - [[>]] [[!BUG]] Found a rendering issue on mobile viewports
    The sidebar overlaps the main content when screen width is below 768px.
  - [[>]] [[!EXAMPLE]] Here's how you format a callout
    Use `[[>]] [[!TYPE]] Title` on the first line. Add body text with Shift+Enter.
  - [[>]] [[!QUOTE]] "The best way to predict the future is to invent it."
    — Alan Kay, 1971
    - Alias: `cite`
- **Foldable Callouts**
  - Add `+` or `-` after the type (e.g. `[[!TIP]]+`) to make it foldable. `+` starts expanded, `-` starts collapsed. Click the header to toggle.
  - [[>]] [[!TIP]]+ Click to collapse this tip
    This body is visible by default because of the `+` marker. It hides when you click the header.
  - [[>]] [[!WARNING]]- Hidden by default — click to expand
    This body starts collapsed because of the `-` marker. Click the header to reveal it.
- **Headings + Callouts**
  - Callouts work inside heading blocks. The title scales with the heading size while the body stays regular size.
  - **[[>]] [[!WARNING]] Heading callout**
    Body text stays regular size.
- **Custom Types & CSS**
  - Unrecognized types fall back to "note" styling but get a `.rm-callout--{type}` CSS class for custom styling. Each callout exposes `--callout-color` and `--callout-bg` custom properties — override these to restyle any type or define your own.
  - Turn on the css below to enable the custom types
  - {{[[roam/css]]}}
    - ```css
      /* Override an existing callout type's colors */
      /* .rm-callout--warning {
        --callout-color: #a371f7;
      } */

      /* Custom type with emoji icon */
      .rm-callout--recipe {
        --callout-color: #f778ba;
      }
      .rm-callout--recipe .rm-callout__icon::before {
        content: "🍪";
        font-family: initial;
      }

      /* Custom type with SVG icon from URL (inherits callout color) */
      .rm-callout--security {
        --callout-color: #e5534b;
      }
      .rm-callout--security .rm-callout__icon::before {
        content: "";
      }
      .rm-callout--security .rm-callout__icon {
        width: 1em;
        height: 1em;
        background: currentColor;
        -webkit-mask-image: url("https://unpkg.com/lucide-static@latest/icons/shield-alert.svg");
        mask-image: url("https://unpkg.com/lucide-static@latest/icons/shield-alert.svg");
        -webkit-mask-size: contain;
        mask-size: contain;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
      }

      /* Override background separately if needed */
      /* .rm-callout--recipe {
        --callout-bg: rgba(247, 120, 186, 0.2);
      } */
      ```
  - > [!recipe] Grandma's cookies
  - > [!security] Security alert
