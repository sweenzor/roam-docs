/**
 * TypeScript definitions for window.roamAlphaAPI (Roam Research frontend API).
 *
 * Coverage is verified against a live-introspected inventory of the running app
 * (see the /developer-documentation/llms-full.txt appendix): every function that exists on window.roamAlphaAPI
 * appears here, including ones missing from the official docs. Functions whose
 * parameter shapes are not (yet) officially documented are marked @undocumented —
 * their existence and arity are verified, their argument types are best-effort.
 *
 * API version at introspection time: 1.1.2
 * Docs: https://roamresearch.com/#/app/developer-documentation
 */

export {};

// ---------------------------------------------------------------------------
// Shared types

/** 9-character Roam Research uid, e.g. "nNdE8rkMx". Daily note pages use "MM-DD-YYYY". */
export type RoamUid = string;

/** Datalog entity id: a numeric db id or an entity lookup like `[:block/uid "abc123xyz"]`. */
export type RoamEid = number | string;

export type ViewType = "bullet" | "document" | "numbered";
export type TextAlign = "left" | "center" | "right" | "justify";
/** 0 clears the heading. */
export type HeadingLevel = 0 | 1 | 2 | 3;

/** Result shape of pull/pull_many (keys are datalog keywords, with leading ":"). */
export interface PullBlock {
  ":db/id"?: number;
  ":block/uid"?: RoamUid;
  ":node/title"?: string;
  ":block/string"?: string;
  ":block/order"?: number;
  ":block/heading"?: number;
  ":block/open"?: boolean;
  ":block/text-align"?: TextAlign;
  ":children/view-type"?: `:${ViewType}`;
  ":block/children"?: PullBlock[];
  ":block/refs"?: PullBlock[];
  ":block/parents"?: PullBlock[];
  ":block/page"?: PullBlock;
  ":create/time"?: number;
  ":edit/time"?: number;
  ":create/user"?: PullBlock;
  ":edit/user"?: PullBlock;
  ":page/sidebar"?: number;
  [key: `:${string}`]: unknown;
}

export interface BlockLocation {
  "parent-uid": RoamUid;
  order: number | "first" | "last";
}

export interface CreateBlockArgs {
  location: BlockLocation;
  block: {
    string: string;
    /** Provide your own (util.generateUID()) if you need to reference the block afterwards. */
    uid?: RoamUid;
    open?: boolean;
    heading?: HeadingLevel;
    "text-align"?: TextAlign;
    "children-view-type"?: ViewType;
  };
}

export interface UpdateBlockArgs {
  block: {
    uid: RoamUid;
    string?: string;
    open?: boolean;
    heading?: HeadingLevel;
    "text-align"?: TextAlign;
    "children-view-type"?: ViewType;
  };
}

export interface MoveBlockArgs {
  location: BlockLocation;
  block: { uid: RoamUid };
}

export interface DeleteBlockArgs {
  block: { uid: RoamUid };
}

export interface CreatePageArgs {
  page: {
    title: string;
    uid?: RoamUid;
    "children-view-type"?: ViewType;
  };
}

export interface UpdatePageArgs {
  page: { uid: RoamUid; title: string };
}

export interface DeletePageArgs {
  page: { uid: RoamUid };
}

/** Identify a page by title or uid. */
export type PageRef = { title: string } | { uid: RoamUid };

export type SidebarWindowType =
  | "block"
  | "outline"
  | "mentions"
  | "graph"
  | "search-query";

export interface SidebarWindowInput {
  type: SidebarWindowType;
  "block-uid": RoamUid;
  order?: number;
}

export interface SidebarWindow {
  type: SidebarWindowType;
  "window-id": string;
  order: number;
  "collapsed?"?: boolean;
  "pinned?"?: boolean;
  "block-uid"?: RoamUid;
  "page-uid"?: RoamUid;
  [key: string]: unknown;
}

export interface FocusedBlock {
  "window-id": string;
  "block-uid": RoamUid;
}

/** Context passed to block context-menu command callbacks. */
export interface BlockContextMenuInfo {
  "block-string": string;
  "block-uid": RoamUid;
  "page-uid": RoamUid;
  "window-id": string;
  heading?: number | null;
  "read-only?"?: boolean;
  [key: string]: unknown;
}

export interface ContextMenuCommand<Ctx = Record<string, unknown>> {
  label: string;
  callback: (context: Ctx) => void;
  "display-conditional"?: (context: Ctx) => boolean;
}

export interface CommandPaletteCommand {
  label: string;
  callback: () => void;
  "disable-hotkey"?: boolean;
  /** e.g. "ctrl-shift-h" */
  "default-hotkey"?: string | string[];
}

export interface GlobalFilterArgs {
  title: string;
  type: "includes" | "removes";
}

export interface Filters {
  includes?: string[];
  removes?: string[];
}

export type PullWatchCallback = (
  before: PullBlock | null,
  after: PullBlock | null
) => void;

// ---------------------------------------------------------------------------

export interface RoamAlphaAPI {
  /** API version string, e.g. "1.1.2". */
  apiVersion: string;

  graph: {
    name: string;
    type: "hosted" | "offline";
    isEncrypted: boolean;
  };

  platform: {
    isDesktop: boolean;
    isMobile: boolean;
    isMobileApp: boolean;
    isIOS: boolean;
    isPC: boolean;
    isTouchDevice: boolean;
  };

  constants: {
    /** CORS proxy usable by extensions for cross-origin fetches. */
    corsAnywhereProxyUrl: string;
  };

  /**
   * Synchronous datalog query against the graph.
   * @example roamAlphaAPI.q('[:find ?uid . :in $ ?t :where [?e :node/title ?t] [?e :block/uid ?uid]]', 'My Page')
   */
  q(query: string, ...args: unknown[]): any;

  /**
   * Synchronous datalog pull.
   * @example roamAlphaAPI.pull('[:block/string {:block/children ...}]', '[:block/uid "abc123xyz"]')
   */
  pull(selector: string, eid: RoamEid): PullBlock | null;

  createBlock(args: CreateBlockArgs): Promise<void>;
  updateBlock(args: UpdateBlockArgs): Promise<void>;
  moveBlock(args: MoveBlockArgs): Promise<void>;
  deleteBlock(args: DeleteBlockArgs): Promise<void>;
  createPage(args: CreatePageArgs): Promise<void>;
  updatePage(args: UpdatePageArgs): Promise<void>;
  deletePage(args: DeletePageArgs): Promise<void>;

  data: {
    /** Same as roamAlphaAPI.q. */
    q(query: string, ...args: unknown[]): any;
    /** Same as roamAlphaAPI.pull. */
    pull(selector: string, eid: RoamEid): PullBlock | null;
    /** Pull many entities at once. */
    pull_many(selector: string, eids: RoamEid[]): (PullBlock | null)[];

    fast: {
      /**
       * Faster q variant: returns results with keyword keys as strings and
       * shared structure — treat the result as read-only.
       */
      q(query: string, ...args: unknown[]): any;
    };

    async: {
      /** Promise-based q (use from contexts where the sync db may not be ready). */
      q(query: string, ...args: unknown[]): Promise<any>;
      pull(selector: string, eid: RoamEid): Promise<PullBlock | null>;
      pull_many(selector: string, eids: RoamEid[]): Promise<(PullBlock | null)[]>;
      fast: {
        q(query: string, ...args: unknown[]): Promise<any>;
      };
      /** @undocumented Text search across the graph. */
      search(args: Record<string, unknown> | string): Promise<unknown>;
      /** @undocumented Semantic (embedding) search; check data.semanticSearchEnabled() first. */
      semanticSearch(args: Record<string, unknown> | string): Promise<unknown>;
    };

    backend: {
      /**
       * Runs the query on Roam Research's backend rather than the local datascript db.
       * Useful before local sync completes; slower per-call.
       */
      q(query: string, ...args: unknown[]): Promise<any>;
    };

    /**
     * Watch an entity for changes.
     * @example addPullWatch('[:block/string {:block/children ...}]', '[:block/uid "abc"]', cb)
     */
    addPullWatch(pullPattern: string, entityId: string, callback: PullWatchCallback): void;
    removePullWatch(pullPattern: string, entityId: string, callback: PullWatchCallback): void;

    undo(): Promise<void>;
    redo(): Promise<void>;

    /** Run a Roam Research {{query}} (the block-embeddable query syntax, not datalog). @undocumented */
    roamQuery(query: string): unknown;
    /** @undocumented Text search (sync). */
    search(query: string): unknown;
    /** Whether semantic search is available on this graph. */
    semanticSearchEnabled(): boolean;

    block: {
      create(args: CreateBlockArgs): Promise<void>;
      update(args: UpdateBlockArgs): Promise<void>;
      move(args: MoveBlockArgs): Promise<void>;
      delete(args: DeleteBlockArgs): Promise<void>;
      /** Reorder the children of a block. @undocumented */
      reorderBlocks(args: Record<string, unknown>): Promise<void>;
      /** Add a comment thread to a block. @undocumented */
      addComment(args: Record<string, unknown>): Promise<void>;
      /** Create block(s) from a markdown string. @undocumented */
      fromMarkdown(args: Record<string, unknown>): Promise<unknown>;
    };

    page: {
      create(args: CreatePageArgs): Promise<void>;
      update(args: UpdatePageArgs): Promise<void>;
      delete(args: DeletePageArgs): Promise<void>;
      /** Add a page to the left-sidebar shortcuts. */
      addShortcut(args: { page: PageRef }): Promise<void>;
      removeShortcut(args: { page: PageRef }): Promise<void>;
      /** Create a page from a markdown string. @undocumented */
      fromMarkdown(args: Record<string, unknown>): Promise<unknown>;
    };

    user: {
      /** @undocumented */
      upsert(args: Record<string, unknown>): Promise<unknown>;
    };

    /**
     * AI/agent-oriented read APIs (these power Roam Research's MCP server).
     * @undocumented Discovered via live introspection.
     */
    ai: {
      getPage(args: Record<string, unknown>): Promise<unknown>;
      getBlock(args: Record<string, unknown>): Promise<unknown>;
      getBacklinks(args: Record<string, unknown>): Promise<unknown>;
      getComments(args: Record<string, unknown>): Promise<unknown>;
      getGraphGuidelines(args?: Record<string, unknown>): Promise<unknown>;
      search(args: Record<string, unknown>): Promise<unknown>;
      searchTemplates(args: Record<string, unknown>): Promise<unknown>;
      roamQuery(args: Record<string, unknown>): Promise<unknown>;
    };
  };

  ui: {
    /** The block the user is currently editing, or null. */
    getFocusedBlock(): FocusedBlock | null;

    setBlockFocusAndSelection(args: {
      location?: { "block-uid": RoamUid; "window-id": string };
      selection?: { start: number; end?: number };
    }): Promise<void>;

    leftSidebar: {
      open(): Promise<void>;
      close(): Promise<void>;
    };

    rightSidebar: {
      open(): Promise<void>;
      close(): Promise<void>;
      getWindows(): SidebarWindow[];
      addWindow(args: { window: SidebarWindowInput }): Promise<void>;
      removeWindow(args: { window: SidebarWindowInput }): Promise<void>;
      collapseWindow(args: { window: SidebarWindowInput }): Promise<void>;
      expandWindow(args: { window: SidebarWindowInput }): Promise<void>;
      pinWindow(args: { window: SidebarWindowInput }): Promise<void>;
      unpinWindow(args: { window: SidebarWindowInput }): Promise<void>;
      setWindowOrder(args: { window: SidebarWindowInput & { order: number } }): Promise<void>;
    };

    mainWindow: {
      openPage(args: { page: PageRef }): Promise<void>;
      openBlock(args: { block: { uid: RoamUid } }): Promise<void>;
      openDailyNotes(): Promise<void>;
      /** e.g. { type: "outline", uid: "49715b-M2", title: "Developer Hub" } */
      getOpenView(): Promise<{ type: string; uid?: RoamUid; title?: string }>;
      getOpenPageOrBlockUid(): Promise<RoamUid | null>;
      focusFirstBlock(): Promise<void>;
      /** @undocumented */
      openComponent(...args: unknown[]): unknown;
      /** @undocumented */
      registerComponent(...args: unknown[]): unknown;
      /** @undocumented */
      unregisterComponent(...args: unknown[]): unknown;
      /** @undocumented */
      closeComponent(): unknown;
    };

    commandPalette: {
      addCommand(args: CommandPaletteCommand): void;
      removeCommand(args: { label: string }): void;
    };

    blockContextMenu: {
      addCommand(args: ContextMenuCommand<BlockContextMenuInfo>): void;
      removeCommand(args: { label: string }): void;
    };
    /** Right-click menu on block references. @undocumented context shape */
    blockRefContextMenu: {
      addCommand(args: ContextMenuCommand): void;
      removeCommand(args: { label: string }): void;
    };
    /** Right-click menu on page titles. @undocumented context shape */
    pageContextMenu: {
      addCommand(args: ContextMenuCommand): void;
      removeCommand(args: { label: string }): void;
    };
    /** Right-click menu on page references. @undocumented context shape */
    pageRefContextMenu: {
      addCommand(args: ContextMenuCommand): void;
      removeCommand(args: { label: string }): void;
    };
    /** Right-click menu on page links. @undocumented context shape */
    pageLinkContextMenu: {
      addCommand(args: ContextMenuCommand): void;
      removeCommand(args: { label: string }): void;
    };
    /** Multiselect context menu. @undocumented context shape */
    msContextMenu: {
      addCommand(args: ContextMenuCommand): void;
      removeCommand(args: { label: string }): void;
    };

    slashCommand: {
      addCommand(args: { label: string; callback: () => void }): void;
      removeCommand(args: { label: string }): void;
    };

    filters: {
      addGlobalFilter(args: GlobalFilterArgs): Promise<void>;
      removeGlobalFilter(args: GlobalFilterArgs): Promise<void>;
      getGlobalFilters(): { includes: string[]; removes: string[] };
      getPageFilters(args: { page: PageRef }): unknown;
      getPageLinkedRefsFilters(args: { page: PageRef }): unknown;
      getSidebarWindowFilters(args: { window: SidebarWindowInput }): unknown;
      setPageFilters(args: { page: PageRef; filters: Filters }): Promise<void>;
      setPageLinkedRefsFilters(args: { page: PageRef; filters: Filters }): Promise<void>;
      setSidebarWindowFilters(args: {
        window: SidebarWindowInput;
        filters: Filters;
      }): Promise<void>;
    };

    components: {
      /** Render a block (and children) into your own element. */
      renderBlock(args: {
        uid: RoamUid;
        el: HTMLElement;
        "zoom-path?"?: boolean;
        open?: boolean;
      }): void;
      renderPage(args: ({ uid: RoamUid } | { title: string }) & {
        el: HTMLElement;
        "hide-mentions?"?: boolean;
      }): void;
      /** Render a string of Roam Research-flavored markdown. */
      renderString(args: { string: string; el: HTMLElement }): void;
      renderSearch(args: {
        "search-query-str": string;
        el: HTMLElement;
        "closed?"?: boolean;
        "group-by-page?"?: boolean;
        "hide-paths?"?: boolean;
        "config-changed-callback"?: (config: unknown) => void;
        "result-count-changed-callback"?: (count: number) => void;
      }): void;
      /** Unmount anything previously rendered into el by the calls above. */
      unmountNode(args: { el: HTMLElement }): void;
    };

    graphView: {
      /** @undocumented */
      addCallback(args: { label: string; callback: (info: unknown) => void }): void;
      /** @undocumented */
      removeCallback(args: { label: string }): void;
      wholeGraph: {
        /** @undocumented e.g. "Whole Graph" */
        setMode(mode: string): unknown;
        setExplorePages(pages: string[]): unknown;
        getExplorePages(): string[];
        addCallback(args: { label: string; callback: (info: unknown) => void }): void;
        removeCallback(args: { label: string }): void;
      };
    };

    multiselect: {
      /** Uids of blocks selected via multiselect. */
      getSelected(): unknown[];
    };
    individualMultiselect: {
      getSelectedUids(): RoamUid[];
    };

    /** Custom callout types ("callout" blocks). @undocumented Discovered via live introspection. */
    callout: {
      addType(args: Record<string, unknown>): unknown;
      removeType(args: Record<string, unknown>): unknown;
    };

    /**
     * React components for embedding Roam Research UI in custom React trees.
     * @undocumented Discovered via live introspection; props unverified.
     */
    react: {
      Block: unknown;
      BlockString: unknown;
      Page: unknown;
      Search: unknown;
    };
  };

  file: {
    /** Upload a file to the graph's storage; resolves to the hosted URL. */
    upload(args: { file: File; toast?: { hide: boolean } }): Promise<string>;
    /** Fetch a previously-uploaded file by its firebase URL. */
    get(args: { url: string }): Promise<File>;
    delete(args: { url: string }): Promise<void>;
  };

  util: {
    /** New 9-char uid, e.g. "wG2VsyRpi". */
    generateUID(): string;
    /** new Date(2026,0,15) -> "January 15th, 2026" */
    dateToPageTitle(date: Date): string;
    /** new Date(2026,0,15) -> "01-15-2026" */
    dateToPageUid(date: Date): string;
    /** "January 15th, 2026" -> Date (null/invalid for non-DNP titles) */
    pageTitleToDate(title: string): Date | null;
    /** Alias of file.upload. */
    uploadFile(args: { file: File; toast?: { hide: boolean } }): Promise<string>;
  };

  user: {
    /** Current user's uid, or null when not signed in. */
    uid(): string | null;
    isAdmin(): boolean;
  };

  depot: {
    /**
     * Installed Roam Depot extensions, keyed by extension id ({} when none).
     * @undocumented Verified to exist via live introspection (absent from official docs).
     */
    getInstalledExtensions(): Record<string, unknown>;
  };
}

declare global {
  interface Window {
    roamAlphaAPI: RoamAlphaAPI;
  }

  /** Convenience global some extension contexts rely on. */
  const roamAlphaAPI: RoamAlphaAPI;
}

/**
 * The extensionAPI object passed to a Roam Depot extension's onload.
 * See the "Roam Depot/Extension API" docs page.
 */
export interface ExtensionAPI {
  settings: {
    get(key: string): unknown;
    getAll(): Record<string, unknown>;
    set(key: string, value: unknown): Promise<void>;
    panel: {
      create(config: {
        tabTitle: string;
        settings: Array<{
          id: string;
          name: string;
          description?: string;
          action?:
            | { type: "input"; placeholder?: string; onChange?: (e: Event) => void }
            | { type: "select"; items: string[]; onChange?: (value: string) => void }
            | { type: "switch"; onChange?: (e: Event) => void }
            | { type: "button"; onClick?: (e: Event) => void; content?: string }
            | { type: "reactComponent"; component: unknown };
        }>;
      }): void;
    };
  };
  ui: {
    commandPalette: {
      addCommand(args: CommandPaletteCommand): void;
      removeCommand(args: { label: string }): void;
    };
  };
}

export interface RoamExtension {
  onload(args: { extensionAPI: ExtensionAPI }): void | Promise<void>;
  onunload(): void | Promise<void>;
}
