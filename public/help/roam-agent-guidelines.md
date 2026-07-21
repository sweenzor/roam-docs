# roam/agent guidelines

- Guidelines for AI agents working on this graph, Roam's **public help documentation**. Real users read every word. Follow these for every read and write.

### Process

- Work page by page. A human reviews everything: write, then let them edit and cull.
- When rewriting an existing page, append new sections at the bottom and let the human delete the old content. Never delete or reword content you didn't write unless asked.
- Re-read a page before editing it; it may have changed since you last saw it.
- When replacing old content, every fact the old version conveyed must be either carried forward or deliberately dropped as wrong. Say which.
- Verify every claim against the product's source code before writing it. Never document from memory, and never trust the old docs' claims without checking.
- If you have access to the relemma codebase: the full audit and fix plan lives at `generated-docs/help-graph-audit-2026-07.md`. Read it before starting doc work, and check items off there as they land.

### Page structure

- No "What is it?" section. The intro is 2-3 plain bullets directly under the page title (the title is the question). Then sections like **How to use it** and **Good to know**.
- One idea per block. Separate blocks are good.
- Steps: a title block with one action per child bullet. Never pack several actions into one block.
- Group by topic: don't interleave two topics (e.g. browsing shortcuts vs changing them) in one run of bullets.
- One home per fact: don't say the same thing twice in different phrasings.

### Formatting patterns

- Hotkeys: the command name as a bold parent block, with `Mac:` and `PC:` sub-bullets when the keys differ. When the keys are the same on both platforms, one block with the keys inline.
- Syntax references (query clauses and similar): the syntax in code as the parent block, the explanation nested underneath.
- Tips go in callouts: `[[>]] [[!TIP]]`.
- Keep example syntax inside backticks so `[[links]]` in examples don't create real pages.
- When an example needs an outline shape, write it as real nested blocks, with each example line's text in a code span.

### Links

- Link mentions of other help pages, but don't over-link. No links on incidental words (Mac, PC), and avoid linking to empty pages.
- Alias links so names read naturally, e.g. `[TODO]([[TODO/DONE]])` renders as the command name while linking the right page.
- Every new page ships with at least one natural inbound link. Nothing orphaned.
- Prefer a plain `[[Page Title]]` link where the page comes up, reshaping the sentence to fit the title ("A [[Hosted Graph]] is synchronized…") over appending "see [[Hosted Graph]]" at the end. Use a markdown alias (`[TODO]([[TODO/DONE]])`) only when the visible text must differ from the page title, like command names.

### Media

- Prefer **live components over screenshots**: a real `{{[[table]]}}` or `{{[[query]]}}` the reader can poke at beats an image. Tell public readers their edits aren't saved, so they can play freely.
- For screenshots and GIFs, leave placeholder blocks for a human to record: `📷 **Screenshot:** __what it should show__`. Use GIFs sparingly: at most one per page, only for genuinely multi-step interactions.
- Reuse images and videos that already exist in this graph (Change Log entries are a good source). Put the file link or video component directly on the page.

### Language & accuracy

- Plain, simple language. Explain mechanisms so a non-programmer can follow: "nested blocks inherit references", not implementation jargon.
- Skip implementation details that confuse more than they help (e.g. desktop-shell updates vs web-app updates).
- No false, unverifiable, or aspirational claims. If the product can't do something, say so plainly.
- Page titles match the product's own terminology.
- No em-dashes (—). Use commas, colons, parentheses, a new sentence, or a separate block instead.
- Tone: conversational and friendly. Write to "you", explain why things matter, keep the warmth.
- But don't polish every bullet to the same rhythm. It's fine for a bullet to state a fact plainly and stop.
- Explaining **why** is part of the job. Mechanisms, consequences, and non-obvious benefits belong in the docs ("sorting reorders the blocks for everyone" is exactly what to say). What to skip is restating a benefit the reader already got: "handy once the graphs pile up" adds nothing to "the search box filters your list".
- Watch for other AI habits: three-item lists everywhere, and a charming aside on every page. Ration personality to about one moment per page, and vary list lengths.
- No rhetorical-question asides ("Reading this on the help graph? Your edits aren't saved, so play freely."). Say it straight: "Edits here aren't saved."
- Friendly means relaxed and natural, not clever. Write full sentences with a subject, attach the reason to the fact with "so" or "because", and prefer an invitation over a bare command.
- The voice, by example. Three drafts of the same block:
  - Too AI: "Try it on a classic: Doug Engelbart's 1962 __Augmenting Human Intellect__, the paper that imagined tools like this one. Select some text and make a highlight. (Reading this on the help graph? Your edits aren't saved, so play freely.)" The tells: a setup colon, a winking appositive, a rhetorical-question aside.
  - Overcorrected: "Highlight something. Edits here aren't saved." Clipped imperatives read cold, even aggressive.
  - Right: "Try it on this copy of Doug Engelbart's 1962 paper, __Augmenting Human Intellect__. Highlights you make here aren't saved, so feel free to experiment." Plain sentences, the interesting fact stated rather than sold, and the warmth comes from a natural invitation.
