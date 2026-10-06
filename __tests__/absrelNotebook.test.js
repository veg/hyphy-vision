import {
  hasSiteLevelResults,
  hasSynonymousRatePosteriors,
  patchAbsrelNotebook,
  siteTableData,
  SITE_TABLE_DATA_INPUTS
} from "../src/helpers/absrelNotebook.js";
import { Runtime } from "@observablehq/runtime";

const _ = require("lodash");
const oldAbsrel = require("./../data/json_files/absrel/CD2.fna.ABSREL.json");
const newAbsrel = require("./../data/json_files/absrel/ENST00000319286.ZNF572.aBSREL.json");

// d3 v7 semantics: sum() iterates its argument with for...of, so passing
// undefined throws, which is what the unpatched notebook cell ran into.
const d3 = {
  sum: (values, accessor) => {
    let total = 0;
    for (const v of values) total += +accessor(v) || 0;
    return total;
  }
};
const html = (strings, ...values) =>
  strings.reduce((acc, s, i) => acc + s + (i < values.length ? values[i] : ""), "");
const distMean = d => _.sumBy(d, x => x.value * x.weight);

function siteIndexPartitionCodon(json) {
  return _.chain(json["data partitions"])
    .map((d, k) => _.map(d["coverage"][0], site => [+k + 1, site + 1]))
    .flatten()
    .value();
}

function run(json, profiles) {
  return siteTableData(
    _,
    profiles,
    json,
    siteIndexPartitionCodon(json),
    null,
    distMean,
    d3,
    100,
    html
  );
}

describe("absrel notebook shims", () => {
  it("detects whether site-level results are present", () => {
    expect(hasSiteLevelResults(oldAbsrel)).toBe(false);
    expect(hasSiteLevelResults(newAbsrel)).toBe(true);
    expect(hasSiteLevelResults(null)).toBe(false);
  });

  it("builds the site table for results without branch-site profiles", () => {
    const [rows] = run(oldAbsrel, []);
    expect(rows.length).toBe(oldAbsrel.input["number of sites"]);
    expect(rows[0]).toEqual({ Codon: 1 });
  });

  it("keeps Subs / ER columns when profiles exist, tolerating gaps", () => {
    const profiles = [
      { site: 1, subs: 2, ER: 500 },
      { site: 1, subs: 1, ER: 3 }
    ];
    const [rows] = run(oldAbsrel, profiles);
    expect(rows[0]).toEqual({ Codon: 1, Subs: 3, ER: 1 });
    expect(rows[1]).toEqual({ Codon: 2, Subs: 0, ER: 0 });
  });

  it("detects synonymous rate variation posteriors", () => {
    expect(hasSynonymousRatePosteriors(oldAbsrel)).toBe(false);
    expect(hasSynonymousRatePosteriors(null)).toBe(false);
    expect(
      hasSynonymousRatePosteriors({ "Synonymous site-posteriors": [[1]] })
    ).toBe(true);
  });

  it("matches the siteTableData cell of the installed @spond/absrel", () => {
    // Fails on a notebook bump that changes the cell, so the shim gets reviewed.
    const fs = require("fs");
    const path = require("path");
    const pkgDir = path.dirname(require.resolve("@spond/absrel/package.json"));
    const main = require("@spond/absrel/package.json").main;
    const src = fs.readFileSync(path.join(pkgDir, main), "utf8");
    const m = src.match(/define\("siteTableData", (\[[^\]]*\])/);
    expect(m).not.toBeNull();
    expect(JSON.parse(m[1])).toEqual(SITE_TABLE_DATA_INPUTS);
  });

  describe("patchAbsrelNotebook", () => {
    let warn;
    beforeEach(() => {
      warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterEach(() => warn.mockRestore());

    function moduleWith(inputs) {
      const runtime = new Runtime();
      return runtime.module(function define(runtime, observer) {
        const main = runtime.module();
        _.each(SITE_TABLE_DATA_INPUTS, name => main.define(name, () => name));
        if (inputs) main.define("siteTableData", inputs, () => "original");
        return main;
      });
    }

    it("replaces siteTableData when the cell matches", async () => {
      const main = moduleWith(SITE_TABLE_DATA_INPUTS);
      expect(patchAbsrelNotebook(main)).toBe(true);
      expect(warn).not.toHaveBeenCalled();
    });

    it("leaves the notebook alone if the cell inputs changed", async () => {
      const main = moduleWith(["_", "results_json"]);
      expect(patchAbsrelNotebook(main)).toBe(false);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(await main.value("siteTableData")).toBe("original");
    });

    it("does not throw if the cell no longer exists", () => {
      const main = moduleWith(null);
      expect(() => patchAbsrelNotebook(main)).not.toThrow();
      expect(patchAbsrelNotebook(main)).toBe(false);
    });

    it("does not throw on an unexpected module object", () => {
      expect(patchAbsrelNotebook({})).toBe(false);
      expect(patchAbsrelNotebook(null)).toBe(false);
    });
  });
});
