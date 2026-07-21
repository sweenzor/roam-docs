# Working with AI Tools

- These guidelines apply to every way of connecting an AI to your graphs: [[Roam MCP]], [[Local MCP]], and the [[Roam CLI]].
  - One thing this page does not cover: [[Roam Depot]] extensions that use AI. Those run inside the app under each extension's own rules, so the token, permission, and attribution guarantees here don't apply to them.
- The individual pages cover installing each one. This page is about using them well.

### What to ask for

- An AI connected to your graph answers from your notes, so it's useful in ways a plain chatbot isn't.
- Ask it about your own thinking:
  - "What do my notes say about interviewing?" It searches your graph, reads the relevant pages, and answers with links to the blocks it drew from.
  - "What did I write about this project last month?" It reads your daily notes and pages and summarizes, with references.
  - Turn on [[Semantic search (Experimental)]] (local MCP only) and it can find notes by meaning, so the old notes surface even when the words don't match.
- Have it capture for you:
  - Paste in raw meeting notes and ask it to file them using one of your [[Templates]].
  - Forward it ideas mid-conversation: "add this to my daily note under Ideas."
- Put it to work on the graph itself:
  - "Link this page up." It finds the pages your text mentions and adds the references.
  - "Find blocks that mention the offsite but aren't tagged, and tag them." Review the plan before it runs; bulk edits are where mistakes get expensive.
- Draft with it:
  - "Draft a blog post from my notes on this topic, on a new page." You get a draft whose sources are a click away, in your graph where you can reshape it block by block.

### Guide the AI with graph guidelines

- Create a page called [[roam/agent guidelines]] in your graph, and connected AI tools will read it before they start working.
- It's the place for your conventions: how you tag, where things get filed, what the AI should leave alone.
  - How you name things: what page titles look like, what your namespaces mean.
  - Your tags and what they're for: "#inbox means unprocessed, #ref means external material."
  - Where things get filed: which page captures go to, where drafts belong.
  - What to leave alone: pages or sections the AI shouldn't touch.
  - How you like blocks written: for example, one idea per block, links over plain mentions.

### Take care

- A full-access connection can read and write everything in the graph, and an AI's changes can be hard to undo. There is always [[Graph History]] if something disastrous happens
- Review what the assistant plans to write before confirming it.
- Blocks tagged `#.rm-hide` or `#.rm-private` are left out of what the read tools return. This is a convenience filter, not a security guarantee, because the raw query tool reads the database directly.

### Access and permissions

- Every connection authenticates with a token that carries only the scopes you approved. See [[Local API Tokens]].
- A connection can never do more than your own account can. If your access to a shared graph shrinks, so does the token's.
- Writes made through a connection are attributed to it, so version history shows what an AI changed.
  - Hover a bullet to see its author, and a query like `{{query: {by: [[Your Name (AI)]]}}}` collects everything an assistant has written in one place.
