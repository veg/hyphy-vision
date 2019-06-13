var React = require("react"),
  ReactDOM = require("react-dom"),
  d3 = require("d3");

import { default as default_tree_settings } from "../helpers/default_tree_settings";
import { Tree } from "./components/tree.jsx";
import { DatamonkeyTable } from "./components/tables.jsx";
import { Header } from "./components/header.jsx";
import { ResultsPage } from "./components/results_page.jsx";

let part_scale = d3.scale.category10();

var edgeColorizer = function(element, data, parts) {
  //var is_foreground = data.target.annotations.is_foreground,
  //  color_fill = foreground_color(0);
  element
    .style("stroke", "black")
    .style("stroke-linejoin", "round")
    .style("stroke-linejoin", "round")
    .style("stroke-linecap", "round");
};

var nodeColorizer = function(element, data, parts) {
  let label = data.name;
  let part = _.compact(
    _.map(parts, (v, k) => {
      if (_.filter(v, d => d == label).length) {
        return k;
      }
    })
  );
  let color = "black";

  if (part.length) {
    color = part_scale(_.indexOf(_.keys(parts), part[0]));
  }

  element.style("fill", color);
};

const float_format = d3.format(".3f");

var tree_settings = default_tree_settings;
tree_settings.edgeColorizer = edgeColorizer;
tree_settings.nodeColorizer = nodeColorizer;

class SlatkinResults extends React.Component {
  partitionFormatter() {
    let p = this.props.data.partitions;
    let np = {};
    _.each(p, (v, k) => {
      np[k] = _.map(v, (v, k) => {
        return v;
      });
    });
    return np;
  }

  getPartitionCounts() {
    let rows = _.map(this.props.data["partition-counts"], (k, v) => (
      <tr>
        <td>{v}</td>
        <td>{k}</td>
      </tr>
    ));
    return (
      <table className="table table-light">
        <thead>
          <tr>
            <th>Compartment</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }

  getColorLegend(color_legend) {
    let elem = _.map(color_legend, (v, k) => {
      return (
        <li className="list-group-item" style={{ color: v }}>
          {k}
        </li>
      );
    });
    return <ul className="list-group">{elem}</ul>;
  }

  render() {
    var headerData = [
      { value: "Node", sortable: true },
      { value: "From", sortable: true },
      { value: "To", sortable: true }
    ];

    if (!this.props.data) return <div />;

    let parts = this.partitionFormatter();
    let color_legend = {};
    _.each(_.keys(parts), (d, i) => {
      color_legend[d] = part_scale(i);
    });
    let color_element = this.getColorLegend(color_legend);

    let new_rows = _.map(this.props.data.events, (v, k) => {
      return [k, v["from"], v["to"]];
    });
    tree_settings.edgeColorizer = _.partial(edgeColorizer, _, _, parts);
    tree_settings.nodeColorizer = _.partial(nodeColorizer, _, _, parts);

    return (
      <div className="row" id="summary-tab">
        <div className="col-md-12">
          <br />
        </div>
        <div className="col-md-12">
          <div className="main-result">
            <h4 className="border-bottom mb-2">
              Full Panmixia Test (Standard)
            </h4>

            <p>
              Based on <b>{this.props.data.replicates}</b> leaf label
              permutations, the standard (full panmixia) p-value for
              compartmentalization test was &lt;{" "}
              <b>{float_format(this.props.data["p-value"]["panmictic"])}</b>.
            </p>

            <h4 className="border-bottom mt-5 mb-2">Structured Test</h4>

            <p>
              Based on <b>{this.props.data.replicates}</b> <i>structured</i>{" "}
              permutations, the p-value for compartmentalization test was &lt;{" "}
              <b>{float_format(this.props.data["p-value"]["structured"])}</b>.
            </p>

            <p className="alert alert-warning">
              This p-value is derived by comparing the distribution of migration
              events from the panmictic reshuffle to the 90% percentile of the
              simulated distribution of expected migrations if leaf labels are
              permuted partially respecting subtree structure (block
              permutations), which results in{" "}
              <b>{this.props.data["structured-cutoff"]} </b>
              expected migrations.
            </p>

            <hr />
            <p>
              <small>
                <p>
                  This analysis implements canonical and modified versions of
                  the Slatkin-Maddison phylogeny based test for population
                  segregation. The test estimates the minimum number of
                  migration events using maximum parsimony, and then evaluating
                  whether or not this number is lower than expected in a
                  panmictic or unstructured population using permutation tests.
                </p>
                <br />
                Please cite{" "}
                <a
                  href="http://www.ncbi.nlm.nih.gov/pubmed/2599370"
                  id="summary-pmid"
                  target="_blank"
                >
                  PMID 2599370
                </a>
                {" and "}
                <a
                  href="http://doi.org/10.1093/bioinformatics/bti079"
                  id="summary-pmid"
                  target="_blank"
                >
                  PMID 15509596
                </a>{" "}
                if you use this result in a publication, presentation, or other
                scientific work.
              </small>
            </p>
          </div>

          <div id="compartments-tab">
            <Header title="Compartments" />
            <h2 className="mt-2 mb-2">
              <i className="fas fa fa-boxes" /> Performed Test with{" "}
              <b>{this.props.data.compartments}</b> Compartments
            </h2>
            <p>{this.getPartitionCounts()}</p>
          </div>

          <div id="migrations-tab">
            <Header title="Migrations" />
            <h2 className="mt-2 mb-2">
              <i className="fas fa fa-running" /> Inferred{" "}
              <b>{this.props.data.migrations}</b> Migration Events
            </h2>

            <DatamonkeyTable
              headerData={headerData}
              bodyData={new_rows}
              paginate={20}
              classes={"table table-smm table-striped"}
              export_csv
            />
          </div>

          <div id="original-tab">
            <Header title="Original Parameters" />

            <div className="alert alert-primary mt-2 mb-2">
              <i className="fas fa fa-sync" />{" "}
              <b>{this.props.data.replicates}</b> Bootstrap Replicates
            </div>
          </div>

          <div id="tree-tab">
            <Tree
              models={{}}
              json={this.props.data}
              tree_string={this.props.data.tree.string_with_lengths}
              settings={tree_settings}
              method={"slatkin"}
              color_gradient={["#00a99d", "#000000"]}
              grayscale_gradient={["#444444", "#000000"]}
            />

            <h2>Node Color Legend</h2>
            <div>{color_element}</div>
          </div>
        </div>
      </div>
    );
  }
}

class SlatkinContents extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  render() {
    var self = this;
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-sm-10" id="results">
              <SlatkinResults data={self.props.json} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function Slatkin(props) {
  return (
    <ResultsPage
      data={props.data}
      scrollSpyInfo={[
        { label: "summary", href: "summary-tab" },
        { label: "compartments", href: "compartments-tab" },
        { label: "migrations", href: "migrations-tab" },
        { label: "original", href: "original-tab" },
        { label: "tree", href: "tree-tab" }
      ]}
      methodName="Slatkin-Maddison 2019"
      fasta={props.fasta}
      originalFile={props.originalFile}
      analysisLog={props.analysisLog}
    >
      {SlatkinContents}
    </ResultsPage>
  );
}

function render_slatkin(data, element, fasta, originalFile, analysisLog) {
  ReactDOM.render(
    <Slatkin
      data={data}
      fasta={fasta}
      originalFile={originalFile}
      analysisLog={analysisLog}
    />,
    document.getElementById(element)
  );
}

module.exports = render_slatkin;
module.exports.Slatkin = Slatkin;
