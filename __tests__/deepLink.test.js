import {
  parseDeepLinkParams,
  sanitizeSection,
  sectionCandidates,
  notebookCellId,
  matchOption,
  phylotreeNodeName,
} from "../src/helpers/deepLink.js";

describe("parseDeepLinkParams", () => {
  it("returns nulls when no parameters are present", () => {
    expect(parseDeepLinkParams("", "")).toEqual({
      json: null,
      section: null,
      tree: null,
      branch: null,
    });
    expect(parseDeepLinkParams(undefined, undefined).json).toBeNull();
  });

  it("keeps json / resultsUrl precedence", () => {
    expect(parseDeepLinkParams("?json=a.json").json).toBe("a.json");
    expect(parseDeepLinkParams("?resultsUrl=b.json").json).toBe("b.json");
    expect(parseDeepLinkParams("?resultsUrl=b.json&json=a.json").json).toBe(
      "a.json"
    );
    expect(parseDeepLinkParams("?json=").json).toBeNull();
    expect(
      parseDeepLinkParams(
        "?json=https%3A%2F%2Fexample.org%2Fx.json.gz%3Fv%3D1&section=tree"
      ).json
    ).toBe("https://example.org/x.json.gz?v=1");
  });

  it("reads section from section, tab, or the hash", () => {
    expect(parseDeepLinkParams("?section=tree").section).toBe("tree");
    expect(parseDeepLinkParams("?tab=table").section).toBe("table");
    expect(parseDeepLinkParams("?section=tree&tab=table").section).toBe("tree");
    expect(parseDeepLinkParams("", "#fits-tab").section).toBe("fits-tab");
    expect(parseDeepLinkParams("?section=plot", "#tree").section).toBe("plot");
    expect(parseDeepLinkParams("", "#").section).toBeNull();
  });

  it("maps partition / site / codon / tree to a tree option", () => {
    expect(parseDeepLinkParams("?partition=2").tree).toBe("Partition 2");
    expect(parseDeepLinkParams("?site=17").tree).toBe("Codon 17");
    expect(parseDeepLinkParams("?codon=5").tree).toBe("Codon 5");
    expect(parseDeepLinkParams("?tree=Alignment-wide%20tree").tree).toBe(
      "Alignment-wide tree"
    );
    // explicit tree wins, then partition, then site
    expect(parseDeepLinkParams("?tree=Codon+3&partition=1").tree).toBe(
      "Codon 3"
    );
    expect(parseDeepLinkParams("?partition=1&site=9").tree).toBe("Partition 1");
  });

  it("ignores malformed numeric parameters", () => {
    expect(parseDeepLinkParams("?partition=0").tree).toBeNull();
    expect(parseDeepLinkParams("?partition=-1").tree).toBeNull();
    expect(parseDeepLinkParams("?site=abc").tree).toBeNull();
    expect(parseDeepLinkParams("?site=1.5").tree).toBeNull();
  });

  it("reads and trims the branch name", () => {
    expect(parseDeepLinkParams("?branch=Node12").branch).toBe("Node12");
    expect(parseDeepLinkParams("?branch=%20HUM%20").branch).toBe("HUM");
    expect(parseDeepLinkParams("?branch=").branch).toBeNull();
  });
});

describe("sanitizeSection", () => {
  it("strips characters that cannot be part of an id", () => {
    expect(sanitizeSection("tree")).toBe("tree");
    expect(sanitizeSection("#tree")).toBe("tree");
    expect(sanitizeSection("model fits")).toBe("model-fits");
    expect(sanitizeSection("<script>")).toBe("script");
    expect(sanitizeSection("\"'();")).toBeNull();
    expect(sanitizeSection("   ")).toBeNull();
    expect(sanitizeSection(null)).toBeNull();
  });
});

describe("notebookCellId", () => {
  it("drops the viewof prefix and escapes other characters", () => {
    expect(notebookCellId("viewof tree_id")).toBe("nb-tree_id");
    expect(notebookCellId("tree_id")).toBe("nb-tree_id");
    expect(notebookCellId("figure1")).toBe("nb-figure1");
    expect(notebookCellId("a.b")).toBe("nb-a_b");
    expect(notebookCellId(undefined)).toBeNull();
    expect(notebookCellId("")).toBeNull();
  });
});

describe("sectionCandidates", () => {
  it("expands friendly names to classic and notebook ids", () => {
    const tree = sectionCandidates("tree");
    expect(tree[0]).toBe("tree-tab");
    expect(tree).toContain("nb-tree_id");
    expect(tree).toContain("nb-figure2");
    expect(sectionCandidates("Tree")).toEqual(
      expect.arrayContaining(["tree-tab", "nb-tree_id"])
    );
  });

  it("supports synonyms", () => {
    expect(sectionCandidates("figure")).toContain("nb-figure1");
    expect(sectionCandidates("model fits")).toContain("fits-tab");
    expect(sectionCandidates("sites")).toContain("nb-table1");
  });

  it("falls back to raw ids and cell names without duplicates", () => {
    expect(sectionCandidates("figure1")).toEqual([
      "figure1",
      "figure1-tab",
      "nb-figure1",
    ]);
    expect(sectionCandidates("fits-tab")).toEqual([
      "fits-tab",
      "fits-tab-tab",
      "nb-fits-tab",
    ]);
    const table = sectionCandidates("table");
    expect(new Set(table).size).toBe(table.length);
    expect(sectionCandidates("")).toEqual([]);
  });
});

describe("matchOption", () => {
  const options = ["Partition 1", "Partition 2", "Codon 1", "Codon 12"];
  it("matches exactly or ignoring case and spacing", () => {
    expect(matchOption(options, "Codon 12")).toBe("Codon 12");
    expect(matchOption(options, "codon 12")).toBe("Codon 12");
    expect(matchOption(options, " partition   2 ")).toBe("Partition 2");
  });
  it("returns null for unknown options", () => {
    expect(matchOption(options, "Codon 13")).toBeNull();
    expect(matchOption([], "Codon 1")).toBeNull();
    expect(matchOption(null, "Codon 1")).toBeNull();
  });
});

describe("phylotreeNodeName", () => {
  it("handles phylotree 0.1 and 1.x node shapes", () => {
    expect(phylotreeNodeName({ name: "HUM" })).toBe("HUM");
    expect(phylotreeNodeName({ data: { name: "Node6" } })).toBe("Node6");
    expect(phylotreeNodeName({})).toBeNull();
    expect(phylotreeNodeName(undefined)).toBeNull();
  });
});
