// Creating and editing content. All write calls return Promises — await them.

const api = window.roamAlphaAPI;

// Create a page (uid optional; provide one to reference the page right after)
const pageUid = api.util.generateUID();
await api.createPage({ page: { title: 'API Scratchpad', uid: pageUid } });

// Add a block at the end of that page
const blockUid = api.util.generateUID();
await api.createBlock({
  location: { 'parent-uid': pageUid, order: 'last' },
  block: { string: 'Hello from the Alpha API', uid: blockUid },
});

// Nest a child under it
await api.createBlock({
  location: { 'parent-uid': blockUid, order: 0 },
  block: { string: 'a child block', heading: 0 },
});

// Edit, move, delete
await api.updateBlock({ block: { uid: blockUid, string: 'Hello (edited)', open: false } });
await api.moveBlock({ location: { 'parent-uid': pageUid, order: 'first' }, block: { uid: blockUid } });
await api.deleteBlock({ block: { uid: blockUid } });

// Write to today's daily note page
const todayUid = api.util.dateToPageUid(new Date()); // "MM-DD-YYYY"
await api.createBlock({
  location: { 'parent-uid': todayUid, order: 'last' },
  block: { string: 'Captured via API' },
});
