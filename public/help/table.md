# Table

- Tables display blocks as a grid you can edit in place: click into cells, sort columns, resize, and paste to and from spreadsheets.
- Every cell is a real Roam block, so cells can contain page links, block references, and formatting. They show up in search and linked references like any other block.
- This one is live: click into a cell, or try sorting the **Price** column from its pill. (Reading this on the help graph? Your edits here aren't saved, so play freely.)
- {{[[table]]}}
  - Item
    - Price
      - Last ordered
  - Coffee
    - $4.50
      - [[March 3rd, 2026]]
  - Tea
    - $3.25
      - [[June 12th, 2026]]
  - Croissant
    - $2.75
      - [[January 8th, 2026]]

### Creating a table

- Type `/table` in a block, or write `{{[[table]]}}` yourself.
- A brand-new table asks for its size first. Pick rows and columns, hit **Create table**, and you get a grid ready to fill in:
- {{[[table]]}}
- Click any empty cell and start typing. Roam creates the blocks for you as the table grows.
- Under the hood, the grid is built from the blocks nested beneath the table block: each direct child starts a row, and each level of nesting is the next column. Existing nested-list tables render just as they always have.

### Editing cells

- Click a cell to edit it. A cell edits like a normal block, including `[[links]]` and `((block refs))`.
- Drag across cells, or hold `Shift` with the arrow keys, to select a range.
- With a selection: arrow keys move, `Enter` or just typing edits the focused cell, `Tab` / `Shift-Tab` step through cells, and `Backspace` clears contents.
- Copy or cut a selection (`Cmd-c` / `Cmd-x`) and paste it into a spreadsheet. Pasting a grid of spreadsheet cells into a table fills it in, creating cells as needed.

### Rows and columns

- Hover over a column and click its pill to open the column menu: **Header column**, **Sort**, **Insert left / right**, **Clear contents**, and **Delete**.
- Rows have the same pill menu: **Header row**, **Insert above / below**, **Clear contents**, and **Delete**.
- Drag a column's edge to resize it, and drag a row or column by its pill to move it.

### Sorting

- Sort a column ascending or descending from its column menu.
- Sorting understands numbers (including `$`, `%`, and thousands separators), dates, and plain text.
- The header row stays put; the rest of the rows are reordered.
- Sorting reorders the actual blocks, so the new order is what everyone sees. It's not a per-person view.
- If edits later knock the table out of order, the column offers **Re-sort**; **Remove sort** stops tracking it.
