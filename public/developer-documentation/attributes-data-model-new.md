# Attributes Data Model (new)

- **Introduction: it's a hypergraph**
  - Roam's graph is made of nodes: __pages__ (named nodes) and __blocks__ (outline content nodes with stable ids). `[[links]]` and `((refs))` connect them, but that is an __untyped__ graph. Attributes (written `Name:: value`) add __typed relationships__ on top.
  - What makes it a __hypergraph__ rather than a plain labeled graph: **a relationship is itself a node.**
    - Each `Name:: value` assertion is derived from a real block, the attribute name is a real page, and the value can be another entity that carries its own attributes.
    - So edges are addressable, can be annotated, and can serve as endpoints of further edges.
  - Concretely, each assertion is stored as its own entity: a **harc** (hyperedge/arc) with its own `:block/uid`.
    - It holds the `[entity attribute value]` triple, plus provenance refs recording which blocks it was derived from.
- **The harc entity**
  - Each assertion is one entity carrying six ref attributes, three for the logical triple and three for provenance:
    - `:harc/e` is the **entity** being described (normally the attribute block's parent page/block).
      - If the parent block is exactly one reference and nothing else, the assertion is about the __referenced__ entity instead: `:harc/e` points at the referenced node while the e-source stays the referencing block.
      - This is how you can assert attributes about `[[Project Apollo]]` from a daily note.
    - `:harc/a` is the **attribute**; always a __page__, since `Name::` resolves to a `[[Name]]` page.
    - `:harc/v` is the **value(s)**; many-cardinality, so one harc holds all of an attribute's values for that entity.
    - `:harc/e-source`, `:harc/a-source`, `:harc/v-source` record which blocks each position was derived __from__ (see provenance below).
  - All six are ordinary many-cardinality refs, so everything is natively indexed by DataScript and traversable with plain pulls and reverse refs (see [[Data Model]] for the underlying store).
    - For now, only `:harc/v` can have multiple values. But all were made cardinality many for future compatibility
  - Harcs are **derived data**: Roam recomputes them from the source blocks whenever those blocks change.
    - There is no API for writing them (for now). To change a harc, edit the blocks it derives from.
- **Provenance: the `-source` refs**
  - `:harc/a-source` is the `Name::` block itself, the block that defines the assertion. One per harc.
    - When it stops being an attribute (edited to plain text, or deleted), the harc is retracted.
  - `:harc/e-source` is the block the entity was reached through: normally the attribute block's parent, even when `:harc/e` proxied through it to a referenced entity.
  - `:harc/v-source` records which block contributed each value: a value child, or the attribute block itself when the value comes from its inline tail.
- **Values: blocks, pages, and owned text**
  - **Plain-text child block** → `:harc/v` is that child block's own node.
  - **Refs-only content** (`Owner:: [[Jane Doe]]`, or a child that is only refs) → `:harc/v` is the referenced node(s).
    - Multiple refs all become values, unlike the entity position, which proxies only through a single ref.
  - **Inline text tail** (`Status:: Active`) → the tail becomes one owned **text entity**: `{:block/uid "v-<harc-uid>" :harc/v-string "Active"}`.
    - It is not a block (no parent, no `:block/string`) and is referenced only through `:harc/v`. It lives and dies with its harc.
    - Text values are entities with `:harc/v-string`, so value __strings__ are directly queryable.
    - The text entity's uid is deterministic (`v-` + the harc's uid), so two clients minting the same value concurrently converge on one entity instead of duplicating.
  - **Exclusivity**: a non-blank inline tail claims the value position, and the block's children are then plain sub-content, not values.
    - A bare `Name::` with no tail and no children keeps its harc with an empty `:harc/v`.
  - Children that are themselves attributes are never values: they define their own harcs about this relationship instead (see attributes on relationships below).
  - Attribute names resolve refs only **one level deep** (`[[hello [[world]]]]` picks up `hello`, not the nested `world`).
- **Querying: reverse refs do the work**
  - The harc's own datoms are the index: traversal is plain pulls and reverse refs.
  - Everything asserted about an entity: pull `:harc/_e` off it.
    - ```javascript
      // all attributes of a page, with their values
      window.roamAlphaAPI.data.pull(
        "[{:harc/_e [{:harc/a [:node/title]} {:harc/v [:block/uid :node/title :block/string :harc/v-string]}]}]",
        [":node/title", "Project Apollo"])```
  - Every entity with a given attribute: walk `:harc/_a` backwards from the attribute page.
    - ```clojure
      ;; datalog: every entity with a Status attribute, and the value entities
      [:find ?e ?v
       :where [?a :node/title "Status"]
              [?harc :harc/a ?a]
              [?harc :harc/e ?e]
              [?harc :harc/v ?v]]```
  - What a block defines: `:harc/_a-source` from the block. Everything a node is a value of: `:harc/_v` from the node.
  - A value's display string is one of three shapes: a page's `:node/title`, a block's `:block/string`, or a text entity's `:harc/v-string`.
    - An `or` over those three normalizes the heterogeneity.
- **Worked example**
  - Outline (uids in parens):
    - ```javascript
      Project Apollo (page-apollo)
        Status:: Active (blk-status)
        Owner:: [[Jane Doe]] (blk-owner)
        Tags::(blk-tags)
          [[urgent]] (blk-tag1)
          [[backend]] (blk-tag2)```
  - Three harc entities exist (one per attribute block), shown as pulls:
    - ```clojure
      ;; Project Apollo --Status--> "Active"  (inline tail -> owned text entity)
      {:block/uid     "harc-1"
       :harc/e        [{:block/uid "page-apollo"}]
       :harc/a        [{:block/uid "page-status"}]
       :harc/v        [{:block/uid "v-harc-1" :harc/v-string "Active"}]
       :harc/e-source [{:block/uid "page-apollo"}]
       :harc/a-source [{:block/uid "blk-status"}]
       :harc/v-source [{:block/uid "blk-status"}]}

      ;; Project Apollo --Owner--> [[Jane Doe]]  (inline ref -> the page)
      {:block/uid     "harc-2"
       :harc/e        [{:block/uid "page-apollo"}]
       :harc/a        [{:block/uid "page-owner"}]
       :harc/v        [{:block/uid "page-jane"}]
       :harc/e-source [{:block/uid "page-apollo"}]
       :harc/a-source [{:block/uid "blk-owner"}]
       :harc/v-source [{:block/uid "blk-owner"}]}

      ;; Project Apollo --Tags--> [[urgent]], [[backend]]  (one harc, two values)
      {:block/uid     "harc-3"
       :harc/e        [{:block/uid "page-apollo"}]
       :harc/a        [{:block/uid "page-tags"}]
       :harc/v        [{:block/uid "page-urgent"} {:block/uid "page-backend"}]
       :harc/e-source [{:block/uid "page-apollo"}]
       :harc/a-source [{:block/uid "blk-tags"}]
       :harc/v-source [{:block/uid "blk-tag1"} {:block/uid "blk-tag2"}]}
      ```
- **Attributes on relationships (edges as endpoints)**
  - Attributes nested under an attribute block describe __the relationship itself__: their `:harc/e` is the parent **harc**, not a page or block.
    - Extending the worked example with `Role:: Lead` nested under the `Owner::` block:
      - ```javascript
        Project Apollo (page-apollo)
          Owner:: [[Jane Doe]] (blk-owner)
            Role:: Lead (blk-role)```
      - ```clojure
        ;; the ownership relationship --Role--> "Lead"
        {:block/uid     "harc-4"
         :harc/e        [{:block/uid "harc-2"}]   ;; harc-2 = the Owner harc above
         :harc/a        [{:block/uid "page-role"}]
         :harc/v        [{:block/uid "v-harc-4" :harc/v-string "Lead"}]
         :harc/e-source [{:block/uid "blk-owner"}]
         :harc/a-source [{:block/uid "blk-role"}]
         :harc/v-source [{:block/uid "blk-role"}]}```
    - So `:harc/e` can point at another harc, and chains of statements-about-statements are plain graph walks.
- **`roam/meta::` as a structural proxy**
  - A block whose text is exactly `roam/meta::` never gets a harc of its own.
    - Attribute blocks nested under it attach to the `roam/meta::` block's __parent__: a way to tuck an entity's attributes away under a single child.
  - The blocks walked through this proxy are recorded as additional `:harc/e-source`s.
