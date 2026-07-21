# Local MCP

- The local MCP server connects AI tools running on your computer, like Claude Desktop, Claude Code, Codex, or Cursor, to your graphs through the [[Desktop App]].
- Nothing passes through Roam's servers, so it works fully with [[Encrypted Graphs]] and with a [[Local Graph]].
- To reach your graphs from anywhere, with no desktop app running, use [[Roam MCP]] instead.
- The [[Roam CLI]] runs the same tools as terminal commands, for AI agents that work through the shell instead of MCP.
- The full documentation lives in the [roam-tools repository](https://github.com/Roam-Research/roam-tools).

### Requirements

- Node.js 18 or later.
- The [[Desktop App]]. The local API isn't available in the web version.

### Setting it up

- The easy way: if your AI tool can run commands (Claude Code, Codex, Cursor), give it the [roam-tools repository](https://github.com/Roam-Research/roam-tools) link and ask it to set up the Roam MCP server for you.
- To do it by hand instead: add the server to your tool. For Claude Code that's one command: `claude mcp add -s user roam-mcp -- npx -y @roam-research/roam-mcp` (Config snippets for Claude Desktop and other tools are in the [repository README](https://github.com/Roam-Research/roam-tools).)
- Then ask the AI to connect your graph. No command needed: the server has a tool for connecting graphs, and Roam Desktop will ask you to approve.
- Either way, connecting a graph ends with an approval request in Roam Desktop, naming the tool and the graph. Approving creates a [[Local API Tokens]].
- If Roam isn't running when a tool calls, the server launches the desktop app for you and retries.
- Before letting an AI loose on a real graph, read [[Working with AI Tools]].
