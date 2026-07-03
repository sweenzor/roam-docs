# iFrame Components

#### **Important Note: ** This is [[Depreciated]], it still most likely works but we will not be continuing it's development

### Overview

- With iFrame Components, you can develop custom interfaces, widgets, and data visualizations in any framework and host on your own server. The components get iframed into a Roam block, and through message passing, have access to a limited subset of graph data, and the ability to write/edit the blocks nested below itself.

### Examples

- Spreadsheet-like table with data stored in blocks nested below
  - {{iframe-component: https://iframe.stianhaklev.repl.co/spreadsheet | 3x3}}
    - A1: 30
    - B1: 40
    - C1: 50
    - B3: 90
- Word cloud of RoamAlphaAPI methods
  - test {{iframe-component: https://iframe.stianhaklev.repl.co/wordcloud Reference::}} it 
  - 
- Very simple chat
  - {{iframe-component: https://iframe.stianhaklev.repl.co/chat}}
    - Buzz Lightyear: Hello
    - Other user: Nice to meet you!
    - Baibhav Bista: test
- You can find the source of these examples [here](https://github.com/houshuang/iframe) . These are hosted on [[Repl.it]], but could be hosted anywhere. (If you host on repl.it, make sure to make your repo "always on")

### How to use in a Roam graph

- The syntax is `{{iframe-component: URL [block-refs] | [options]}}`
- The minimum is just iframe-component, followed by a URL. 
  - You can optionally specify one or more block-references separated by a space, like in the word cloud example above
  - You can optionally specify one or more queries separated by a space, like this: `{and: {[[Food]] not: [[Vegetarian]]}}`.
    - So a full example of using invoking the word cloud with a query would look like 
      - `{{iframe-component: https://iframe.stianhaklev.repl.co/wordcloud {and: [[parameters]]} }}`
        - {{iframe-component: https://iframe.stianhaklev.repl.co/wordcloud {and: [[Roam Alpha API]]}}}
  - You can optionally add options after a vertical bar (|), as in the spreadsheet example above
- Permissions::
  - Components always have read and write access to the blocks nested below them. 
  - In addition, they have read access to all blocks-with-children that are specified as block references when invoking a component.
  - In the examples above, the spreadsheet only has read and write access to the data nested below, whereas the word cloud has read access to the block reference that is provided, and could additionally store data in the blocks nested below.
  - Components are also able to zoom in on a block in the main window, or open a block in the right sidebar, functionality that would typically be tied to clicking/shift-clicking on the representation of a block.

### How to develop an iFrame Component

- iFrame Components are simply "small websites" served inside iFrames. These can be written using any JS framework, or even in a language that compiles to JS, and hosted anywhere. Because of iFrame isolation, they do not have access to manipulate the Roam DOM or call the [[Roam Alpha API]], like [[roam/js]] can. However, through message passing using `postMessage`, they receive data about the relevant subset of blocks, and can call a number of API functions.
- Iframe Resizer::
  - In order for Roam to be able to automatically resize the iFrame according to the content, you need to include the [[iframe-resizer]] contentwindow.min.js script ([link](https://raw.githubusercontent.com/davidjbradshaw/iframe-resizer/master/js/iframeResizer.contentWindow.min.js)) on any page you serve. 
    - For [[Create React App]], you can just copy this file to the public folder, and include this in your index.html:
      - ```javascript
        <script src="%PUBLIC_URL%/iframeResizer.contentWindow.min.js"/></script>```
- Options::
  - Any options written after the `|` are passed in the URL parameter `opts`, so the actual URL called for the spreadsheet above, which is invoked using `{{iframe-component: https://iframe.stianhaklev.repl.co/spreadsheet | 3x3}}` is actually `https://iframe.stianhaklev.repl.co/spreadsheet?opts=3x3`
- Communications::
  - All communication with Roam happens through `postMessage`. 
    - All API calls consist of an object with a type, and other keys depending on the type.
    - When the component has loaded and is ready, it should begin by sending the "ready" message.
      - ```javascript
        window.parent.postMessage({ type: "roamIframeAPI.ready" }, "*");```
    - Receiving data::
      - Once Roam has received the ready signal, it will send the first data. The iFrame component will need to listen using `addEventListener("message)`. 
        - Example::
          - ```javascript
            window.addEventListener("message", (e) => {
              if (!typeof e.data === "object" || !e.data["roam-data"]) {
                return;
              }
              // do things with e.data
            }```
      - After the initial data is sent, the full data will be sent again whenever there is a change in one of the blocks subscribed to. 
    - Structure of the roam-data object::
      - keys::
        - blocks-below:: iframe component block-and-children
        - block-refs:: array of block-and-children for each block ref
        - queries:: Object, where keys are the queries, and values is an array of blocks with children
        - user::
          - display-name:: display name or "anonymous"
          - uid:: unique user id
      - Example::
        - chat above
          - ```javascript
            {
                "blocks-below": {
                    "order": 0,
                    "uid": "diqQJPCS1",
                    "string": "{{iframe-component: https://iframe.stianhaklev.repl.co/chat}}",
                    "id": 1392,
                    "children": [
                        {
                            "order": 0,
                            "uid": "W5RHM_o56",
                            "string": "Buzz Lightyear: Hello",
                            "id": 1396
                        },
                        {
                            "order": 1,
                            "uid": "SAbdRqJJ8",
                            "string": "Other user:Nice to meet you!",
                            "id": 1397
                        }
                    ]
                },
                "block-refs": [],
                "user": {
                    "display-name": "Buzz Lightyear",
                    "uid": "fsgfsfsgT5FZQdzAI7P40aB3"
                }
            }```
        - word cloud above
          - ```javascript
            {
                "blocks-below": {
                    "order": 0,
                    "uid": "diqQJPCS1",
                    "string": "{{iframe-component: https://iframe.stianhaklev.repl.co/chat ((jg94ngNDd))}}",
                    "id": 1392
                },
                "block-refs": [
                    {
                        "order": 1,
                        "uid": "jg94ngNDd",
                        "string": "The minimum is just iframe-component, followed by a URL. ",
                        "id": 1338,
                        "children": [
                            {
                                "order": 0,
                                "uid": "gnglVpCCV",
                                "string": "You can optionally specify one or more block-references separated by a space, like in the word cloud example above",
                                "id": 1337
                            },
                            {
                                "order": 1,
                                "uid": "j13RVmFat",
                                "string": "You can optionally add options after a vertical bar (|), as in the spreadsheet example above",
                                "id": 1339
                            }
                        ]
                    }
                ],
                "user": {
                    "display-name": "Buzz Lightyear",
                    "uid": "sdfsdfsdfVlT5FZQdzAI7P40aB3"
                }
            }```
  - RoamIframeAPI::
    - The API methods follow the format of [[Roam Alpha API]] closely.
    - `.block`
      - `create`
        - Description::
          - Creates a new block at a location
        - Parameters::
          - `location`
            - `parent-uid` **optional** defaults to the Iframe Component block. __Must be a descendant of the Iframe Component block.__
            - `order` **optional** defaults to "last"
          - `block`
            - `string` **required**
            - `uid` **optional**
        - Usage::
          - [[roam/js]]
            - ```javascript
              window.parent.postMessage({ 
                  type: "roamIframeAPI.data.block.create", 
                  block: {string: changeCell.key+': '+ 
                          updatedCell.value }}, "*");```
      - `move`
        - Description::
          - Move a block to a new location
        - Parameters::
          - `location`
            - `parent-uid` **required** __Must be a descendant of the Iframe Component block.__
            - `order` **required**
          - `block`
            - `uid` **required** __Must be a descendant of the Iframe Component block.__
      - `update`
        - Description::
          - Updates a block's text and/or collapsed state
        - Parameters::
          - `block`
            - `uid` **required** __Must be a descendant of the Iframe Component block.__
            - `string` **optional**
            - `open` **optional**
      - `delete`
        - Description::
          - Delete a block and all its children, and recalculates order of sibling blocks
        - Parameters::
          - `block`
            - `uid` **required** __Must be a descendant of the Iframe Component block.__
    - `.right-sidebar`
      - `.add-window`
        - Description::
          - Adds a window to the right sidebar. If the sidebar is closed, opens it.
        - Parameters::
          - `window`
            - `type`
              - Required
              - Can be one of:
                - "mentions"
                - "block"
                - "outline"
                - "graph"
            - `block-uid`
              - Required 
        - Usage::
          - [[roam/js]]
            - ```javascript
              window.parent.postMessage({ 
                type: "roamIframeAPI.ui.right-sidebar.add-window", 
                window: {"block-uid":  targetBlock.uid , 
                         "type": "block"}}, "*");```
    - `.main-window`
      - `.zoom-block`
        - Description::
          - Zooms the main window into a specific block UID. (Like clicking on a bullet).
        - Parameters::
          - `block`
            - `uid` **required**
