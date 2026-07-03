# Roam Backend API (Beta)

#### **Description**

- If you want to capture to both unencrypted & encrypted graphs, please checkout our Append API docs instead: [[Roam Append API]]
- [[Postman]] Public workspace to play around with
  - https://www.postman.com/roamresearch/workspace/roam-research-backend-api/collection/27948971-ac6bd2a2-c0f0-4259-abc1-78bde0a01958
    - A walkthrough [[Loom video]]: https://www.loom.com/share/2f14c2331b65439a81632b9b94400160
- These are the docs for Roam Beta Backend API
- We would love any testers. Please report any issues in the #developers channel in the [[Roam Slack]] or via email to [support@roamrsearch.com](mailto:support@roamresearch.com)
  - invitation link: https://join.slack.com/t/roamresearch/shared_invite/zt-1x2y9jkx1-KkSjlsWeTdfXy5H8hMB7tg
- Currently in Public Beta
- Some caveats
  - encrypted graphs don’t work (and will not work in the future, except for maybe an append API)
  - a request to a brand new graph will fail on the first request but the second request should go through (we’ll fix this soon)

#### Change Log::

- [[April 30th, 2024]]
  - Releasing `pull-many` endpoint: `/api/graph/{graph-name}/pull-many` (POST)
  - Proper documentation for all error codes: **What does response look like?** (with **HTTP status codes**)
- [[March 7th, 2024]]
  - Better error reporting for `batch-actions` write requests
    - We're now returning `num-actions-successfully-transacted-before-failure` in the `response.data` so you can figure out which action in your request failed
      - > If batch action had 5 txs and the 3rd action failed, this means the first 2 actions were successfully transacted. In this case, `num-actions-successfully-transacted-before-failure` would be `2`
    - More more info and background, please read: **What happens on failure of any particular action in the batch action?**
- [[July 29th, 2023]]
  - For the `create-block` and `move-block` write actions, you can pass a different parameter `page-title`. If you use this instead of `parent-uid`, it will create the page if it does not exist already
    - `location`
      - `page-title`
        - You can use this if you want the location of the block to be a direct child of a page. 
        - Can either be 
          - a string corresponding to page's title
            - example: 
              "location": {"page-title": **"Roam Backend API (Beta)"**}
          - or
          - a map of the form `{"daily-note-page": "MM-DD-YYYY"}`.
            - **(Use this for Daily Notes Pages)**
            - example: 
              "location": {"page-title": **{"daily-note-page": "07-29-2023"}** }
- [[November 23rd, 2022]]
  - Breaking change for format of response for pulls (and for queries with pull params)
    - Previously, response.body looked like the following
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2F8jf_dApP6-.png?alt=media&token=b7dd0ec1-9d37-489b-8536-60c7be9b2157)
    - Now it looks like
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FrF0B6tKOc3.png?alt=media&token=937181c0-03c8-4be9-bc89-c4560dd84974)
    - The change therefore is that keys inside of the "result" have ":" at the beginning
    - The rationale for this change is to minimize the number of different formats across frontend and the backend, a concern which was raised by @David Vargas here: https://roamresearch.slack.com/archives/C02TMKXNVS6/p1663773904953259
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FQjS_ERpIUy.png?alt=media&token=9f6990e3-d109-474f-8506-8aec79f39f5d)
    - Fixing this in your code should be pretty simple - in the places where you're handling the "result" of query and/or pull, you want to change the keys of type "namespace/property" to ":namespace/property"
    - Sorry for the inconvenience caused!
  - Better (More secure) API Tokens
    - [[Screenshot]]
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FHfSSrPx1_U.png?alt=media&token=5f40ddc8-4cfa-4a8c-89a8-748f65bcb80c)
    - Now, the only time you can get the secret token is when you're creating the token. you cannot copy it later
      - this prevents others (malicious code/malicious person who somehow got access to your machine one time) from being able to copy your long lived tokens
      - Internally, instead of storing the secret token, Roam only stores the hashed value of the tokens. So, the secret token can never be recovered.
    - However, this does mean that this is a new token format. So, please remove your old tokens and create new ones (the old ones will stop working on [[December 1st, 2022]])
    - way to get an API token is same as before: You can create and edit roam-graph-tokens from a new section "API tokens" in the "Graph" tab in the Settings, Please just make you do ... > Check for updates
  - **Graph-specific Usage Quotas**

#### **Authentication**

- Requests to the API use graph specific tokens for authentication
- You can only get/create these if you own the graph i.e. if you're the admin of the graph
- These start with `roam-graph-token-`
- You can create and edit roam-graph-tokens from a new section "API tokens" in the "Graph" tab in the Settings
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Froamteam%2FkqaM1ePPbV.png?alt=media&token=e113f2b5-4fbe-4b75-8d30-a114a6aa0f8d)
- How to pass the tokens in the request?
  - pass them in the `X-Authorization` header
    - you can use the `Authorization` header too (would be more secure) but you have to make sure that your code/library handles redirect properly and passes the authorization header when redirect has been followed (and the latter is generally not default behavior for most network libraries) 
  - Make sure they're prefixed with a `Bearer `
  - An example
    - `Bearer roam-graph-token-t_OjqgIAH1JZphzP4HxjJNad55lLFKpsqIM7x3bW`
- To use the Backend API, you need a roam-graph-token with either a "read+edit" or a "read-only" role
  - roam-graph-tokens with "append-only" roles can only be used with the [[Roam Append API]]
- A [[cURL]] request example
  - ```shell
    curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/q" --location-trusted \
    -H  "accept: application/json" \
    -H  "X-Authorization: Bearer roam-graph-token-for-MY-GRAPH-1JN132hnXUYIfso22" \
    -H  "Content-Type: application/json" \
    -d "{\"query\" : \"[:find ?block-uid ?block-str :in \$ ?search-string :where [?b :block/uid ?block-uid] [?b :block/string ?block-str] [(clojure.string/includes? ?block-str ?search-string)]]\", \"args\": [\"apple\"]}"```
    - queries a graph named "MY-GRAPH" given a datalog `query` and `args`
  - Some important points
    - `--location-trusted` is required because your request is redirected to the actual machine doing the work. 
      - More info
        - There is a sharding mechanism in place (such that different graphs run on different machines)
        - `https://api.roamresearch.com/` abstracts away this from the developer point of view, by redirecting messages to the actual machine doing the work
    - As mentioned earlier in **Authentication**, you have to make sure that the tokens are prefixed with a `Bearer ` and are passed in the Authorization header

#### SDKs

- Please prefer using [our sdks](https://github.com/Roam-Research/backend-sdks)
  - [typescript](https://www.npmjs.com/package/@roam-research/roam-api-sdk)
  - [clojure](https://github.com/Roam-Research/backend-sdks/tree/master/clojure)
  - [python](https://github.com/Roam-Research/backend-sdks/tree/master/python)
  - [java](https://github.com/Roam-Research/backend-sdks/tree/master/java)
  - [rust](https://crates.io/crates/roam-sdk)

#### Reference::

- **Endpoint base url:** https://api.roamresearch.com/
- **API routes**
  - `/api/graph/{graph-name}/q` (POST)
    - Example query
      - query-params (body)
        - ```javascript
          {
            "query" : "[:find ?block-uid ?block-str :in $ ?search-string :where [?b :block/uid ?block-uid] [?b :block/string ?block-str] [(clojure.string/includes? ?block-str ?search-string)]]", 
            "args": ["apple"]
          }```
      - [[cURL]] request
        - ```shell
          curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/q" --location-trusted \
          -H  "accept: application/json" \
          -H  "X-Authorization: Bearer roam-graph-token-for-MY-GRAPH-1JN132hnXUYIfso22" \
          -H  "Content-Type: application/json" \
          -d "{\"query\" : \"[:find ?block-uid ?block-str :in \$ ?search-string :where [?b :block/uid ?block-uid] [?b :block/string ?block-str] [(clojure.string/includes? ?block-str ?search-string)]]\", \"args\": [\"apple\"]}"```
          - queries a graph named "MY-GRAPH" given a datalog `query` and `args`
      - sample output structure
        - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Foz9l5Y0q7B.png?alt=media&token=7c7dffd4-6729-4f75-99bc-a0d00589fa3b)
  - `/api/graph/{graph-name}/pull` (POST)
    - body of the request (pull-params) should have the following keys
      - `eid`
      - `selector`
    - Example query
      - pull-params
        - ```javascript
          {
            "eid":       "[:block/uid \"08-30-2022\"]", 
            "selector": "[:block/uid :node/title :block/string {:block/children [:block/uid :block/string]} {:block/refs [:node/title :block/string :block/uid]}]"
          }```
      - [[cURL]] request
        - ```shell
          curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/pull" --location-trusted \
          -H  "accept: application/json" \
          -H  "Authorization: Bearer roam-graph-token-for-MY-GRAPH-1JN132hnXUYIfso22" \
          -H  "Content-Type: application/json" \
          -d "{\"eid\": \"[:block/uid \\\"08-30-2022\\\"]\", \"selector\": \"[:block/uid :node/title :block/string {:block/children [:block/uid :block/string]}{:block/refs [:node/title :block/string :block/uid]}]\"}"```
      - sample output structure
        - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Fb-o1HKrX_N.png?alt=media&token=7e6c9ef0-1162-4478-8cba-f0bf3c419deb)
  - `/api/graph/{graph-name}/pull-many` (POST)
    - body of the request (pull-params) should have the following keys
      - `eids`
      - `selector`
    - Example query
      - pull-params
        - ```javascript
          {
            "eids":       "[[:block/uid \"08-30-2022\"] [:block/uid \"08-31-2022\"]]", 
            "selector": "[:block/uid :node/title :block/string {:block/children [:block/uid :block/string]} {:block/refs [:node/title :block/string :block/uid]}]"
          }```
      - [[cURL]] request
        - ```shell
          curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/pull-many" --location-trusted \
          -H  "accept: application/json" \
          -H  "Authorization: Bearer roam-graph-token-for-MY-GRAPH-1JN132hnXUYIfso22" \
          -H  "Content-Type: application/json" \
          -d "{\"eids\": \"[[:block/uid \\\"08-30-2022\\\"]]\", \"selector\": \"[:block/uid :node/title :block/string {:block/children [:block/uid :block/string]}{:block/refs [:node/title :block/string :block/uid]}]\"}"```
      - Output is the same as pull, but an array of pull results
  - `/api/graph/{graph-name}/write` (POST)
    - We have a **single endpoint** for all the different write actions. The way you differentiate between the actions is by passing the name of the action as value for the `action` key (alongside all the other required parameters)
    - Showcase Example: 
      - Look at the params for `create-block` write action:
        - Parameters::
          - `location`
            - `parent-uid` **required**
            - `order` **required**
          - `block`
            - `string` **required**
            - `uid` **optional**
            - `open` **optional**
            - `heading` **optional**
            - `text-align` **optional**
            - `children-view-type` **optional**
            - `block-view-type` **optional**
      - This is what we would pass in the request body
        - ```javascript
          {
              "action" : "create-block", 
              "location": {
                  "parent-uid": "09-28-2022",
                  "order": "last"
              },
              "block": {
                  "string": "new block created via the backend",
                  "open": false,
                  "heading": 2,
                  "text-align": "right",
                  "children-view-type": "document"
              }
          }```
          - you can see that we're passing "action" alongside the parameters "location" and "block" (which are from the action specific params above)
      - Full writeup of a write request to the backend
        - Example request showing all the possible properties (you can always omit the **optional** params if not needed)
          - This request creates a new block with given string in given location and sets its open state, makes it a heading 2, makes it align right and sets the children to be shown as a document
            - [[Screenshot]] [[Output]]
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FRw8wp3hX0n.png?alt=media&token=d3f46916-4d69-4c19-b389-cc063ed4f621)
          - Example Endpoint: `/api/graph/MY-GRAPH/write` (POST)
          - Request body (passed as "application/json")
            - ```javascript
              {
                  "action" : "create-block", 
                  "location": {
                      "parent-uid": "09-28-2022",
                      "order": "last"
                  },
                  "block": {
                      "string": "new block created via the backend",
                      "open": false,
                      "heading": 2,
                      "text-align": "right",
                      "children-view-type": "document"
                  }
              }```
          - [[cURL]] request
            - ```shell
              curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/write" --location-trusted \
              -H  "accept: application/json" \
              -H  "Authorization: Bearer roam-graph-token-for-MY-GRAPH-1JN132hnXUYIfso22" \
              -H  "Content-Type: application/json" \
              -d "{\"action\":\"create-block\",\"location\":{\"parent-uid\":\"09-28-2022\",\"order\":\"last\"},\"block\":{\"string\":\"new block created via the backend\",\"open\":false,\"heading\":2,\"text-align\":\"right\",\"children-view-type\":\"document\"}}"```
    - How does the response look? aka Possible responses
      - Please checkout **What does response look like?** (with **HTTP status codes**)
    - You can also batch multiple write actions in a single request to the server. This means that they happen in order and return response when all the actions have completed. For info on how to use, see `batch-actions` 
      (It's might be better to go through this after looking at a few write actions and understanding how that works)
    - **available write actions** (contains documentation and example for each)
      - `create-block`
        - equivalent to roamAlphaAPI.block.create
        - Description::
          - Creates a new block at a location
        - Parameters::
          - `location`
            -  **required**
              - `parent-uid`
              - or
              - `page-title`
                - `page-title`
                  - You can use this if you want the location of the block to be a direct child of a page. 
                  - Can either be 
                    - a string corresponding to page's title
                      - example: 
                        "location": {"page-title": **"Roam Backend API (Beta)"**}
                    - or
                    - a map of the form `{"daily-note-page": "MM-DD-YYYY"}`.
                      - **(Use this for Daily Notes Pages)**
                      - example: 
                        "location": {"page-title": **{"daily-note-page": "07-29-2023"}** }
            - `order` **required**
          - `block`
            - `string` **required**
            - `uid` **optional**
            - `open` **optional**
            - `heading` **optional**
            - `text-align` **optional**
            - `children-view-type` **optional**
            - `block-view-type` **optional**
        - Returns::
          - (If you're building an integration, be sure to implement at least the response codes below)
          - 200 OK #important
            - if successful
            - If q request , see sample output structure
            - if pull request, see sample output structure
            - if write request, 200 status code in response means all done
          - 308 PERMANENT REDIRECT
            - the API endpoint for backend API i.e. **Endpoint base url:** https://api.roamresearch.com/ actually returns the actual URL you want to hit for your read/write requests
            - In many cases, the network tool/library you're using will follow the redirect without additional config on your side
          - 4XX BAD REQUEST (with error message specifying what went wrong)
            - 400 BAD REQUEST #important
              - this error code is returned in many cases. So, please checkout response body's `message` value
              - some cases
                - When input format error / invalid parameter values
                  - Example:: if we pass `"order": 2` in the update-block example request
                    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FCYOavPuw7p.png?alt=media&token=a1a7301b-e12a-4385-983f-3d6489a7916f)
                - If write request fails
                  - For `batch-actions` especially, You have to carefully handle this (to know how many requests suceeded)
                    - Please checkout **What happens on failure of any particular action in the batch action?**
                      - We validate arguments for all actions first, then transact/handle the actions one after another in sequence. If there is an error transacting the action, we bail on it and all subsequent actions. 
                        This means that out of the `n` actions in a batch action request, the first `x` could succeed/transact and if then error occurs, the remaining `n-x` ones would not happen
                        - you can use `num-actions-successfully-transacted-before-failure` to figure out where exactly in the actions list the error happened
                - When one is trying to use an Encrypted graph
                  - Encrypted graphs are NOT supported by the [[Roam Backend API (Beta)]]
                - When no graph name in request, or invalid graph name
                - If invalid write action
                - When token cannot be verified or improperly formatted
            - 401 UNAUTHORIZED #important
              - If one is unauthorized or if one does not have required access to the graph (read/write)
              - Please note that in some cases, When token cannot be verified or improperly formatted returns a 400 BAD REQUEST #important
                - this is a bug on our part, but changing it now could break existing integrations, so leaving it like this for this version of the API
            - 404 NOT FOUND
              - If the API route you're calling is not found
                - i.e. if you request an API route NOT in **API routes**
            - 429 TOO MANY REQUESTS #important
              - When you run into the per graph limit/quota. See **Graph-specific Usage Quotas**
                - Currently set to __50 requests/minute/graph__
          - 500 INTERNAL SERVER ERROR #important ( default fallback code for errors  )
            - default fallback code for errors 
              - So, please checkout response body's `message` value
            - If you get this & message does not make clarify, please contact us at support@roamresearch.com or in the developers slack
            - Some cases
              - If message contains "**took too long to run**", then the query/pull request is running into our time limit (20 seconds for now). In this case, you want to request less data or add limits. 
                - You might want to add limited recursion limits to pull specs: https://docs.datomic.com/pro/query/pull.html#recursive-specifications
          - 503 SERVICE UNAVAILABLE #important
            - if graph is not ready for requests yet or is unavailable at the moment. If you get this, please try again in a bit
            - Example
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FOFF0WgypQ2.png?alt=media&token=99704237-587c-4046-ab08-67b03a0143a3)
        - Usage::
          - Example request showing all the possible properties (you can always omit the **optional** params if not needed)
            - This request creates a new block with given string in given location and sets its open state, makes it a heading 2, makes it align right and sets the children to be shown as a document
              - [[Screenshot]] [[Output]]
                - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FRw8wp3hX0n.png?alt=media&token=d3f46916-4d69-4c19-b389-cc063ed4f621)
            - Example Endpoint: `/api/graph/MY-GRAPH/write` (POST)
            - Request body (passed as "application/json")
              - ```javascript
                {
                    "action" : "create-block", 
                    "location": {
                        "parent-uid": "09-28-2022",
                        "order": "last"
                    },
                    "block": {
                        "string": "new block created via the backend",
                        "open": false,
                        "heading": 2,
                        "text-align": "right",
                        "children-view-type": "document"
                    }
                }```
            - [[cURL]] request
              - ```shell
                curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/write" --location-trusted \
                -H  "accept: application/json" \
                -H  "Authorization: Bearer roam-graph-token-for-MY-GRAPH-1JN132hnXUYIfso22" \
                -H  "Content-Type: application/json" \
                -d "{\"action\":\"create-block\",\"location\":{\"parent-uid\":\"09-28-2022\",\"order\":\"last\"},\"block\":{\"string\":\"new block created via the backend\",\"open\":false,\"heading\":2,\"text-align\":\"right\",\"children-view-type\":\"document\"}}"```
      - `move-block`
        - equivalent to roamAlphaAPI.block.move (other than accepting a new argument `page-title` in `location`)
        - Description::
          - Move a block to a new location
        - Parameters::
          - `block`
            - `uid` **required**
          - `location`
            -  **required**
              - `parent-uid`
              - or
              - `page-title`
                - `page-title`
                  - You can use this if you want the location of the block to be a direct child of a page. 
                  - Can either be 
                    - a string corresponding to page's title
                      - example: 
                        "location": {"page-title": **"Roam Backend API (Beta)"**}
                    - or
                    - a map of the form `{"daily-note-page": "MM-DD-YYYY"}`.
                      - **(Use this for Daily Notes Pages)**
                      - example: 
                        "location": {"page-title": **{"daily-note-page": "07-29-2023"}** }
            - `order` **required**
        - Returns::
          - (If you're building an integration, be sure to implement at least the response codes below)
          - 200 OK #important
            - if successful
            - If q request , see sample output structure
            - if pull request, see sample output structure
            - if write request, 200 status code in response means all done
          - 308 PERMANENT REDIRECT
            - the API endpoint for backend API i.e. **Endpoint base url:** https://api.roamresearch.com/ actually returns the actual URL you want to hit for your read/write requests
            - In many cases, the network tool/library you're using will follow the redirect without additional config on your side
          - 4XX BAD REQUEST (with error message specifying what went wrong)
            - 400 BAD REQUEST #important
              - this error code is returned in many cases. So, please checkout response body's `message` value
              - some cases
                - When input format error / invalid parameter values
                  - Example:: if we pass `"order": 2` in the update-block example request
                    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FCYOavPuw7p.png?alt=media&token=a1a7301b-e12a-4385-983f-3d6489a7916f)
                - If write request fails
                  - For `batch-actions` especially, You have to carefully handle this (to know how many requests suceeded)
                    - Please checkout **What happens on failure of any particular action in the batch action?**
                      - We validate arguments for all actions first, then transact/handle the actions one after another in sequence. If there is an error transacting the action, we bail on it and all subsequent actions. 
                        This means that out of the `n` actions in a batch action request, the first `x` could succeed/transact and if then error occurs, the remaining `n-x` ones would not happen
                        - you can use `num-actions-successfully-transacted-before-failure` to figure out where exactly in the actions list the error happened
                - When one is trying to use an Encrypted graph
                  - Encrypted graphs are NOT supported by the [[Roam Backend API (Beta)]]
                - When no graph name in request, or invalid graph name
                - If invalid write action
                - When token cannot be verified or improperly formatted
            - 401 UNAUTHORIZED #important
              - If one is unauthorized or if one does not have required access to the graph (read/write)
              - Please note that in some cases, When token cannot be verified or improperly formatted returns a 400 BAD REQUEST #important
                - this is a bug on our part, but changing it now could break existing integrations, so leaving it like this for this version of the API
            - 404 NOT FOUND
              - If the API route you're calling is not found
                - i.e. if you request an API route NOT in **API routes**
            - 429 TOO MANY REQUESTS #important
              - When you run into the per graph limit/quota. See **Graph-specific Usage Quotas**
                - Currently set to __50 requests/minute/graph__
          - 500 INTERNAL SERVER ERROR #important ( default fallback code for errors  )
            - default fallback code for errors 
              - So, please checkout response body's `message` value
            - If you get this & message does not make clarify, please contact us at support@roamresearch.com or in the developers slack
            - Some cases
              - If message contains "**took too long to run**", then the query/pull request is running into our time limit (20 seconds for now). In this case, you want to request less data or add limits. 
                - You might want to add limited recursion limits to pull specs: https://docs.datomic.com/pro/query/pull.html#recursive-specifications
          - 503 SERVICE UNAVAILABLE #important
            - if graph is not ready for requests yet or is unavailable at the moment. If you get this, please try again in a bit
            - Example
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FOFF0WgypQ2.png?alt=media&token=99704237-587c-4046-ab08-67b03a0143a3)
        - Usage::
          - Example request
            - This request moves block with given uid to the page "09-27-2022" and keeps it in order 3 (i.e. the 4th element, since order is zero-indexed)
              - [[Screenshot]] [[Output]]
                - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Fp8RtZH5Jej.png?alt=media&token=d6cbbb37-191c-4979-85b0-c85eb41cc323)
            - Example Endpoint: `/api/graph/MY-GRAPH/write` (POST)
            - Request body
              - ```javascript
                {
                    "action" : "move-block", 
                    "block": {
                        "uid": "7yYBPW-WO"
                    },
                    "location": {
                        "parent-uid": "09-27-2022",
                        "order": 3
                    }
                }```
            - [[cURL]] request
              - ```shell
                curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/write" --location-trusted \
                -H  "accept: application/json" \
                -H  "Authorization: Bearer roam-graph-token-for-MY-GRAPH-1JN132hnXUYIfso22" \
                -H  "Content-Type: application/json" \
                -d "{\"action\":\"move-block\",\"block\":{\"uid\":\"7yYBPW-WO\"},\"location\":{\"parent-uid\":\"09-27-2022\",\"order\":3}}"```
      - `update-block`
        - equivalent to roamAlphaAPI.block.update
        - Description::
          - Updates a block's text and/or other properties like collapsed state, heading, text-align, children-view-type
        - Parameters::
          - `block`
            - `uid` **required**
            - `string` **optional**
            - `open` **optional**
            - `heading` **optional**
            - `text-align` **optional**
            - `children-view-type` **optional**
            - `block-view-type` **optional**
        - Returns::
          - (If you're building an integration, be sure to implement at least the response codes below)
          - 200 OK #important
            - if successful
            - If q request , see sample output structure
            - if pull request, see sample output structure
            - if write request, 200 status code in response means all done
          - 308 PERMANENT REDIRECT
            - the API endpoint for backend API i.e. **Endpoint base url:** https://api.roamresearch.com/ actually returns the actual URL you want to hit for your read/write requests
            - In many cases, the network tool/library you're using will follow the redirect without additional config on your side
          - 4XX BAD REQUEST (with error message specifying what went wrong)
            - 400 BAD REQUEST #important
              - this error code is returned in many cases. So, please checkout response body's `message` value
              - some cases
                - When input format error / invalid parameter values
                  - Example:: if we pass `"order": 2` in the update-block example request
                    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FCYOavPuw7p.png?alt=media&token=a1a7301b-e12a-4385-983f-3d6489a7916f)
                - If write request fails
                  - For `batch-actions` especially, You have to carefully handle this (to know how many requests suceeded)
                    - Please checkout **What happens on failure of any particular action in the batch action?**
                      - We validate arguments for all actions first, then transact/handle the actions one after another in sequence. If there is an error transacting the action, we bail on it and all subsequent actions. 
                        This means that out of the `n` actions in a batch action request, the first `x` could succeed/transact and if then error occurs, the remaining `n-x` ones would not happen
                        - you can use `num-actions-successfully-transacted-before-failure` to figure out where exactly in the actions list the error happened
                - When one is trying to use an Encrypted graph
                  - Encrypted graphs are NOT supported by the [[Roam Backend API (Beta)]]
                - When no graph name in request, or invalid graph name
                - If invalid write action
                - When token cannot be verified or improperly formatted
            - 401 UNAUTHORIZED #important
              - If one is unauthorized or if one does not have required access to the graph (read/write)
              - Please note that in some cases, When token cannot be verified or improperly formatted returns a 400 BAD REQUEST #important
                - this is a bug on our part, but changing it now could break existing integrations, so leaving it like this for this version of the API
            - 404 NOT FOUND
              - If the API route you're calling is not found
                - i.e. if you request an API route NOT in **API routes**
            - 429 TOO MANY REQUESTS #important
              - When you run into the per graph limit/quota. See **Graph-specific Usage Quotas**
                - Currently set to __50 requests/minute/graph__
          - 500 INTERNAL SERVER ERROR #important ( default fallback code for errors  )
            - default fallback code for errors 
              - So, please checkout response body's `message` value
            - If you get this & message does not make clarify, please contact us at support@roamresearch.com or in the developers slack
            - Some cases
              - If message contains "**took too long to run**", then the query/pull request is running into our time limit (20 seconds for now). In this case, you want to request less data or add limits. 
                - You might want to add limited recursion limits to pull specs: https://docs.datomic.com/pro/query/pull.html#recursive-specifications
          - 503 SERVICE UNAVAILABLE #important
            - if graph is not ready for requests yet or is unavailable at the moment. If you get this, please try again in a bit
            - Example
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FOFF0WgypQ2.png?alt=media&token=99704237-587c-4046-ab08-67b03a0143a3)
        - Usage::
          - Example request showing all the possible properties
            - This request updates the block string, its open state, makes it a heading 2, makes it align at center and sets the children to be shown numbered
              - [[Screenshot]] [[Output]]
                - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Fzj_VdlOSRN.png?alt=media&token=700a9b33-76d9-4149-aeb5-5b13538ea6f0)
                - (open state only shows up after reload because it prefers local state when present)
            - Example Endpoint: `/api/graph/MY-GRAPH/write` (POST)
            - Request body (passed as "application/json")
              - ```javascript
                {
                    "action" : "update-block", 
                    "block": {
                        "uid": "51v-orCLm",
                        "string": "new string from the backend",
                        "open": false,
                        "heading": 2,
                        "text-align": "center",
                        "children-view-type": "numbered"
                    }
                }```
            - [[cURL]] request
              - ```shell
                curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/write" --location-trusted \
                -H  "accept: application/json" \
                -H  "Authorization: Bearer roam-graph-token-for-MY-GRAPH-1JN132hnXUYIfso22" \
                -H  "Content-Type: application/json" \
                -d "{\"action\":\"update-block\",\"block\":{\"uid\":\"51v-orCLm\",\"string\":\"new string from the backend\",\"open\":false,\"heading\":2,\"text-align\":\"center\",\"children-view-type\":\"numbered\"}}"```
      - `delete-block`
        - equivalent to roamAlphaAPI.block.delete
        - Description::
          - Delete a block and all its children, and recalculates order of sibling blocks
        - Parameters::
          - `block`
            - `uid` **required**
        - Returns::
          - (If you're building an integration, be sure to implement at least the response codes below)
          - 200 OK #important
            - if successful
            - If q request , see sample output structure
            - if pull request, see sample output structure
            - if write request, 200 status code in response means all done
          - 308 PERMANENT REDIRECT
            - the API endpoint for backend API i.e. **Endpoint base url:** https://api.roamresearch.com/ actually returns the actual URL you want to hit for your read/write requests
            - In many cases, the network tool/library you're using will follow the redirect without additional config on your side
          - 4XX BAD REQUEST (with error message specifying what went wrong)
            - 400 BAD REQUEST #important
              - this error code is returned in many cases. So, please checkout response body's `message` value
              - some cases
                - When input format error / invalid parameter values
                  - Example:: if we pass `"order": 2` in the update-block example request
                    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FCYOavPuw7p.png?alt=media&token=a1a7301b-e12a-4385-983f-3d6489a7916f)
                - If write request fails
                  - For `batch-actions` especially, You have to carefully handle this (to know how many requests suceeded)
                    - Please checkout **What happens on failure of any particular action in the batch action?**
                      - We validate arguments for all actions first, then transact/handle the actions one after another in sequence. If there is an error transacting the action, we bail on it and all subsequent actions. 
                        This means that out of the `n` actions in a batch action request, the first `x` could succeed/transact and if then error occurs, the remaining `n-x` ones would not happen
                        - you can use `num-actions-successfully-transacted-before-failure` to figure out where exactly in the actions list the error happened
                - When one is trying to use an Encrypted graph
                  - Encrypted graphs are NOT supported by the [[Roam Backend API (Beta)]]
                - When no graph name in request, or invalid graph name
                - If invalid write action
                - When token cannot be verified or improperly formatted
            - 401 UNAUTHORIZED #important
              - If one is unauthorized or if one does not have required access to the graph (read/write)
              - Please note that in some cases, When token cannot be verified or improperly formatted returns a 400 BAD REQUEST #important
                - this is a bug on our part, but changing it now could break existing integrations, so leaving it like this for this version of the API
            - 404 NOT FOUND
              - If the API route you're calling is not found
                - i.e. if you request an API route NOT in **API routes**
            - 429 TOO MANY REQUESTS #important
              - When you run into the per graph limit/quota. See **Graph-specific Usage Quotas**
                - Currently set to __50 requests/minute/graph__
          - 500 INTERNAL SERVER ERROR #important ( default fallback code for errors  )
            - default fallback code for errors 
              - So, please checkout response body's `message` value
            - If you get this & message does not make clarify, please contact us at support@roamresearch.com or in the developers slack
            - Some cases
              - If message contains "**took too long to run**", then the query/pull request is running into our time limit (20 seconds for now). In this case, you want to request less data or add limits. 
                - You might want to add limited recursion limits to pull specs: https://docs.datomic.com/pro/query/pull.html#recursive-specifications
          - 503 SERVICE UNAVAILABLE #important
            - if graph is not ready for requests yet or is unavailable at the moment. If you get this, please try again in a bit
            - Example
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FOFF0WgypQ2.png?alt=media&token=99704237-587c-4046-ab08-67b03a0143a3)
        - Usage::
          - Example request showing all the possible properties
            - This request updates the block string, its open state, makes it a heading 2, makes it align at center and sets the children to be shown numbered
            - Example Endpoint: `/api/graph/MY-GRAPH/write` (POST)
            - Request body (passed as "application/json")
              - ```javascript
                {
                    "action" : "delete-block", 
                    "block": {
                        "uid": "7yYBPW-WO"
                    }
                }```
            - [[cURL]] request
              - ```shell
                curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/write" --location-trusted \
                -H  "accept: application/json" \
                -H  "Authorization: Bearer roam-graph-token-for-MY-GRAPH-1JN132hnXUYIfso22" \
                -H  "Content-Type: application/json" \
                -d "{\"action\":\"update-block\",\"block\":{\"uid\":\"51v-orCLm\",\"string\":\"new string from the backend\",\"open\":false,\"heading\":2,\"text-align\":\"center\",\"children-view-type\":\"numbered\"}}"```
      - `create-page`
        - equivalent to roamAlphaAPI.page.create
        - Description::
          - Creates a new page with a given title
          - Pages with title in the format of `January 21st, 2021` will create a new daily note if it does not yet exist
        - Parameters::
          - `page`
            - `title` **required**
            - `uid` **optional**
              - in normal operation, should not be required
            - `children-view-type` **optional**
        - Returns::
          - (If you're building an integration, be sure to implement at least the response codes below)
          - 200 OK #important
            - if successful
            - If q request , see sample output structure
            - if pull request, see sample output structure
            - if write request, 200 status code in response means all done
          - 308 PERMANENT REDIRECT
            - the API endpoint for backend API i.e. **Endpoint base url:** https://api.roamresearch.com/ actually returns the actual URL you want to hit for your read/write requests
            - In many cases, the network tool/library you're using will follow the redirect without additional config on your side
          - 4XX BAD REQUEST (with error message specifying what went wrong)
            - 400 BAD REQUEST #important
              - this error code is returned in many cases. So, please checkout response body's `message` value
              - some cases
                - When input format error / invalid parameter values
                  - Example:: if we pass `"order": 2` in the update-block example request
                    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FCYOavPuw7p.png?alt=media&token=a1a7301b-e12a-4385-983f-3d6489a7916f)
                - If write request fails
                  - For `batch-actions` especially, You have to carefully handle this (to know how many requests suceeded)
                    - Please checkout **What happens on failure of any particular action in the batch action?**
                      - We validate arguments for all actions first, then transact/handle the actions one after another in sequence. If there is an error transacting the action, we bail on it and all subsequent actions. 
                        This means that out of the `n` actions in a batch action request, the first `x` could succeed/transact and if then error occurs, the remaining `n-x` ones would not happen
                        - you can use `num-actions-successfully-transacted-before-failure` to figure out where exactly in the actions list the error happened
                - When one is trying to use an Encrypted graph
                  - Encrypted graphs are NOT supported by the [[Roam Backend API (Beta)]]
                - When no graph name in request, or invalid graph name
                - If invalid write action
                - When token cannot be verified or improperly formatted
            - 401 UNAUTHORIZED #important
              - If one is unauthorized or if one does not have required access to the graph (read/write)
              - Please note that in some cases, When token cannot be verified or improperly formatted returns a 400 BAD REQUEST #important
                - this is a bug on our part, but changing it now could break existing integrations, so leaving it like this for this version of the API
            - 404 NOT FOUND
              - If the API route you're calling is not found
                - i.e. if you request an API route NOT in **API routes**
            - 429 TOO MANY REQUESTS #important
              - When you run into the per graph limit/quota. See **Graph-specific Usage Quotas**
                - Currently set to __50 requests/minute/graph__
          - 500 INTERNAL SERVER ERROR #important ( default fallback code for errors  )
            - default fallback code for errors 
              - So, please checkout response body's `message` value
            - If you get this & message does not make clarify, please contact us at support@roamresearch.com or in the developers slack
            - Some cases
              - If message contains "**took too long to run**", then the query/pull request is running into our time limit (20 seconds for now). In this case, you want to request less data or add limits. 
                - You might want to add limited recursion limits to pull specs: https://docs.datomic.com/pro/query/pull.html#recursive-specifications
          - 503 SERVICE UNAVAILABLE #important
            - if graph is not ready for requests yet or is unavailable at the moment. If you get this, please try again in a bit
            - Example
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FOFF0WgypQ2.png?alt=media&token=99704237-587c-4046-ab08-67b03a0143a3)
        - Usage::
          - Example request
            - This request creates a page with title "List of participants". Since this page is only meant to contain the names of participants, also set "children-view-type" to "numbered"
              - [[Screenshot]] [[Output]]
                - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FgEOyMdoetk.png?alt=media&token=688ac303-54d7-40da-aeba-54ae7b9784af)
            - Example Endpoint: `/api/graph/MY-GRAPH/write` (POST)
            - Request body (passed as "application/json")
              - ```javascript
                {
                    "action" : "create-page", 
                    "page": {
                        "title": "List of participants",
                        "children-view-type": "numbered"
                    }
                }```
            - [[cURL]] request
              - ```shell
                curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/write" --location-trusted \
                -H  "accept: application/json" \
                -H  "Authorization: Bearer roam-graph-token-for-MY-GRAPH-1JN132hnXUYIfso22" \
                -H  "Content-Type: application/json" \
                -d "{\"action\":\"create-page\",\"page\":{\"title\":\"List of participants\",\"children-view-type\":\"numbered\"}}"```
      - `update-page`
        - equivalent to roamAlphaAPI.page.update
        - Description::
          - Updates a page's title and/or its children-view-type
        - Parameters::
          - `page`
            - `uid` **required**
            - `title` **optional**
            - `children-view-type` **optional**
        - Returns::
          - (If you're building an integration, be sure to implement at least the response codes below)
          - 200 OK #important
            - if successful
            - If q request , see sample output structure
            - if pull request, see sample output structure
            - if write request, 200 status code in response means all done
          - 308 PERMANENT REDIRECT
            - the API endpoint for backend API i.e. **Endpoint base url:** https://api.roamresearch.com/ actually returns the actual URL you want to hit for your read/write requests
            - In many cases, the network tool/library you're using will follow the redirect without additional config on your side
          - 4XX BAD REQUEST (with error message specifying what went wrong)
            - 400 BAD REQUEST #important
              - this error code is returned in many cases. So, please checkout response body's `message` value
              - some cases
                - When input format error / invalid parameter values
                  - Example:: if we pass `"order": 2` in the update-block example request
                    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FCYOavPuw7p.png?alt=media&token=a1a7301b-e12a-4385-983f-3d6489a7916f)
                - If write request fails
                  - For `batch-actions` especially, You have to carefully handle this (to know how many requests suceeded)
                    - Please checkout **What happens on failure of any particular action in the batch action?**
                      - We validate arguments for all actions first, then transact/handle the actions one after another in sequence. If there is an error transacting the action, we bail on it and all subsequent actions. 
                        This means that out of the `n` actions in a batch action request, the first `x` could succeed/transact and if then error occurs, the remaining `n-x` ones would not happen
                        - you can use `num-actions-successfully-transacted-before-failure` to figure out where exactly in the actions list the error happened
                - When one is trying to use an Encrypted graph
                  - Encrypted graphs are NOT supported by the [[Roam Backend API (Beta)]]
                - When no graph name in request, or invalid graph name
                - If invalid write action
                - When token cannot be verified or improperly formatted
            - 401 UNAUTHORIZED #important
              - If one is unauthorized or if one does not have required access to the graph (read/write)
              - Please note that in some cases, When token cannot be verified or improperly formatted returns a 400 BAD REQUEST #important
                - this is a bug on our part, but changing it now could break existing integrations, so leaving it like this for this version of the API
            - 404 NOT FOUND
              - If the API route you're calling is not found
                - i.e. if you request an API route NOT in **API routes**
            - 429 TOO MANY REQUESTS #important
              - When you run into the per graph limit/quota. See **Graph-specific Usage Quotas**
                - Currently set to __50 requests/minute/graph__
          - 500 INTERNAL SERVER ERROR #important ( default fallback code for errors  )
            - default fallback code for errors 
              - So, please checkout response body's `message` value
            - If you get this & message does not make clarify, please contact us at support@roamresearch.com or in the developers slack
            - Some cases
              - If message contains "**took too long to run**", then the query/pull request is running into our time limit (20 seconds for now). In this case, you want to request less data or add limits. 
                - You might want to add limited recursion limits to pull specs: https://docs.datomic.com/pro/query/pull.html#recursive-specifications
          - 503 SERVICE UNAVAILABLE #important
            - if graph is not ready for requests yet or is unavailable at the moment. If you get this, please try again in a bit
            - Example
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FOFF0WgypQ2.png?alt=media&token=99704237-587c-4046-ab08-67b03a0143a3)
        - Usage::
          - Example request which updates the title of the page with given uid
            - Example Endpoint: `/api/graph/MY-GRAPH/write` (POST)
            - Request body (passed as "application/json")
              - ```javascript
                {
                    "action" : "update-page", 
                    "page": {
                        "uid": "xK98D8L7U",
                        "title": "List of participants (updated)"
                    }
                }```
            - [[cURL]] request
              - ```shell
                curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/write" --location-trusted \
                -H  "accept: application/json" \
                -H  "Authorization: Bearer roam-graph-token-for-MY-GRAPH-1JN132hnXUYIfso22" \
                -H  "Content-Type: application/json" \
                -d "{\"action\":\"update-page\",\"page\":{\"uid\":\"xK98D8L7U\",\"title\":\"List of participants (updated)\"}}"```
            - [[Screenshot]] [[Output]]
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FuGX_aFYC0M.png?alt=media&token=d54b08ef-f8c0-4145-813f-f735c8461a65)
      - `delete-page`
        - equivalent to roamAlphaAPI.page.delete
        - Description::
          - Delete a page and all its children blocks
        - Parameters::
          - `page`
            - `uid` **required**
        - Returns::
          - (If you're building an integration, be sure to implement at least the response codes below)
          - 200 OK #important
            - if successful
            - If q request , see sample output structure
            - if pull request, see sample output structure
            - if write request, 200 status code in response means all done
          - 308 PERMANENT REDIRECT
            - the API endpoint for backend API i.e. **Endpoint base url:** https://api.roamresearch.com/ actually returns the actual URL you want to hit for your read/write requests
            - In many cases, the network tool/library you're using will follow the redirect without additional config on your side
          - 4XX BAD REQUEST (with error message specifying what went wrong)
            - 400 BAD REQUEST #important
              - this error code is returned in many cases. So, please checkout response body's `message` value
              - some cases
                - When input format error / invalid parameter values
                  - Example:: if we pass `"order": 2` in the update-block example request
                    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FCYOavPuw7p.png?alt=media&token=a1a7301b-e12a-4385-983f-3d6489a7916f)
                - If write request fails
                  - For `batch-actions` especially, You have to carefully handle this (to know how many requests suceeded)
                    - Please checkout **What happens on failure of any particular action in the batch action?**
                      - We validate arguments for all actions first, then transact/handle the actions one after another in sequence. If there is an error transacting the action, we bail on it and all subsequent actions. 
                        This means that out of the `n` actions in a batch action request, the first `x` could succeed/transact and if then error occurs, the remaining `n-x` ones would not happen
                        - you can use `num-actions-successfully-transacted-before-failure` to figure out where exactly in the actions list the error happened
                - When one is trying to use an Encrypted graph
                  - Encrypted graphs are NOT supported by the [[Roam Backend API (Beta)]]
                - When no graph name in request, or invalid graph name
                - If invalid write action
                - When token cannot be verified or improperly formatted
            - 401 UNAUTHORIZED #important
              - If one is unauthorized or if one does not have required access to the graph (read/write)
              - Please note that in some cases, When token cannot be verified or improperly formatted returns a 400 BAD REQUEST #important
                - this is a bug on our part, but changing it now could break existing integrations, so leaving it like this for this version of the API
            - 404 NOT FOUND
              - If the API route you're calling is not found
                - i.e. if you request an API route NOT in **API routes**
            - 429 TOO MANY REQUESTS #important
              - When you run into the per graph limit/quota. See **Graph-specific Usage Quotas**
                - Currently set to __50 requests/minute/graph__
          - 500 INTERNAL SERVER ERROR #important ( default fallback code for errors  )
            - default fallback code for errors 
              - So, please checkout response body's `message` value
            - If you get this & message does not make clarify, please contact us at support@roamresearch.com or in the developers slack
            - Some cases
              - If message contains "**took too long to run**", then the query/pull request is running into our time limit (20 seconds for now). In this case, you want to request less data or add limits. 
                - You might want to add limited recursion limits to pull specs: https://docs.datomic.com/pro/query/pull.html#recursive-specifications
          - 503 SERVICE UNAVAILABLE #important
            - if graph is not ready for requests yet or is unavailable at the moment. If you get this, please try again in a bit
            - Example
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FOFF0WgypQ2.png?alt=media&token=99704237-587c-4046-ab08-67b03a0143a3)
        - Usage::
          - Example request which deletes a block given the uid
            - Example Endpoint: `/api/graph/MY-GRAPH/write` (POST)
            - Request body (passed as "application/json")
              - ```javascript
                {
                    "action" : "delete-page", 
                    "page": {
                        "uid": "xK98D8L7U"
                    }
                }```
            - [[cURL]] request
              - ```shell
                curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/write" --location-trusted \
                -H  "accept: application/json" \
                -H  "Authorization: Bearer roam-graph-token-for-MY-GRAPH-1JN132hnXUYIfso22" \
                -H  "Content-Type: application/json" \
                -d "{\"action\":\"delete-page\",\"page\":{\"uid\":\"xK98D8L7U\"}}"```
      - `batch-actions`
        - Use this if you want to do multiple write actions in a single request, in order, without having to wait for round trip between your code and Roam's backend server each time
        - Usage::
          - use the write-action `batch-actions` and pass the actions as a list under the key `actions`
            - i.e. Request body (in "application/json" format) should look like this
              - ```javascript
                {
                   "action": "batch-actions",
                   "actions": [
                     {
                       "action": "create-block"
                       "location": {...},
                       "block": {...}
                     },
                     {
                       "action": "write-action-2"
                       //... params required by write-action-2
                     },
                     {
                       "action": "write-action-3"
                       //... params required by write-action-3
                     },
                   ] 
                }```
          - tempids
            - Instead of passing actual uid strings in "uid" or "parent-uid", you can also pass negative integers and reuse them across a batch
            - if you're using the negative integers tempids, in the response, you will receive data with "tempids-to-uids" key. See example below
              - Response #Output is a 200 OK with the following data
                - ```javascript
                  {
                      "tempids-to-uids": {
                          -1: "EBiw8LzPb",
                          -2: "X4DelKvsP"
                      }
                  }```
          - Example request showing creation of a page and three blocks as children, and then moving of one of the blocks around
            - [[Screenshot]] [[Output]]
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2F7fhzwaddcu.png?alt=media&token=16a09d77-9239-4d30-90af-a9be683bbca5)
            - Example Endpoint: `/api/graph/MY-GRAPH/write` (POST)
            - Request body (passed as "application/json")
              - ```javascript
                {
                    "action" : "batch-actions", 
                    "actions": [
                        {
                            "action": "create-page",
                            "page": {
                                "title": "Batch action test page",
                                "uid": -1
                            }
                        },
                        {
                            "action": "create-block",
                            "location": {
                                "parent-uid": -1,
                                "order": "last"
                            },
                            "block": {
                                "string": "First"
                            }
                        },
                        {
                            "action": "create-block",
                            "location": {
                                "parent-uid": -1,
                                "order": "last"
                            },
                            "block": {
                                "string": "Third"
                            }
                        },
                        {
                            "action": "create-block",
                            "location": {
                                "parent-uid": -1,
                                "order": "last"
                            },
                            "block": {
                                "string": "Second",
                                "uid": -2
                            }
                        },
                        {
                            "action": "move-block",
                            "block": {
                                "uid": -2
                            },
                            "location": {
                                "parent-uid": -1,
                                "order": 1
                            }
                        }
                    ]
                }```
            - [[cURL]] request
              - ```shell
                curl -X POST "https://api.roamresearch.com/api/graph/MY-GRAPH/write" --location-trusted \
                -H  "accept: application/json" \
                -H  "Authorization: Bearer roam-graph-token-for-MY-GRAPH-1JN132hnXUYIfso22" \
                -H  "Content-Type: application/json" \
                -d "{\"action\":\"batch-actions\",\"actions\":[{\"action\":\"create-page\",\"page\":{\"title\":\"Batch action test page\",\"uid\":-1}},{\"action\":\"create-block\",\"location\":{\"parent-uid\":-1,\"order\":\"last\"},\"block\":{\"string\":\"First\"}},{\"action\":\"create-block\",\"location\":{\"parent-uid\":-1,\"order\":\"last\"},\"block\":{\"string\":\"Third\"}},{\"action\":\"create-block\",\"location\":{\"parent-uid\":-1,\"order\":\"last\"},\"block\":{\"string\":\"Second\",\"uid\":-2}},{\"action\":\"move-block\",\"block\":{\"uid\":-2},\"location\":{\"parent-uid\":-1,\"order\":1}}]}"```
            - Response #Output is a 200 OK with the following data
              - ```javascript
                {
                    "tempids-to-uids": {
                        -1: "EBiw8LzPb",
                        -2: "X4DelKvsP"
                    }
                }```
        - **What happens on failure of any particular action in the batch action?**
          - We validate arguments for all actions first, then transact/handle the actions one after another in sequence. If there is an error transacting the action, we bail on it and all subsequent actions. 
            This means that out of the `n` actions in a batch action request, the first `x` could succeed/transact and if then error occurs, the remaining `n-x` ones would not happen
            - you can use `num-actions-successfully-transacted-before-failure` to figure out where exactly in the actions list the error happened
          - Error's `response.body` contains
            - `message`
              - the error message relevant to the failing action
              - If you have a batch action with a number of create-blocks and one fails, `message` could have a value like `"Error in create-block: Block already exists"`
                - So, this is the specific error that happened 
                - If you want to understand the error at a higher level, please checkout the `batch-error-message`
            - `num-actions-successfully-transacted-before-failure`
              - **important**
              - If batch action had 5 txs and the 3rd action failed, this means the first 2 actions were successfully transacted. In this case, `num-actions-successfully-transacted-before-failure` would be `2`
              - This value is useful in case you want to retry the action and do not want to redo the actions (in the start of the list) which have already been done successfully
            - `batch-error-message`
              - Error message which gives a more holistic view of what went wrong in the context of the whole batch action.
                - Is different from `message` because `message` returns the technical thing that went wrong, while `batch-error-message` is more on a meta level
              - Some examples of what this might look like
                - "Error during validation of the batch-action. No actions were successful/transacted."
                - "Error partway through handling a batch-actions request. The first `num-actions-successfully-transacted-before-failure` actions were successful/transacted. The action immediately after that is the one that failed."
          - Examples:: Some errors and response [[Screenshot]]s
            - failure during pre-processing
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FCEXW-DtufC.png?alt=media&token=80b05160-34b7-495f-af05-77af992a6569)
            - Failure on 1st action in batch action
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FosS9ELnHRq.png?alt=media&token=20d1f610-72da-4f84-99aa-36760668798f)
            - Failure on 2nd action in batch action
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FzHivVgjwnR.png?alt=media&token=ef7bb2da-8e85-495e-9a18-cbc10f464eb2)
    - ---
      - Common [[Resources]] For [[Example]]s
        - Example Endpoint: `/api/graph/MY-GRAPH/write` (POST)
- **What does response look like?** (with **HTTP status codes**)
  - Returns::
    - (If you're building an integration, be sure to implement at least the response codes below)
    - 200 OK #important
      - if successful
      - If q request , see sample output structure
      - if pull request, see sample output structure
      - if write request, 200 status code in response means all done
    - 308 PERMANENT REDIRECT
      - the API endpoint for backend API i.e. **Endpoint base url:** https://api.roamresearch.com/ actually returns the actual URL you want to hit for your read/write requests
      - In many cases, the network tool/library you're using will follow the redirect without additional config on your side
    - 4XX BAD REQUEST (with error message specifying what went wrong)
      - 400 BAD REQUEST #important
        - this error code is returned in many cases. So, please checkout response body's `message` value
        - some cases
          - When input format error / invalid parameter values
            - Example:: if we pass `"order": 2` in the update-block example request
              - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FCYOavPuw7p.png?alt=media&token=a1a7301b-e12a-4385-983f-3d6489a7916f)
          - If write request fails
            - For `batch-actions` especially, You have to carefully handle this (to know how many requests suceeded)
              - Please checkout **What happens on failure of any particular action in the batch action?**
                - We validate arguments for all actions first, then transact/handle the actions one after another in sequence. If there is an error transacting the action, we bail on it and all subsequent actions. 
                  This means that out of the `n` actions in a batch action request, the first `x` could succeed/transact and if then error occurs, the remaining `n-x` ones would not happen
                  - you can use `num-actions-successfully-transacted-before-failure` to figure out where exactly in the actions list the error happened
          - When one is trying to use an Encrypted graph
            - Encrypted graphs are NOT supported by the [[Roam Backend API (Beta)]]
          - When no graph name in request, or invalid graph name
          - If invalid write action
          - When token cannot be verified or improperly formatted
      - 401 UNAUTHORIZED #important
        - If one is unauthorized or if one does not have required access to the graph (read/write)
        - Please note that in some cases, When token cannot be verified or improperly formatted returns a 400 BAD REQUEST #important
          - this is a bug on our part, but changing it now could break existing integrations, so leaving it like this for this version of the API
      - 404 NOT FOUND
        - If the API route you're calling is not found
          - i.e. if you request an API route NOT in **API routes**
      - 429 TOO MANY REQUESTS #important
        - When you run into the per graph limit/quota. See **Graph-specific Usage Quotas**
          - Currently set to __50 requests/minute/graph__
    - 500 INTERNAL SERVER ERROR #important ( default fallback code for errors  )
      - default fallback code for errors 
        - So, please checkout response body's `message` value
      - If you get this & message does not make clarify, please contact us at support@roamresearch.com or in the developers slack
      - Some cases
        - If message contains "**took too long to run**", then the query/pull request is running into our time limit (20 seconds for now). In this case, you want to request less data or add limits. 
          - You might want to add limited recursion limits to pull specs: https://docs.datomic.com/pro/query/pull.html#recursive-specifications
    - 503 SERVICE UNAVAILABLE #important
      - if graph is not ready for requests yet or is unavailable at the moment. If you get this, please try again in a bit
      - Example
        - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FOFF0WgypQ2.png?alt=media&token=99704237-587c-4046-ab08-67b03a0143a3)
- **Graph-specific Usage Quotas**
  - Currently set to __50 requests/minute/graph__
    - If you run into the limits regularly even when using the strategies mentioned below, please let us know
  - When you run into the limit/quota, server will respond with a 429 TOO MANY REQUESTS #important
    - so please account for that in your code by using timeouts etc
  - One way of reducing the number of requests you're making is to use batch writes

#### FAQ::

- Q:: How do I do the --location-trusted if I'm using something other than [[cURL]]?
  - The two main things
    - You want the request library to automatically follow redirects
      - this is generally the default in most libraries and applications
    - You want the authorization header to be passed when redirect has been followed
      - This is generally not default behavior, so this will probably need extra configuration
      - another approach would be to use the `X-Authorization` header instead of the `Authorization` header
        - pass them in the `X-Authorization` header
          - you can use the `Authorization` header too (would be more secure) but you have to make sure that your code/library handles redirect properly and passes the authorization header when redirect has been followed (and the latter is generally not default behavior for most network libraries) 
  - Examples
    - [[Python]] 
      - some examples, courtesy of [[Matt Vogel]]: https://gist.github.com/8bitgentleman/75561ac116b5b925fd58ff595389d591
    - [[Postman]] client: https://www.postman.com/
      - Postman already fulfills criteria 1: it automatically follows redirects
        - If it doesn't for you, you have to go to the settings and enable "Automatically follow redirects"
          - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Fe-TlApoRVQ.png?alt=media&token=4a136983-a944-4000-98ee-84057b2c2f16)
      - For criteria 2 i..e passing authorization header on redirect, that is a per "request" setting and it can be enabled in the request level settings > Follow Authorization Header
        - If you don't do this, you will get a `"message": "You are not authenticated"` response from the server, which is super confusing unless you go to the console and really look at the requests
        - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FnC3atvLkRc.png?alt=media&token=4ed94fa2-fcaf-420e-b2ad-ee3315aa7f40)
- Q:: I can't get the request to work using `fetch` or equivalent in my roam/js (i.e. in the browser)
  - A:: Yes, this is a known issue due to a bunch of CORS and preflight requests issues. So, right now, that is not possible. We plan on exposing functions in the client-side [[Roam Alpha API]] to make this possible
- ---
