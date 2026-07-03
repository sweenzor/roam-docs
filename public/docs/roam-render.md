# roam/render

- **Getting Started**
  - roam/render is a way to write custom inline components like Roam's `{{}}`
  - roam/render components can be written in [[clojurescript]], [[JavaScript]], or [[jsx]]
    - currently clojurescript has the best support
  - To use roam/render, create a clojure (or js or jsx) code block, copy a reference to the block, create a new bock and type `{{roam/render: ((<block-reference>))}}`.
    - like this
    - ```clojure
      (defn hello-world []
        [:div
         {:style {:color "blue"}}
         "hello world"])```
    - `{{roam/render: ((uD2gB7Qvh))}}`
    - {{roam/render: ```clojure
      (defn hello-world []
        [:div
         {:style {:color "blue"}}
         "hello world"])```}}
      - If you haven't enabled custom components yet, click the link above to turn it on in settings
  - In clojurescript, you have access to the [[Roam Clojurescript API]] as well as the [[Roam Alpha API]] (although the clojurescript API is mostly a copy / paste of the roam alpha)
    - You can also use [[Available Libraries]] from the window object, some of these are wrapped in a namespace like blueprint for ease of use, but you may use the others by just getting them from the window object
  - In js and jsx, you will only have access to the [[Roam Alpha API]] and [[Available Libraries]]
  - The best way to get started is to try out a few of our **[[Examples]]** below, and read up on the API pages to see the functions available to you.
  - Don't hesitate to [[Contact Us]] with any questions or [[Feature Requests]] you have
- **[[Resources]]**
  - [[Roam Clojurescript API]]
  - [A closer look at roam/render](https://www.zsolt.blog/2021/02/a-closer-look-at-roamrender.html) by [[Zsolt Viczian]] #Community #Article
  - [Creating Reagent Components](https://github.com/reagent-project/reagent/blob/master/doc/CreatingReagentComponents.md)
- **[[Examples]]**
  - [[clojurescript]]
    - Hello World
      - Code::
        - ```clojure
          (ns dev-docs.hello-world)

          (defn main []
            [:h1 "Hello world from CLJS"])```
      - Output::
        - `{{roam/render: ((ltUELYamK))}}`
        - {{roam/render: ```clojure
          (ns dev-docs.hello-world)

          (defn main []
            [:h1 "Hello world from CLJS"])```}}
    - Argument Parsing #[[Important Note]]
      - Code::
        - ```clojure
          (defn main-args-1 [{:keys [block-uid]} & args]
            [:div
             [:h1 (str block-uid ": args: ")]
             [:ul
              (for [arg args]
                [:li (pr-str arg)])]])```
      - Output::
        - {{roam/render: ```clojure
          (defn main-args-1 [{:keys [block-uid]} & args]
            [:div
             [:h1 (str block-uid ": args: ")]
             [:ul
              (for [arg args]
                [:li (pr-str arg)])]])``` "arg-1" 2 [[test args]] test block args}}
    - Displaying strings with Roam's markdown parser
      - Code::
        - ```clojure
          (ns dev-docs.parse-example
            (:require [roam.util :refer [parse]]))

          (defn main []
            [parse "**apple** __banana__ [[test-parse]]"])```
      - Output::
        - `{{[[roam/render]]: ((uUxqZ4Bwb))}}`
        - {{[[roam/render]]: ```clojure
          (ns dev-docs.parse-example
            (:require [roam.util :refer [parse]]))

          (defn main []
            [parse "**apple** __banana__ [[test-parse]]"])```}}
    - Rendering latex equations and splitting code files into multiple blocks #[[Important Note]]
      - Description::
        - Code for a roam/render component does not have to live inside a single block. Roam will look for sibling code blocks to the block referenced, concatenate those together and evaluate everything. 
          - **Only sibling blocks are part of the same file, not children blocks**
        - The block that you referenced will be the function that is run in the roam/render component
        - You can even intersperse the components between the code blocks. This is particularly useful for [[explorable explanation]] style tutorials
      - ```clojure
        (ns katex-example
          (:require
           [reagent.core :as r]
           [roam.katex :as katex]))```
      - ```clojure
        (defn inline-example []
          (let [*val (r/atom "")]
            (fn []
              [:div
               [:input
                {:value @*val
                 :on-change #(reset! *val (.. % -target -value))}]
               [:div
                "Inline katex: "
                [katex/inline
                @*val]]])))```
      - `{{roam/render: ((ydU0Dpoq_))}}`
      - {{roam/render: ```clojure
        (defn inline-example []
          (let [*val (r/atom "")]
            (fn []
              [:div
               [:input
                {:value @*val
                 :on-change #(reset! *val (.. % -target -value))}]
               [:div
                "Inline katex: "
                [katex/inline
                @*val]]])))```}}
      - ```clojure
        (defn block-example []
          (let [*val (r/atom "")]
            (fn []
              [:div
               [:input
                {:value @*val
                 :on-change #(reset! *val (.. % -target -value))}]
               [:div
                "Block katex: "
                [katex/block
                @*val]]])))```
      - `{{roam/render: ((cF6Xzv0bd))}}`
      - {{roam/render: ```clojure
        (defn block-example []
          (let [*val (r/atom "")]
            (fn []
              [:div
               [:input
                {:value @*val
                 :on-change #(reset! *val (.. % -target -value))}]
               [:div
                "Block katex: "
                [katex/block
                @*val]]])))```}}
    - Get all blocks on a page that reference another page #[[Important Note]]
      - Description::
        - `roam.datascript.reactive` is identical to `roam.datascript` except that every function returns a reagent reactions, which updates when the result of the query or pull changes.
        - Take note of the use of `r/with-let` below. Any time you use `r/atom` or any function from `roam.datascript.reactive` you should define it inside of a [form 2 or form 3 component](https://github.com/reagent-project/reagent/blob/master/doc/CreatingReagentComponents.md#form-2--a-function-returning-a-function)
          - Not using form 2 or form 3 components can lead to unnecessary rerenders and even infinite loops!
      - Code::
        - ```clojure
          (ns dev-docs.get-page-blocks-with-tag
            (:require
             [roam.datascript.reactive :as dr]
             [roam.util :as u]
             [roam.ui.main-window :as main-window]
             [reagent.core :as r]))```
        - ```clojure
          (defn track-blocks-with-tag-on-page [tag-uid page-uid]
            (dr/q
              '[:find (pull ?page-block [:block/uid :block/string])
                :in $ ?tag-uid ?page-uid
                :where
                [?tag-e :block/uid ?tag-uid]
                [?page-e :block/uid ?page-uid]
                [?page-block :block/page ?page-e]
                [?page-block :block/refs ?tag-e]]
              tag-uid
              page-uid))```
        - ```clojure
          (defn main [{:keys [block-uid]} [_ tag-uid] [_ page-uid]]
            (r/with-let [*blocks (track-blocks-with-tag-on-page tag-uid page-uid)]
              (into [:ul]
                (keep (fn [[{:keys [block/string block/uid]}]]
                        (when (not= uid block-uid)
                          [:li
                           {:style {:cursor "pointer"}
                            :on-click (fn []
                                        (main-window/open-block
                                          {:block {:uid uid}}))}
                           [u/parse string]])))
                @*blocks)))```
      - Output::
        - `{{roam/render: ((o5wWBZxdg))}}`
        - {{roam/render: Code:: [[Important Note]] [[roam/render]]}}
    - List public vars of a namespace using [ns-publics](https://clojuredocs.org/clojure.core/ns-publics)
      - Description::
        - `ns-publics` can be useful when trying to figure out what a namespace exports. In this example we pass in a `ns-name` and display all of the functions / vars in a namespace
      - Code::
        - ```clojure
          (ns ns-vars-lister
            (:require [reagent.core]))

          (defn main [{:keys [block-uid]} ns-name]
            (let [ns-symbol (symbol ns-name)]
              [:div [:div
                     [:h3 "public vars of ns: " (pr-str ns-symbol)]
                     [:div (map
                            (fn [n] [:div (pr-str n)])
                            (->> (ns-publics ns-symbol)
                                 (seq)
                                 (sort)))]]]))```
      - Output::
        - `{{roam/render: ((r47yvGHoi)) "reagent.core"}}`
        - {{roam/render: ```clojure
          (ns ns-vars-lister
            (:require [reagent.core]))

          (defn main [{:keys [block-uid]} ns-name]
            (let [ns-symbol (symbol ns-name)]
              [:div [:div
                     [:h3 "public vars of ns: " (pr-str ns-symbol)]
                     [:div (map
                            (fn [n] [:div (pr-str n)])
                            (->> (ns-publics ns-symbol)
                                 (seq)
                                 (sort)))]]]))``` "reagent.core"}}
    - `instaparse.core` readme example
      - Code::
        - ```clojure
          (ns developer-documentation.test-instaparse.1
            (:require 
             [reagent.core :as r]
             [roam.block :as block]
             [blueprintjs.core :as bp-core]
             [cljs.pprint :refer [pprint]]
             [instaparse.core :as insta]))

          (def as-and-bs
            (insta/parser
              "S = AB*
               AB = A B
               A = 'a'+
               B = 'b'+"))

          (defn main [{:keys [block-uid]}]
            [:button 
             {:on-click 
              #(pprint (as-and-bs "aaaaabbbaaaabb"))} "Click me!"])```
      - Output::
        - `{{[[roam/render]]: ((6DXyUOHhH))}}`
        - {{[[roam/render]]: ```clojure
          (ns developer-documentation.test-instaparse.1
            (:require 
             [reagent.core :as r]
             [roam.block :as block]
             [blueprintjs.core :as bp-core]
             [cljs.pprint :refer [pprint]]
             [instaparse.core :as insta]))

          (def as-and-bs
            (insta/parser
              "S = AB*
               AB = A B
               A = 'a'+
               B = 'b'+"))

          (defn main [{:keys [block-uid]}]
            [:button 
             {:on-click 
              #(pprint (as-and-bs "aaaaabbbaaaabb"))} "Click me!"])```}} (check console after clicking)
    - Click me template using `blueprintjs.core`
      - Code::
        - ```clojure
          (ns dev-docs.test-blueprint.1
            (:require 
             [reagent.core :as r]
             [roam.block :as block]
             [blueprintjs.core :as bp-core]))

          (defonce bp3-button (r/adapt-react-class bp-core/Button))

          (defn main [{:keys [block-uid]}]
            [bp3-button 
             {:large true
              :disabled true
              :icon "history"
              :on-click 
              #(block/update 
                {:block {:uid block-uid 
                         :string "Hello world!"}})} 
             "Click me!"])```
      - Output::
        - `{{[[roam/render]]: ((O1iyYWZsW))}}`
        - {{[[roam/render]]: ```clojure
          (ns dev-docs.test-blueprint.1
            (:require 
             [reagent.core :as r]
             [roam.block :as block]
             [blueprintjs.core :as bp-core]))

          (defonce bp3-button (r/adapt-react-class bp-core/Button))

          (defn main [{:keys [block-uid]}]
            [bp3-button 
             {:large true
              :disabled true
              :icon "history"
              :on-click 
              #(block/update 
                {:block {:uid block-uid 
                         :string "Hello world!"}})} 
             "Click me!"])```}}
    - Load modules and css from [[npm]] #experimental
      - You can load any package from npm simply by requiring it.
        - Unfortunately many packages will not work because they will load their own version of React
        - Some common errors when this happens are
          - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FSiIri1B_CW.png?alt=media&token=b5ba8288-16bb-49f8-b8aa-4a6a6634875c)
      - `{{[[roam/render]]: ((Hcuh0h3ys))}}`
      - {{[[roam/render]]: ```clojure
        (ns render-examples.confetti
          (:require
           [reagent.core :as r]
           ;; require any package from npm
           ["canvas-confetti" :as confetti]
           ;; require a specific version of a package
           ["react-awesome-button@6.5.0" :refer [AwesomeButton]]
           ;; require css for an npm package
           ["react-awesome-button@6.5.0/dist/styles.css"]
           ;; alternatively you could use CDN of your choice by providing a full URL
           ;; internally we use esm.sh to load npm packages
           #_["https://cdn.skypack.dev/react-awesome-button@6.5.0/dist/styles.css"]))

        (def awesome-button (r/adapt-react-class AwesomeButton))

        (defn main []
          [:div
           [awesome-button
            {:type "primary"
             ;; be careful, some packages export default, which is not auto processed by cljs as it is in js
             ;; when in doubt, print out what your var is
             :onPress #(confetti/default)}
            "Fun!"]])```}}
        - ```clojure
          (ns render-examples.confetti
            (:require
             [reagent.core :as r]
             ;; require any package from npm
             ["canvas-confetti" :as confetti]
             ;; require a specific version of a package
             ["react-awesome-button@6.5.0" :refer [AwesomeButton]]
             ;; require css for an npm package
             ["react-awesome-button@6.5.0/dist/styles.css"]
             ;; alternatively you could use CDN of your choice by providing a full URL
             ;; internally we use esm.sh to load npm packages
             #_["https://cdn.skypack.dev/react-awesome-button@6.5.0/dist/styles.css"]))

          (def awesome-button (r/adapt-react-class AwesomeButton))

          (defn main []
            [:div
             [awesome-button
              {:type "primary"
               ;; be careful, some packages export default, which is not auto processed by cljs as it is in js
               ;; when in doubt, print out what your var is
               :onPress #(confetti/default)}
              "Fun!"]])```
  - [[jsx]]
    - Hello World
      - Code::
        - ```jsx
          function main2 () {
            return <h1>Hello world from JSX</h1>
          }```
      - Output::
        - `{{roam/render: ((hlu_MicTh))}}`
        - {{roam/render: ```jsx
          function main2 () {
            return <h1>Hello world from JSX</h1>
          }```}}
    - Argument Parsing
      - Code::
        - ```jsx
          function mainArgs3({args}) {
            let block, actualArgs;
            [block, ...actualArgs] = args;
            const listArgs = actualArgs.map(
              (arg) => <li>{arg.toString()}</li>
            );
            return (
              <div>
                <h1>
                  {block["block-uid"]}: args:
                </h1>
                <ul>{listArgs}</ul>
              </div>
            );
          }```
      - Output::
        - {{roam/render: ```jsx
          function mainArgs3({args}) {
            let block, actualArgs;
            [block, ...actualArgs] = args;
            const listArgs = actualArgs.map(
              (arg) => <li>{arg.toString()}</li>
            );
            return (
              <div>
                <h1>
                  {block["block-uid"]}: args:
                </h1>
                <ul>{listArgs}</ul>
              </div>
            );
          }```  "arg-1" 2 [[test args]] test block args}}
  - [[JavaScript]]
    - It's a better idea to just use [[jsx]] instead of raw javascript unless you run into some bug. Jsx examples will work with javascript if you convert the jsx syntax to create element
    - Hello World
      - Code::
        - ```javascript
          function main1() {
            return React.createElement('h1', {}, 'Hello world from JS');
          }```
      - Output::
        - `{{roam/render: ((qfcNnWG7J))}}`
        - {{roam/render: ```javascript
          function main1() {
            return React.createElement('h1', {}, 'Hello world from JS');
          }```}}
    - Argument Parsing
      - Code::
        - ```javascript
          function mainArgs2({args}) {
            let block, actualArgs;
            [block, ...actualArgs] = args;
            console.log(block, actualArgs)
            return React.createElement('div', {}, "Hello");
          }```
      - Output::
        - `{{roam/render: ((zJX0nWRLX)) "arg-1" 2 [[test args]] ((7lN0hyokF))}}`
        - {{roam/render: ```javascript
          function mainArgs2({args}) {
            let block, actualArgs;
            [block, ...actualArgs] = args;
            console.log(block, actualArgs)
            return React.createElement('div', {}, "Hello");
          }``` "arg-1" 2 [[test args]] test block args}}
          - just did a console log here. Check the JSX example for a better example
- **[[FAQ]]**
  - **How to pass arguments into components?**
    - When you build anything but the simplest roam/render components, you run into the need to be able to take arguments. Similarly, it is a common use case that you need to know where (which block) your component is situated. 
    - The first argument to your component is always a context map
      - Currently this map only contains the `block-uid` of the block the component is rendered inside of (not the uid of the code block!)
      - `{:block-uid "KjccJWpBM"}` (clojure) or `{"block-uid": "KjccJWpBM"}` (js)
    - To pass in additional arguments, add them after the code block uid, like this
      - `{{roam/render: ((KjccJWpBM)) "arg-1" 2}}`
      - This render component would run the code in the block with block-uid `KjccJWpBM` and pass the arguments "arg-1" and 2
        - Roam automatically parses these into a string and a number (This is done with the `cljs.reader`)
      - These all would be automatically passed into the last function in the code block. Specifically, the function would receive the following arguments
        - `{:block-uid "KjccJWpBM"}` (clojure) or `{"block-uid": "KjccJWpBM"}` (js)
        - `"arg-1"`
        - `2`
    - Roam will automatically parse and resolve page and block references passed in
      - `{{roam/render: ((KjccJWpBM)) [[test args]] ((7lN0hyokF))}}`
      - Args
        - `{:block-uid "KjccJWpBM"}` (clojure) or `{"block-uid": "KjccJWpBM"}` (js)
        - `[:block/uid "MFSo6yX_Q"]` (clojure) or `['uid', 'MFSo6yX_Q']` (js)
        - `[:block/uid "7lN0hyokF"]` or `['uid', '7lN0hyokF']` (js)
    - [[Examples]]
      - clojurescript
        - Argument Parsing #[[Important Note]]
          - Code::
            - ```clojure
              (defn main-args-1 [{:keys [block-uid]} & args]
                [:div
                 [:h1 (str block-uid ": args: ")]
                 [:ul
                  (for [arg args]
                    [:li (pr-str arg)])]])```
          - Output::
            - {{roam/render: ```clojure
              (defn main-args-1 [{:keys [block-uid]} & args]
                [:div
                 [:h1 (str block-uid ": args: ")]
                 [:ul
                  (for [arg args]
                    [:li (pr-str arg)])]])``` "arg-1" 2 [[test args]] test block args}}
      - JS
        - Argument Parsing
          - Code::
            - ```javascript
              function mainArgs2({args}) {
                let block, actualArgs;
                [block, ...actualArgs] = args;
                console.log(block, actualArgs)
                return React.createElement('div', {}, "Hello");
              }```
          - Output::
            - `{{roam/render: ((zJX0nWRLX)) "arg-1" 2 [[test args]] ((7lN0hyokF))}}`
            - {{roam/render: ```javascript
              function mainArgs2({args}) {
                let block, actualArgs;
                [block, ...actualArgs] = args;
                console.log(block, actualArgs)
                return React.createElement('div', {}, "Hello");
              }``` "arg-1" 2 [[test args]] test block args}}
              - just did a console log here. Check the JSX example for a better example
      - JSX
        - Argument Parsing
          - Code::
            - ```jsx
              function mainArgs3({args}) {
                let block, actualArgs;
                [block, ...actualArgs] = args;
                const listArgs = actualArgs.map(
                  (arg) => <li>{arg.toString()}</li>
                );
                return (
                  <div>
                    <h1>
                      {block["block-uid"]}: args:
                    </h1>
                    <ul>{listArgs}</ul>
                  </div>
                );
              }```
          - Output::
            - {{roam/render: ```jsx
              function mainArgs3({args}) {
                let block, actualArgs;
                [block, ...actualArgs] = args;
                const listArgs = actualArgs.map(
                  (arg) => <li>{arg.toString()}</li>
                );
                return (
                  <div>
                    <h1>
                      {block["block-uid"]}: args:
                    </h1>
                    <ul>{listArgs}</ul>
                  </div>
                );
              }```  "arg-1" 2 [[test args]] test block args}}
  - **How are the code blocks evaluated?**
    - In [[clojurescript]] we use [[SCI]] to parse and evaluate files
    - [[jsx]] is converted to js with babel and then evaluated the same as js
    - [[JavaScript]] is evaluated with `eval`
