# roam/js

- **Getting Started**
  - roam/js is a way to customize your Roam experience with javascript. 
  - To use roam/js create a block with `{{[[roam/js]]}}` in it, then indent underneath and create a javascript code block
    - Like this
    - {{[[roam/js]]}}
      - ```javascript
        console.log("hello world");```
    - Then, click "Yes, I know what I'm doing" to run the code block, open your browsers developer console to see the logged text
      - Clicking this only enables the javascript to run for you, it will not run for any other users on the graph without them also agreeing to run the javascript
  - roam/js blocks that are enabled **run automatically run on startup**
    - The order of operations is 
      - `Roam Depot extensions -> roam/js (or roam/cljs) -> roam/render components`
  - You have access to the [[Roam Alpha API]] in the window object, as well as a list of [[Available Libraries]] Roam exports to the window.
  - roam/js is most useful for developing a small script you expect to only run for yourself, if you want to distribute your extension, we recommend you develop a [[Roam Depot/Extensions]], which is similar, but has a different development process.
- **[[Examples]]**
  - A script that changes a graph's homepage to be a different page than daily notes
    - {{[[roam/js]]}}
      - ```javascript
        function isHomePage() {
          return ( window.location.hash.split("/")[3] == null );
        }

        if (isHomePage()) {
          window.roamAlphaAPI.ui.mainWindow
            .openPage({page: {title: "Developer Hub"}});
        }```
  - {{[[TODO]]}} More examples
