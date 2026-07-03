# Yet-to-release updates

- if you run into issues with any of the following, please contact me (Baibhav Bista) on the [[Roam Public Slack]] or post on the #developers channel there
- IN THE WORKS
  - [[Roam Alpha API]] function that gives parsed markdown string for a block (with children blocks)
    - deployment to test in:: https://relemma-git-roamalphapi-getmarkdownstring.roamresearch.com/
    - `window.roamAlphaAPI``.data``.block`
      - `.getParsedMarkdownString`
        - Description::
          - Get parsed markdown string for a block (and optionally, it's children)
          - "parsed" meaning that block refs are resolved to their strings (and block embeds to their block trees!)
          - am not sure I like the shape of the API right now. Let me know if you have any feedback
          - Can't be used for page uids.
            - If you want to get md string for a page, You want to get :block/children for the page, sort them by :block/order and then call this fn for each :block/uid in that ordered list.
            - Why not for pages?
              - pages are slightly but confusingly different because there is no standard to include the page title
                - so page md exports will not include the :node/title
                - however, we want block md exports to include the :block/string
        - Parameters::
          - arg 1: `block-uid`
            - Type::
              - Block / page's uid
          - arg 2: `childrenDepth`
            - can be one of
              - true
                - give me all nested children
              - false
                - do not give me children
              - positive integer
                - give me children upto this depth
    - Example::
      - ```javascript
        console.log(
          window.roamAlphaAPI.data.block.getParsedMarkdownString("rT56JCmqH", true)
        );

        console.log(
          window.roamAlphaAPI.data.block.getParsedMarkdownString("rT56JCmqH", false)
        );

        console.log(
          window.roamAlphaAPI.data.block.getParsedMarkdownString("rT56JCmqH", 3)
        );
        ```
- ARCHIVE
  - isolate Depot extensions to platforms #.rm-falsified
    - Falsified due to:: we will have a native mobile app and they will not run custom code at all
    - deployment to test in:: https://relemma-git-feat-roam-depot-enabled-platforms.roamresearch.com/
      - if you run into issues with any of the following, please contact me (Baibhav Bista) on the [[Roam Public Slack]] or post on the #developers channel there
    - [[Loom video]] (a bit outdated regarding the options)
      - {{[[video]]: https://www.loom.com/share/9adff7cbbf104c17815849a589693aaa}}
    - Basic idea is more for users to be able to isolate Roam depot extensions to certain platforms
      - some examples
        - users might not want to/need to have power-user like extensions like "Workbench" in mobile
          - well to be frank, I don't know if one would want to have "Workbench" in mobile or if it has mobile targeted features. I included it because it was the first thing I thought of when thinking about extensions for power users
        - users might have extensions meant for mobile which do not make sense to be run in browser, like "Mobile Gesture Actions"
    - Options are:
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FI0qVg3f6Ua.png?alt=media&token=16c10b0d-8fbe-441f-b222-98730da96e39)
      - All devices
        - enabled on everything
      - Mobile Only
        - Allows for mobile devices (but not tablets)
        - should work both for the mobile app and for mobile site
        - Tablets are removed from this criteria by checking for if the userAgent includes "iPad" or "Tablet" or if it includes "Android' but not "Mobile"
      - Desktop & Tablets
        - essentially the negation of the "Mobile Only" option
    - Extensions are allowed to have defaults
      - if no default is set or invalid default is provided, it defaults to "all"
      - Assumption is that very few extensions will have to set defaults
        - only few like "Mobile Gesture Actions"  might want to
      - Extension devs can select default for their extension in metadata json i.e. in `roam-depot-repo/extensions/github-username/extension-name.json` as "default-enabled-platforms"
        - Options::
          - "all"
          - "desktop-and-tablets"
          - "only-mobile"
      - default value is signified in the settings, so the user knows the default recommended value for the extension
