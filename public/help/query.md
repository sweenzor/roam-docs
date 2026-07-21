# Query

- A query block collects every block in your graph that matches conditions you give it: a saved search that lives right in your notes.
- Type `/query` in a block to create one. The [[Roam Query Builder]] opens so you can build it visually. This page covers the clauses underneath.
- Here's a live one under this block: every block that links to [[Templates]], minus the [[Change Log]].
  - {{[[query]]: {and: [[Templates]] {not: [[Change Log]]}}}}

### How queries work

- A query is written inside the block, like:
  - `{{[[query]]: {and: [[Project]] [[TODO]]}}}`
- Using a `[[page]]` or `((block ref))` as a condition matches everything that **links to it**.
- Nested blocks inherit references: a block counts as mentioning everything its parent blocks mention, and the page it lives on.
- That's how conditions combine: they don't all have to sit on the same block. A block matches when every condition is met somewhere along its path: the block itself, its parents, or its page.
  - For example, `{and: [[Acme]] [[pricing]]}` matches the nested block here:
    - Met with [[Acme]] today
      - Discussed [[pricing]] options
- Until you name a query, its title shows the query string itself. Click the title and type to name it, or write it as `{{[[query]]: "My title" {and: ...}}}`.
- For meaning-heavy searches or things queries can't express, there's also the datalog query block: see [[Examples of :q query blocks]] and [[Roam-specific :q additions]].

### The clauses

- `{and: [[A]] [[B]]}`
  - Every condition must match.
- `{or: [[A]] [[B]]}`
  - Any one condition must match.
- `{not: [[A]]}`
  - Excludes matches; takes exactly one condition.
  - Combine it like `{and: [[Project]] {not: [[Archived]]}}`.
- `{search: some text}`
  - Blocks whose text contains what you typed.
  - Takes one piece of text; other clauses can't nest inside it.
- `{between: [[January 1st, 2026]] [[today]]}`
  - Matches daily notes in a date range: the pages themselves, blocks on them, and blocks mentioning any date in the range.
  - Relative date pages work too: `[[today]]`, `[[yesterday]]`, `[[tomorrow]]`, `[[last week]]`, `[[next week]]`, `[[last month]]`, `[[next month]]`.
  - Combine it: `{and: [[TODO]] {between: [[last week]] [[today]]}}` finds the past week's TODOs.
  - `between` only understands daily-note dates. It doesn't look at when blocks were created or edited.
- `{daily-notes:}`
  - Matches everything in your daily notes: the daily pages themselves, blocks on them, and blocks mentioning any date.
  - Use it to scope a query to your daily notes, `{and: [[Project]] {daily-notes:}}`, or to keep them out: `{and: [[Project]] {not: {daily-notes:}}}`.
- `{by: [[Person]]}`, `{created-by: [[Person]]}`, `{edited-by: [[Person]]}`
  - Blocks by author. Use the person's display-name page.

### Displaying results

- The **options menu** on each query offers **Group by Page**, **Show Paths**, sorting, and **Nest under parent results**.
  - Nest under parent results: when a block and its parent both match, show just the parent.
- Queries don't re-run on their own. Click the **refresh** button to re-run one.
- Or turn on **Reactive** in the options menu to make a query update automatically as your graph changes. It's off by default to keep large graphs fast.
- The **filter** button narrows results by page, just like filtering [[Linked References]].

### Community Videos::

#### Query syntax and logic: how to ask Roam questions with queries by [[Robert Haisfield]]

- {{[[video]]: https://www.youtube.com/watch?v=LJZBGJOzhUY&t=20s&ab_channel=RobertHaisfield}}

#### How Queries Work in Roam Research by [[R.J. Nestor]]

- {{[[video]]: https://www.youtube.com/watch?v=lBmklV0n8D0}}

#### Roam Research Search Queries by [[David Perell]]

- {{[[video]]: https://www.youtube.com/watch?v=HoccqyiHvPw}}

#### Insight Hunting with Queries in Roam by [[Cortex Futura]]

- {{[[video]]: https://www.youtube.com/watch?v=gLAlQGM_l1Q}}

#### Roam Research Query Tutorial: Pending Tasks for Task Management and Task Dashboard Using Queries by [[The Upgraded Brain]]

- {{[[video]]: https://www.youtube.com/watch?v=Kg5omIyWu8s}}
