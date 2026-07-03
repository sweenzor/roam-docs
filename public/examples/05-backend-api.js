// Roam Backend API from Node/Deno/Workers — plain fetch, no SDK required.
// (Official SDKs exist: npm @roam-research/roam-api-sdk, plus python/clojure/java/rust.)

const GRAPH = 'YOUR-GRAPH';
const TOKEN = 'roam-graph-token-XXXX';

async function roamPost(route, body) {
  const res = await fetch(`https://api.roamresearch.com/api/graph/${GRAPH}/${route}`, {
    method: 'POST',
    redirect: 'follow', // redirects to the graph's shard;
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      // X-Authorization survives the cross-origin redirect (Authorization gets stripped)
      'x-authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${route}: ${res.status} ${await res.text()}`);
  return (await res.json()).result;
}

// Datalog query (note: result keys come back with leading ":")
const uids = await roamPost('q', {
  query: '[:find [?uid ...] :where [?e :node/title] [?e :block/uid ?uid]]',
});

// Recursive pull of the first page
const tree = await roamPost('pull', {
  selector: '[:block/uid :node/title :block/string {:block/children ...}]',
  eid: `[:block/uid "${uids[0]}"]`,
});

// Writes use /write with the same action maps as the frontend API, e.g.:
// await roamPost('write', {action: 'create-block',
//   location: {'parent-uid': 'PAGE-UID', order: 'last'},
//   block: {string: 'from the backend API'}});

console.log(uids.length, 'pages;', tree[':node/title']);
