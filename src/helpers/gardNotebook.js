/**
 * Input normalization for the @hyphy_software/gard-analysis-result-visualization
 * Observable notebook (v916).
 *
 * The notebook was written against GARD result files that
 *   - carry `bestModelAICc` (HyPhy 2.5.5x and later). Older files do not, so the
 *     "Δ c-AIC vs the null model" and "Δ c-AIC vs the single tree multiple
 *     partition" tiles read `baselineScore - undefined` and show NaN;
 *   - list one entry per inferred breakpoint count in `improvements`. When GARD
 *     finds no breakpoints, HyPhy still writes a placeholder entry,
 *     `{"0": {"breakpoints": null, "deltaAICc": 0}}`, which the notebook's
 *     `_.size(improvements)` reports as "1 inferred breakpoints". Such files
 *     also have un-indexed `trees` ({"newickString": ...} instead of
 *     {"0": {"newickString": ...}}) and string coordinates in
 *     `breakpointData[*].bps` (e.g. [["1","187"]]).
 *
 * The notebook's `makeTreeDivs` cell also throws for a single tree
 * ("Cannot read properties of undefined (reading 'push')": it pushes into
 * row m2+1 of an array with one row per tree), which breaks Figure 4 for
 * every zero-breakpoint result. That cell is the one thing redefined below
 * (patchGardNotebook); it cannot be fixed by changing the data.
 *
 * Otherwise, rather than redefining notebook cells, normalizeGardResult() returns a copy
 * of the result JSON in the shape the notebook expects. The input is never
 * mutated, and a well-formed file comes back with the same content.
 */

const _ = require("underscore");

const isNumber = x => typeof x === "number" && isFinite(x);

export function improvementList(json) {
  return json && json.improvements ? _.values(json.improvements) : [];
}

// A placeholder improvement entry has no breakpoint list (null or empty).
function isPlaceholderImprovement(d) {
  return !d || !d.breakpoints || d.breakpoints.length === 0;
}

// True for a result with no inferred breakpoints: every improvements entry
// (typically the single placeholder) lacks breakpoints.
export function hasNoBreakpoints(json) {
  return _.every(improvementList(json), isPlaceholderImprovement);
}

// The number of inferred breakpoints the notebook should report.
export function inferredBreakpointCount(json) {
  return _.reject(improvementList(json), isPlaceholderImprovement).length;
}

// The c-AIC of the best model: the null model's score minus every improvement
// (same formula as the legacy topological incongruence report).
export function bestModelAICcFallback(json) {
  const improvements = improvementList(json);
  if (!json || !isNumber(json.baselineScore)) return undefined;
  return (
    json.baselineScore -
    _.reduce(improvements, (t, d) => t + (d && isNumber(d.deltaAICc) ? d.deltaAICc : 0), 0)
  );
}

// {"newickString": ...} -> {"0": {"newickString": ...}}
function normalizeTrees(trees) {
  if (trees && typeof trees === "object" && "newickString" in trees) {
    return { 0: trees };
  }
  return trees;
}

const toNumber = x =>
  typeof x === "string" && x.trim() !== "" && isNumber(+x) ? +x : x;

// [["1","187"]] -> [[1,187]]
function normalizeBreakpointData(breakpointData) {
  if (!breakpointData || typeof breakpointData !== "object") {
    return breakpointData;
  }
  return _.mapObject(breakpointData, partition => {
    if (!partition || !_.isArray(partition.bps)) return partition;
    return Object.assign({}, partition, {
      bps: _.map(partition.bps, range =>
        _.isArray(range) ? _.map(range, toNumber) : range
      )
    });
  });
}

export function normalizeGardResult(json) {
  if (!json || typeof json !== "object") return json;
  const result = Object.assign({}, json);

  if (!isNumber(result.bestModelAICc)) {
    const fallback = bestModelAICcFallback(result);
    if (fallback !== undefined) result.bestModelAICc = fallback;
  }

  if (result.improvements && hasNoBreakpoints(result)) {
    result.improvements = {};
  }

  result.trees = normalizeTrees(result.trees);
  result.breakpointData = normalizeBreakpointData(result.breakpointData);
  return result;
}

function cellInputs(main, name) {
  const variable = main._scope && main._scope.get(name);
  if (!variable) return null;
  return _.map(variable._inputs, v => v._name);
}

// Input signature of the notebook cells this normalization was written for.
export const EXPECTED_CELL_INPUTS = {
  stages: ["_", "gard_results_json"],
  caic_improvements: ["_", "gard_results_json"],
  gard_breakpoints: ["_", "gard_results_json", "d3"],
  breakpointData: ["gard_results_json"]
};

// Warns (never throws) when the installed notebook no longer matches what
// normalizeGardResult() assumes. Returns true when all signatures match.
export function checkGardNotebook(main) {
  try {
    const mismatched = _.filter(_.keys(EXPECTED_CELL_INPUTS), name => {
      return !_.isEqual(cellInputs(main, name), EXPECTED_CELL_INPUTS[name]);
    });
    if (mismatched.length) {
      console.warn(
        "GARD notebook normalization (bestModelAICc / zero-breakpoint) was written for notebook v916, but cell(s) " +
          mismatched.join(", ") +
          " changed; review src/helpers/gardNotebook.js."
      );
      return false;
    }
    return true;
  } catch (e) {
    console.warn("GARD notebook check failed:", e);
    return false;
  }
}

// Same as the notebook's `makeTreeDivs` cell, except that the rows array has
// one more row than there are trees, so a single tree no longer throws.
export function makeTreeDivs(_, tree_objects, svgSize) {
  return () => {
    let rows = _.map(_.range(tree_objects.length + 1), i => []);
    _.each(_.range(tree_objects.length), i => {
      let m2 = Math.floor(i / 2);
      rows[m2 + 1].push(
        "<div><svg height = '" + svgSize + "px' id = 'tree_" + i + "'></div>"
      );
      rows[m2].push(
        "<div>Tree " + (i + 1) + ", coordinate range " +
          tree_objects[i].bps[0] + "-" + tree_objects[i].bps[1] + " </div>"
      );
    });

    return (
      "<div style = 'display: grid; grid-template-columns: 400px 400px'>" +
      _.flatten(rows).join("\n") +
      "</div>"
    );
  };
}

export const MAKE_TREE_DIVS_INPUTS = ["_", "tree_objects", "svgSize"];

// Returns true when the cell was redefined. Never throws; on a signature
// mismatch the notebook is left untouched.
export function patchGardNotebook(main) {
  try {
    const inputs = cellInputs(main, "makeTreeDivs");
    if (!_.isEqual(inputs, MAKE_TREE_DIVS_INPUTS)) {
      console.warn(
        "GARD notebook shim (single-tree Figure 4) not applied: `makeTreeDivs` cell " +
          (inputs ? "inputs changed to " + JSON.stringify(inputs) : "not found") +
          "; review src/helpers/gardNotebook.js."
      );
      return false;
    }
    main.redefine("makeTreeDivs", MAKE_TREE_DIVS_INPUTS, makeTreeDivs);
    return true;
  } catch (e) {
    console.warn("GARD notebook shim (single-tree Figure 4) not applied:", e);
    return false;
  }
}
