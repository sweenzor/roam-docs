# Better search (Experimental)

### What is it?

- A new search engine for Roam, currently opt-in while it's experimental.
- It's a **personal** setting: turning it on changes how search works for you, not for everyone on the graph.
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2F2dBwqEBmaB.png?alt=media&token=37f82236-48d4-4a8e-a22c-0cb8c35431b4)

### What's better

- **It's faster**, especially on large graphs.
- **Block references are searchable.** A block that embeds another block with `(( ))` now matches searches for the referenced text — the old search only saw the raw reference, not what it says.
- **Smarter ranking.** Results are ordered by how directly they match: exact page titles first, then titles and blocks containing your words as a phrase, then those containing all your words anywhere.
- **It finds ideas spread across nearby blocks.** In an outline, one thought often spans several blocks. When no single block contains all your search words but a small neighborhood of blocks does, that group matches too — so you find the passage even though no block has the full phrase.
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FIbcwJXIPwF.png?alt=media&token=734a5256-bf82-4632-84e0-dc694ab666ae)
- **It unlocks search filters.** With it on, keyword searches in [[Advanced Search]] support filters like daily notes and edit time.

### How to turn it on

- Open **Settings → User → Experimental: Better search** and flip the switch.
- Each person on a graph chooses for themselves.
- The toggle is temporary — it will go away once the new engine becomes Roam's default search.
- Looking for meaning-based search on top of this? See [[Semantic search (Experimental)]].
