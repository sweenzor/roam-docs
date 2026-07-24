# roam/cljs

- **Getting Started**
  - roam/cljs is [[roam/js]] in ClojureScript: create a block containing `{{[[roam/cljs]]}}`, then nest a clojure code block underneath it.
    - Like this
    - {{[[roam/cljs]]}}
      - ```clojure
        (prn "hello from roam/cljs")```
  - Everything else — enabling, running on startup, re-running after edits, errors, and `?disablejs=true` — works exactly as described on [[roam/js]], and its **Good practices** apply here too.
- **The environment**
  - All roam/cljs blocks share one ClojureScript environment ([SCI](https://github.com/babashka/sci)), loaded on demand the first time a block runs.
  - Start each script with an `(ns ...)` form — other roam/cljs blocks can then `:require` it.
    - Namespaces do not autoload: a `:require` only works if the defining block has already run.
  - The [[Roam Clojurescript API]] mirrors the [[Roam Alpha API]] as native namespaces — kebab-case names, and arguments as maps with keyword keys (`{:location {:parent-uid ...}}` instead of `{"parent-uid": ...}`).
    - `roam.datascript/q` and `roam.datascript/pull` query the graph directly — no connection argument, and queries are plain quoted vectors instead of strings.
    - The write namespaces (`roam.block`, `roam.page`, `roam.user`) only exist when you have write access to the graph.
  - Reagent, promesa, datascript.core, and the other bundled libraries are listed on [[Roam Clojurescript API]] under External Libraries.
  - JS interop works throughout: `js/window`, `js/console.log`, and anything on `window.roamAlphaAPI` that has no wrapper.
    - Callbacks invoked by Roam (command palette, context menus) receive JavaScript objects, not maps — read them with `applied-science.js-interop`.
  - A `:require` of a URL string loads it as an ES module, and a `.css` URL injects a stylesheet.
- Examples::
  - Open a random page from the command palette — good for rediscovering old notes
    - {{[[roam/cljs]]}}
      - ```clojure
        (ns examples.random-page
          (:require
           [roam.datascript :as rd]
           [roam.ui.command-palette :as command-palette]
           [roam.ui.main-window :as main-window]))

        (command-palette/add-command
          {:label    "Open random page"
           :callback (fn [_]
                       (let [uids (rd/q '[:find [?uid ...]
                                          :where [?e :node/title]
                                                 [?e :block/uid ?uid]])]
                         (main-window/open-page {:page {:uid (rand-nth uids)}})))})```
  - Make sure today's daily note starts with a Journal block — runs on every startup, and shows the guard pattern that keeps a script from creating duplicates
    - {{[[roam/cljs]]}}
      - ```clojure
        (ns examples.daily-journal
          (:require
           [promesa.core :as p]
           [roam.block :as block]
           [roam.datascript :as rd]
           [roam.page :as page]
           [roam.util :as util]))

        (defn ensure-today-has-journal []
          (let [today-uid (util/date->page-uid (js/Date.))]
            (p/do!
              (when-not (rd/q '[:find ?p . :in $ ?uid
                                :where [?p :block/uid ?uid]]
                              today-uid)
                (page/create {:page {:title (util/date->page-title (js/Date.))}}))
              (when-not (rd/q '[:find ?c . :in $ ?uid ?text
                                :where [?p :block/uid ?uid]
                                       [?p :block/children ?c]
                                       [?c :block/string ?text]]
                              today-uid "Journal")
                (block/create {:location {:parent-uid today-uid :order 0}
                               :block    {:string "Journal"}})))))

        (ensure-today-has-journal)```
  - Share helper functions between blocks with namespaces
    - Enable the `my.helpers` block first — namespaces do not autoload, so the block that requires one only works after its defining block has run.
    - {{[[roam/cljs]]}}
      - ```clojure
        (ns my.helpers
          (:require
           [roam.datascript :as rd]))

        (defn get-page-uid [title]
          (rd/q '[:find ?uid . :in $ ?title
                  :where [?e :node/title ?title]
                         [?e :block/uid ?uid]]
                title))```
    - {{[[roam/cljs]]}}
      - ```clojure
        (ns my.scratch
          (:require
           [my.helpers :as h]))

        (prn (h/get-page-uid "Reading List"))```
