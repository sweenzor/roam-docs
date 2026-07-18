# Zen Mode

- Zen Mode (or Focus Mode) strips the interface down to just what you're writing. One command hides everything else, and toggling it again puts it all back the way it was.
- Toggle it with `Cmd-k` then `z` (PC: `Ctrl-k` then `z`), or run **Toggle Zen Mode** from the [[Command Palette]].
- While you're in Zen Mode, that command stays pinned to the top of the palette, so the way out is always one `Cmd-p` away.

#### [[Zen Mode]]

- **Zen Mode (or Focus mode)** allows you to focus on just the current page or block by hiding all unnecessary UI elements
  - What happens when you trigger Zen Mode?
    - hides the left and right sidebars
    - hides the topbar ( a minimal topbar is visible on hover )
      - a minimal topbar is visible on hover
        - only has
          - sync dot
          - help button
          - navigation arrow buttons (in desktop app)
    - hides the search bar (you need to use the hotkey to trigger when in this mode)
    - and, in [[Desktop App]], switches to full screen (removing menu bar too)
  - When you get out of Zen Mode, it brings everything back to how it was before
- **Demo**
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2F-gPHx_5hvn.gif?alt=media&token=15319200-d502-43c8-b7b2-1b14486eb5f5)
- **How to use?**
  - You can trigger Zen Mode by opening the command palette (`cmd-p` or `ctrl-p`) and then triggering the command **"Toggle Zen Mode"**
    - To quit Zen mode, you just trigger that command again
- **Some useful shortcuts for navigating when in Zen Mode:**
  - Search: `cmd-u` or `ctrl-u`
  - Go to daily notes: `ctrl-shift-d` or `alt-d`
- **Huge thanks** to [[Mark Lavercombe]] for his extension [Focus Mode](https://github.com/mlava/focus-mode) which was a major source of inspiration for this feature
  - We liked it so much that we decided to make it native 😁
  - If you want more customizability than the native feature provides (like say, you want to not hide right sidebar, or keep search intact), do play around with his extension!
