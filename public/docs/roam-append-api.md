# Roam Append API

#### Recommended order for going through this document:

- (A [[choose your own adventure]], if you will)
- **If you are new to our APIs**
  - first, ensure that this is the one you want to use: Q:: When would you use this Append API vs other Roam APIs?
  - then go through the description: **Description:**
  - then go through **Getting Started:** for hitting the ground running
  - next steps would be **Examples** or the actual **API Reference**
- **If you have used the [[Roam Backend API (Beta)]] before**
  - first go through Q:: How is this Append API different from the regular [[Roam Backend API (Beta)]]?
  - then go through **Getting Started:** for hitting the ground running
  - next steps would be **Examples** or the actual **API Reference**
- **If you used this Append API when it was in Alpha stage**
  - Please checkout the changelog: **Change Log:** (with special attention to ones below)
    - In particular, you want to make sure your code works wrt below:
      - works with change to response.body
        - changed the format of error messages. Previously the `response.body` used to contain only the error message, now it is a map of the format `{message: error-message-str}`
      - handles all possible response error codes properly
        - ERRORs
          - (for every return code other than 200 OK, `response.body` will have a "message" key clarifying what the error)
          - 400 BAD REQUEST #important
            - Some examples
              - invalid graph name
              - location not present in location.page
              - If request.data is not valid JSON for example
                - in this case, you might not get an error.message, but just a cryptic HTML response 
          - 401 UNAUTHORIZED #important
            - authentication failure
            - roam-graph-token passed is not valid
            - Please checkout **Authentication**
          - 403 FORBIDDEN #important
            - authorization failure
            - If the token does not have append/edit access to the graph
              - Some common cases
                - if the token only has read permission
                - if the token has been revoked
                - typo when getting the token from user
          - 405 METHOD NOT ALLOWED
            - only POST method allowed in request
          - 413 CONTENT TOO LARGE #important
            - 200 KB limit
          - 429 TOO MANY REQUESTS #important
            - if hit the limits
              - will also have response header `retry-after` which mentions how many seconds to wait for before next request
              - If you regularly hit the limits, do email us 
              - More info
                - LIMITS
                  - Size Limits
                    - **200 KB** = Per-request size limit for request.body.append-data = 
                      - Payload for a `req` = `count(JSON.stringify(req.body.append-data))`
                      - If you exceed the limits, the response will have a status code 413 CONTENT TOO LARGE
                  - Rate limits
                    - **30 requests** **per minute** per api token
                    - **20 MB** sum of append-data size **per hour** per api token
                      - same calculation: Payload for a `req` = `count(JSON.stringify(req.body.append-data))`
                    - If you exceed the limits, the response will have a status code 429 TOO MANY REQUESTS
                      - will also have response header `retry-after` which mentions how many seconds to wait for before next request
          - 500 INTERNAL SERVER ERROR #important
            - Errors which should not be happening. Please contact us at support@roamresearch.com if you run into this

#### **Table of Contents**

- **Description:**
- **Getting Started:**
- **Authentication**
- **API Reference**
- **Examples**
- **Change Log:**
- **FAQ**

#### **Description:**

- These are the docs for the Roam Append API
  - The main use case for this API is adding stuff to your Roam graph. This works for all hosted Roam graphs - i.e. for both unencrypted and encrypted graphs
- Q:: When would you use this Append API vs other Roam APIs?
  - Use [[Roam Backend API (Beta)]] 
    - IF you need to do reads and edits (and not just additions/appends)
    - IF you do NOT need to support encrypted graphs (the backend API cannot work with encrypted graphs)
  - Use [Append API]([[Roam Append API]]) 
    - IF you need to support BOTH unencrypted & encrypted graphs
    - IF you want an easy-to-use API optimized for capture
    - IF you do not need read functionality
  - Use [[Roam Alpha API]] (our client side API) 
    - If you're building a [[Roam Depot]] extension or writing [[roam/js]] scripts for yourself 
- If you have used our regular Backend API, you might want to read the following FAQ to get a sense of the differences: Q:: How is this Append API different from the regular [[Roam Backend API (Beta)]]?
- **Minimal example using [[cURL]]**
  - ```shell
    curl -X POST "https://append-api.roamresearch.com/api/graph/MY-GRAPH/append-blocks" \
        -H  "Authorization: Bearer YOUR_ROAM_GRAPH_TOKEN" \
        -H  "Content-Type: application/json" \
        -d '{"location": {"page": {"title": "Append API Captures"}, "nest-under": {"string": "Captures from [[CURL]]"}}, "append-data": [{"string": "a new capture", "children": [{"string": "child block of capture"}]}]}'```
    - would capture the following, creating the `page` and `nest-under` capture group if they did not exist already 
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FYKKEr4C8XK.png?alt=media&token=07822238-9284-4f53-b8d2-ce7511196b8d)
  - Explaining `nest-under` below
    - After the earlier CURL, if we then do the following curl request, 
      - ```shell
        curl -X POST "https://append-api.roamresearch.com/api/graph/MY-GRAPH/append-blocks" \
            -H  "Authorization: Bearer YOUR_ROAM_GRAPH_TOKEN" \
            -H  "Content-Type: application/json" \
            -d '{"location": {"page": {"title": "Append API Captures"}, "nest-under": {"string": "Captures from [[CURL]]"}}, "append-data": [{"string": "second capture"}]}'```
    - we get the following result
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FJfoU8ZVbf3.png?alt=media&token=c04adb40-fd20-421a-a944-c7e59c95c546)
    - Note that the "Captures from [[cURL]]" block was reused
    - The idea is that you can use this to have "Capture blocks" in your pages to keep things clean/uncluttered
      - Very useful for daily notes pages, for example, consider a page like below
        - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Fsm8kxglqXZ.png?alt=media&token=02955030-9842-4cda-ba0b-4917602d213f)
        - To create this, different services can use the following nest-under strings
          - `"Raycast extension capture"`
          - `"Captures from [[Zapier]]"`
          - `"{{[[TODO]]}} TODOs from Slack bot (be sure to go handle these)"`
- **Some characteristics of the API**
  - Will create the page or the nest-under block if it does not exist yet
    - If the page has multiple top level blocks with the nest-under string, then it appends as a child of the bottom most matching block
  - Appends will happen in-order
    - If you append "A" first (and get a 200 OK back) and then append a "B" in the same place, you can be sure that they are handled in that order
  - Appended blocks will get the edit/time and create/time of the time the request to the Append API was made (not the time the client handled the sync)
  - Exactly-once write
    - You do not have to worry about a single capture being appended multiple times (even if user has multiple clients open). 
- Please report any issues in the #developers channel in the [[Roam Slack]] or via email to [support@roamrsearch.com](mailto:support@roamresearch.com)

#### **Getting Started:**

- First, you have to get your credentials from **Settings** > **Graph** tab
  - You can get your "Graph name" from this tab
  - Then in the "API tokens" section, click on the green `+ New API Token` button
    - Do note that you need to be the owner/admin of the graph in order to create API tokens
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2F9RqhCNoxe2.png?alt=media&token=91659d43-4b3c-4ca0-a2e4-8954ae77d401)
  - After clicking the button, please enter a clear description of expected usage. Also, for access scope, you need to select "append-only access"
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FSeF3Dgj2MU.png?alt=media&token=d68781a4-d742-42dd-ae2b-c092f0704da8)
    - Alternatively, you can select "read & edit access" too. This works because that role/permission is a superset of the append-only permission
  - In the next screen, click on the "Clipboard" icon 📋 to copy the token to your clipboard. It will start with "roam-graph-token-"
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FV2_LPeVbUg.png?alt=media&token=87fd850a-f31f-4a6d-ae67-4f41cf185754)
- After getting credentials, you're almost done
  - Copy the command below
    - ```shell
      curl -X POST "https://append-api.roamresearch.com/api/graph/MY-GRAPH/append-blocks" \
          -H  "Authorization: Bearer YOUR_ROAM_GRAPH_TOKEN" \
          -H  "Content-Type: application/json" \
          -d '{"location": {"page": {"title": "Append API Captures"}, "nest-under": {"string": "Captures from [[CURL]]"}}, "append-data": [{"string": "a new capture", "children": [{"string": "child block of capture"}]}]}'``` *
  - Replace `MY-GRAPH` with your graph name and `YOUR_ROAM_GRAPH_TOKEN` with the API token you copied to the clipboard
  - Finally, run the command in your shell/terminal. In your graph, if you then search for it, you should find a new page "Append API Captures" which looks like the following
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2F1ZR9BZ-jZD.png?alt=media&token=ebf38ba0-68cc-40bd-9896-25539e4ecb65)

#### **Authentication**

- The getting started section has the basics of auth. Please start with that
- More details below
  - Let's first start with the differences from Backend API
    - Append API expects a token with an "Append-only" role 
      - token with an "Append-only" role
        - These tokens cannot read your graph nor can they modify existing blocks in your graph
          - This is very often a desired characteristic: say you want to connect your Roam graph to a service so that you can send data in, but do not want the service from being able to access your Roam graph data 
        - so, these tokens cannot be used with the [[Roam Backend API (Beta)]]
        - You can create these tokens via **Settings** > **Graph** > **API Tokens** > "**New API Token**" button. Then you can select a role of "append-only access"
          - In non-encrypted graphs, you can now create append-only tokens in addition to the "read-only" and "read&edit" tokens that you can use in [[Roam Backend API (Beta)]] 
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FSeF3Dgj2MU.png?alt=media&token=d68781a4-d742-42dd-ae2b-c092f0704da8)
          - In encrypted graphs, the only tokens you can create are append-only-tokens
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2F7FaKvDIYOo.png?alt=media&token=d70c0d27-5ad1-475c-9c97-c9639223c25e)
      - Caveat: you can also use tokens with "read+edit access" in the Append API
        - since read+edit role is a superset of the append role
  - Now, the things common with **Authentication** in [[Roam Backend API (Beta)]]:
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

#### **API Reference**

- **Endpoint base url:** https://append-api.roamresearch.com/
- **API routes**
  - `/api/graph/{graph-name}/append-blocks` (POST) ^^IMPORTANT^^
    - Description:: A route using which you can append blocks (possibly nested multiple times) to a specified page or  nest-under block under a specified page
    - Authentication:: For authentication, be sure to follow How to pass the tokens in the request?
    - Parameters::
      - `location` **required**
        - we require one - either page or block. 
          nest-under is optional and can be used with either
        - `page` **required** 
          - Description:: The page in the roam graph that you want to append to
            - The page is created if it does not exist already
          - `title` **required**
            - Type::
              - String
              - or
              - a map of the form `{"daily-note-page": "MM-DD-YYYY"}`. *
                - **(Use this for Daily Notes Pages)**
                - example: 
                  "location": {"page": {"title": **{"daily-note-page": "07-29-2023"}**} }
                - Q:: Why do you want to use this format for appending to daily note pages (DNP)?
                  - Otherwise, you have to pass the exact correct title for the daily notes page. 
                    If you send a wrong DNP title (say "June 29, 2023" instead of "June 29**th**, 2023"), then a new non daily note page will be created, and your blocks will not show up in the daily log (will instead show up in the new non-DNP page)
                - Q:: You might also be wondering why you cannot just pass in "today", "tomorrow" here. 
                  - Answer is two fold (see below)
                    - First, the roam graph may already have a page with that title
                    - Second and more importantly, **timezones**
                      - It is very likely that the user is on a different timezone than our servers, so, a mapping from today to a DNP title on our side could add the data to the incorrect DNP (maybe tomorrow, maybe yesterday)
                        - So, how do you deal with it?
                          - first, if you're not adding to DNPs, you don't need to worry
                          - Second, if what you're building works on the user's device, then just get the local date locally , get the month, day and year and use the format `{"daily-note-page": "MM-DD-YYYY"}`
                          - Third, if you're a server application and you want to get this right, you might want to ask the user for what their local timezone is. Then, in your server, get the epoch time, convert it to a date object with user's provided local timezone, then get the month, day and year and use the format `{"daily-note-page": "MM-DD-YYYY"}`
        - `block` (alternative to page)
          - Description:: the block in the Roam graph you want to append child blocks to
            - For most cases, if possible, **we recommend you use page instead of this**. We believe page used along with nest-under would be good enough for 95% of use cases
              - some reasons why you might not want to use `location.block.uid` below
                - In case page does not exist, we create the page. In case block does not exist, we add the capture to a Daily notes page under a block with text `Append API Captures attempted under non-existent blocks:`
                  - Knowing which daily note page to add to is not foolproof (due to timezones). For encrypted graphs, we can use the local timezone, but in the case of unencrypted graphs, since these captures are handled on the backend, we are using the US Central timezone i.e. `America/Chicago`. This means that the captures may appear in yesterday/tomorrow's daily note page (from the POV of the user)
                - You might be think to create a block via the append API and then capture underneath it later via passing `location.block.uid`. If you do so, please be advised that this is fragile
                  - first, the block uid you pass for new append-data blocks might not end up being the final uid of the block . This can happen if the uid you pass in collides with the uid of an existing block in the graph
                    - For more info, please look into the warning here: 
                      - `uid` **optional**
                        - Caution:: Be very careful when using this. You CANNOT later depend on the uid you pass to this. That is because, in the case a uid is already in the roam graph, we use a newly generated random uid instead 
                          - In most cases, we recommend you NOT to use this. A new random block uid will be created for your new blocks as normal
                          - Use this only for internal block references  i.e. block references to blocks from within the same append-api capture request
                    - More importantly, since this happens asynchronously, you (as the dev) would not know that there was a collision!
                  -  then later captures would get added underneath a different block
          - `uid`
            - the block uid for the block to add the append api capture blocks underneath
            - If a block with given uid does not exist in the graph, the capture will get added to the Daily Notes Page under a block saying "Append API Captures attempted under non-existent blocks:" 
            - Type:: 
              - string
        - `nest-under` **optional**
          - Description:: Optional parameter. Use this to append inside of a top level child block in a page
            - A pretty convenient way to have different "capture target"s in a page
              - Very useful for daily notes pages, for example, consider a page like below
                - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Fsm8kxglqXZ.png?alt=media&token=02955030-9842-4cda-ba0b-4917602d213f)
                - To create this, different services can use the following nest-under strings
                  - `"Raycast extension capture"`
                  - `"Captures from [[Zapier]]"`
                  - `"{{[[TODO]]}} TODOs from Slack bot (be sure to go handle these)"`
          - `string`
            - Type::
              - String
      - `append-data` **required**
        - needs to be an array of blocks to be appended, cannot be empty
        - Every block needs to have a 'string' value. Optionally they can have 'uid', 'heading', 'text-align', 'open', 'children-view-type' and an array of possibly nested child blocks - 'children'.
        - **value needs to be an array of blocks**
          - for each block
            - `string` **required**
              - `string`
                - Text content of the block.
                - __string__
              - From [[April 11th, 2025]], this also supports nested markdown strings: For this, make sure the string starts with a "- " 
                - and also make sure the block has no children
                - More info in our tweet:
                  - https://x.com/RoamResearch/status/1910658366575178199
            - `children` **optional**
              - an array of possibly further nested child blocks. See [examples](Examples::)
            - `heading` **optional**
              - Heading styling of the block
              - __integer__
                - `0` (no heading styling)
                - `1`
                - `2`
                - `3`
            - `text-align` **optional**
              - `text-align`
                - The block's alignment
                - __string__
                  - `left` 
                  - `center` 
                  - `right`
                  - `justify`
            - `open` **optional**
              - `open`
                - Collapse state of the block.
                - __boolean__
                - `true` by default (if not passed)
            - `children-view-type` **optional**
              - `children-view-type`
                - Block view type of children blocks
                - __string__
                  - `bullet` 
                  - `numbered` 
                  - `document`
            - `uid` **optional**
              - Caution:: Be very careful when using this. You CANNOT later depend on the uid you pass to this. That is because, in the case a uid is already in the roam graph, we use a newly generated random uid instead 
                - In most cases, we recommend you NOT to use this. A new random block uid will be created for your new blocks as normal
                - Use this only for internal block references  i.e. block references to blocks from within the same append-api capture request
    - Please checkout the **Examples**
- Size & rate limits are documented here: LIMITS
  - If you hit them, you will get error codes 413 CONTENT TOO LARGE #important or 429 TOO MANY REQUESTS #important
- **What does response look like?** (with **HTTP status codes**)
  - Returns::
    - (If you're building an integration, be sure to implement at least the response codes below)
    - 200 OK #important
      - An important difference between this API and the regular [[Roam Backend API (Beta)]] is what a 200 OK response means
        - In the Backend API, when you get a 200 OK response, say on a create block write request, you know that that create has happened
        - However, in the Append API, a 200 OK means that the append data that you sent has been verified and saved in Roam's servers, and it might be applied almost immediately (in the case of unencrypted graphs generally) or the next time a full Roam client is opened by the user (in the case of encrypted graphs)
      - the response.data will look like `{captureSuccessful: true}`
    - ERRORs
      - (for every return code other than 200 OK, `response.body` will have a "message" key clarifying what the error)
      - 400 BAD REQUEST #important
        - Some examples
          - invalid graph name
          - location not present in location.page
          - If request.data is not valid JSON for example
            - in this case, you might not get an error.message, but just a cryptic HTML response 
      - 401 UNAUTHORIZED #important
        - authentication failure
        - roam-graph-token passed is not valid
        - Please checkout **Authentication**
      - 403 FORBIDDEN #important
        - authorization failure
        - If the token does not have append/edit access to the graph
          - Some common cases
            - if the token only has read permission
            - if the token has been revoked
            - typo when getting the token from user
      - 405 METHOD NOT ALLOWED
        - only POST method allowed in request
      - 413 CONTENT TOO LARGE #important
        - 200 KB limit
      - 429 TOO MANY REQUESTS #important
        - if hit the limits
          - will also have response header `retry-after` which mentions how many seconds to wait for before next request
          - If you regularly hit the limits, do email us 
          - More info
            - LIMITS
              - Size Limits
                - **200 KB** = Per-request size limit for request.body.append-data = 
                  - Payload for a `req` = `count(JSON.stringify(req.body.append-data))`
                  - If you exceed the limits, the response will have a status code 413 CONTENT TOO LARGE
              - Rate limits
                - **30 requests** **per minute** per api token
                - **20 MB** sum of append-data size **per hour** per api token
                  - same calculation: Payload for a `req` = `count(JSON.stringify(req.body.append-data))`
                - If you exceed the limits, the response will have a status code 429 TOO MANY REQUESTS
                  - will also have response header `retry-after` which mentions how many seconds to wait for before next request
      - 500 INTERNAL SERVER ERROR #important
        - Errors which should not be happening. Please contact us at support@roamresearch.com if you run into this

#### **Examples**

- The "Hello world" example (**start here!**)
  - **Minimal example using [[cURL]]**
    - ```shell
      curl -X POST "https://append-api.roamresearch.com/api/graph/MY-GRAPH/append-blocks" \
          -H  "Authorization: Bearer YOUR_ROAM_GRAPH_TOKEN" \
          -H  "Content-Type: application/json" \
          -d '{"location": {"page": {"title": "Append API Captures"}, "nest-under": {"string": "Captures from [[CURL]]"}}, "append-data": [{"string": "a new capture", "children": [{"string": "child block of capture"}]}]}'```
      - would capture the following, creating the `page` and `nest-under` capture group if they did not exist already 
        - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FYKKEr4C8XK.png?alt=media&token=07822238-9284-4f53-b8d2-ce7511196b8d)
    - Explaining `nest-under` below
      - After the earlier CURL, if we then do the following curl request, 
        - ```shell
          curl -X POST "https://append-api.roamresearch.com/api/graph/MY-GRAPH/append-blocks" \
              -H  "Authorization: Bearer YOUR_ROAM_GRAPH_TOKEN" \
              -H  "Content-Type: application/json" \
              -d '{"location": {"page": {"title": "Append API Captures"}, "nest-under": {"string": "Captures from [[CURL]]"}}, "append-data": [{"string": "second capture"}]}'```
      - we get the following result
        - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FJfoU8ZVbf3.png?alt=media&token=c04adb40-fd20-421a-a944-c7e59c95c546)
      - Note that the "Captures from [[cURL]]" block was reused
      - The idea is that you can use this to have "Capture blocks" in your pages to keep things clean/uncluttered
        - Very useful for daily notes pages, for example, consider a page like below
          - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2Fsm8kxglqXZ.png?alt=media&token=02955030-9842-4cda-ba0b-4917602d213f)
          - To create this, different services can use the following nest-under strings
            - `"Raycast extension capture"`
            - `"Captures from [[Zapier]]"`
            - `"{{[[TODO]]}} TODOs from Slack bot (be sure to go handle these)"`
  - (For the requests below this point, for readability purposes, we will show the pretty-formatted JSON)
- An example with multiple nested blocks being created
  - POST request to "https://append-api.roamresearch.com/api/graph/MY-GRAPH/append-blocks"
  - Authorization: Bearer YOUR_ROAM_GRAPH_TOKEN
  - Content-Type: application/json
  - request data
    - ```json
      {
          "location": {
              "page": {
                  "title": "May 18th, 2024"
              },
              "nest-under": {
                  "string": "Captures from [[Zapier]]"
              }
          },
          "append-data": [
              {
                  "string": "Hey I am a block with children",
                  "open": false,
                  "children-view-type": "document",
                  "children": [
                      {
                          "string": "hey I am a child block",
                          "open": false,
                          "children": [
                              {
                                  "string": "nested two layers deep"
                              }
                          ]
                      }
                  ]
              },
              {
                  "string": "I am a second block getting added"
              }
          ]
      }```
  - [[Output]] [[Screenshot]]
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FzBj3HjSO7e.png?alt=media&token=a6fdab1b-165c-47c9-993e-ede69e34a8a0)
- Example for capture to daily notes #important
  - We captured to daily note in An example with multiple nested blocks being created too, but the problem was that we had to explicitly enter the full page title "May 18th, 2024"
    - If we had made a typo, then it would've added the blocks to the typo-d page (say "May 18, 2024"), and would not show up in the actual daily note page "May 18th, 2024"
    - Please read below to get the complete rationale
      - Q:: Why do you want to use this format for appending to daily note pages (DNP)?
      - Q:: You might also be wondering why you cannot just pass in "today", "tomorrow" here. 
  - The solution is to pass a map of the form `{"daily-note-page": "MM-DD-YYYY"}`. * as location.page.title
  - POST "https://append-api.roamresearch.com/api/graph/MY-GRAPH/append-blocks"
  - Authorization: Bearer YOUR_ROAM_GRAPH_TOKEN
  - Content-Type: application/json
  - request data
    - (the main difference from the earlier example is that we pass `{"daily-note-page": "05-18-2024"}` in `location.page.title` instead of passing in "May 18th, 2024")
    - ```json
      {
          "location": {
              "page": {
                  "title": {"daily-note-page": "05-18-2024"}
              },
              "nest-under": {
                  "string": "Captures from [[Zapier]]"
              }
          },
          "append-data": [
              {
                  "string": "Hey I am a block with children",
                  "open": false,
                  "children-view-type": "document",
                  "children": [
                      {
                          "string": "hey I am a child block",
                          "open": false,
                          "children": [
                              {
                                  "string": "nested two layers deep"
                              }
                          ]
                      }
                  ]
              },
              {
                  "string": "I am a second block getting added"
              }
          ]
      }```
  - 
- Example for capturing as child of an existing block
  - Before capturing using block as location, please read the disclaimer/recommendation below
    - For most cases, if possible, **we recommend you use page instead of this**. We believe page used along with nest-under would be good enough for 95% of use cases
      - some reasons why you might not want to use `location.block.uid` below
        - In case page does not exist, we create the page. In case block does not exist, we add the capture to a Daily notes page under a block with text `Append API Captures attempted under non-existent blocks:`
          - Knowing which daily note page to add to is not foolproof (due to timezones). For encrypted graphs, we can use the local timezone, but in the case of unencrypted graphs, since these captures are handled on the backend, we are using the US Central timezone i.e. `America/Chicago`. This means that the captures may appear in yesterday/tomorrow's daily note page (from the POV of the user)
        - You might be think to create a block via the append API and then capture underneath it later via passing `location.block.uid`. If you do so, please be advised that this is fragile
          - first, the block uid you pass for new append-data blocks might not end up being the final uid of the block . This can happen if the uid you pass in collides with the uid of an existing block in the graph
            - For more info, please look into the warning here: 
              - `uid` **optional**
                - Caution:: Be very careful when using this. You CANNOT later depend on the uid you pass to this. That is because, in the case a uid is already in the roam graph, we use a newly generated random uid instead 
                  - In most cases, we recommend you NOT to use this. A new random block uid will be created for your new blocks as normal
                  - Use this only for internal block references  i.e. block references to blocks from within the same append-api capture request
            - More importantly, since this happens asynchronously, you (as the dev) would not know that there was a collision!
          -  then later captures would get added underneath a different block
  - POST "https://append-api.roamresearch.com/api/graph/MY-GRAPH/append-blocks"
  - Authorization: Bearer YOUR_ROAM_GRAPH_TOKEN
  - Content-Type: application/json
  - request data
    - ```json
      {
          "location": {
              "block": {
                  "uid": "f-gVYZHz4"
              },
              "nest-under": {
                  "string": "Captures from [[Append API]]"
              }
          },
          "append-data": [
              {
                  "string": "Hey I am a block with children"
              }
          ]
      }```

#### **Change Log:**

- (move this to the top of the page later)
- [[April 11th, 2025]]
  - `string` argument for any block in append-data now also accepts a nested markdown string!
    - From [[April 11th, 2025]], this also supports nested markdown strings: For this, make sure the string starts with a "- " 
      - and also make sure the block has no children
      - More info in our tweet:
        - https://x.com/RoamResearch/status/1910658366575178199
- [[October 26th, 2024]]
  - Made a small change to the Append API: if `open` value is not passed, it is now `true` by default
    - Change made to match the behavior in the [[Roam Backend API (Beta)]] & the frontend [[Roam Alpha API]]
    - turns out that we had not mentioned any default value in the docs
      - So, hopefully noone was depending on this value being different
      - If you were depending on this, and if we slightly broke your stuff, super sorry! 😅
- [[May 21st, 2024]]
  - In the case of a successful capture i.e. 200 OK #important, now **the response.data will look like `{captureSuccessful: true}`** (previously was `null`)
- [[May 17th, 2024]]
  - Added ability to pass a block as a capture location for append API.
    - you can now pass location.block.uid instead of location.page.title
    - You probably want to just use location.page.title with maybe a location.nest-under.string though
      - Explanation below
        - For most cases, if possible, **we recommend you use page instead of this**. We believe page used along with nest-under would be good enough for 95% of use cases
          - some reasons why you might not want to use `location.block.uid` below
            - In case page does not exist, we create the page. In case block does not exist, we add the capture to a Daily notes page under a block with text `Append API Captures attempted under non-existent blocks:`
              - Knowing which daily note page to add to is not foolproof (due to timezones). For encrypted graphs, we can use the local timezone, but in the case of unencrypted graphs, since these captures are handled on the backend, we are using the US Central timezone i.e. `America/Chicago`. This means that the captures may appear in yesterday/tomorrow's daily note page (from the POV of the user)
            - You might be think to create a block via the append API and then capture underneath it later via passing `location.block.uid`. If you do so, please be advised that this is fragile
              - first, the block uid you pass for new append-data blocks might not end up being the final uid of the block . This can happen if the uid you pass in collides with the uid of an existing block in the graph
                - For more info, please look into the warning here: 
                  - `uid` **optional**
                    - Caution:: Be very careful when using this. You CANNOT later depend on the uid you pass to this. That is because, in the case a uid is already in the roam graph, we use a newly generated random uid instead 
                      - In most cases, we recommend you NOT to use this. A new random block uid will be created for your new blocks as normal
                      - Use this only for internal block references  i.e. block references to blocks from within the same append-api capture request
                - More importantly, since this happens asynchronously, you (as the dev) would not know that there was a collision!
              -  then later captures would get added underneath a different block
- [[May 1st, 2024]]
  - changed the format of error messages. Previously the `response.body` used to contain only the error message, now it is a map of the format `{message: error-message-str}`
  - documented and supporting following error codes. Please make sure you handle all of these
    - ERRORs
      - (for every return code other than 200 OK, `response.body` will have a "message" key clarifying what the error)
      - 400 BAD REQUEST #important
        - Some examples
          - invalid graph name
          - location not present in location.page
          - If request.data is not valid JSON for example
            - in this case, you might not get an error.message, but just a cryptic HTML response 
      - 401 UNAUTHORIZED #important
        - authentication failure
        - roam-graph-token passed is not valid
        - Please checkout **Authentication**
      - 403 FORBIDDEN #important
        - authorization failure
        - If the token does not have append/edit access to the graph
          - Some common cases
            - if the token only has read permission
            - if the token has been revoked
            - typo when getting the token from user
      - 405 METHOD NOT ALLOWED
        - only POST method allowed in request
      - 413 CONTENT TOO LARGE #important
        - 200 KB limit
      - 429 TOO MANY REQUESTS #important
        - if hit the limits
          - will also have response header `retry-after` which mentions how many seconds to wait for before next request
          - If you regularly hit the limits, do email us 
          - More info
            - LIMITS
              - Size Limits
                - **200 KB** = Per-request size limit for request.body.append-data = 
                  - Payload for a `req` = `count(JSON.stringify(req.body.append-data))`
                  - If you exceed the limits, the response will have a status code 413 CONTENT TOO LARGE
              - Rate limits
                - **30 requests** **per minute** per api token
                - **20 MB** sum of append-data size **per hour** per api token
                  - same calculation: Payload for a `req` = `count(JSON.stringify(req.body.append-data))`
                - If you exceed the limits, the response will have a status code 429 TOO MANY REQUESTS
                  - will also have response header `retry-after` which mentions how many seconds to wait for before next request
      - 500 INTERNAL SERVER ERROR #important
        - Errors which should not be happening. Please contact us at support@roamresearch.com if you run into this

#### **FAQ**

- Q:: How is this Append API different from the regular [[Roam Backend API (Beta)]]?
  - This new API **also works with encrypted graphs** while the Backend API does not (i.e. Append API supports all hosted graphs while Backend API only works with unencrypted hosted graphs)
  - Append API expects a token with an "Append-only" role ~~~~
    - Append API expects a token with an "Append-only" role 
      - token with an "Append-only" role
        - These tokens cannot read your graph nor can they modify existing blocks in your graph
          - This is very often a desired characteristic: say you want to connect your Roam graph to a service so that you can send data in, but do not want the service from being able to access your Roam graph data 
        - so, these tokens cannot be used with the [[Roam Backend API (Beta)]]
        - You can create these tokens via **Settings** > **Graph** > **API Tokens** > "**New API Token**" button. Then you can select a role of "append-only access"
          - In non-encrypted graphs, you can now create append-only tokens in addition to the "read-only" and "read&edit" tokens that you can use in [[Roam Backend API (Beta)]] 
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2FSeF3Dgj2MU.png?alt=media&token=d68781a4-d742-42dd-ae2b-c092f0704da8)
          - In encrypted graphs, the only tokens you can create are append-only-tokens
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fdeveloper-documentation%2F7FaKvDIYOo.png?alt=media&token=d70c0d27-5ad1-475c-9c97-c9639223c25e)
      - Caveat: you can also use tokens with "read+edit access" in the Append API
        - since read+edit role is a superset of the append role
  - The domain is `append-api.roamresearch.com` (as opposed to the `api.roamresearch.com` for the Backend API)
  - An important difference between this API and the regular [[Roam Backend API (Beta)]] is what a 200 OK response means
    - In the Backend API, when you get a 200 OK response, say on a create block write request, you know that that create has happened
    - However, in the Append API, a 200 OK means that the append data that you sent has been verified and saved in Roam's servers, and it might be applied almost immediately (in the case of unencrypted graphs generally) or the next time a full Roam client is opened by the user (in the case of encrypted graphs)
  - LIMITS
    - Size Limits
      - **200 KB** = Per-request size limit for request.body.append-data = 
        - Payload for a `req` = `count(JSON.stringify(req.body.append-data))`
        - If you exceed the limits, the response will have a status code 413 CONTENT TOO LARGE
    - Rate limits
      - **30 requests** **per minute** per api token
      - **20 MB** sum of append-data size **per hour** per api token
        - same calculation: Payload for a `req` = `count(JSON.stringify(req.body.append-data))`
      - If you exceed the limits, the response will have a status code 429 TOO MANY REQUESTS
        - will also have response header `retry-after` which mentions how many seconds to wait for before next request
- Q:: When would you use this Append API vs other Roam APIs?
