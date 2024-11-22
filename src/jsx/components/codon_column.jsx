import React from "react";

import translate from "../../helpers/translate";

function CodonColumn(props) {
  const codon_sequence_data = props.sequence_data.map((record) => {
    return {
      header: record.header,
      seq: record.seq.slice(3 * props.site, 3 * props.site + 3),
    };
  });
  codon_sequence_data.number_of_sequences = codon_sequence_data.length;
  codon_sequence_data.number_of_sites = 3;

  const amino_acid_sequence_data = props.sequence_data.map((record) => {
    const codon = record.seq.slice(3 * props.site, 3 * props.site + 3),
      amino_acid = translate(codon, 1);
    return {
      header: record.header,
      seq: amino_acid,
    };
  });
  amino_acid_sequence_data.number_of_sequences =
    amino_acid_sequence_data.length;
  amino_acid_sequence_data.number_of_sites = 1;
  return (
    <g transform={`translate(${props.translateX}, ${props.translateY})`}>
      <text
        x={(4 * props.site_size + props.site_padding) / 2}
        y={props.height + props.codon_label_height}
        alignmentBaseline="middle"
        textAnchor="middle"
        fontFamily="Courier"
        fontSize={14}
      >
        Codon {props.site + 1}
      </text>
    </g>
  );
}

CodonColumn.defaultProps = {
  translateX: 0,
  translateY: 0,
};

export default CodonColumn;
