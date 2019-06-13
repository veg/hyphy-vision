const translation_table = require("../../data/translation-table.json");

const ambiguous_nucleotides = [
  "R",
  "Y",
  "S",
  "W",
  "K",
  "M",
  "B",
  "D",
  "H",
  "V",
  "N"
];

function translate(codon, genetic_code) {
  if (ambiguous_nucleotides.some(nucleotide => codon.includes(nucleotide))) {
    return "X";
  }
  return translation_table[genetic_code][codon];
}

export default translate;
