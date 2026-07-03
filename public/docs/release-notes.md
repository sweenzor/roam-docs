# Release notes (daily-note updates from the developer-documentation graph)

## February 26th, 2026

- 

## January 7th, 2026

- [[Datalog Tutorial]]
  - https://max-datom.com/

## September 16th, 2025

- 

## April 8th, 2025

- 
- testing [[datalog-block-query]]
  - sample data
    - test [[Writing]] [[Writing 2]]
  - the query
    - {{datalog-block-query:
      ```javascript
      [:find [?uid ...]
       :where
        [?block :block/refs ?writing-page]
        [?writing-page :node/title "Writing"]
        [?block :block/refs ?other-page]
        [?other-page :node/title ?title]
        [(not= ?title "Writing")]
        [?other-page :block/uid ?uid]]```}}
      - ```javascript
        [:find [?uid ...]
         :where
          [?block :block/refs ?writing-page]
          [?writing-page :node/title "Writing"]
          [?block :block/refs ?other-page]
          [?other-page :node/title ?title]
          [(not= ?title "Writing")]
          [?other-page :block/uid ?uid]]```
        - result-transform::
          ```clojure
          (fn [pages]
            pages
            #_
            (->> pages
                 (map (fn [p] 
                        [:div [:a {:href (str "/page/" (:node/title p))} (str "[[" (:node/title p) "]]")]]))
                 (into []))
            )```

## December 13th, 2024

- {{[[query]]: {and: [[ex-A]] [[ex-B]]}}}
- [[random test page]]
- 
- 

## November 11th, 2024

- [[datalog-block-query]] example which uses `result-transform` to get from the result set 3 random uids
  - {{datalog-block-query: ```javascript
    [:find [?uid ...]
     :in $ % [?uid ...]
     :where
     [?block :block/uid ?uid]
     (created-by ?block "Baibhav Bista")]```}}
  - the block being reffed
    - ```javascript
      [:find [?uid ...]
       :in $ % [?uid ...]
       :where
       [?block :block/uid ?uid]
       (created-by ?block "Baibhav Bista")]```
      - rules::
        ```clojure
        [[(created-by ?block ?user-page-title)
          [?user-page :node/title ?user-page-title]
          [?user :user/display-page ?user-page]
          [?block :create/user ?user]]
         [(created-by-either ?block ?user-page-title-1 ?user-page-title-2)
          (created-by ?block ?user-page-title-1)]
         [(created-by-either ?block ?user-page-title-1 ?user-page-title-2)
          (created-by ?block ?user-page-title-2)]]```
      - query->uids:: {and: [[Roam Alpha API]]}
      - result-transform::
        ```clojure
        (fn [block-ents]
          (->> block-ents
               (shuffle)
               (take 3)))```

## November 4th, 2024

- Example of [[datalog-block-query]] with two inputs
  - test [[test page A]] `[[test page B]]`
  - Datalog block query which takes two pages as inputs and finds a block which refs both of them
    - Source
      - ```javascript
        [:find [?uid ...]
         :in $ ?p1-uid ?p2-uid
         :where
         [?p1 :block/uid ?p1-uid]
         [?p2 :block/uid ?p2-uid]
         [?block :block/refs ?p1]
         [?block :block/refs ?p2]
         [?block :block/uid ?uid]]```
        - uid:: [[test page A]]
        - uid:: [[test page B]]
    - The query in action
      - {{[[datalog-block-query]]: ```javascript
        [:find [?uid ...]
         :in $ ?p1-uid ?p2-uid
         :where
         [?p1 :block/uid ?p1-uid]
         [?p2 :block/uid ?p2-uid]
         [?block :block/refs ?p1]
         [?block :block/refs ?p2]
         [?block :block/uid ?uid]]```}}

## October 29th, 2024

- test [[test page A]] [[test page B]]

## October 22nd, 2024

- [[Ivo]]'s question regarding `:q` & some improvements to `:q`
  - **ds-q without title**
    - :q [:find ?class_title (count ?instance_page)
          :where
          [?main_class_page :node/title "Class"]
          [?is_a :node/title "is a"]
          [?defined_by_ref :node/title "defined by"]
          [?rio_ref :node/title "RIO"]

          [?child :block/refs ?main_class_page]
          [?child :block/refs ?is_a]
          [?child :block/page ?a_class_page]
          [?cchild :block/parents ?child]
          [?cchild :block/refs ?defined_by_ref]
          [?cchild :block/refs ?rio_ref]
          [?a_class_page :node/title ?class_title]

          [?i_child :block/refs ?a_class_page]
          [?i_child :block/refs ?is_a]
          [?i_child :block/page ?instance_page]]
    - :q [:find (count ?instance_page) .
          :where
          [?main_class_page :node/title "Class"]
          [?is_a :node/title "is a"]
          [?defined_by_ref :node/title "defined by"]
          [?rio_ref :node/title "RIO"]

          [?child :block/refs ?main_class_page]
          [?child :block/refs ?is_a]
          [?child :block/page ?a_class_page]
          [?cchild :block/parents ?child]
          [?cchild :block/refs ?defined_by_ref]
          [?cchild :block/refs ?rio_ref]
          [?a_class_page :node/title ?class_title]

          [?i_child :block/refs ?a_class_page]
          [?i_child :block/refs ?is_a]
          [?i_child :block/page ?instance_page]]
  - **ds-q with title**
    - :q "how many subclasses we have that are defined by [[RIO]]?"
      [:find ?class_title ?class_page_uid (count ?instance_page) 
          :where
          [?main_class_page :node/title "Class"]
          [?is_a :node/title "is a"]
          [?defined_by_ref :node/title "defined by"]
          [?rio_ref :node/title "RIO"]

          [?child :block/refs ?main_class_page]
          [?child :block/refs ?is_a]
          [?child :block/page ?a_class_page]
          [?cchild :block/parents ?child]
          [?cchild :block/refs ?defined_by_ref]
          [?cchild :block/refs ?rio_ref]
          [?a_class_page :node/title ?class_title]
          [?a_class_page :block/uid ?class_page_uid]

          [?i_child :block/refs ?a_class_page]
          [?i_child :block/refs ?is_a]
          [?i_child :block/page ?instance_page]]
    - :q "how many subclasses do we have?" 
      [:find (count ?instance_page) .
          :where
          [?main_class_page :node/title "Class"]
          [?is_a :node/title "is a"]
          [?defined_by_ref :node/title "defined by"]
          [?rio_ref :node/title "RIO"]

          [?child :block/refs ?main_class_page]
          [?child :block/refs ?is_a]
          [?child :block/page ?a_class_page]
          [?cchild :block/parents ?child]
          [?cchild :block/refs ?defined_by_ref]
          [?cchild :block/refs ?rio_ref]
          [?a_class_page :node/title ?class_title]

          [?i_child :block/refs ?a_class_page]
          [?i_child :block/refs ?is_a]
          [?i_child :block/page ?instance_page]]
  - **ds-q with title used as a ref**
    - apple :q "how many subclasses do we have?" 
      [:find (count ?instance_page) .
          :where
          [?main_class_page :node/title "Class"]
          [?is_a :node/title "is a"]
          [?defined_by_ref :node/title "defined by"]
          [?rio_ref :node/title "RIO"]

          [?child :block/refs ?main_class_page]
          [?child :block/refs ?is_a]
          [?child :block/page ?a_class_page]
          [?cchild :block/parents ?child]
          [?cchild :block/refs ?defined_by_ref]
          [?cchild :block/refs ?rio_ref]
          [?a_class_page :node/title ?class_title]

          [?i_child :block/refs ?a_class_page]
          [?i_child :block/refs ?is_a]
          [?i_child :block/page ?instance_page]]
    - ball :q [:find (count ?instance_page) .
          :where
          [?main_class_page :node/title "Class"]
          [?is_a :node/title "is a"]
          [?defined_by_ref :node/title "defined by"]
          [?rio_ref :node/title "RIO"]

          [?child :block/refs ?main_class_page]
          [?child :block/refs ?is_a]
          [?child :block/page ?a_class_page]
          [?cchild :block/parents ?child]
          [?cchild :block/refs ?defined_by_ref]
          [?cchild :block/refs ?rio_ref]
          [?a_class_page :node/title ?class_title]

          [?i_child :block/refs ?a_class_page]
          [?i_child :block/refs ?is_a]
          [?i_child :block/page ?instance_page]]
  - 
  - test more
    - all pages
      - :q "all pages"
        [:find ?class_title ?class_page_uid 
            :where
            [?a_class_page :node/title ?class_title]
            [?a_class_page :block/uid ?class_page_uid]]
    - subclasses but in vector form
      - :q "how many subclasses we have that are defined by [[RIO]]?"
        [:find [?class_title ...] 
            :where
            [?main_class_page :node/title "Class"]
            [?is_a :node/title "is a"]
            [?defined_by_ref :node/title "defined by"]
            [?rio_ref :node/title "RIO"]

            [?child :block/refs ?main_class_page]
            [?child :block/refs ?is_a]
            [?child :block/page ?a_class_page]
            [?cchild :block/parents ?child]
            [?cchild :block/refs ?defined_by_ref]
            [?cchild :block/refs ?rio_ref]
            [?a_class_page :node/title ?class_title]
            [?a_class_page :block/uid ?class_page_uid]

            [?i_child :block/refs ?a_class_page]
            [?i_child :block/refs ?is_a]
            [?i_child :block/page ?instance_page]]

## December 14th, 2023

- testing a complicated example for [[datalog-block-query]]
  - TODOs
    - {{[[TODO]]}} have to make it support js/Date
    - {{[[TODO]]}} have to show both results and groups in the count at the top
  - Datalog block query which shows pages where the two last backrefs are more than 1 week apart
    - the actual running query 
      - {{[[datalog-block-query]]: ```javascript
        [:find [?uid ...]
         :where
         [?page :block/uid ?uid]
         [?page :node/title ?page-title]]```}}
    - the query "code" (datalog query just gets the page uids, the heavy lifting is done by the result-transform)
      - ```javascript
        [:find [?uid ...]
         :where
         [?page :block/uid ?uid]
         [?page :node/title ?page-title]]```
        - result-transform::
          ```clojure
          ;; FIXME: could not figure out how to get the current timestamp i.e. (js/Date.now) is not working
          ;;   After figuring that out, we need to first check for pages which have new backrefs in say the last week, then when it comes to comparing with old refs, get the most recent backref not in the last week
          ;;   or something like the above
          ;;   For now, ordering them in reverse chronological order
          ;; FIXME: unsure if we want to use :edit/date :create/date or others
          ;; FIXME: CONSTANTS that can be adjusted at the top

          (fn [page-ents]
            (let [page-ent->title+most-recent-two-back-refs
                  (fn [page-ent]
                    (let [most-recent-two (->> page-ent
                                               :block/_refs
                                               (sort-by :edit/time >)
                                               (take 2))
                          [a b] most-recent-two
                          referenced-after-days (quot (- (:edit/time a) (:edit/time b))
                                                   (* 24 60 60 1000)) ]
                      
                      (when (and
                             ;; has at least 2 reference
                             a
                             b
                             ;; at least 1 week difference between the two references
                             (<= 7 referenced-after-days)
                             )
                        [(str "'" (:node/title page-ent) "' (referenced after " referenced-after-days " days"  ")" )
                         most-recent-two])))]
              (->> page-ents
                   (map page-ent->title+most-recent-two-back-refs)
                   (remove nil?)
                   (sort-by (comp :edit/time first second) >)
                   (into []))))```

## June 16th, 2022

- {{[[roam/cljs]]}}
  - ```clojure
    (def today (new js/Date))
    (def today-rm-str (js/roamAlphaAPI.util.dateToPageTitle today))
    (prn today-rm-str)
    ;; => "June 16th, 2022"```

## June 14th, 2022

- test
- test
- test
- test
- test
- test

## June 9th, 2022

- #progressback
- {{[[roam/css]]}}
  - ```css
    [data-tag^="progressback"] {
      display: none;
    }```
- 
- 
- 
- {{[[roam/render]]: ```clojure
  (ns example.promise
    (:require 
     [promesa.core :as p]
     [roam.util]
     [roam.block]))

  (defn main [{:keys [block-uid]}]
    [:button
     {:on-click 
      #(let [new-uid (roam.util/generate-uid)]
         (p/do! (roam.block/create
                 {:location {:parent-uid block-uid
                             :order :first}
                  :block {:uid new-uid
                          :string "parent"}})
                (roam.block/create
                 {:location {:parent-uid new-uid
                             :order :first}
                  :block {:string "child"}})))}
     "add children"])```}}
  - parent
    - child
  - parent
    - child
  - parent
    - child
  - parent
    - child
  - parent
    - child
  - parent
    - child
  - parent
    - child
- ```clojure
  (ns example.promise
    (:require 
     [promesa.core :as p]
     [roam.util]
     [roam.block]))

  (defn main [{:keys [block-uid]}]
    [:button
     {:on-click 
      #(let [new-uid (roam.util/generate-uid)]
         (p/do! (roam.block/create
                 {:location {:parent-uid block-uid
                             :order :first}
                  :block {:uid new-uid
                          :string "parent"}})
                (roam.block/create
                 {:location {:parent-uid new-uid
                             :order :first}
                  :block {:string "child"}})))}
     "add children"])```

## June 4th, 2022

- {{[[roam/cljs]]}}
  - ```clojure
    (ns require-test)

    (def foo "foo")

    (defn add-block-ctx-menu []
      (js/window.roamAlphaAPI.ui.blockContextMenu.addCommand
       (clj->js 
        {:label "hello world"
         :callback         
         (fn [ctx]                  
           (prn (:block-uid (js->clj ctx :keywordize-keys true))))})))

    (add-block-ctx-menu)```
- 
- 
- ```clojure
  (ns require-test2
    (:require [require-test :as rt]))

  (defn main []
    [:button rt/foo])```

## March 18th, 2022

- [[datalog-block-query]]
  - adding `result-transform`

## March 16th, 2022

- Added some documentation for namespaces exposed to [[roam/cljs]] and [[roam/render]]
  - Output:: page [[roam/cljs]]
- added some more info to page [[roam/render]]
  - Output:: page [[roam/render]]

## April 1st, 2021

- [[roam/css]]
- 

## January 21st, 2021

- test

