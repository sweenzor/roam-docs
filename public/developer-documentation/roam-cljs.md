# roam/cljs

- **Getting Started**
  - Equivalent to [[roam/js]] but language of choice is [[clojurescript]]
  - roam/cljs is a way to customize your Roam experience with clojurescript. 
  - To use roam/cljs create a block with `{{[[roam/cljs]]}}` in it, then indent underneath and create a clojure code block
    - Like this
    - {{[[roam/cljs]]}}
      - ```clojure
        (prn "hello world")```
    - Then, click "Yes, I know what I'm doing" to run the code block, open your browsers developer console to see the logged text
      - Clicking this only enables the clojurescript to run for you, it will not run for any other users on the graph without them also agreeing to run the javascript
  - roam/cljs blocks that are enabled **run automatically run on startup**
    - The order of operations is 
      - `Roam Depot extensions -> roam/js (or roam/cljs) -> roam/render components`
  - You have access to the [[Clojurescript API], [[Roam Alpha API]] in the window object, as well as a list of [[Available Libraries]] Roam exports to the window.
    - The [[Roam Clojurescript API]] is mostly a copy of the [[Roam Alpha API]] but with a few additions
  - roam/cljs is most useful for developing a small script you expect to only run for yourself, if you want to distribute your extension, we recommend you develop a [[Roam Depot/Extensions]], which is similar, but has a different development process.
    - It can also be useful to use roam/cljs to create "common" namespaces for use in [[roam/render]]
- **[[Examples]]**
  - A script that changes a graph's homepage to be a different page than daily notes
    - {{[[roam/cljs]]}}
      - ```clojure
        (ns examples.custom-homepage
          (:require
           [clojure.string :as str]
           [roam.main-window :as main-window]))

        (defn on-home-page? []
          (-> (str/split js/window.location.hash "/")
              (get 3)
              (= nil)))

        (when (on-home-page?)
          (main-window/open-page {:page {:title "Developer Hub"}}))```
  - Requiring code from other roam/cljs blocks
    - First click run on the example, `examples.custom-homepage`, above. The namespaces do not autoload 
    - {{[[roam/cljs]]}}
      - ```clojure
        (ns examples.internal-require
          (:require
           [examples.custom-homepage :as ch]))

        (prn (ch/on-home-page?))```
  - {{[[TODO]]}} More Examples
