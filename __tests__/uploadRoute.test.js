const uploadRoute = require("./../src/helpers/uploadRoute.js");
const determineHyPhyMethod = require("./../src/helpers/determineHyPhyMethod.js");
const exampleGardOld = require("./../data/json_files/gard/CD2.fasta.GARD_old.json");
const exampleGardNew = require("./../data/json_files/gard/Flu.fna.GARD.json");
const exampleBusted = require("./../data/json_files/busted/CD2.fna.BUSTED.json");

// Shape of a HyPhy 2.5.103 `hyphy gard` result (trimmed): adds bestModelAICc
// and, with no breakpoints, an un-indexed trees object.
const gard25103 = {
  analysis: { info: "GARD : Genetic Algorithms for Recombination Detection." },
  bestModelAICc: 9310.3488,
  baselineScore: 9400.1,
  breakpointData: { 0: { bps: ["1", "187"], tree: "(a:0.1,b:0.2);" } },
  improvements: { 0: { breakpoints: null, deltaAICc: 0 } },
  input: { "file name": "x.fna", "number of sequences": 10 },
  potentialBreakpoints: 149,
  singleTreeAICc: 9310.3,
  siteBreakPointSupport: {},
  timeElapsed: 224,
  totalModelCount: 1554,
  trees: { newickString: "(a:0.1,b:0.2);" }
};

describe("uploadRoute", () => {
  it("routes GARD results from any HyPhy version to /gard", () => {
    expect(uploadRoute(exampleGardOld)).toBe("/gard");
    expect(uploadRoute(exampleGardNew)).toBe("/gard");
    expect(uploadRoute(gard25103)).toBe("/gard");
  });

  it("routes other methods to their own page", () => {
    expect(uploadRoute(exampleBusted)).toBe("/busted");
  });

  it("returns null for JSON that is not a recognized HyPhy result", () => {
    expect(uploadRoute({})).toBe(null);
    expect(uploadRoute({ analysis: {} })).toBe(null);
    expect(uploadRoute(null)).toBe(null);
  });
});

describe("determineHyPhyMethod", () => {
  it("does not throw when analysis has no info string", () => {
    expect(determineHyPhyMethod({ analysis: {} })).toBe("unknownMethod");
  });
});
