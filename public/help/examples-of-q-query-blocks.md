# Examples of :q query blocks

- `:q` queries can be used to display the results of datomic/datascript queries in your Roam graph
  - If you're technically inclined (or prompt an AI to do it well), you can use these to very flexibly query any condition in your graph
  - Resources::
    - Query Reference Resource: https://docs.datomic.com/query/query-data-reference.html
      - **Tip:** If your variable name contains "uid", then in the table, shows block view or page view
    - Here's a very useful blog article on getting started with roam-flavored datascript queries: https://www.zsolt.blog/2021/01/Roam-Data-Structure-Query.html
- Video going through this feature and the demos below:
  - original video
    - {{[[video]]: https://www.loom.com/share/b384798d37904947afefe9059c71035e}}
  - video with quality of life improvements from [[March 28th, 2025]]
    - {{[[video]]: https://www.loom.com/share/a3e5f8126d924b3eb95c7c11209eceee}}
  - video with QOL improvements from [[March 31st, 2026]]
    - {{[[video]]: https://www.loom.com/share/f62d4893563143ae84cdae3640af6eb8}}

## Examples

#### Getting started example

- :q 
  "Number of pages in the graph"
  [:find (count ?page) . :where [?page :node/title _]]

#### Some other small examples

- (small = returning a single value, which is shown inline)
- :q 
  "Number of code blocks in the graph" 
  [:find (count ?b) . 
       :where [?b :block/string ?s]
                    [(clojure.string/starts-with? ?s "```")]]
- :q
  "Number of TODOs in the graph:"
  [:find (count ?b) . :where [?todo-page :node/title "TODO"] [?b :block/refs ?todo-page]]
- equivalent queries to the above, but without the title:
  - :q 
    [:find (count ?page) . :where [?page :node/title ?page-title]]
  - :q 
    [:find (count ?b) . 
         :where [?b :block/string ?s]
                      [(clojure.string/starts-with? ?s "```")]]
  - :q
    [:find (count ?b) . :where [?todo-page :node/title "TODO"] [?b :block/refs ?todo-page]]
- Here's an interesting query: 
  - :q "5 random pages in the graph"
    [:find (sample 5 ?class_title) .
        :where
        [?a_class_page :node/title ?class_title]
        [?a_class_page :block/uid ?class_page_uid]]

#### Some table examples 

- (we show as a table when the query returns a number of "columns" and a number of data)
  - Technically, we show as table [when the find spec denotes a relation](https://docs.datomic.com/query/query-data-reference.html#find-specs). This will look something like `:find ?a ?b` in the query
- 
- :q "All Roam pages with 'API' in their title, their first blocks"
  [:find ?page-title ?page-uid ?first-block-uid (count ?block)
   :where 
  [?page :node/title ?page-title]
  [?page :block/uid ?page-uid]
  [(clojure.string/includes? ?page-title "API")]
  [?page :block/children ?block]
  [?block :block/order 0]
  [?block :block/uid ?first-block-uid]]
-  
- :q "All Roam pages with 'API' in their title, sorted so that recently created at top"
  [:find ?page-uid ?create-time
   :where 
  [?page :node/title ?page-title]
  [?page :block/uid ?page-uid]
  [?page :create/time ?create-time]
  [(clojure.string/includes? ?page-title "API")]]
-  
- A more involved example: **All Readwise highlight pages**
  - the q
    - :q "All Readwise Highlight Pages, sorted so that recently created at top"
      [:find ?page-uid ?first-child-uid ?page-create-time
       :where 
      [?page :node/title ?page-title]
      ;; hack: readwise default template all page titles contain "(highlights)" string
      [(clojure.string/includes? ?page-title "(highlights)")]
      [?page :block/uid ?page-uid]
      [?page :create/time ?page-create-time]
      [?page :block/children ?b]
      [?b :block/order 0]
      [?b :block/uid ?first-child-uid]]
  - no such pages in this graph sadly, please check our video for a demo:
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FCDgZUSitGM.gif?alt=media&token=a36140c6-3719-460d-ace1-13d2f06e9aee)
-  
- Example:: q getting children of a block and parsing out number
  - sample data (student + roll number)
    - Alice 1
    - Bob 2
    - Claire 3
    - Herbert 43
    - Andy 78
  - the query
    - ```clojure
      [:find ?e ?s
       :where
       [?parent :block/uid "CQjUT-rQD"]
       [?parent :block/children ?e]
       [?e :block/string ?s]]```
    - :q ```clojure
      [:find ?e ?s
       :where
       [?parent :block/uid "CQjUT-rQD"]
       [?parent :block/children ?e]
       [?e :block/string ?s]]```
-  
- Example:: get 4 random pages in the graph
  - `:q "Pages in the graph" [:find ?p :where [?p :node/title]]`
  - :q "Pages in the graph" [:find ?p :where [?p :node/title]]
  - GIF
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2F3tX-_cHQeW.gif?alt=media&token=d10ee7af-80d0-4d26-9583-4f349de23633)
-  
- Example:: get current page and how many backrefs it has (this uses `current/page-title` )
  - the query
    - ```clojure
      [:find ?p (count ?b)
        :where
        [?p :node/title current/page-title]
        [?b :block/refs ?p]]```
    - :q ```clojure
      [:find ?p (count ?b)
        :where
        [?p :node/title current/page-title]
        [?b :block/refs ?p]]```
-  
- Example:: get additions to changelog in current calendar month (this uses the special symbols `ms/this-month-start` and `ms/this-month-end` )
  - How this works:
    - to minimize the number of results, we're also nesting results under parent results
    - we're also sorting via `?t` to get recent results at top (you can hide this column and keep sorting!)
  - the query
    - ```clojure
      [:find ?b ?t
        :where
        [?changelog-p :node/title "Change Log"]
        [?b :block/page ?changelog-p]
        [?b :create/time ?t]
        [(<= ms/this-month-start ?t ms/this-month-end)]]```
    - :q ```clojure
      [:find ?b ?t
        :where
        [?changelog-p :node/title "Change Log"]
        [?b :block/page ?changelog-p]
        [?b :create/time ?t]
        [(<= ms/this-month-start ?t ms/this-month-end)]]```
-   
- Example:: query to get backrefs of a page (in this example: [[Quality of Life Improvements]]) created by [a specific user]([[Baibhav Bista]]) in the current calendar year ((This uses the rules `(refs-page ?page-title ?b)`, `(created-by ?user-name ?block)`, and `(created-between ?t1 ?t2 ?b)`))
  - the query
    - ```clojure
      [:find ?b ?t
        :where
        [?b :block/uid ?uid]
        (refs-page "Quality of Life Improvements" ?b)
        (created-by "Baibhav Bista" ?b)
        [?b :create/time ?t]
        (created-between ms/this-year-start ms/this-year-end ?b)]```
  - in action ...
    - :q ```clojure
      [:find ?b ?t
        :where
        [?b :block/uid ?uid]
        (refs-page "Quality of Life Improvements" ?b)
        (created-by "Baibhav Bista" ?b)
        [?b :create/time ?t]
        (created-between ms/this-year-start ms/this-year-end ?b)]```
  - How this works:
    - this uses the rules `(refs-page ?page-title ?b)`, `(created-by ?user-name ?block)`, and `(created-between ?t1 ?t2 ?b)`
    - After getting the query, using the UI, we're also sorting in descending order of `?t`
      - (so that latest is at the top)
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2Fw3X0QeKFNz.png?alt=media&token=4bdfd9a3-a247-487e-90bf-ce3bb5e8ba0f)
-  
- Examples of queries our new `in-dnp-between`, `refs-dnp-between`, `in-or-refs-dnp-between` enable [[Examples of :q query blocks]]
  - (this roam graph does not have much content in daily note pages, so below queries will probably be empty, please copy and test in your own graphs)
  - DNP blocks this month with create time
    - `(in-dnp-between dnp/this-month-start dnp/this-month-end ?b)`
      - :q "DNP blocks this month with create time"
        [:find ?b ?t
         :where
         (in-dnp-between dnp/this-month-start dnp/this-month-end ?b)
         [?b :create/time ?t]]
  - TODOs from last week's daily notes or reffing those DNPs
    - `(in-or-refs-dnp-between dnp/last-week-start dnp/last-week-end ?b)`
      - :q "TODOs from last week's daily notes or reffing those DNPs"
        [:find ?b
         :where
         (in-or-refs-dnp-between dnp/last-week-start dnp/last-week-end ?b)
         (refs-page "TODO" ?b)]
  - Blocks referencing this week, written by particular user "Baibhav Bista"
    - `(refs-dnp-between dnp/this-week-start dnp/this-week-end ?b)`
      - :q "Blocks referencing this week, written by Baibhav"
        [:find ?b
         :where
         (refs-dnp-between dnp/this-week-start dnp/this-week-end ?b)
         (created-by "Baibhav Bista" ?b)
         [?b :create/time ?t]]
  - Blocks referencing this week, written by particular user "Baibhav Bista" (also filter out blocks already in those DNPs)
    - `(refs-dnp-between dnp/this-week-start dnp/this-week-end ?b)
      (not (in-dnp-between dnp/this-week-start dnp/this-week-end ?b))`
      - :q "Blocks referencing this week, written by Baibhav"
        [:find ?b
         :where
         (refs-dnp-between dnp/this-week-start dnp/this-week-end ?b)
         (not (in-dnp-between dnp/this-week-start dnp/this-week-end ?b))
         (created-by "Baibhav Bista" ?b)
         [?b :create/time ?t]]
-  
- One random old reference of the currently open page
  - I manually clicked on ... then 
    set sorting to be random
    set rows per column to a 1
  - To test it out, open the query below on the sidebar (shift click) and then go to a page with a lot of references like [[video]]
  - :q "One random old reference to open page" 
    [:find ?uid ?t 
    :where 
    (refs-page current/main-window-page-title ?b) 
    [?b :create/time ?t]
    [?b :block/uid ?uid]
    [(< ?t ms/-365D-start)]]
-  
- 
