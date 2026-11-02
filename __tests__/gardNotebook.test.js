import {
  EXPECTED_CELL_INPUTS,
  bestModelAICcFallback,
  checkGardNotebook,
  MAKE_TREE_DIVS_INPUTS,
  hasNoBreakpoints,
  makeTreeDivs,
  patchGardNotebook,
  inferredBreakpointCount,
  normalizeGardResult
} from "../src/helpers/gardNotebook.js";
import { Runtime } from "@observablehq/runtime";

// Old HyPhy (the app's demo data): no bestModelAICc, two breakpoint models.
const oldGard = require("./../data/json_files/gard/Flu.fna.GARD.json");
// HyPhy 2.5.103: has bestModelAICc, one inferred breakpoint.
const newGard = require("./fixtures/gard_nuc_2.5.103.json");
// HyPhy 2.5.103, no breakpoints found: placeholder improvement, un-indexed
// trees, string breakpoint coordinates.
const zeroGard = require("./fixtures/gard_aa_2.5.103.json");

describe("GARD notebook input normalization", () => {
  describe("bestModelAICc", () => {
    test("old result without bestModelAICc gets baselineScore - sum(deltaAICc)", () => {
      expect(oldGard.bestModelAICc).toBeUndefined();
      const normalized = normalizeGardResult(oldGard);
      const expected =
        oldGard.baselineScore -
        Object.values(oldGard.improvements).reduce((t, d) => t + d.deltaAICc, 0);
      expect(normalized.bestModelAICc).toBeCloseTo(expected, 8);
      // the notebook's two tiles are now numbers
      expect(Number.isFinite(normalized.baselineScore - normalized.bestModelAICc)).toBe(true);
      expect(Number.isFinite(normalized.singleTreeAICc - normalized.bestModelAICc)).toBe(true);
    });

    test("result with bestModelAICc keeps it unchanged", () => {
      const normalized = normalizeGardResult(newGard);
      expect(normalized.bestModelAICc).toBe(newGard.bestModelAICc);
      expect(normalized.improvements).toEqual(newGard.improvements);
      expect(normalized.trees).toEqual(newGard.trees);
      expect(normalized.breakpointData).toEqual(newGard.breakpointData);
    });

    test("fallback agrees with the file's own bestModelAICc", () => {
      expect(bestModelAICcFallback(newGard)).toBeCloseTo(newGard.bestModelAICc, 6);
      expect(bestModelAICcFallback(zeroGard)).toBeCloseTo(zeroGard.bestModelAICc, 6);
    });

    test("does not mutate its input", () => {
      const before = JSON.stringify(oldGard);
      normalizeGardResult(oldGard);
      expect(JSON.stringify(oldGard)).toBe(before);
    });
  });

  describe("breakpoint count", () => {
    test("normal files keep every improvements entry", () => {
      expect(inferredBreakpointCount(oldGard)).toBe(2);
      expect(inferredBreakpointCount(newGard)).toBe(1);
      expect(Object.keys(normalizeGardResult(oldGard).improvements)).toHaveLength(2);
      expect(Object.keys(normalizeGardResult(newGard).improvements)).toHaveLength(1);
    });

    test("zero-breakpoint file reports 0, not the placeholder entry", () => {
      expect(Object.keys(zeroGard.improvements)).toHaveLength(1);
      expect(hasNoBreakpoints(zeroGard)).toBe(true);
      expect(inferredBreakpointCount(zeroGard)).toBe(0);
      const normalized = normalizeGardResult(zeroGard);
      // what the notebook's `_.size(improvements)` sees
      expect(Object.keys(normalized.improvements)).toHaveLength(0);
      expect(normalized.bestModelAICc).toBe(zeroGard.bestModelAICc);
    });

    test("zero-breakpoint trees and bps are put in the indexed / numeric shape", () => {
      const normalized = normalizeGardResult(zeroGard);
      expect(Object.keys(normalized.trees)).toEqual(["0"]);
      expect(normalized.trees[0].newickString).toBe(zeroGard.trees.newickString);
      expect(normalized.breakpointData[0].bps).toEqual([[1, 187]]);
      expect(normalized.breakpointData[0].tree).toBe(zeroGard.breakpointData[0].tree);
    });
  });

  test("passes through values that are not result objects", () => {
    expect(normalizeGardResult(null)).toBe(null);
    expect(normalizeGardResult(undefined)).toBe(undefined);
    expect(() => normalizeGardResult({})).not.toThrow();
  });

  it("matches the cells of the installed GARD notebook", () => {
    // Fails on a notebook bump that changes these cells, so the normalization
    // gets reviewed.
    const fs = require("fs");
    const path = require("path");
    const pkgJson = "@hyphy_software/gard-analysis-result-visualization/package.json";
    const pkgDir = path.dirname(require.resolve(pkgJson));
    const src = fs.readFileSync(path.join(pkgDir, require(pkgJson).main), "utf8");
    const expected = Object.assign({ makeTreeDivs: MAKE_TREE_DIVS_INPUTS }, EXPECTED_CELL_INPUTS);
    Object.keys(expected).forEach(name => {
      const m = src.match(new RegExp('define\\("' + name + '", (\\[[^\\]]*\\])'));
      expect(m).not.toBeNull();
      expect(JSON.parse(m[1])).toEqual(expected[name]);
    });
  });

  describe("checkGardNotebook", () => {
    let warn;
    beforeEach(() => {
      warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterEach(() => warn.mockRestore());

    function moduleWith(overrides) {
      const runtime = new Runtime();
      return runtime.module(function define(runtime, observer) {
        const main = runtime.module();
        main.define("gard_results_json", () => ({}));
        main.define("_", () => ({}));
        main.define("d3", () => ({}));
        Object.keys(EXPECTED_CELL_INPUTS).forEach(name => {
          main.define(name, overrides[name] || EXPECTED_CELL_INPUTS[name], () => name);
        });
        return main;
      });
    }

    test("accepts the expected cell inputs", () => {
      expect(checkGardNotebook(moduleWith({}))).toBe(true);
      expect(warn).not.toHaveBeenCalled();
    });

    test("warns, without throwing, when a cell's inputs change", () => {
      expect(checkGardNotebook(moduleWith({ stages: ["gard_results_json"] }))).toBe(false);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toMatch(/stages/);
    });

    test("tolerates a missing module", () => {
      expect(checkGardNotebook({})).toBe(false);
      expect(checkGardNotebook(null)).toBe(false);
    });
  });

  describe("makeTreeDivs", () => {
    const _ = require("underscore");
    const trees = bps => bps.map(b => ({ bps: b }));

    test("renders a single tree (zero-breakpoint result) without throwing", () => {
      const html = makeTreeDivs(_, trees([[1, 187]]), 300)();
      expect(html).toMatch(/Tree 1, coordinate range 1-187/);
      expect(html).toMatch(/id = 'tree_0'/);
    });

    test("renders two trees and three trees", () => {
      const two = makeTreeDivs(_, trees([[1, 5], [6, 9]]), 300)();
      expect(two).toMatch(/Tree 2, coordinate range 6-9/);
      const three = makeTreeDivs(_, trees([[1, 5], [6, 9], [10, 12]]), 300)();
      expect(three).toMatch(/id = 'tree_2'/);
    });
  });

  describe("patchGardNotebook", () => {
    let warn;
    beforeEach(() => {
      warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterEach(() => warn.mockRestore());

    function moduleWith(inputs) {
      const runtime = new Runtime();
      return runtime.module(function define(runtime, observer) {
        const main = runtime.module();
        MAKE_TREE_DIVS_INPUTS.forEach(n => main.define(n, () => n));
        if (inputs) main.define("makeTreeDivs", inputs, () => "original");
        return main;
      });
    }

    test("redefines makeTreeDivs when the signature matches", () => {
      expect(patchGardNotebook(moduleWith(MAKE_TREE_DIVS_INPUTS))).toBe(true);
    });

    test("leaves the notebook alone on a mismatch or missing cell", () => {
      expect(patchGardNotebook(moduleWith(["_"]))).toBe(false);
      expect(patchGardNotebook(moduleWith(null))).toBe(false);
      expect(patchGardNotebook(null)).toBe(false);
      expect(warn).toHaveBeenCalledTimes(3);
    });
  });
});
