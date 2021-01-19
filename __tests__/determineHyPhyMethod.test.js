import { default as determineHyPhyMethod } from "../src/helpers/determineHyPhyMethod.js";
const exampleAbsrel = require("./../dist/data/json_files/absrel/CD2.fna.ABSREL.json");
const exampleBgm = require("./../dist/data/json_files/bgm/BGM.json");
const exampleBusted = require("./../dist/data/json_files/busted/CD2.fna.BUSTED.json");
const exampleFade = require("./../dist/data/json_files/fade/CD2_AA.fasta.FADE.json");
const exampleFel = require("./../dist/data/json_files/fel/CD2.fna.FEL.json");
const exampleFubar = require("./../dist/data/json_files/fubar/CD2.fna.FUBAR.json");
const exampleGardOld = require("./../dist/data/json_files/gard/CD2.fasta.GARD_old.json");
const exampleGardNew = require("./../dist/data/json_files/gard/Flu.fna.GARD.json");
const exampleMeme = require("./../dist/data/json_files/meme/CD2.fna.MEME.json");
const exampleRelax = require("./../dist/data/json_files/relax/CD2.fna.RELAX.json");
const exampleSlac = require("./../dist/data/json_files/slac/CD2.fna.SLAC.json");
const exampleSlatkin = require("./../dist/data/json_files/slatkin/C012_Time1_collapse.tre.json");

describe("determineHyPhyMethod", () => {
  it("should work on the example json files", () => {
    expect(determineHyPhyMethod(exampleAbsrel)).toBe("absrel");
    expect(determineHyPhyMethod(exampleBgm)).toBe("bgm");
    expect(determineHyPhyMethod(exampleBusted)).toBe("busted");
    expect(determineHyPhyMethod(exampleFade)).toBe("fade");
    expect(determineHyPhyMethod(exampleFel)).toBe("fel");
    expect(determineHyPhyMethod(exampleFubar)).toBe("fubar");
    expect(determineHyPhyMethod(exampleGardOld)).toBe("gard");
    expect(determineHyPhyMethod(exampleGardNew)).toBe("gard");
    expect(determineHyPhyMethod(exampleRelax)).toBe("relax");
    expect(determineHyPhyMethod(exampleSlac)).toBe("slac");
    expect(determineHyPhyMethod(exampleMeme)).toBe("meme");
    expect(determineHyPhyMethod(exampleSlatkin)).toBe("slatkin");
  });

  it("should return a message if the json is empty", () => {
    expect(determineHyPhyMethod("")).toBe("No json object was provided");
    expect(determineHyPhyMethod()).toBe("No json object was provided");
    expect(determineHyPhyMethod(undefined)).toBe("No json object was provided");
    expect(determineHyPhyMethod(null)).toBe("No json object was provided");
  });

  it("should return 'unkownMethod' if the json isn't in the right format", () => {
    expect(determineHyPhyMethod({ badJson: 1 })).toBe("unknownMethod");
  });
});
