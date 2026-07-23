# Roam Depot/Extension API

- **Extension lifecycle**
  - Your `extension.js` must default-export an object with `onload` and `onunload` functions
  - `onload({extensionAPI, extension})` runs when the extension is enabled, and again on every app load while it stays enabled
    - `extensionAPI` — the API documented on this page, scoped to your extension; it is only passed here, not available on `window`
    - `extension.version` (string) — the installed version of your extension
    - `onload` may return a cleanup function — it is called at unload, right before `onunload`
    - an async `onload` works too — Roam awaits a returned Promise (logging any error), and if it resolves to a function, that function is the cleanup
  - `onunload()` runs when the extension is disabled, uninstalled, updated, or reloaded
  - If your extension ships an `extension.css`, it is injected automatically on load and removed on unload
  - What Roam cleans up automatically on unload (no code needed in `onunload`):
    - commands added via `extensionAPI.ui.commandPalette` and `extensionAPI.ui.slashCommand`
    - the settings panel
    - your `extension.css`
    - everything else — DOM elements, event listeners, intervals — is your responsibility in `onunload`
  - Example::
    - ```javascript
      export default {
        onload: ({ extensionAPI, extension }) => {
          console.log("loading version", extension.version);
          extensionAPI.ui.commandPalette.addCommand({
            label: "My Extension: Say hi",
            callback: () => console.log("hi")});
          // optionally return a cleanup function;
          // it runs at unload, right before onunload
        },
        onunload: () => {
          // undo anything not covered by automatic cleanup
          // (DOM nodes, event listeners, intervals, ...)
        }
      };```
- **Reference**
  - `extensionAPI.settings`
    - Description::
      - Persistent key-value storage scoped to your extension — keys cannot collide with other extensions
      - values are saved with the graph and sync across the user's devices
      - setting keys must be non-empty strings and cannot contain ".", "#", "$", "[", or "]"
    - `extensionAPI.settings.canSet` (boolean) — false when the extension was installed "for everyone" by the graph admin and the current user is not an admin; then `set` only logs a warning and changes nothing
    - `extensionAPI.settings.get`
      - Description::
        - Returns the saved value for a setting key
      - Parameters::
        - `key` (string, required) — the setting to read
      - Return::
        - the saved value, or null if never set
      - Example::
        - ```javascript
          extensionAPI.settings.get("api-key")
          // => "sk-abc123"```
    - `extensionAPI.settings.set`
      - Description::
        - Saves a value for a key
      - Parameters::
        - `key` (string, required) — non-empty, cannot contain ".", "#", "$", "[", or "]"
        - `value` (required) — any JSON-serializable value
      - Return::
        - Promise resolving to null
        - rejects if `key` is invalid; if the user cannot write settings (`canSet` is false), it only logs a warning
      - Example::
        - ```javascript
          await extensionAPI.settings.set("threshold", 5)
          // => null```
    - `extensionAPI.settings.getAll`
      - Description::
        - Returns all of the extension's saved settings
      - Return::
        - an object of key → value, or null if nothing has been saved yet
      - Example::
        - ```javascript
          extensionAPI.settings.getAll()
          // =>
          // {"api-key": "sk-abc123",
          //  "threshold": 5,
          //  "sync-enabled": true}```
    - `extensionAPI.settings.panel.create`
      - Description::
        - Creates a settings tab for your extension in the Settings dialog
        - calling it again replaces the panel
        - switch, input, and select rows save their state automatically under the row's `id` — read it back with `extensionAPI.settings.get`; button and reactComponent rows save nothing themselves
      - Parameters::
        - `config` (map, required)
          - `tabTitle` (string) — the title of your extension's tab in Settings
          - `settings` (array of maps) — one entry per settings row:
            - `id` (string, required) — the storage key for the row; non-empty, cannot contain ".", "#", "$", "[", or "]"
            - `name` (string | React element) — the row's title
            - `description` (string | React element, optional) — shown under the name
            - `className` (string, optional) — extra CSS class on the row
            - `action` (map, required) — the control, one of:
              - `{type: "switch", onChange}` — a toggle; saved on change; onChange (optional) receives the DOM event
              - `{type: "input", placeholder, onChange}` — a text field; saved on blur; onChange (optional) fires on each keystroke with the event
              - `{type: "select", items, onChange}` — a dropdown; items is an array of strings; saved on selection; onChange (optional) receives the selected item
              - `{type: "button", content, onClick, class}` — a button; content is the label, onClick (optional) the click handler, class (optional) replaces the default button styling
              - `{type: "reactComponent", component}` — renders your React component; manage state yourself with `extensionAPI.settings.set`/`get`
      - Return::
        - Promise resolving to null
        - rejects if any setting `id` is invalid
      - Example::
        - ```javascript
          await extensionAPI.settings.panel.create({
            tabTitle: "My Extension",
            settings: [
              {id:          "sync-enabled",
               name:        "Sync",
               description: "Sync data automatically",
               action:      {type:     "switch",
                             onChange: (evt) => console.log("switch:", evt.target.checked)}},
              {id:     "api-key",
               name:   "API key",
               action: {type:        "input",
                        placeholder: "paste your key",
                        onChange:    (evt) => console.log("typing:", evt.target.value)}},
              {id:     "mode",
               name:   "Mode",
               action: {type:     "select",
                        items:    ["fast", "thorough"],
                        onChange: (item) => console.log("selected:", item)}},
              {id:     "reset",
               name:   "Reset",
               action: {type:    "button",
                        content: "Reset all data",
                        onClick: () => console.log("clicked")}}
            ]
          })
          // => null```
  - `extensionAPI.ui`
    - `extensionAPI.ui.commandPalette.addCommand`
      - Description::
        - Add a command to the Command Palette (cmd-p) — same as `roamAlphaAPI.ui.commandPalette.addCommand`, but tied to your extension:
          - commands are grouped under your extension (for example in the Hotkeys window)
          - the label is namespaced by your extension, so it cannot collide with other extensions' commands
        - Calling again with the same `label` updates the existing command
      - Parameters::
        - `label` (string, required) — text shown in the Command Palette
        - `callback` (function, required) — called with no arguments when the user runs the command
        - `disable-hotkey` (boolean, optional) — don't allow a hotkey for this command
        - `default-hotkey` (string | array of strings, optional) — most commands should NOT set this; without it, users can still assign their own hotkey in Settings → Hotkeys
          - a hotkey string looks like "defmod-shift-h" — at least one modifier (shift, ctrl, alt, super, or defmod — the OS default modifier) plus a key; an array of strings (max 5) defines a multi-step hotkey
      - Return::
        - Promise resolving to null
      - Example::
        - ```javascript
          await extensionAPI.ui.commandPalette.addCommand({
            label: "My Extension: Do the thing",
            callback: () => console.log("doing the thing")})
          // => null```
    - `extensionAPI.ui.commandPalette.removeCommand`
      - Description::
        - Remove a command your extension added — same as `roamAlphaAPI.ui.commandPalette.removeCommand`
      - Parameters::
        - `label` (string, required) — the label the command was added with
      - Return::
        - Promise resolving to null
      - Example::
        - ```javascript
          await extensionAPI.ui.commandPalette.removeCommand(
            {label: "My Extension: Do the thing"})
          // => null```
    - `extensionAPI.ui.slashCommand.addCommand`
      - Description::
        - Add a command to the `/` slash menu — same as `roamAlphaAPI.ui.slashCommand.addCommand`, but tied to your extension:
          - the label is namespaced by your extension, so it cannot collide with other extensions' commands
        - Calling again with the same `label` updates the existing command
      - Parameters::
        - `label` (string, required) — text shown in the slash menu
        - `callback` (function, required)
          - called with a context object when the user selects the command
            - ```javascript
              {"block-uid": "YnatnbZzF",
               "window-id": "BBG4fFwolaVlT5FZQdzAI7P40aB3-body-outline-04-15-2021",
               indexes: [1, 10]}```
          - return a string to insert at the cursor, or null to handle insertion yourself (the typed search string is not removed)
        - `display-conditional` (function, optional) — called with the context object (without indexes); return true to show the command
      - Return::
        - null
      - Example::
        - ```javascript
          extensionAPI.ui.slashCommand.addCommand({
            label: "Insert Greeting",
            callback: (context) => "Hello from my extension! 👋"})
          // => null```
    - `extensionAPI.ui.slashCommand.removeCommand`
      - Description::
        - Remove a slash command your extension added — same as `roamAlphaAPI.ui.slashCommand.removeCommand`
      - Parameters::
        - `label` (string, required) — the label the command was added with
      - Return::
        - null
      - Example::
        - ```javascript
          extensionAPI.ui.slashCommand.removeCommand(
            {label: "Insert Greeting"})
          // => null```
