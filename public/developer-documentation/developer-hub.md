# Developer Hub

### Our different APIs and which one you should use

- Use [[Roam Backend API]] 
  - IF you need to do reads and edits (and not just additions/appends)
  - IF you do NOT need to support encrypted graphs (the backend API cannot work with encrypted graphs)
- Use [Append API]([[Roam Append API]]) 
  - IF you need to support BOTH unencrypted & encrypted graphs
  - IF you want an easy-to-use API optimized for capture
  - IF you do not need read functionality
- Use [[Roam Alpha API]] (our client side API) 
  - If you're building a [[Roam Depot]] extension or writing [[roam/js]] scripts for yourself 

### We highly recommend installing the [local MCP](https://roamresearch.com/#/app/help/page/hTcF3-dXo), connecting it to this graph, and telling the AI to search here.

- Just tell it to connect to the graph "developer-documentation"

### [[Data Model]]

- The DataScript attribute reference; what pages, blocks, users, and the other entities look like, plus querying tips.

### [[Roam Alpha API]]

- Front-end API for read/write operations

### [[Roam Backend API]]

- Access your Roam data over http! A read/write API for Roam data

### [[Roam Depot/Extensions]]

- How to write and submit [[Roam Depot]] extensions

### [[roam/css]]

- Style your graph with custom CSS

### [[roam/js]] and [[roam/cljs]]

- Write and run JavaScript/Clojurescript in your graph

### [[Roam Clojurescript API]]

- Front-end API for read/write operations, mostly a copy of [[Roam Alpha API]] for clojurescript with some additions for [[roam/render]]

### [[roam/render]]

- Render custom inline components in your graph

### If you have any questions don't hesitate to reach out! [Join our slack](https://join.slack.com/t/roamresearch/shared_invite/zt-21yynf99v-39t09XesqSiIsz_1VFmwtA) and head over to the #developers channel

