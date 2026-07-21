# Roam Query Builder

- The Query Builder is a visual editor for [[Query]] blocks: build and refine a query with menus and pickers instead of writing the syntax by hand.
- It reads and writes the real query syntax in your block, so you can flip between building visually and editing the text whenever you like.
- Here's a live one: click the wrench button next to the query's title to open the builder and poke around. (Reading this on the help graph? Your edits aren't saved, so play freely.)
- {{[[query]]: {and: [[Block References]] {not: [[Change Log]]}}}}

### Opening the builder

- Every query block has a wrench button beside its title. Click it to show or hide the builder.
- A brand-new query (type `/query` in a block) opens with the builder already showing.
- The builder sits right above the query's live results, so you can watch the matches change as you edit.

### Building a query

- A query is a stack of clauses. Click **Add clause** to add one, and click an existing clause's name to switch its type or delete it.
- Clause types: `[[page]]` and `((block))` references, the combinators **and**, **or**, and **not**, full-text **search**, **between** for date ranges (including relative dates), **daily notes**, and **by** / **created by** / **edited by** to filter by author.
- Each clause type brings the right picker with it: page search, block search, free text, user search, or a date picker.
- For what these clauses mean and the underlying syntax, see [[Query]].
