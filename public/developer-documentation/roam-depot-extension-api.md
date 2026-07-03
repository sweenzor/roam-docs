# Roam Depot/Extension API

- Work in progress, for now see https://github.com/panterarocks49/settings-panel-example/blob/main/extension.js for an example of how to use it
- Roam handles removing dom elements / settings set with the extension API
- **methods**
  - `extensionAPI`
    - `.settings`
      - Settings are scoped to your extension, there is no risk of it conflicting with another extension
        - They are persisted across devices as well
      - `.set`
        - key
        - value
      - `.get`
        - key
      - `.getAll`
      - `.panel`
        - `.create`
          - config
          - **Note regarding "id" in a setting**: they must be non-empty strings and can't contain ".", "#", "$", "[", or "]"
          - Example::
            - ```javascript
              function reactButton() {
                  // Declare a new state variable, which we'll call "count"
                  const [count, setCount] = React.useState(0);

                  return (
                      React.createElement(
                          "button",
                          {className: "bp3-button",
                           onClick: () => setCount(count + 1)},
                          "my button " + count
                      )
                  );
              }

              // actions that are predefined save there state automatically (except button) underneath the id provided for the action
              // custom actions can save state with extensionAPI.settings.set / get / getAll
              const panelConfig = {
                  tabTitle: "Test Ext 1",
                  settings: [
                      {id:          "button-setting",
                       className:   "ext-settings-panel-button-setting",
                       name:        "Button test",
                       description: "tests the button",
                       action:      {type:    "button",
                                     onClick: (evt) => { console.log("Button clicked!"); },
                                     content: "Button"}},
                      {id:          "switch-setting",
                       name:        "Switch Test",
                       description: React.createElement("a", {href: "https:roamresearch.com"}, "Show off react components in the description"),
                       action:      {type:     "switch",
                                     onChange: (evt) => { console.log("Switch!", evt); }}},
                      {id:     "input-setting",
                       name:   "Input test",
                       action: {type:        "input",
                                placeholder: "placeholder",
                                onChange:    (evt) => { console.log("Input Changed!", evt); }}},
                      {id:     "select-setting",
                       name:   "Select test",
                       action: {type:     "select",
                                items:    ["one", "two", "three"],
                                onChange: (evt) => { console.log("Select Changed!", evt); }}},
                      {id:     "reactComponent-setting",
                       name:   "reactComponent test",
                       action: {type:     "reactComponent",
                                component: reactButton}}
                  ]
              };```
            - For an example config see https://github.com/panterarocks49/settings-panel-example/blob/main/extension.js
    - `.ui`
      - `.commandPalette`
        - `.addCommand`
          - same as window.roamAlphaAPI.ui.commandPalette.addCommand (please follow the link for documentation)
            - only difference is: when you use this version from extensionAPI, the commands are associated with your extension and so you have convenient grouping (in for example the Hotkeys window)
          - [[Migration Guide]] from roamAlphaAPI.ui.commandPalette.addCommand to extensionAPI's version
            - [[Loom video]]: 
              {{[[video]]: https://www.loom.com/share/f51a889a8e444ceb8c8eab15654d2650}}
        - `.removeCommand`
          - same as window.roamAlphaAPI.ui.commandPalette.removeCommand (please follow the link for documentation)
            - in contrast to the roamAlphaAPI's version, you do not need to call this on `onunload` - if you call via extensionAPI, will be cleaned automatically on unload
- **Changelog**:
  - [[February 14th, 2023]]
    - [[Roam Depot/Extension API]]
