// Reading data with datalog — window.roamAlphaAPI.q / pull
// Run in the browser console on an open graph, in a roam/js block, or in an extension.

// Page title -> uid
const pageUid = window.roamAlphaAPI.q(
  '[:find ?uid . :in $ ?title :where [?p :node/title ?title] [?p :block/uid ?uid]]',
  'My Page'
);

// Every TODO block: [[uid, "text"], ...]
const todos = window.roamAlphaAPI.q(`
  [:find ?uid ?string
   :where [?todo :node/title "TODO"]
          [?b :block/refs ?todo]
          [?b :block/uid ?uid]
          [?b :block/string ?string]]`);

// Full-text search
const hits = window.roamAlphaAPI.q(
  `[:find ?uid ?string
    :in $ ?needle
    :where [?b :block/string ?string]
           [(clojure.string/includes? ?string ?needle)]
           [?b :block/uid ?uid]]`,
  'roamAlphaAPI'
);

// Pull one block/page with its whole subtree (recursive pattern: `...`)
const tree = window.roamAlphaAPI.pull(
  '[:block/uid :node/title :block/string :block/order {:block/children ...}]',
  `[:block/uid "${pageUid}"]`
);

// Async variant (safe before the local db finishes syncing)
const count = await window.roamAlphaAPI.data.async.q(
  '[:find (count ?b) . :where [?b :block/uid]]'
);
console.log({ pageUid, todos: todos.length, hits: hits.length, tree, count });
