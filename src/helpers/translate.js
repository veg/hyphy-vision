const translation_table = require("./translation-table.json");

const ambiguous_nucleotides = {
  "U" : ["T"],
  "R" : ["A","G"],
  "Y" : ["A","C"],
  "S" : ["G","C"],
  "W" : ["A","T"],
  "K" : ["G","T"],
  "M" : ["A","C"],
  "B" : ["C","G","T"],
  "D" : ["A","G","T"],
  "H" : ["A","C","G"],
  "V" : ["A","C","G"],
  "N" : ["A","C","G","T"]
};

function translate(codon, genetic_code) {
    
  if (codon.length == 3) {

      let translations = new Set ();
      let nucs = [];
      for (let i = 0; i < 3; i+=1) {
        let n = codon[i];
        nucs.push (ambiguous_nucleotides[n] || [n]);
      }
      

      let unambig = ['-','-','-'];
  
      try {
          nucs[0].forEach ((n1)=> {
            unambig[0] = n1;
            nucs[1].forEach ((n2) => {
                unambig[1] = n2;
                nucs[2].forEach ((n3) => {
                    unambig[2] = n3;
                    let aa = translation_table[genetic_code][unambig.join('')];
                    if (!aa) {
                        throw 'X';
                    }
                    translations.add (aa);
                });
            });
          });
      } catch (e){
        return 'X';
      }
  
      if (translations.size == 1) {
        return translations.values().next().value;
      }
      return '?';

  } 
  return 'X';
  

  /*if (ambiguous_nucleotides.some(nucleotide => codon.includes(nucleotide))) {
    return "X";
  }
  return translation_table[genetic_code][codon];*/
}

export default translate;
