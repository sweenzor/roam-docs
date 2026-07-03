# Attributes Data Model

- **Introduction: it's a hypergraph**
  - Roam's graph is made of nodes — __pages__ (named nodes) and __blocks__ (outline content nodes with stable ids). `[[links]]` and `((refs))` connect them, but that is an __untyped__ graph. Attributes (written `Name:: value`) add __typed relationships__ on top.
  - What makes it a __hypergraph__ rather than a plain labeled graph: **a relationship is itself a node.** Each `Name:: value` assertion is anchored to a real block, the attribute name is a real page, and the value can be another entity that carries its own attributes — so edges are addressable, can be annotated, and can serve as endpoints of further edges.
  - Concretely, an attribute is modeled as a triple `[entity attribute value]`, and each of those three positions records both __what it points to__ and __where it came from__ — which is what lets relationships be reified and chained.
- **The triple: `[e a v]`**
  - Every attribute assertion is stored as a 3-tuple (internally a "roam datom"): `[e-map a-map v-map]` = entity, attribute, value.
  - **e** — the thing being described (normally the parent page/block).
  - **a** — the attribute; always a __page__, since `Name::` resolves to a `[[Name]]` page.
  - **v** — the value.
- **Each position is a `{:source :value}` map (an "sv-map")**
  - The three positions are not bare ids. Each is a map `{:source <node> :value <node-or-string>}`.
  - `:source` is always a node reference — the provenance, i.e. __which block wrote this part of the relationship__. This is what reifies the edge: the relationship knows the concrete block it lives in, so it can be re-derived when that block changes, and pointed at by other relationships.
  - `:value` is the logical target. For **e** it is the entity, for **a** it is the attribute page. For **v** only, it may also be a plain **string**. (Only the value position can be a string; entity and attribute positions are always node refs.)
- **Where the triples live: `:entity/attrs`**
  - The full set of triples is stored under `:entity/attrs` on **the entity being described** — i.e. on the node that appears as the **e** `:value`, __not__ on the attribute block. It is a set: `#{ [e a v] [e a v] ... }`.
  - So to read "what does `[[Project Apollo]]` assert", you pull `:entity/attrs` off the Apollo page.
- **The reverse index: `:attrs/lookup`**
  - `:entity/attrs` is a nested blob, which Datascript cannot index by content. So alongside it, each entity carries a flat, many-cardinality ref `:attrs/lookup` listing every node mentioned anywhere in `:entity/attrs`.
  - Its reverse, `:attrs/_lookup`, is the workhorse for queries. To find every entity with a `Status` attribute: walk `:attrs/_lookup` backwards from the `[[Status]]` page to candidate entities, then check their `:entity/attrs` for triples whose **a** `:value` is `[[Status]]`. The same trick answers "everything `[[Jane Doe]]` is a value of".
- **Why not just use Datascript's native attributes?**
  - Datascript is itself an EAV store, so why not store each `Name:: value` as a plain datom `[entity :SomeAttr value]`? Native datoms can't carry what Roam attributes need:
  - **It's a hypergraph — the edge has to be something you can point to.** A native datom `[e a v]` is just a fact; there's no entity for the relationship itself to reference or hang more attributes on. Roam anchors every assertion to a real block, so the edge __is__ an addressable node — a Datascript attribute gives you no such handle.
  - **Attribute names must be entities, not keywords.** A native attribute is a schema keyword (`:Status`) you can't link to, rename, give backlinks, or attach its own attributes to. Roam attributes *are* pages (so the **a** `:value` is always a page).
  - **Value type and cardinality can't be per-instance.** Datascript fixes `:db/valueType` and cardinality in the schema up front; a Roam attribute's value is a string, a ref, one or many — decided per instance by what the user typed.
  - **Native datoms have no provenance.** `[e a v]` doesn't record *which block authored it* — and the `:source` on every position is what lets us recompute and retract exactly the triples a block contributes when its text changes. Datascript's only per-datom metadata is the transaction entity, the wrong granularity.
  - **It avoids schema explosion.** Otherwise every user-coined name becomes a distinct runtime schema keyword — thousands per graph. The set-on-entity approach keeps the schema fixed and stores attribute identity as data (page refs).
- **Worked example**
  - Outline (uids in parens):
    - ```javascript
      Project Apollo (page-apollo)
        Status:: Active (blk-status)
        Owner:: [[Jane Doe]] (blk-owner)
        Tags::(blk-tags)
          [[urgent]] (blk-tag1)
          [[backend]] (blk-tag2)```
  - The `:entity/attrs` stored on `Project Apollo` (page-apollo):
    - ```clojure
      #{;; Project Apollo --Status--> "Active"  (inline text becomes a string)
        [{:source [:block/uid "page-apollo"] :value [:block/uid "page-apollo"]}
         {:source [:block/uid "blk-status"] :value [:block/uid "page-status"]}
         {:source [:block/uid "blk-status"] :value "Active"}]

        ;; Project Apollo --Owner--> [[Jane Doe]]  (inline ref becomes a node)
        [{:source [:block/uid "page-apollo"] :value [:block/uid "page-apollo"]}
         {:source [:block/uid "blk-owner"] :value [:block/uid "page-owner"]}
         {:source [:block/uid "blk-owner"] :value [:block/uid "page-jane"]}]

        ;; Project Apollo --Tags--> [[urgent]]  (child block becomes a node)
        [{:source [:block/uid "page-apollo"] :value [:block/uid "page-apollo"]}
         {:source [:block/uid "blk-tags"] :value [:block/uid "page-tags"]}
         {:source [:block/uid "blk-tag1"] :value [:block/uid "page-urgent"]}]

        ;; Project Apollo --Tags--> [[backend]]
        [{:source [:block/uid "page-apollo"] :value [:block/uid "page-apollo"]}
         {:source [:block/uid "blk-tags"] :value [:block/uid "page-tags"]}
         {:source [:block/uid "blk-tag2"] :value [:block/uid "page-backend"]}]}
      ```
  - Its `:attrs/lookup` is the flat, de-duplicated index of everything referenced:
    - ```clojure
      [{:block/uid "page-apollo"}
       {:block/uid "blk-status"}
       {:block/uid "page-status"}
       {:block/uid "blk-owner"}
       {:block/uid "page-owner"}
       {:block/uid "page-jane"}
       {:block/uid "blk-tags"}
       {:block/uid "page-tags"}
       {:block/uid "blk-tag1"}
       {:block/uid "page-urgent"}
       {:block/uid "blk-tag2"}
       {:block/uid "page-backend"}]
      ```
  - so `[[Status]]`'s `:attrs/_lookup` includes `page-apollo`, and you can find Apollo from Status.
- **Value semantics (a gotcha worth knowing)**
  - How a value is represented depends on __where you write it__:
  - **Inline text** (`Status:: Active`) → the v `:value` is the literal **string** `"Active"`.
  - **Inline ref** (`Owner:: [[Jane Doe]]`) → the v `:value` is the referenced **node**.
  - **Child block** → each child yields its own triple; a `[[ref]]` child resolves to the referenced page, while a __plain-text__ child resolves to **that child block's own node** (a block ref), not a string.
  - Attribute names also only resolve refs **one level deep** (`[[hello [[world]]]]` picks up `hello`, not the nested `world`).
- **Back to the hypergraph, concretely**
  - Because the relationship is anchored to a real block (`blk-owner`), you can hang attributes __on the edge itself__ (e.g. `Role:: Lead` and `Since:: 2024` nested under `Owner:: [[Jane Doe]]`).
  - Those produce their own triples whose **e** is `blk-owner` — i.e. the __ownership relationship__ is now an entity with its own `:entity/attrs`. Combined with the `:attrs/_lookup` index, that is everything you need to traverse: from any node, find the relationships it participates in (forward via `:entity/attrs`, backward via `:attrs/_lookup`), and each relationship is itself a node you can keep walking from.
