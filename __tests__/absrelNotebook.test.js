import {
  hasSiteLevelResults,
  siteTableData
} from "../src/helpers/absrelNotebook.js";

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
});
