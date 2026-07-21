# Roam CLI

- The Roam CLI runs the same tools as [[Local MCP]] as terminal commands: list graphs, search, read pages, and more.
- It's mainly for AI agents that work through shell commands instead of MCP, such as skill-based setups, and its output is formatted with that in mind. It can work for your own scripts too.
- Like the MCP server, it talks to your graphs through the [[Desktop App]], and it's documented in the [roam-tools repository](https://github.com/Roam-Research/roam-tools).

### Setting it up

- Install it globally: `npm install -g @roam-research/roam-cli`
- Run `roam connect` and approve the request in Roam Desktop.
  - Already connected [[Local MCP]]? Skip that step. The CLI shares the same connection and tokens.
- Update it the same way you installed it: `npm install -g @roam-research/roam-cli@latest`

### Using it

- `roam list-graphs` shows every graph you've connected.
- `roam search --query "my notes" --graph my-graph` searches a graph.
- The `--graph` flag is optional when you've only connected one graph, and nicknames work in place of graph names.
- The full, current command list is in the [roam-tools repository](https://github.com/Roam-Research/roam-tools).
- Usage guidelines shared by all the AI connections live at [[Working with AI Tools]].
