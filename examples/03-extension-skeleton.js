// Minimal Roam Depot extension (extension.js).
// Repo layout, manifest and publishing: see the "Roam Depot/Extensions" docs page.

function onload({ extensionAPI }) {
  // Settings panel (appears under Settings > Extensions)
  extensionAPI.settings.panel.create({
    tabTitle: 'My Extension',
    settings: [
      {
        id: 'api-endpoint',
        name: 'API endpoint',
        description: 'Where to send captured blocks',
        action: { type: 'input', placeholder: 'https://example.com/hook' },
      },
      { id: 'enabled', name: 'Enable sync', action: { type: 'switch' } },
    ],
  });

  // Command palette entry (Cmd/Ctrl-P)
  extensionAPI.ui.commandPalette.addCommand({
    label: 'My Extension: Log focused block',
    callback: () => {
      const focused = window.roamAlphaAPI.ui.getFocusedBlock();
      if (!focused) return;
      const block = window.roamAlphaAPI.pull('[:block/string]', [
        ':block/uid',
        focused['block-uid'],
      ]);
      console.log('focused block:', block?.[':block/string']);
    },
  });

  // Right-click menu on blocks
  window.roamAlphaAPI.ui.blockContextMenu.addCommand({
    label: 'Copy block uid',
    callback: (ctx) => navigator.clipboard.writeText(ctx['block-uid']),
  });

  console.log('my-extension loaded; setting =', extensionAPI.settings.get('api-endpoint'));
}

function onunload() {
  // Commands added via extensionAPI are cleaned up automatically.
  // Anything registered directly on window.roamAlphaAPI must be removed by hand:
  window.roamAlphaAPI.ui.blockContextMenu.removeCommand({ label: 'Copy block uid' });
}

export default { onload, onunload };
