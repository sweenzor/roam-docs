# Create API Tokens

- (how to create Roam API tokens for a graph)
  - If you're a developer, you can use these with [[Roam Backend API]] or [[Roam Append API]] 
- Steps to create new API Token
  - **Walkthrough GIF**
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FO6sd1Ey3g2.gif?alt=media&token=18c9f89e-e86b-4f9e-97cc-8cf1dc9d3954)
    - Process is the same for encrypted graphs but you should select the "append-only" scope instead (It is the only option for encrypted graphs)
    - Please note that you can only create API tokens for your graphs, not for graphs that have been shared with you
  - **Steps** (if you prefer following via text)
    - Open your settings via ... > Settings, then go to the "Graph" tab
      -  ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FfagWR_XbE7.png?alt=media&token=0d1d5156-d91b-4078-ad2f-e35db1ceb8ba)
    - In the "Graph" tab in settings, click on the green "+ New API Token" button
      - Do note that you need to be the owner/admin of the graph in order to create API tokens
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FvLvpJCRi36.png?alt=media&token=7cc08bb8-f684-4537-ba15-0f76c07e30d1)
    - After clicking the button, please enter a clear description of expected usage. In the access scope, select **read & edit access** for unencrypted graphs and **append-only access** for encrypted graphs. More regarding scope below
      - More details regarding scopes for API tokens below:
        - **read-only access**
          - (only available for unencrypted graphs)
          - This scope only allows access to read to your graph.
          - In the case of the Zapier integration, this means that you can only use the "Trigger"s, but not the "Action"s
        - **read & edit access**
          - (only available for unencrypted graphs)
          - this scope is the most permissive one. It allows the service to both read your graph and edit/add stuff to it. 
          - In the case of the Zapier integration, this means that you can use both the "Trigger"s and the "Action"s
        - **append-only access**
          - (available for **both** encrypted & unencrypted graphs)
          - this access only provides the service ability to __add__ stuff to your graph
          - In the case of the Zapier integration, this means that you can only use the "Actions"s, but not the "Trigger"s
    - In the next screen, click on the "Clipboard" icon 📋 to copy the token to your clipboard. It will start with "roam-graph-token-"
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FtnYMdlay_y.png?alt=media&token=e49cdfbc-872e-44b6-bc01-4b0c0b22a386)

### Good to know

- The create form also asks for a **Roam Page Title**. Each token acts as its own member of your graph, and this is the name it shows up under.
  - Blocks added or edited through the token are attributed to that name, so you can always tell which changes came in through the API.
  - The field is pre-filled from your description, and the title can't already be in use by another page.
- Creating tokens requires an active subscription. Without one, the **+ New API Token** button is disabled.
- These tokens work with Roam's cloud APIs, so they exist only for [hosted graphs]([[Hosted Graph]]).
  - For AI tools running on your own computer, the [[Desktop App]] has separate [[Local API Tokens]].
