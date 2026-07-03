# Datomic Alpha API

#### **Important Note: ** This is the documentation for the [[Depreciated]] (& inactive) Datomic API. We have a new API! see it here, [[Roam Backend API (Beta)]]

#### Reference::

- Description::
  - The Datomic Alpha API allows you to programatically interact with **Experimental Roam Graphs**.
  - **Experimental Roam Graphs** make use of our new backend infrastructure and are separate from existing graphs.
    - Our goal is to migrate existing graphs to the new infrastructure when it is finalized.
  - Our goal with an Alpha release is to gather information on use cases and usage to further shape work on the API.
  - Any part of the API may change during the Alpha period.
  - Any data in **Experimental Roam Graphs** is subject to:
    - deletion
    - alteration
    - unintended access
  - **Do not use Experimental Graphs or the Datomic Alpha API for important or sensitive information.**
- terms::
  - **Experimental Roam Graphs**
    - Hosted Roam graph based on upcoming backend infrastructure.
  - **Datomic Alpha API**
    - programmatic interface to **Experimental Roam Graphs**s
  - **Block**
    - base structure in Roam, corresponding to visible blocks of text and other functionality.
  - **Page**
    - base structure in Roam, corresponding to the top level structure containing child blocks.
  - **API key**
    - Unique string that grants an app access to the **Datomic Alpha API**.
      - Your app always uses this key when communicating with the API.
    - Currently obtained by messaging the either Filipe or Josh in the Alpha API slack channel.
      - Please provide your roam login email when asking for an API key.
    - API keys are subject to the following quota
      - 500 requests per second, with burst of 2,500 requests
      - 100,000 requests per month starting on the 1st day
      - If these are insufficient for your use case, please get in touch.
  - **API token**
    - Unique string that grants an app access to an **Experimental Roam Graphs**.
      - Your app stores this token for an users graph.
- Usage::
  - The API can only interact with graphs created via the `Create Experimental Graph` button on the `Hosted Graphs` section of https://roamresearch.com/#/app
    - this button is only visible for users that are part of the alpha.
  - The API receives a payload containing both the action to be performed and the action parameters.
  - REST API
    - The REST API exposes a single URL where payloads are sent over HTTPS POST together with a header containing the API key.
      - The **API key** must be provided in a `x-api-key` header.
      - The **API token** must be provided in a `x-api-token` header.
      - Payload format must be provided via the `Content-Type` header.
        - Returns will use the same format.
      - Supported formats:
        - `application/edn`
          - See https://github.com/edn-format/edn for specification
          - See https://github.com/edn-format/edn/wiki/Implementations for implementations.
        - `application/json`
          - Widely available across most programming languages.
        - `application/transit+json`
          - See https://github.com/cognitect/transit-format#specification for specification
          - See https://github.com/cognitect/transit-format#implementations for implementations
  - JS SDK
    - The Roam web client exposes the `window.roamDatomicAlphaAPI` JS SDK as a convenient way to access the API from within `roam/js` or the browser console.
      - when using the SDK the `graph-name` action parameter is automatically filled in to the current graph.
      - no **API key** or **API token** is needed when using the JS SDK.
      - payload format is always JSON for the JS SDK.
  - The API is currently based on [Datomic](https://www.datomic.com/) dialect of [Datalog](https://en.wikipedia.org/wiki/Datalog)
    - the extent to which Datomic and Datalog is exposed is the final API is under consideration.
    - [Learn Datalog Today](http://www.learndatalogtoday.org/) is an excellent resource for those curious about Datalog. 
    - [Datomic's docs](https://docs.datomic.com/on-prem/query.html) are also a great place to learn more about its flavour of Datalog
- status::
  - **Experimental Roam Graphs** are **available** to Alpha participants
  - **Datomic Alpha API** is **available** and **under active development**.
  - REST API is **available**.
  - JS SDK is **available**.
  - Actions are **missing return documentation**.
    - actions that create entities should return them, allowing you to use the newly created entity.
  - Entity schema is **missing documentation**.
- known problems::
  - Attributes do not work
    - Creating or updating a block with an attribute in it won't update attribute tables correctly, please do not use
- action parameter schema::
  - `graph-name`
    - Name of the graph.
    - string
  - `selector`
    - Datomic Pull pattern
      - see https://docs.datomic.com/on-prem/pull.html for details
    - string
    - **required**
  - `query`
    - Datomic query
      - see https://docs.datomic.com/on-prem/query.html for details
      - where clauses are limited to only data patterns.
    - string
  - `inputs`
    - Datomic query inputs
      - see https://docs.datomic.com/on-prem/query.html for details
    - vector of any
  - `block`
    - `uid`
      - Unique identifier for the block.
      - string
    - `string`
      - Text content of the block.
      - string
    - `open`
      - Collapse state of the block.
      - boolean
  - `location`
    - `parent-uid`
      - Unique Identifier for block parent under which the block should be inserted.
      - string
    - `order`
      - Index where the block should be inserted under the parent.
        - Starts at zero.
      - string
  - `page`
    - `uid`
      - Unique identifier for the page.
      - string
    - `title`
      - Title of the page.
      - string
- actions::
  - read
    - `pull`
      - Description::
        - Pull is a declarative way to make hierarchical (and possibly nested) selections of information about entities.
        - Exposes [Datomic Pull](https://docs.datomic.com/cloud/query/query-pull.html) over graph entities.
      - Parameters::
        - `graph-name` **required**
        - `selector` **required**
        - `uid` **required**
      - Usage::
        - Retrieve the string of block `yS-It9SFL`.
          - JS SDK
            - ```javascript
              roamDatomicAlphaAPI({
                "action": "pull",
                "selector": "[:block/string]",
                "uid": "yS-It9SFL"
              });```
          - REST API
            - ```shell
              curl \
               -X POST https://4c67k7zc26.execute-api.us-west-2.amazonaws.com/v1/alphaAPI \
               -H "Content-Type: application/edn" \
               -H "x-api-key: YOUR_API_KEY_HERE" \
               -H "x-api-token: GRAPH_TOKEN_HERE" \
               -d '{:action     "pull" 
                    :graph-name "an-experimental-graph"
                    :selector   [:block/string]
                    :uid        "yS-It9SFL"}'```
    - `q`
      - Description::
        - Deductive query.
        - Exposes [Datomic Query](https://docs.datomic.com/cloud/query/query-data-reference.html) over graph entities.
      - Parameters::
        - `graph-name` **required**
        - `query` **required**
        - `inputs` **optional**
      - Usage::
        - Get all titles. 
          - JS SDK
            - ```javascript
              await roamDatomicAlphaAPI({
                "action": "q",
                "query": "[:find ?t \
                           :where [?e :node/title ?t]]"});```
          - REST API
            - ```shell
              curl \
               -X POST https://4c67k7zc26.execute-api.us-west-2.amazonaws.com/v1/alphaAPI \
               -H "Content-Type: application/edn" \
               -H "x-api-key: YOUR_API_KEY_HERE" \
               -H "x-api-token: GRAPH_TOKEN_HERE" \
               -d '{:action     "q" 
                    :graph-name "an-experimental-graph"
                    :query      "[:find ?t
                                  :where
                                  [?e :node/title ?t]]"}'```
        - Get all pages.
          - JS SDK
            - ```javascript
              await roamDatomicAlphaAPI({
                "action": "q",
                "query": "[:find (pull ?page [*]) \
                      	 :where \
                           [?page :node/title]]"});```
          - REST API
            - ```shell
              curl \
               -X POST https://4c67k7zc26.execute-api.us-west-2.amazonaws.com/v1/alphaAPI \
               -H "Content-Type: application/edn" \
               -H "x-api-key: YOUR_API_KEY_HERE" \
               -H "x-api-token: GRAPH_TOKEN_HERE" \
               -d '{:action     "q" 
                    :graph-name "an-experimental-graph"
                    :query      "[:find (pull ?page [*])
                                   :where
                                   [?page :node/title]]"}'```
        - Get all pages in the left sidebar.
          - JS SDK
            - ```javascript
              await roamDatomicAlphaAPI({
                "action": "q",
                "query": "[:find (pull ?page [*]) \
                           :where \
                           [?page :page/sidebar]]"});```
          - REST API
            - ```shell
              curl \
               -X POST https://4c67k7zc26.execute-api.us-west-2.amazonaws.com/v1/alphaAPI \
               -H "Content-Type: application/edn" \
               -H "x-api-key: YOUR_API_KEY_HERE" \
               -H "x-api-token: GRAPH_TOKEN_HERE" \
               -d '{:action     "q" 
                    :graph-name "an-experimental-graph"
                    :query      "[:find (pull ?page [*])
                                  :where \
                                  [?page :page/sidebar]]"}'```
        - Get all blocks' strings and their uids.
          - JS SDK
            - ```javascript
              await roamDatomicAlphaAPI({
                "action": "q",
                "query": "[:find (pull ?block [:block/string :block/uid]) \
                      	 :where \
                           [?block :block/string]]"});```
          - REST API
            - ```shell
              curl \
               -X POST https://4c67k7zc26.execute-api.us-west-2.amazonaws.com/v1/alphaAPI \
               -H "Content-Type: application/edn" \
               -H "x-api-key: YOUR_API_KEY_HERE" \
               -H "x-api-token: GRAPH_TOKEN_HERE" \
               -d '{:action     "q" 
                    :graph-name "an-experimental-graph"
                    :query      "[:find (pull ?block [:block/string :block/uid])
                                  :where
                                  [?block :block/string]]"}'```
        - Get all pages and their blocks in a tree structure.
          - JS SDK
            - ```javascript
              await roamDatomicAlphaAPI({
                "action": "q",
                "query": "[:find (pull ?page [:node/title :block/uid :block/string :block/order {:block/children ...}]) \
                           :where \
                           [?page :node/title] \
                           [?page :block/children]]"});```
          - REST API
            - ```shell
              curl \
               -X POST https://4c67k7zc26.execute-api.us-west-2.amazonaws.com/v1/alphaAPI \
               -H "Content-Type: application/edn" \
               -H "x-api-key: YOUR_API_KEY_HERE" \
               -H "x-api-token: GRAPH_TOKEN_HERE" \
               -d '{:action     "q" 
                    :graph-name "an-experimental-graph"
                    :query      "[:find (pull ?page [:node/title :block/uid :block/string :block/order {:block/children ...}])
                           		:where
                         		    [?page :node/title]
                                  [?page :block/children]]"}'```
        - Get the page with the title `"October 4th, 2020"` and its blocks in a tree structure.
          - JS SDK
            - ```javascript

              let title = "October 4th, 2020"
              await roamDatomicAlphaAPI({
                "action": "q",
                "query": "[:find (pull ?page [:node/title :block/uid :block/string :block/order {:block/children ...}]) \
                           :in $ ?title \
              			 :where \
                           [?page :node/title ?title] \
                           [?page :block/children]]",
                "inputs": [title]});```
          - REST API
            - ```shell
              curl \
               -X POST https://4c67k7zc26.execute-api.us-west-2.amazonaws.com/v1/alphaAPI \
               -H "Content-Type: application/edn" \
               -H "x-api-key: YOUR_API_KEY_HERE" \
               -H "x-api-token: GRAPH_TOKEN_HERE" \
               -d '{:action     "q" 
                    :graph-name "an-experimental-graph"
                    :inputs     ["October 4th, 2020"]
                    :query      "[:find (pull ?page [:node/title :block/uid :block/string :block/order {:block/children ...}])
                                  :in $ ?title
                                  :where
                                  [?page :node/title ?title]
                                  [?page :block/children]]"}'```
  - write
    - block
      - `create-block`
        - Description::
          - Create a new block at a location.
        - Parameters::
          - `graph-name` **required**
          - `location`
            - `parent-uid` **required**
            - `order` **required**
          - `block`
            - `string` **required**
            - `uid` **optional**
        - Usage::
          - Create a block as the first child under `09-22-2020` with the text `Mondays are cool!`
            - JS SDK
              - ```javascript
                roamDatomicAlphaAPI({
                  "action": "create-block",
                  "location": {
                    "parent-uid": "09-22-2020",
                    "order": 0
                  },
                  "block": {
                    "string": "Mondays are cool!"
                  }
                });```
            - REST API
              - ```shell
                curl \
                 -X POST https://4c67k7zc26.execute-api.us-west-2.amazonaws.com/v1/alphaAPI \
                 -H "Content-Type: application/edn" \
                 -H "x-api-key: YOUR_API_KEY_HERE" \
                 -H "x-api-token: GRAPH_TOKEN_HERE" \
                 -d '{:action     "create-block" 
                      :graph-name "an-experimental-graph"
                      :location   {:parent-uid "09-22-2020"
                                   :order      0}
                      :block      {:string "Mondays are cool!"}}'```
      - `move-block`
        - Description::
          - Move a block to a new location.
        - Parameters::
          - `graph-name` **required**
          - `location`
            - `parent-uid` **required**
            - `order` **required**
          - `block`
            - `uid` **required**
        - Usage::
          - Move block `yS-It9SFL` as the 6th child under `09-23-2020`.
            - JS SDK
              - ```javascript
                roamDatomicAlphaAPI({
                  "action": "move-block",
                  "location": {
                    "parent-uid": "09-23-2020",
                    "order": 5
                  },
                  "block": {
                    "uid": "yS-It9SFL"
                  }
                });```
            - REST API
              - ```shell
                curl \
                 -X POST https://4c67k7zc26.execute-api.us-west-2.amazonaws.com/v1/alphaAPI \
                 -H "Content-Type: application/edn" \
                 -H "x-api-key: YOUR_API_KEY_HERE" \
                 -H "x-api-token: GRAPH_TOKEN_HERE" \
                 -d '{:action     "move-block" 
                      :graph-name "an-experimental-graph"
                      :location   {:parent-uid "09-23-2020"
                                   :order      5}
                      :block      {:uid "yS-It9SFL"}}'```
      - `update-block`
        - Description::
          - Update a blocks text and/or collapsed state.
        - Parameters::
          - `graph-name` **required**
          - `block`
            - `uid` **required**
            - `string` **required**
            - `open` **optional**
        - Usage::
          - Set `yS-It9SFL` to be closed with the text `Poof!`.
            - JS SDK
              - ```javascript
                roamDatomicAlphaAPI({
                  "action": "update-block",
                  "block": {
                    "uid": "yS-It9SFL",
                    "open": false,
                    "string": "Poof!"
                  }
                });```
            - REST API
              - ```shell
                curl \
                 -X POST https://4c67k7zc26.execute-api.us-west-2.amazonaws.com/v1/alphaAPI \
                 -H "Content-Type: application/edn" \
                 -H "x-api-key: YOUR_API_KEY_HERE" \
                 -H "x-api-token: GRAPH_TOKEN_HERE" \
                 -d '{:action     "update-block" 
                      :graph-name "an-experimental-graph"
                      :block      {:uid    "yS-It9SFL"
                                   :open   false
                                   :string "Poof!"}}'```
      - `delete-block`
        - Description::
          - Delete a block and all its children, and recalculates order of sibling blocks.
        - Parameters::
          - `graph-name` **required**
          - `block`
            - `uid` **required**
        - Usage::
          - Delete block `yS-It9SFL`.
            - JS SDK
              - ```javascript
                roamDatomicAlphaAPI({
                  "action": "delete-block",
                  "block": {
                    "uid": "yS-It9SFL"
                  }
                });```
            - REST API
              - ```shell
                curl \
                 -X POST https://4c67k7zc26.execute-api.us-west-2.amazonaws.com/v1/alphaAPI \
                 -H "Content-Type: application/edn" \
                 -H "x-api-key: YOUR_API_KEY_HERE" \
                 -H "x-api-token: GRAPH_TOKEN_HERE" \
                 -d '{:action     "delete-block" 
                      :graph-name "an-experimental-graph"
                      :block      {:uid "yS-It9SFL"}}'```
    - page
      - `create-page`
        - Description::
          - Create a new page with a given title.
          - Pages with title in the format of `September 22nd, 2020` will create a new daily note if it does not yet exist.
        - Parameters::
          - `graph-name` **required**
          - `page`
            - `title` **required**
            - `uid` **optional**
        - Usage::
          - Create a new page titled `Reminder Inbox`.
            - JS SDK
              - ```javascript
                roamDatomicAlphaAPI({
                  "action": "create-page",
                  "page": {
                    "title": "Reminder Inbox"
                  }
                });```
            - REST API
              - ```shell
                curl \
                 -X POST https://4c67k7zc26.execute-api.us-west-2.amazonaws.com/v1/alphaAPI \
                 -H "Content-Type: application/edn" \
                 -H "x-api-key: YOUR_API_KEY_HERE" \
                 -H "x-api-token: GRAPH_TOKEN_HERE" \
                 -d '{:action     "create-page" 
                      :graph-name "an-experimental-graph"
                      :page       {:title "Reminder Inbox"}}'```
      - `update-page`
        - Description::
          - Update a pages title.
        - Parameters::
          - `graph-name` **required**
          - `page`
            - `uid` **required**
            - `title` **required**
        - Usage::
          - Change title of page `aY-ItUT65` to `Testing Alpha API`.
            - JS SDK
              - ```javascript
                roamDatomicAlphaAPI({
                  "action": "update-page",
                  "page": {
                    "uid": "aY-ItUT65"
                    "title": "Testing Alpha API"
                  }
                });```
            - REST API
              - ```shell
                curl \
                 -X POST https://4c67k7zc26.execute-api.us-west-2.amazonaws.com/v1/alphaAPI \
                 -H "Content-Type: application/edn" \
                 -H "x-api-key: YOUR_API_KEY_HERE" \
                 -H "x-api-token: GRAPH_TOKEN_HERE" \
                 -d '{:action     "update-page" 
                      :graph-name "an-experimental-graph"
                      :page       {:uid   "aY-ItUT65"
                                   :title "Testing Alpha API"}}'```
      - `delete-page`
        - Description::
          - Delete a page and all its children blocks.
        - Parameters::
          - `graph-name` **required**
          - `page`
            - `uid` **required**
        - Usage::
          - Delete page `09-22-2020`.
            - JS SDK
              - ```javascript
                roamDatomicAlphaAPI({
                  "action": "delete-page",
                  "page": {
                    "uid": "09-22-2020"
                  }
                });```
            - REST API
              - ```shell
                curl \
                 -X POST https://4c67k7zc26.execute-api.us-west-2.amazonaws.com/v1/alphaAPI \
                 -H "Content-Type: application/edn" \
                 -H "x-api-key: YOUR_API_KEY_HERE" \
                 -H "x-api-token: GRAPH_TOKEN_HERE" \
                 -d '{:action     "delete-page" 
                      :graph-name "an-experimental-graph"
                      :page       {:uid "09-22-2020"}}'```
