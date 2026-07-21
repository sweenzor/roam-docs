# Roam-specific :q additions

- If you're a dev (or even if not!), you can use our very flexible query features to do the kinds of specialized queries you want
- **Ways to use it**
  - use our `:q` query blocks feature inside Roam
    - Teaser into the revamped `:q`
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FCDgZUSitGM.gif?alt=media&token=a36140c6-3719-460d-ace1-13d2f06e9aee)
    - you can checkout examples in [[Examples of :q query blocks]]
  - via our frontend API: [window.roamAlphaAPI.data.q](https://roamresearch.com/#/app/developer-documentation/page/SI3FNt3EQ)
  - via our backend API: [/api/graph/{graph-name}/q](https://roamresearch.com/#/app/developer-documentation/page/vbEj2bZql)
  - All but the backend API can use the additions we have detailed below
    Also note that below we will talk about and have examples for `:q` primarily, but the same additions work in the other ways of querying too
- **Custom symbols**
  - Description:: new special words/symbols are available to represent dates which you can use directly in the `:where` clause
    - Some examples:
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
  - Reference:: the special symbols available in `:q`
    - `current` 
      - **Usage notes:** Specify the location of the query or the block/page open on the main window
      - `current/block-id`
        - returns the :db/id for the block which has the `:q` query
          - It can be used directly in the first place in a where clause
            - for example `?e` in `[?e ?a ?v]`
      - `current/page-id`
        - returns the :db/id for the page whose child block has the `:q`
          - It can be used directly in the first place in a where clause
            - for example `?e` in `[?e ?a ?v]`
      - `current/page-title`
        - returns the title of the page where the `:q` exists
      - `current/block-uid`
        - returns the :block/uid for the block which has the `:q` query
      - `current/page-uid`
        - returns the :block/uid for the page whose child block has the `:q`
      - `current/main-window-page-title` **NEW ✨**
        - Returns the :node/title for the page open in the main window. If you're zoomed into a block, we get it's parent page's node/title
        - can be useful for queries you open in the sidebar. The query gets refreshed when page open on the left side (main window changes)
      - `current/main-window-page-uid` **NEW ✨**
        - Returns the :block/uid for the page in the main window. If you're zoomed into a block, we get it's parent page's block/uid
        - can be useful for queries you open in the sidebar. The query gets refreshed when page open on the left side (main window changes)
      - `current/main-window-page-id` **NEW ✨**
        - returns the :db/id for the page in the main window. If you're zoomed into a block, we get it's parent page's :db/id
          - It can be used directly in the first place in a where clause
            - for example `?e` in `[?e ?a ?v]`
        - can be useful for queries you open in the sidebar. The query gets refreshed when page open on the left side (main window changes)
      - `current/main-window-block-uid` **NEW ✨**
        - returns the :block/uid for the zoomed in block (or page!) open in the main window
        - can be useful for queries you open in the sidebar. The query gets refreshed when page open on the left side (main window changes)
      - `current/main-window-block-id` **NEW ✨**
        - returns the :db/id for the zoomed in block (or page!) open in the main window
          - It can be used directly in the first place in a where clause
            - for example `?e` in `[?e ?a ?v]`
        - can be useful for queries you open in the sidebar. The query gets refreshed when page open on the left side (main window changes)
    - `ms` 
      - **Usage notes: ** These return time in milliseconds. Primarily for use with  attributes like  `:create/time`/`:edit/time` 
        - for use with 
          - attributes like  `:create/time`/`:edit/time` 
          - or rules `(created-between ?t1 ?t2 ?b)`/`(edited-between ?t1 ?t2 ?b)`)
      - `ms/today-start`
        - equivalent to `:ms/+0D-start`
      - `ms/today-end`
        - equivalent to `:ms/+0D-end`
      - `ms/this-week-start`
        - equivalent to `:ms/+0W-start`
      - `ms/this-week-end`
        - equivalent to `:ms/+0W-end`
      - `ms/last-week-start`
        - equivalent to `:ms/-1W-start`
      - `ms/last-week-end`
        - equivalent to `:ms/-1W-end`
      - `ms/next-week-start`
        - equivalent to `:ms/+1W-start`
      - `ms/next-week-end`
        - equivalent to `:ms/+1W-end`
      - `ms/this-month-start`
      - `ms/this-month-end`
      - `ms/this-quarter-start`
      - `ms/this-quarter-end`
      - `ms/last-quarter-start`
        - equivalent to `:ms/-1Q-start`
      - `ms/this-year-start`
      - `ms/this-year-end`
      - `ms/+1D-end`
      - `ms/-5D-start`
      - `ms/+1D-start`
      - `ms/+1D-end`
      - `ms/+1W-end`
        - not equal to `ms/+7D-end`
        - notably not the same as `:ms/+7d-end`
        - is actually the end of next week
      - `ms/+1M-start`
        - next month's start millisecond
          - might be 31 days later or even 1 day later
      - `ms/+1Q-start`
        - next quarter's start millisecond
          - might be 90 days later or even 1 day later
      - `ms/+1Q-end`
      - `ms/+0Y-start`
        - not equal to `ms/+365D-start`
        - first millisecond of Jan 1 for this year
      - `ms/+0Y-end`
        - last millisecond of Dec 31 for this year
      - `ms/=2025-01-01-start`
      - `ms/=2025-12-31-end`
    - `dnp`
      - **Usage notes:** These resolve to page title (i.e. `:node/title`) for the relevant daily note page
      - `dnp/today`
      - `dnp/yesterday`
      - `dnp/tomorrow`
      - `dnp/-1D`
      - `dnp/+1D`
      - `dnp/this-week-start`
      - `dnp/this-week-end`
      - `dnp/this-month-start`
      - `dnp/this-quarter-start`
      - `dnp/this-year-end`
      - `dnp/=2025-01-01`
        - resolves to "January 1st, 2025"
- **Supported inbuilt rules**
  - Description::
    - Rules are packaged logic which can be used to more easily do common operations
      - more technical detail:
        - Datomic Rules reference: https://docs.datomic.com/query/query-data-reference.html#rules
        - what we're doing for :q inbuilt rules is providing a set of rules that we find useful when writing queries
          - Right now, we do not support custom rules/ability to pass your own rules
          - If you have the idea for a rule you think will be useful, please let us know!
    - An example:
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
  - **Reference:** The rules:
    - `(created-by ?user-name ?block)`
    - `(edited-by ?user-name ?block)`
    - `(by ?user-name ?block)`
    - `(refs-page ?page-title ?b)`
    - `(block-or-parent-refs-page ?page-title ?b)`
    - `(created-between ?t1 ?t2 ?b)`
    - `(edited-between ?t1 ?t2 ?b)`
    - `(in-dnp-between ?start-dnp ?end-dnp ?b)` **NEW ✨**
    - `(refs-dnp-between ?start-dnp ?end-dnp ?b)` **NEW ✨**
    - `(in-or-refs-dnp-between ?start-dnp ?end-dnp ?b)` **NEW ✨**
    - `(in-dnp ?dnp ?b)` **NEW ✨**
    - `(refs-dnp ?dnp ?b)` **NEW ✨**
    - `(in-or-refs-dnp ?dnp ?b)` **NEW ✨**
- ---
  - **NEW ✨**
