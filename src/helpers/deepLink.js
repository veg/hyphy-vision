/**
 * Deep-link helpers (issue #897).
 *
 * Besides `?json=` / `?resultsUrl=` (which choose the results file), a Vision
 * URL may carry:
 *
 *   ?section=<name>   (alias `?tab=`, or a `#<name>` hash)
 *       Scroll to a named part of the results page once it has rendered.
 *       Friendly names (summary, plot, table, tree, fits) work on every page;
 *       any element id (e.g. `tree-tab`) or Observable notebook cell name
 *       (e.g. `figure1`, `table1`) is accepted as well.
 *   ?tree=<option>    Select a tree in the notebook's "Tree to view" menu
 *       (BUSTED, aBSREL, MEME, FEL), e.g. `tree=Partition 1` or `tree=Codon 12`.
 *   ?partition=<n>    Shorthand for `tree=Partition <n>`.
 *   ?site=<n>         Shorthand for `tree=Codon <n>` (alias `?codon=`).
 *   ?branch=<name>    Highlight that branch in the rendered tree and scroll
 *       to it. On BUSTED/MEME, whose tree is hidden until a tree is chosen,
 *       the first partition tree is selected automatically.
 *
 * `tree`, `partition`, `site` and `branch` also scroll to the tree unless a
 * `section` is given. Every parameter is optional; with none of them the page behaves exactly as
 * before.
 */

// Ordered element-id candidates for the friendly section names. Classic
// React pages use `*-tab` ids (the ScrollSpy targets); Observable notebook
// cells are tagged `nb-<cell name>` by tagNotebookCell().
export const SECTION_ALIASES = {
  summary: [
    "summary-tab",
    "slac-summary",
    "nb-summary_table",
    "nb-summaryBox",
    "nb-intro",
  ],
  plot: [
    "plot-tab",
    "site-plot-tab",
    "site-graph-tab",
    "nb-plot_type",
    "nb-fig1caption",
    "nb-figure1",
    "nb-fig1label",
    "nb-fig1_label",
    "nb-fig1",
  ],
  table: [
    "table-tab",
    "site-pairs-tab",
    "nb-table1caption",
    "nb-table1",
    "nb-tabulatedView",
  ],
  tree: ["tree-tab", "nb-tree_id", "nb-figure2"],
  fits: ["fits-tab", "fit-tab", "nb-rate_table"],
};

const SECTION_SYNONYMS = {
  figure: "plot",
  graph: "plot",
  sites: "table",
  "site-table": "table",
  phylogeny: "tree",
  fit: "fits",
  "model-fits": "fits",
};

const BRANCH_CLASS = "hyphy-deeplink-branch";
const NODE_CLASS = "hyphy-deeplink-node";
const STYLE_ID = "hyphy-deeplink-style";
// Fixed navbar height (app.jsx pads the content by 70px).
const NAVBAR_OFFSET = 80;

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    return value;
  }
}

function positiveInteger(value) {
  if (typeof value != "string" || !/^\s*\d+\s*$/.test(value)) return null;
  const n = parseInt(value, 10);
  return n > 0 ? n : null;
}

function nonEmpty(value) {
  if (typeof value != "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

/**
 * Keep only characters that can appear in an element id / cell name.
 * Spaces become dashes so `?section=model fits` -> `model-fits`.
 */
export function sanitizeSection(value) {
  const trimmed = nonEmpty(value);
  if (!trimmed) return null;
  const cleaned = trimmed
    .replace(/^#/, "")
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9_-]/g, "");
  return cleaned.length ? cleaned : null;
}

/**
 * Parse the deep-link parameters from `location.search` and `location.hash`.
 */
export function parseDeepLinkParams(search, hash) {
  const query = new URLSearchParams(search || "");

  const partition = positiveInteger(query.get("partition"));
  const site = positiveInteger(query.get("site") || query.get("codon"));

  let tree = nonEmpty(query.get("tree"));
  if (!tree && partition) tree = "Partition " + partition;
  if (!tree && site) tree = "Codon " + site;

  const hashSection =
    typeof hash == "string" && hash.length > 1
      ? safeDecode(hash.replace(/^#/, ""))
      : null;

  return {
    // Same precedence as before: `json` first, `resultsUrl` for old links.
    json: query.get("json") || query.get("resultsUrl") || null,
    section: sanitizeSection(
      query.get("section") || query.get("tab") || hashSection
    ),
    tree: tree,
    branch: nonEmpty(query.get("branch")),
  };
}

/**
 * Element id given to an Observable notebook cell's DOM node.
 * `viewof tree_id` and `tree_id` both map to `nb-tree_id`.
 */
export function notebookCellId(name) {
  if (typeof name != "string" || !name.length) return null;
  return "nb-" + name.replace(/^viewof\s+/, "").replace(/[^A-Za-z0-9_-]/g, "_");
}

/**
 * Ordered list of element ids to try for a requested section.
 */
export function sectionCandidates(section) {
  const clean = sanitizeSection(section);
  if (!clean) return [];
  const lower = clean.toLowerCase();
  const key = SECTION_SYNONYMS[lower] || lower;
  const candidates = (SECTION_ALIASES[key] || []).concat([
    clean,
    clean + "-tab",
    notebookCellId(clean),
  ]);
  return candidates.filter((id, i) => candidates.indexOf(id) == i);
}

/**
 * Find `wanted` among `options`, exactly or ignoring case/extra spaces.
 * Returns the canonical option string or null.
 */
export function matchOption(options, wanted) {
  if (!options || !options.length || typeof wanted != "string") return null;
  if (options.indexOf(wanted) >= 0) return wanted;
  const norm = (s) => String(s).trim().replace(/\s+/g, " ").toLowerCase();
  const target = norm(wanted);
  for (let i = 0; i < options.length; i++) {
    if (norm(options[i]) == target) return options[i];
  }
  return null;
}

/**
 * Name of the tree node a phylotree branch/node datum refers to. Handles both
 * phylotree 0.1 (d3 v3: `node.name`) and phylotree 1.x (`node.data.name`).
 */
export function phylotreeNodeName(node) {
  if (!node) return null;
  if (node.data && typeof node.data.name == "string") return node.data.name;
  if (typeof node.name == "string") return node.name;
  return null;
}

/* ---------------------------------------------------------------------- */
/* DOM side                                                                */
/* ---------------------------------------------------------------------- */

/**
 * Give an Observable Inspector node a stable id so it can be deep-linked.
 * The first cell to claim an id wins (the `viewof` cell precedes its value).
 */
export function tagNotebookCell(inspector, name) {
  const el = inspector && inspector._node;
  const id = notebookCellId(name);
  if (!el || !id || el.id) return inspector;
  const doc = el.ownerDocument || document;
  if (!doc.getElementById(id)) el.id = id;
  return inspector;
}

export function findSection(section, root) {
  const doc = (root && root.ownerDocument) || document;
  const candidates = sectionCandidates(section);
  for (let i = 0; i < candidates.length; i++) {
    const el = doc.getElementById(candidates[i]);
    if (el && (!root || root.contains(el))) return el;
  }
  return null;
}

function ensureHighlightStyle(doc) {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent =
    "path.branch." +
    BRANCH_CLASS +
    "{" +
    "filter: drop-shadow(0 0 2px #ff9800) drop-shadow(0 0 4px #ff9800);" +
    "stroke-opacity: 1 !important;}" +
    "g.node." +
    NODE_CLASS +
    " text{font-weight: bold; fill: #e65100;}";
  (doc.head || doc.body).appendChild(style);
}

/**
 * Mark the branch (and its node label) called `name` in every rendered
 * phylotree under `root`. Returns the highlighted elements, branches first.
 */
export function highlightBranch(root, name) {
  if (!root || !name) return [];
  const doc = root.ownerDocument || document;
  ensureHighlightStyle(doc);

  const lowered = name.toLowerCase();
  const collect = (selector, nameOf) => {
    const all = Array.prototype.slice.call(root.querySelectorAll(selector));
    let hits = all.filter((el) => nameOf(el.__data__) === name);
    if (!hits.length) {
      hits = all.filter((el) => {
        const n = nameOf(el.__data__);
        return typeof n == "string" && n.toLowerCase() == lowered;
      });
    }
    return hits;
  };

  const branches = collect("path.branch", (d) =>
    phylotreeNodeName(d && d.target)
  );
  const nodes = collect("g.node", (d) => phylotreeNodeName(d));

  branches.forEach((el) => el.classList.add(BRANCH_CLASS));
  nodes.forEach((el) => el.classList.add(NODE_CLASS));
  return branches.concat(nodes);
}

/**
 * After the results have loaded, scroll to the requested section and/or
 * highlight the requested branch. Rendering (especially Observable notebooks)
 * is asynchronous and shifts the layout, so this polls until the target is
 * present and its position has been stable for `settle` ms, or until
 * `timeout`. Scrolling stops as soon as the user scrolls themselves.
 *
 * Returns a cancel function.
 */
export function startDeepLinkNavigation(params, options) {
  const opts = Object.assign(
    { root: null, timeout: 20000, settle: 1500, interval: 200 },
    options || {}
  );
  if (!params || (!params.section && !params.branch && !params.tree)) {
    return () => {};
  }
  if (typeof window == "undefined" || typeof document == "undefined") {
    return () => {};
  }

  const root = opts.root || document.body;
  // A requested tree or branch implies the tree section.
  const section = params.section || "tree";
  const start = Date.now();
  let lastTop = null;
  let stableSince = null;
  let userTookOver = false;
  let done = false;

  const onUser = () => {
    userTookOver = true;
  };
  const userEvents = ["wheel", "touchstart", "keydown", "mousedown"];
  userEvents.forEach((e) =>
    window.addEventListener(e, onUser, { passive: true })
  );

  const stop = (warn) => {
    if (done) return;
    done = true;
    clearInterval(timer);
    userEvents.forEach((e) => window.removeEventListener(e, onUser));
    // eslint-disable-next-line no-console
    if (warn) console.warn(warn);
  };

  const tick = () => {
    const now = Date.now();
    let target = null;
    let branchFound = false;

    if (params.branch) {
      const hits = highlightBranch(root, params.branch);
      if (hits.length) {
        target = hits[0];
        branchFound = true;
      }
    }
    if (!target) {
      // Also used while waiting for the branch's tree to render.
      target = findSection(section, root);
    }

    if (target && !userTookOver) {
      const rect = target.getBoundingClientRect();
      const offset = branchFound
        ? Math.max(NAVBAR_OFFSET, window.innerHeight / 3)
        : NAVBAR_OFFSET;
      const top = rect.top + window.pageYOffset - offset;
      if (lastTop === null || Math.abs(top - lastTop) > 2) {
        window.scrollTo(0, Math.max(0, top));
        lastTop = top;
        stableSince = now;
      }
    }

    const satisfied =
      target && (branchFound || !params.branch) && stableSince !== null;
    if (satisfied && (userTookOver || now - stableSince >= opts.settle)) {
      stop();
    } else if (now - start > opts.timeout) {
      if (params.branch && !branchFound) {
        stop(
          'hyphy-vision deep link: could not find branch "' +
            params.branch +
            '"'
        );
      } else {
        stop(
          target
            ? null
            : 'hyphy-vision deep link: could not find section "' + section + '"'
        );
      }
    }
  };

  const timer = setInterval(tick, opts.interval);
  tick();
  return () => stop();
}

function viewOptions(view) {
  const datalist = view.querySelectorAll("datalist option");
  if (datalist.length) {
    return Array.prototype.map.call(datalist, (o) => o.value || o.textContent);
  }
  const select = view.querySelectorAll("select option");
  return Array.prototype.map.call(select, (o) => o.textContent);
}

function viewCurrentValue(view) {
  if (view.input && typeof view.input.value == "string")
    return view.input.value;
  return view.value;
}

function setViewValue(view, value) {
  const input = view.input;
  if (input && input.tagName == "INPUT" && input.getAttribute("list")) {
    // @jashkenas/inputs autoSelect: its own oninput handler updates the form.
    input.value = value;
    input.dispatchEvent(new Event("input"));
    return;
  }
  // @observablehq/inputs (Inputs.select) exposes a value setter.
  view.value = value;
  view.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Apply `?tree=` / `?partition=` / `?site=` (and the implicit tree for
 * `?branch=`) to a notebook that exposes a `viewof tree_id` menu.
 * Resolves to the selected option, or null when nothing was changed.
 */
export function applyNotebookTreeSelection(module, params) {
  if (!module || !params || (!params.tree && !params.branch)) {
    return Promise.resolve(null);
  }
  const timeout = new Promise((resolve) =>
    setTimeout(() => resolve(null), 20000)
  );
  const select = module.value("viewof tree_id").then((view) => {
    if (!view || typeof view.querySelectorAll != "function") return null;
    const options = viewOptions(view);
    let wanted = params.tree ? matchOption(options, params.tree) : null;
    if (params.tree && !wanted) {
      // eslint-disable-next-line no-console
      console.warn(
        'hyphy-vision deep link: tree "' + params.tree + '" is not available'
      );
    }
    if (!wanted && params.branch && !viewCurrentValue(view)) {
      wanted =
        matchOption(options, "Alignment-wide tree") ||
        matchOption(options, "Partition 1") ||
        options[0] ||
        null;
    }
    if (!wanted || viewCurrentValue(view) === wanted) return null;
    setViewValue(view, wanted);
    return wanted;
  });
  return Promise.race([select, timeout]).catch(() => null);
}
