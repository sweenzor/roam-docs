# Roam MCP

- Roam MCP connects AI tools like Claude and ChatGPT to your Roam graphs. The AI can search your notes, read pages, and write new blocks, within limits you choose.
- It's a hosted service, so it works from anywhere: the AI tool talks to Roam's servers, and your computer doesn't need to be on.
- For AI tools running on your own computer, there's also [[Local MCP]], which connects through the [[Desktop App]] instead. The local MCP offers more features and is recommended if working from desktop.
- [[Working with AI Tools]] covers the ground rules for every AI connection.

### In Claude

- Roam is in [Claude's connector directory](https://claude.ai/directory/connectors/roam-research).
- Click **Connect**, sign in with your Roam account, and pick which graphs Claude should use.

### In ChatGPT

- Roam lives under **Plugins** in ChatGPT: [the Roam Research app](https://chatgpt.com/plugins/plugin_asdk_app_6a32c0c428388191912577d648a44ba4).
- ChatGPT's menu calls these plugins and the listing calls itself an app. Same thing either way: it's Roam MCP underneath.
- Open it, connect your Roam account, and grant the graphs you want ChatGPT to use.

### In any other AI tool

- Roam MCP is a standard remote MCP server. In tools that let you add an MCP server by URL, use: `https://mcp.roamresearch.com/mcp`
- Signing in and choosing graphs works the same way from there.

### You stay in control

- Nothing is shared until you pick graphs, and each graph gets its own access level, from read-only up to full access.
- Every change the AI makes is attributed to a distinct "(AI)" author in your graph, so its edits are always easy to find and review.
- Adjust a graph's access or disconnect it at any time at [mcp.roamresearch.com/manage](https://mcp.roamresearch.com/manage).
- Roam's servers can't read [[Encrypted Graphs]], so neither can Roam MCP. You can still grant append-only capture into one, and for full access there's [[Local MCP]].
