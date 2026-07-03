# roam/css

- 🚧🚧🚧🚧🚧🚧 Under Construction 🚧🚧🚧🚧🚧🚧

### Use roam/css to create themes, change layouts, develop new features, and style blocks at a granular level

#### Check out our [community-built themes for inspiration]([[Themes]])

## Getting started::

### Create a page in your graph with the title `roam/css`

- Press `cmd+u` (mac) or `ctrl+u` (pc) and then start typing "roam/css" into the search bar, then press `return` (mac) `enter` (pc)
- Or
- Type "[[roam/css]]" into a block

### Create a CSS code block on the roam/css page

- Type "/" into any block on the page then type "CSS", and then press `enter` or `return`
- Or
- Type "```" into any block, which

### Crea

## How-to guides::

- How to use roam/css inline
- How to create custom tags
- How to make page tags
- How to do block-level customization
- How to style the [[Graph Overview]]
  - {{roam/css}}
    - You can also set these on :root since they cascade
    - ```css
      #rm-canvas-container {
        background-color: lightblue;
        --graph-overview-label-font: Times New Roman;
        --graph-overview-label-color: gray;
        --graph-overview-default-node-color: #673AB7;
        --graph-overview-unselected-node-color: #673AB772;
        --graph-overview-explore-node-color: pink;
        --graph-overview-default-edge-color: #FFC107B5;
        --graph-overview-selected-edge-color: black;
        --graph-overview-unselected-edge-color: white;
      }```

## Examples::

- Code samples:
  - 

## Resources::

#### Community Videos::

#### How to Create and Edit Roam CSS: Interview with [[Abhay Prasanna]]

- {{[[video]]: https://www.youtube.com/watch?v=Cz07-oZlPzA&t=3s&ab_channel=MikeGiannulis}}

#### Articles::

- [Painting Roam with Custom CSS](https://maggieappleton.com/paintingroam) by [[Maggie Appleton]]
- [Roam themes: how to style Roam Research with custom CSS](https://nesslabs.com/roam-research-themes-custom-styling-css) by [[Anne-Laure Le Cunff]]

## Reference::

- Selectors:
  - 
- Graph-wide CSS 
  - ```css
    .rm-sidebar-outline > div:nth-child(1) {
      margin-bottom: 16px;
    }```
