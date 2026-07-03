# Roam Backend API (REST) — query a graph you own from anywhere.
# Token: Settings > Graph > API tokens (graph admins only). Needs read-only or read+edit role.
# --location-trusted is required: api.roamresearch.com redirects to your graph's shard
# and the auth header must survive the redirect.

curl -X POST "https://api.roamresearch.com/api/graph/YOUR-GRAPH/q" \
  --location-trusted \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-Authorization: Bearer roam-graph-token-XXXX" \
  -d '{
    "query": "[:find ?uid ?string :in $ ?needle :where [?b :block/string ?string] [(clojure.string/includes? ?string ?needle)] [?b :block/uid ?uid]]",
    "args": ["roamAlphaAPI"]
  }'

# Pull a page's full tree by uid:
curl -X POST "https://api.roamresearch.com/api/graph/YOUR-GRAPH/pull" \
  --location-trusted \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-Authorization: Bearer roam-graph-token-XXXX" \
  -d '{
    "selector": "[:block/uid :node/title :block/string :block/order {:block/children ...}]",
    "eid": "[:block/uid \"PAGE-UID\"]"
  }'
