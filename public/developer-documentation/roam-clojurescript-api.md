# Roam Clojurescript API

- Clojure Core Namespaces
  - `clojure.core`
    - everything in clojure.core
  - `clojure.pprint`
    - everything in cljs.pprint
  - `cljs.pprint`
    - everything in cljs.pprint
- Roam Namespaces
  - In general these namespaces match the [[Roam Alpha API]] exactly, except they accept a clojure map with keywords
    - There are some differences, such as `roam.datascript.reactive` for re-rendering reagent components, or `roam.katex` for rendering katex reagent components
  - `roam.datascript`
    - `q`
      - Description:: 
        - Calls [datascript.core/q](https://cljdoc.org/d/datascript/datascript/1.2.5/api/datascript.core#q) passing current graph's db automatically
          - > Executes a datalog query
        - Resources::
          - [datascript.core/q docs](https://cljdoc.org/d/datascript/datascript/1.2.5/api/datascript.core#q)
          - For a deeper dive into queries, see [datomic docs on query](https://docs.datomic.com/on-prem/query.html).
      - arguments:: `[query & inputs]`
        - query
          - datalog query 
        - inputs
          - any inputs to the query (except the db, which is passed automatically)
          - **Note:**  If you have inputs, the `:in` clause is compulsory (for eg `:in $ input1 input2`)  
      - Usage::
        - Roam render component that shows the parent page's title for a block 
          - block passed as input is the block at the top of this page: 
            Equivalent to [[roam/js]] but language of choice is [[clojurescript]]
          - {{roam/render: ```clojure
            (ns developer-doc.rd.q
              (:require 
               [roam.datascript :as rd]))

            (defn main []
              [:div  
                (str
                 (rd/q 
                  '[:find ?parent-page-title .
                    :in $ ?block-uid
                    :where
                    [?block :block/uid  ?block-uid]
                    [?block :block/page ?page]
                    [?page  :node/title ?parent-page-title]] 
                  "TpIGtsnL7"))])```}}
            - ```clojure
              (ns developer-doc.rd.q
                (:require 
                 [roam.datascript :as rd]))

              (defn main []
                [:div  
                  (str
                   (rd/q 
                    '[:find ?parent-page-title .
                      :in $ ?block-uid
                      :where
                      [?block :block/uid  ?block-uid]
                      [?block :block/page ?page]
                      [?page  :node/title ?parent-page-title]] 
                    "TpIGtsnL7"))])```
    - `pull`
      - Description::
        - Calls [datascript.core/pull](https://cljdoc.org/d/datascript/datascript/1.2.5/api/datascript.core#pull) passing current graph's db automatically
          - > Fetches data from database using recursive declarative description.
        - Resources::
          - [datascript.core/pull docs](https://cljdoc.org/d/datascript/datascript/1.2.5/api/datascript.core#pull)
          - For a deeper dive, see [datomic docs on pull api](https://docs.datomic.com/on-prem/query/pull.html)
      - arguments:: `[pattern eid]`
        - pattern
          - aka selector
        - eid
      - Usage::
        - Roam render component that displays the following information for a page: uid, title, all direct children (with their own uid and :block/string)
          - {{roam/render: ```clojure
            (ns developer-doc.rd.pull
              (:require 
               [roam.datascript :as rd]))

            (defn main []
              [:div  
                (str
                 (rd/pull 
                  '[:block/uid 
                    :node/title 
                    {:block/children [:block/uid :block/string]}] 
                  '[:block/uid "11-20-2021"]))])```}}
            - ```clojure
              (ns developer-doc.rd.pull
                (:require 
                 [roam.datascript :as rd]))

              (defn main []
                [:div  
                  (str
                   (rd/pull 
                    '[:block/uid 
                      :node/title 
                      {:block/children [:block/uid :block/string]}] 
                    '[:block/uid "11-20-2021"]))])```
    - `entity`
      - Description::
        - Calls [datascript.core/entity](https://cljdoc.org/d/datascript/datascript/1.2.5/api/datascript.core#entity) passing current graph's `db` automatically
          - > Retrieves an entity by its id from database. Entities are ^^lazy^^ map-like structures to navigate DataScript database content.
        - Resources::
          - [datascript.core/entity docs](https://cljdoc.org/d/datascript/datascript/1.2.5/api/datascript.core#entity)
      - arguments::
        - eid
          - entity id
          - can directly pass entity id or can use lookup attr
            - therefore, both of the following are valid
              - `7161`
              - `'[:block/uid "11-27-2021"]`
      - Usage::
        - a roam render component that displays the title of a page and the top bullets in order
          - {{roam/render: ```clojure
            (ns developer-doc.rd.entity
              (:require 
               [roam.datascript :as rd]))

            (defn main []
              (let [page-ent (rd/entity '[:block/uid "11-27-2021"])
                    title    (:node/title page-ent)
                    children (->> (:block/children page-ent)
                                  (sort :block/order))]
                [:div 
                 [:h1 title]
                 [:ul
                  (for [child children]
                    [:li (:block/string child)])]]))```}}
            - ```clojure
              (ns developer-doc.rd.entity
                (:require 
                 [roam.datascript :as rd]))

              (defn main []
                (let [page-ent (rd/entity '[:block/uid "11-27-2021"])
                      title    (:node/title page-ent)
                      children (->> (:block/children page-ent)
                                    (sort :block/order))]
                  [:div 
                   [:h1 title]
                   [:ul
                    (for [child children]
                      [:li (:block/string child)])]]))```
    - `datoms`
      - Description::
        - Calls [datascript.core/datoms](https://cljdoc.org/d/datascript/datascript/1.2.5/api/datascript.core#datoms) passing current graph's db automatically
          - > Index lookup. Returns a sequence of datoms (lazy iterator over actual DB index) which components (e, a, v) match passed arguments.
        - Resources::
          - [datascript.core/datoms docs](https://cljdoc.org/d/datascript/datascript/1.2.5/api/datascript.core#datoms)
      - arguments:: `[index & args]`
        - index
          - the database index to be looked up
          - Possible values
            - `:eavt` 
            - `:aevt`
            - `:avet`
          - Note::
            - `:eavt`  and `:aevt` contain all datoms.
            - `:avet` only contains datoms for references, :db/unique and :db/index attributes.
              - in the case of Roam's graphs, these would be
                - `:node/title`
                - `:window/id`
                - `:user/email`
              - However, all of the above are `:db/unique` properties, so you may be better off doing a direct entity lookup
        - args
          - the passed args match against components (e, a, v) of the datoms 
            - depending on the index obviously
      - Usage::
        - a roam render component that displays the name of the  pages which are publicly shared
          - {{roam/render: ```clojure
            (ns developer-doc.rd.datoms
              (:require 
               [roam.datascript :as rd]))

            (defn main []
              (let [page-ents (map (comp rd/entity :e) (rd/datoms :aevt :page/permissions))]
                [:div
                 [:h2 "Shared pages"]
                 [:ol
                   (for [page-ent page-ents]
                     [:li (str (:node/title page-ent) ": " (:page/permissions page-ent))])]]))```}}
            - ```clojure
              (ns developer-doc.rd.datoms
                (:require 
                 [roam.datascript :as rd]))

              (defn main []
                (let [page-ents (map (comp rd/entity :e) (rd/datoms :aevt :page/permissions))]
                  [:div
                   [:h2 "Shared pages"]
                   [:ol
                     (for [page-ent page-ents]
                       [:li (str (:node/title page-ent) ": " (:page/permissions page-ent))])]]))```
  - `roam.datascript.reactive`
    - `q`
      - same as roam.datascript/q but returns a reagent reaction with the result of the query. 
        - The value of the reaction will be automatically updated whenever a change is detected
    - `pull`
      - same as roam.datascript/pull but but returns a reagent reaction which will be updated every time that the value of conn changes
    - `f-entity`
      - Description::
        - Returns a reagent reaction which holds the result of `(apply f (rd/entity eid) args)`
      - arguments:: `[f eid & args]`
        - f
        - eid
        - args
      - Usage::
        - a roam render component that displays the text of a block reactively (reactively - updates automatically when block updates)
          - {{roam/render: ```clojure
            (ns developer-doc.rdr.f-entity.2
              (:require 
               [roam.datascript.reactive :as rdr]))

            (defn main []
              (let [block-uid      "pXh1FJfIX"
                    block-str-atom (rdr/f-entity
                                    :block/string ;;f
                                    [:block/uid block-uid] ;;eid
                                   )]
                [:div 
                 [:h3 
                  (str "Reactive display of block with :block/uid: " block-uid)]
                 [:ul
                  [:li @block-str-atom]]]))```}}
            - ```clojure
              (ns developer-doc.rdr.f-entity.2
                (:require 
                 [roam.datascript.reactive :as rdr]))

              (defn main []
                (let [block-uid      "pXh1FJfIX"
                      block-str-atom (rdr/f-entity
                                      :block/string ;;f
                                      [:block/uid block-uid] ;;eid
                                     )]
                  [:div 
                   [:h3 
                    (str "Reactive display of block with :block/uid: " block-uid)]
                   [:ul
                    [:li @block-str-atom]]]))```
        - a roam render component that displays back refs of a block (reactively - updates automatically when block updates)
          - {{roam/render: ```clojure
            (ns developer-doc.rdr.f-entity.2
              (:require 
               [roam.datascript.reactive :as rdr]))

            (defn get-backref-page-string [ent]
              (mapv (juxt (comp :node/title :block/page) :block/string) (:block/_refs ent)))

            (defn main []
              (let [block-uid      "11-26-2021"
                    backrefs-atom  (rdr/f-entity
                                    get-backref-page-string ;;f
                                    [:block/uid block-uid] ;;eid
                                   )]
                [:div 
                 [:h3 
                  (str "Reactive display of back refs of block with :block/uid: " block-uid)]
                 [:ul
                  (for [[page-title block-string] @backrefs-atom]
                    [:li (str page-title ": " block-string)])
                  ]]))```}}
            - ```clojure
              (ns developer-doc.rdr.f-entity.2
                (:require 
                 [roam.datascript.reactive :as rdr]))

              (defn get-backref-page-string [ent]
                (mapv (juxt (comp :node/title :block/page) :block/string) (:block/_refs ent)))

              (defn main []
                (let [block-uid      "11-26-2021"
                      backrefs-atom  (rdr/f-entity
                                      get-backref-page-string ;;f
                                      [:block/uid block-uid] ;;eid
                                     )]
                  [:div 
                   [:h3 
                    (str "Reactive display of back refs of block with :block/uid: " block-uid)]
                   [:ul
                    (for [[page-title block-string] @backrefs-atom]
                      [:li (str page-title ": " block-string)])
                    ]]))```
    - `datoms`
      - same as roam.datascript/datoms but returns a reagent reaction with the result. 
        - The value of the reaction will be automatically updated whenever a change is detected
  - `roam.util`
    - Aside from `parse` these are equivalent to those in roamAlphaAPI.util
    - `generate-uid`
      - Example::
        - ```clojure
          (roam.util/generate-uid)```
    - `page-title->date`
      - Example::
        - ```clojure
          (roam.util/page-title->date "August 1st, 2022")```
    - `date->page-title`
      - Example::
        - ```clojure
          (roam.util/date->page-title (new js/Date))```
    - `date->page-uid`
      - Example::
        - ```clojure
          (roam.util/date->page-uid (new js/Date))```
    - `parse`
      - Description:: 
        - Takes a Roam markdown style string as input and returns a reagent component of how it would look like when in a block 
      - arguments:: `[s]`
        - s
          - markdown string 
      - Example::
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
      - useful in [[roam/render]]
  - `roam.ui.main-window`
    - Functions in this namespace are equivalent to those in roamAlphaAPI.ui.mainWindow
    - `open-page`
      - Example::
        - ```clojure
          (main-window/open-page {:page {:uid "ljs1l3kj4"}})```
    - `open-block`
      - Example::
        - ```clojure
          (main-window/open-block {:page {:uid "ljs1l3kj4"}})```
    - `open-daily-notes`
      - Example::
        - ```clojure
          (main-window/open-daily-notes)```
    - `get-open-page-or-block-uid`
      - Example::
        - ```clojure
          (main-window/get-open-page-or-block-uid)```
    - `focus-first-block`
      - Example::
        - ```clojure
          (main-window/focus-first-block)```
  - `roam.ui.left-sidebar`
    - Functions in this namespace are equivalent to those in roamAlphaAPI.ui.leftSidebar
    - `open`
      - Example::
        - ```clojure
          (left-sidebar/open)```
    - `close`
      - Example::
        - ```clojure
          (left-sidebar/close)```
  - `roam.ui.right-sidebar`
    - Functions in this namespace are equivalent to those in roamAlphaAPI.ui.rightSidebar
    - `open`
      - Example::
        - ```clojure
          (right-sidebar/open)```
    - `close`
      - Example::
        - ```clojure
          (right-sidebar/close)```
    - `get-windows`
      - Example::
        - ```clojure
          (right-sidebar/get-windows)```
    - `add-window`
      - Example::
        - ```clojure
          (right-sidebar/add-window
            {:window {:type "block" :block-uid "1fasdfef"}})```
    - `remove-window`
      - Example::
        - ```clojure
          (right-sidebar/remove-window
            {:window {:type "block" :block-uid "1fasdfef"}})```
    - `expand-window`
      - Example::
        - ```clojure
          (right-sidebar/expand-window
            {:window {:type "block" :block-uid "1fasdfef"}})```
    - `collapse-window`
      - Example::
        - ```clojure
          (right-sidebar/collapse-window
            {:window {:type "block" :block-uid "1fasdfef"}})```
    - `pin-window`
      - Example::
        - ```clojure
          (right-sidebar/pin-window
            {:window {:type "block" :block-uid "1fasdfef"}})```
    - `unpin-window`
      - Example::
        - ```clojure
          (right-sidebar/unpin-window
            {:window {:type "block" :block-uid "1fasdfef"}})```
  - `roam.ui.filters`
    - Functions in this namespace are equivalent to those in roamAlphaAPI.ui.filters
    - `add-global-filter`
      - Example::
        - ```clojure
          (filters/add-global-filter
            {:title "test"
             :type "includes"})```
    - `remove-global-filter`
      - Example::
        - ```clojure
          (filters/remove-global-filter
            {:title "test"
             :type "includes"})```
    - `get-global-filters`
      - Example::
        - ```clojure
          (filters/get-global-filters)```
    - `get-page-filters`
      - Example::
        - ```clojure
          (filters/get-page-filters
            {:page {:title "test"}})```
    - `get-page-linked-refs-filter`
      - Example::
        - ```clojure
          (filters/get-pagelinked-refs-filters
            {:page {:title "test"}})```
    - `get-sidebar-window-filters`
      - Example::
        - ```clojure
          (filters/get-sidebar-window-filters
            {:window {:block-uid "sdl3kefj"
                      :type "outline"}})```
    - `set-page-filters`
      - Example::
        - ```clojure
          (filters/set-page-filters
            {:page {:title "test"}
             :filters {:includes ["March 11th, 2022"]}})

          ;; clears filters
          (filters/set-page-filters
            {:page {:title "test"}
             :filters {}})```
    - `set-page-linked-refs-filters`
      - Example::
        - ```clojure
          (filters/set-page-linked-refs-filters
            {:page {:title "test"}
             :filters {:includes ["March 11th, 2022"]}})

          ;; clears filters
          (filters/set-page-linked-refs-filters
            {:page {:title "test"}
             :filters {}})```
    - `set-sidebar-window-filters`
      - Example::
        - ```clojure
          (filters/set-sidebar-window-filters
            {:window {:block-uid "sdl3kefj"
                      :type "outline"}
             :filters {:includes ["March 11th, 2022"]}})

          ;; clears filters
          (filters/set-sidebar-window-filters
            {:window {:block-uid "sdl3kefj"
                      :type "outline"}
             :filters {}})```
  - `roam.ui.block-context-menu`
    - Functions in this namespace are equivalent to those in roamAlphaAPI.ui.blockContextMenu
    - `add-command`
      - Example::
        - ```clojure
          (block-context-menu/add-command
            {:label "test"
             :callback (fn []
                         (prn "hey!"))})```
    - `remove-command`
      - Example::
        - ```clojure
          (block-context-menu/remove-command
            {:label "test"})```
  - `roam.ui.individual-multiselect`
    - Functions in this namespace are equivalent to those in roamAlpahAPI.ui.individualMultiselect
    - `get-selected-uids`
      - Example::
        - ```clojure
          (get-selected-uids)```
  - `roam.ui.ms-context-menu`
    - Functions in this namespace are equivalent to those in roamAlpahAPI.ui.msContextMenu
    - `add-command`
      - Example::
        - ```clojure
          (add-command
            {:label "test"
             :callback (fn []
                         (prn "hey!"))})```
    - `remove-command`
      - Example::
        - ```clojure
          (remove-command
            {:label "test"})```
  - `roam.ui.command-palette`
    - Functions in this namespace are equivalent to those in roamAlphaAPI.ui.commandPalette
    - `add-command`
      - Example::
        - ```clojure
          (add-command
            {:label "test"
             :callback (fn []
                         (prn "hello world!"))})```
    - `remove-command`
      - Example::
        - ```clojure
          (remove-command
            {:label "test"})```
  - `roam.graph`
    - `name` #def
      - The name of the current graph
    - `type` #def
      - `"hosted"` or `"offline"`
    - `is-encrypted?` #def
      - Whether the graph is encrypted or not
  - `roam.platform`
    - `is-desktop?` #def
      - true if client is Roam [[Desktop App]]
    - `is-mobile-app?` #def
      - true if client is Roam [[Mobile App]]
    - `is-mobile?` #def
      - Note that this is only a check on the screen size
        - just uses a media query `max-width: 450px`
    - `is-ios?` #def
      - true if client is iphone, ipad or ipod
    - `is-pc?` #def
      - true if client is a PC 
      - useful if you want to have different shortcuts on PC vs Mac 
    - `is-touch-device` #def
      - true if client is a touch device
  - `roam.katex`
    - `inline`
      - Description::
        - Takes a string and renders it with [katex](https://katex.org/) as an inline level element
      - Example::
        - ```clojure
          [katex/inline "1 + 2"]```
    - `block`
      - Description::
        - Takes a string and renders it with [katex](https://katex.org/) as a block level element
      - Example::
        - ```clojure
          [katex/block "1 + 2"]```
  - `roam.user`
    - Functions in this namespace are equivalent to those in roamAlphaAPI.data.user
    - `upsert`
  - `roam.block`
    - Functions in this namespace are equivalent to those in roamAlphaAPI.data.block
      - Example of conversion from ```javascript
        window
          .roamAlphaAPI
          .createBlock(
        	{"location": 
        		{"parent-uid": "01-21-2021", 
        		 "order": 0}, 
        	 "block": 
        		{"string": "test"}})``` to use in clojure
        - {{[[roam/render]]: ```clojure
          (ns dev-doc.roam.block.2
            (:require [roam.block :as block]))

          (defn main []
            [:button
             {:on-click
              (fn [] (-> (block/create {:location {:parent-uid "06-14-2022"
                                                   :order      0}
                                        :block    {:string     "test"}})
                         (.then #(js/console.log "done"))
                         (.catch #(js/console.log "failed" %))))}
             "Click me to create the block"])```}}
          - ```clojure
            (ns dev-doc.roam.block.2
              (:require [roam.block :as block]))

            (defn main []
              [:button
               {:on-click
                (fn [] (-> (block/create {:location {:parent-uid "06-14-2022"
                                                     :order      0}
                                          :block    {:string     "test"}})
                           (.then #(js/console.log "done"))
                           (.catch #(js/console.log "failed" %))))}
               "Click me to create the block"])```
        - [[Test]]
          - go to [[December 5th, 2021]]
          - 
    - `create`
      - Example::
        - ```clojure
          (roam.block/create
            {:location {:parent-uid "asdlkjfe"
                        :order "first"}
             :block {:string "hello world"}})```
    - `move`
      - Example::
        - ```clojure
          (roam.block/move
            {:location {:parent-uid "asdlkjfe"
                        :order "last"}
             :block {:uid "f8cXfDIRn"}})```
    - `update`
      - Example::
        - ```clojure
          (roam.block/update
            {:block {:uid "f8cXfDIRn"
                     :string "foo"}})```
    - `delete`
      - Example::
        - ```clojure
          (roam.block/delete
            {:block {:uid "f8cXfDIRn}})```
    - `reorder-blocks`
      - Example::
        - ```clojure
          (reorder-blocks
            {:location {:parent-uid "hisjslk"}
             :blocks ["QCE0cNNNL" "IATKcVmWE" "nC22orMO4"]})```
  - `roam.page`
    - Functions in this namespace are equivalent to those in roamAlphaAPI.data.page
    - `create`
      - Example::
        - ```clojure
          (roam.page/create
            {:page {:title "test me!"}})```
    - `update`
      - Example::
        - ```clojure
          (roam.page/update
            {:page {:uid "asdflele"
                    :title "test me!"}})```
    - `delete`
      - Example::
        - ```clojure
          (roam.page/delete
            {:page {:uid "asdflele"}})```
- External Libraries
  - Reagent
    - version used: `reagent/reagent   {:mvn/version "1.1.0"}`
    - `reagent.core`
      - [reagent.core docs](https://cljdoc.org/d/reagent/reagent/1.1.0/api/reagent.core)
      - exposed vars
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
    - `reagent.dom`
      - [reagent.dom docs](https://cljdoc.org/d/reagent/reagent/1.1.0/api/reagent.dom)
      - exposed vars
        - {{[[roam/render]]: ```clojure
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
                                 (sort)))]]]))``` "reagent.dom"}}
  - `datascript.core`
    - you will most likely want to use `roam.datascript` or `roam.datascript.reactive`
    - [datascript.core docs](https://cljdoc.org/d/datascript/datascript/1.3.9/doc/readme) 
    - exposed vars: 
      - {{[[roam/render]]: ```clojure
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
                               (sort)))]]]))``` "datascript.core"}}
  - `instaparse.core`
    - [instaparse.core docs](https://cljdoc.org/d/instaparse/instaparse/1.4.10/api/instaparse.core)
    - exposed vars
      - {{[[roam/render]]: ```clojure
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
                               (sort)))]]]))``` "instaparse.core"}}
    - Example
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
  - `blueprintjs.core`
    - everything in [@blueprintjs/core docs](https://blueprintjs.com/docs/#core)
    - **Note:** Since this is a ReactJS library, the classes need some treatment before they can be used.  
      - For most cases, you just have to use [reagent/adapt-react-class](https://github.com/reagent-project/reagent/blob/master/doc/InteropWithReact.md#creating-reagent-components-from-react-components). See the example below
      - For more detail: read through [Reagent Docs/InteropWithReact.md](https://github.com/reagent-project/reagent/blob/master/doc/InteropWithReact.md)
    - Example
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
  - Promesa
    - version used: `funcool/promesa  {:mvn/version "6.0.0"}`
    - [docs](https://cljdoc.org/d/funcool/promesa/6.0.0/doc/user-guide)
    - `promesa.core`
      - exposed vars
        - {{[[roam/render]]: ```clojure
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
                                 (sort)))]]]))``` "promesa.core"}}
    - `promesa.protocols`
      - exposed vars
        - {{[[roam/render]]: ```clojure
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
                                 (sort)))]]]))``` "promesa.protocols"}}
  - `applied-science.js-interop`
    - version used: `applied-science/js-interop  {:mvn/version "0.3.3"}`
    - [docs](https://github.com/applied-science/js-interop)
    - exposed vars
      - {{[[roam/render]]: ```clojure
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
                               (sort)))]]]))``` "applied-science.js-interop"}}
