# PDF Annotator

- Upload a PDF into any block and Roam becomes a reader and annotator: highlight passages, tag them, and hang notes off them.
- Every highlight is a regular Roam block. That means you can reference it anywhere, nest notes under it, and find it in search.
- Try it on this copy of Doug Engelbart's 1962 paper, __Augmenting Human Intellect__. Highlights you make here aren't saved, so feel free to experiment.
- {{[[pdf]]: https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FlPT97cB08L.pdf?alt=media&token=e19a2a18-3673-4f66-902f-f9c83e3f71fb}}

### Reading a PDF

- Type `/upload` in a block and pick the file. The PDF renders right there.
- Reading in a block gets cramped, so click the **fullscreen** button in the toolbar to expand the PDF to the whole main window. The same button collapses it back.
- The toolbar also has page navigation, zoom (with fit-to-page and fit-to-width), and search within the document.

### Highlighting and taking notes

- Select some text and click **Create highlight**. The same popup has note and tag buttons, which create the highlight with a note or tag already attached.
- Or turn on highlight mode from the toolbar, and every selection becomes a highlight automatically. There's a mode for text and one for areas.
- Hold `Alt` and drag to capture an area instead. Area highlights save a snapshot image of that region, which is how you clip figures and diagrams.
- Copy what a highlight holds with `Cmd-c` (text or image), or grab a reference to it with `Cmd-Shift-c` and drop it in your notes. Shift-click opens the highlight's block.
- Deleting a highlight warns you first if notes or references would be lost with it.

### The PDF page

- Behind every PDF is a page of its own, named after the file. Open it from the viewer's menu, or by shift-clicking a highlight's block reference.
- Your highlights and notes collect there, grouped under a **Notes** section per person.
- Roam recognizes a PDF by its contents, not its location. Upload the same file again, or embed it in several places, and they all share one PDF page and one set of annotations.
