var React = require("react"),
  createReactClass = require("create-react-class"),
  ReactDOM = require("react-dom"),
  _ = require("underscore"),
  d3_save_svg = require("d3-save-svg"),
  datamonkey = require("../../datamonkey/datamonkey.js");

import Phylotree, { placenodes, phylotreev1 } from "react-phylotree";
import { SitePlotAxis, fastaParser, colors } from "alignment.js";
import CodonColumn from "./codon_column.jsx";

class AlignmentTree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tree: null,
      max_site: null,
      current_site: 1,
      select_value: "amino-acid"
    };
  }

  initialize(newick, fasta) {
    if (!newick || !fasta) return;
    const tree = new phylotreev1(newick);
    placenodes(tree, true);
    const node_to_ordered_index = _.object(
      tree.node_order,
      _.range(tree.node_order.length)
    );
    const sequence_data = _.initial(
      fasta.sort((a, b) => {
        const a_index = node_to_ordered_index[a.header],
          b_index = node_to_ordered_index[b.header];
        return a_index - b_index;
      })
    );

    this.setState({
      tree: tree,
      sequence_data: sequence_data,
      current_site: 1,
      current_site_index: 0
    });
  }
  componentDidMount() {
    this.initialize(this.props.newick, this.props.fasta);
  }
  componentDidUpdate(prevProps) {
    const new_fasta = prevProps.fasta != this.props.fasta,
      new_newick = prevProps.newick != this.props.newick,
      new_data = new_fasta || new_newick;
    if (new_data) {
      this.initialize(this.props.newick, this.props.fasta);
    }
  }
  savePNG() {
    saveSvgAsPng(
      document.getElementById("slac-widget"),
      "slac-ancestral-phylo.png"
    );
  }
  handleInputChange(e) {
    const new_current_site = e.target.value ? +e.target.value : "",
      max_sites = this.state.sequence_data[0].seq.length / 3;
    if (new_current_site == "") {
      this.setState({
        current_site: "",
        current_site_index: 0
      });
    } else if (new_current_site > 0 && new_current_site <= max_sites) {
      this.setState({
        current_site: new_current_site,
        current_site_index: new_current_site - 1
      });
    }
  }
  render() {
    if (!this.state.tree) return <div />;
    const { site_size, branchAttributes } = this.props,
      vertical_pad = site_size / 2,
      phylotree_props = {
        width: 700,
        height: site_size * this.state.sequence_data.length,
        tree: this.state.tree,
        paddingTop: vertical_pad,
        paddingBottom: vertical_pad,
        paddingLeft: 5,
        paddingRight: 5
      },
      site_padding = 5,
      codon_label_height = 30;
    const { current_site, current_site_index } = this.state,
      syn_count = this.props.syn_substitutions[current_site_index],
      nonsyn_count = this.props.nonsyn_substitutions[current_site_index],
      total_count = syn_count + nonsyn_count,
      column_padding = 40,
      codon_column_width = 4 * site_size + site_padding + column_padding,
      ccw_nopad = 4 * site_size + site_padding,
      bar_height = 200,
      svg_props = {
        width: phylotree_props.width + codon_column_width,
        height: phylotree_props.height + codon_label_height + bar_height
      },
      legend_colors = {
        total: "black",
        nonsyn: "#00a99d",
        syn: "grey"
      };
    const bar_scale = d3.scale
        .linear()
        .domain([0, total_count])
        .range([0, bar_height]),
      bar_padding = 5,
      bar_width = (ccw_nopad - 4 * bar_padding) / 3;

    const { select_value } = this.state;
    const codons = {},
      codon_colors = d3.scale.category10().range();
    var codon_color_index = 0;
    this.state.tree.traverse_and_compute(node => {
      if (node.data.name != "root") {
        if (select_value != "none") {
          const character =
            branchAttributes[node.data.name][select_value][0][
              current_site_index
            ];
          node.data.annotation = character;
          if (select_value == "codon") {
            if (!codons[character]) {
              codons[character] = codon_colors[codon_color_index++];
            }
          }
        } else {
          node.data.annotation = null;
        }
      }
    });

    const color_scale =
      select_value != "codon" ? colors.amino_acid_colors : codons;
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            paddingBottom: 20
          }}
        >
          <span>
            Current site:
            <input
              type="number"
              value={this.state.current_site}
              onChange={e => this.handleInputChange(e)}
              ref={input => {
                this.numberInput = input;
              }}
              style={{ width: 50 }}
            />
          </span>

          <span>
            Show{" "}
            <select
              value={this.state.select_value}
              onChange={e => this.setState({ select_value: e.target.value })}
            >
              <option value="amino-acid">amino acid</option>
              <option value="codon">codon</option>
              <option value="none">none</option>
            </select>{" "}
            on tree
          </span>

          <button
            onClick={() => this.savePNG()}
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
          >
            <span className="far fa-save" />
            PNG
          </button>
        </div>

        <div style={{ textAlign: "center" }}>
          <svg
            {...svg_props}
            id="slac-widget"
            style={{ fontFamily: "sans-serif" }}
          >
            <g transform="translate(0, 5)">
              <rect
                x={0}
                y={0}
                width={svg_props.width}
                height={svg_props.height}
                fill="white"
              />
              <g transform={`translate(${phylotree_props.width - 100}, 50)`}>
                <rect
                  x={5}
                  y={10}
                  width={20}
                  height={20}
                  fill={legend_colors.total}
                />
                <text x={0} y={20} textAnchor="end" alignmentBaseline="middle">
                  Total
                </text>
                <rect
                  x={5}
                  y={40}
                  width={20}
                  height={20}
                  fill={legend_colors.nonsyn}
                />
                <text x={0} y={50} textAnchor="end" alignmentBaseline="middle">
                  Nonsynonymous
                </text>
                <rect
                  x={5}
                  y={70}
                  width={20}
                  height={20}
                  fill={legend_colors.syn}
                />
                <text x={0} y={80} textAnchor="end" alignmentBaseline="middle">
                  Synonymous
                </text>
              </g>
              <SitePlotAxis
                data={[syn_count, nonsyn_count, total_count]}
                axis_label="Substitution counts"
                height={bar_height}
                label_width={75}
                translateX={phylotree_props.width - 75}
                padding={{ top: 0, right: 0, bottom: 0, left: 0 }}
              />
              <rect
                x={phylotree_props.width + bar_padding}
                y={bar_height - bar_scale(total_count)}
                width={bar_width}
                height={bar_scale(total_count)}
                fill={legend_colors.total}
              />
              <rect
                x={phylotree_props.width + 2 * bar_padding + bar_width}
                y={bar_height - bar_scale(nonsyn_count)}
                width={bar_width}
                height={bar_scale(nonsyn_count)}
                fill={legend_colors.nonsyn}
              />
              <rect
                x={phylotree_props.width + 3 * bar_padding + 2 * bar_width}
                y={bar_height - bar_scale(syn_count)}
                width={bar_width}
                height={bar_scale(syn_count)}
                fill={legend_colors.syn}
              />
              <g transform={`translate(0, ${bar_height + 5})`}>
                <Phylotree
                  {...phylotree_props}
                  internalNodeLabels
                  skipPlacement
                  highlightBranches={color_scale}
                />
                <CodonColumn
                  site={current_site_index}
                  translateX={phylotree_props.width}
                  site_size={site_size}
                  site_padding={site_padding}
                  codon_label_height={codon_label_height}
                  height={phylotree_props.height}
                  {...this.state}
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

AlignmentTree.defaultProps = {
  site_size: 20
};

export default AlignmentTree;
