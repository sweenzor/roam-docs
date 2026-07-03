# datalog-block-query

- Older [[Loom video]]s
  - Demo 1
    - {{[[video]]: https://www.loom.com/share/4c8e47aeb7b3481f8dae22f4718abe06}}
  - Motivating example
    - {{[[video]]: https://www.loom.com/share/54af60339efc47c598f1dd07b2262b92}}
- [[January 12th, 2022]]
  - [[Loom video]]: {{[[video]]: https://www.loom.com/share/89387c67013844138d4bd6e39832515b}}
  - The new things
    - refresh button
      - Just to be clear, the thing refreshes automatically during loading of the component. you only need to refresh if you keep it open (in the sidebar or something) and want to rerun the query again
      - not made completely reactive since datascript queries are less performant than `{{queries}}` (which we've tuned)
    - rules
      - how they look like in the query
        - :in $ %
      - How rules are specified as arguments
        - rules:: 
          ```clojure
          [[(rule-a ?a ?b)
            ...]
           [(rule-b ?a ?b)
            ...]
           ...]```
    - `{{queries}}` as input
      - {{[[query]]: {and: [[Adam Krivka]] [[Roam Alpha API]]}}}
      - How the above query would be specified as argument
        - query->uids:: {and: [[Adam Krivka]] [[Roam Alpha API]]}
    - block refs as query
      - same pattern as roam/render
  - Base query
    - {{[[query]]: {and: [[Adam Krivka]] [[Roam Alpha API]]}}}
  - Test data
    - ** [[Adam Krivka]] has written a bunch of stuff you can consult for [[Roam Alpha API]]**
  - rules + `{{queries}}` as input 
    - Here we're using datalog to filter the outputs of the Base query
    - {{datalog-block-query: 
      [:find [?uid ...]
       :in $ % [?uid ...]
       :where
       [?block :block/uid ?uid]
       (created-by ?block "Baibhav Bista")]
      }}
      - rules::
        ```clojure
        [
         ;; rule that checks if a block was created by user with given name
         [(created-by ?block ?user-page-title)
          [?user-page :node/title ?user-page-title]
          [?user :user/display-page ?user-page]
          [?block :create/user ?user]]
         
         ;; an example of an OR using rules
         [(created-by-either ?block ?user-page-title-1 ?user-page-title-2)
          (created-by ?block ?user-page-title-1)]
         [(created-by-either ?block ?user-page-title-1 ?user-page-title-2)
          (created-by ?block ?user-page-title-2)]
        ]```
      - query->uids:: {and: [[Adam Krivka]] [[Roam Alpha API]]}
  - block refs as query
    - Here we're using a pattern similar to [[roam/render]] i.e. passing a block ref as argument to datalog-block-query
      - the arguments will then be the children of the block being reffed 
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
            (->>
              block-ents
              (group-by #(count (:block/_refs %)))))```
