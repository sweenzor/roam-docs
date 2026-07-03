# Local API

- **__Just released, breaking changes might still happen__**
- The desktop app exposes a local HTTP API on port 3333 for external applications to interact with [[Roam Alpha API]].
- **Enable**
  - Open the desktop app
  - Open settings menu and enable
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FCwkAs7bG3T.png?alt=media&token=4ed8739d-6247-4f9e-924d-127e66f31186)
- **Port & Last Graph Discovery**
  - The port is usually 3333, but if that port is taken we increment until we find a usable port.
  - Read `~/.roam-local-api.json` to discover the port and last opened graph:
    - ```javascript
      {
        "port": 3333,
        "last-graph": "my-graph-name"
      }```
    - `port` - the current API port (may be stale if app is not running)
    - `last-graph` - the most recently opened graph name
  - This file persists when the app closes, so check if the port is responsive before using it
- **Endpoints**
  - **Execute API action**
    - ```plain text
      POST http://localhost:3333/api/:graph-name
      Content-Type: application/json

      {"action": "...", "args": [...]}```
    - `action` - the [[Roam Alpha API]] method path (e.g., `data.q`, `data.block.create`)
    - `args` - array of arguments to pass to the method
    - **Examples**
      - Query all page titles:
        - ```shell
          curl -X POST http://localhost:3333/api/my-graph \
          -H "Content-Type: application/json" \
          -d '{"action": "data.q", "args": ["[:find ?title :where [?e :node/title ?title]]"]}'```
      - Create a block:
        - ```shell
          curl -X POST http://localhost:3333/api/my-graph \
          -H "Content-Type: application/json" \
          -d '{"action": "data.block.create", "args": [{"location": {"parent-uid": "abc123", "order": 0}, "block": {"string": "Hello"}}]}'```
    - **Response**
      - Success: `{"success": true, "result": [...]}`
      - Error: `{"success": false, "error": "Local API is disabled. Enable it in Settings menu."}`
  - **List open graphs**
    - ```plain text
      GET http://localhost:3333/api/graphs/open```
    - Returns graphs currently open in the desktop app
    - **Example**
      - ```shell
        curl http://localhost:3333/api/graphs/open```
    - **Response**
      - Success: `{"success": true, "result": [{"name": "my-graph", "type": "hosted"}, ...]}`
      - `type` is either `"hosted"` or `"offline"`
  - **List available graphs**
    - ```plain text
      GET http://localhost:3333/api/graphs/available```
    - Returns all graphs the user has access to
    - Requires at least one graph window to be open
    - **Example**
      - ```shell
        curl http://localhost:3333/api/graphs/available```
    - **Response**
      - Success: `{"success": true, "result": [...]}`
      - Error (no window open): `{"success": false, "error": "No graph window open. Please open a graph first."}`
