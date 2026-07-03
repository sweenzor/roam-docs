// Rendering Roam Research UI into your own DOM elements (extensions / roam/js).

const api = window.roamAlphaAPI;

// Render a live block (editable, synced) into any element
const el = document.createElement('div');
document.body.appendChild(el);
api.ui.components.renderBlock({ uid: 'SOME-BLOCK-UID', el, open: true });

// Render a whole page
api.ui.components.renderPage({ title: 'My Page', el, 'hide-mentions?': true });

// Render a string of Roam Research-flavored markdown (read-only preview)
api.ui.components.renderString({ string: 'A **bold** [[link]] and a ((ref))', el });

// Render live search results
api.ui.components.renderSearch({
  'search-query-str': 'roamAlphaAPI',
  el,
  'group-by-page?': true,
  'result-count-changed-callback': (n) => console.log(n, 'results'),
});

// Always clean up what you rendered (e.g. in onunload)
api.ui.components.unmountNode({ el });

// Open things in the UI instead:
await api.ui.mainWindow.openPage({ page: { title: 'My Page' } });
await api.ui.rightSidebar.addWindow({
  window: { type: 'block', 'block-uid': 'SOME-BLOCK-UID', order: 0 },
});
