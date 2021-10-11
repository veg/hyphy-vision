var React = require("react"),
  ReactDOM = require("react-dom"),
  _ = require("underscore");

import { ErrorMessage } from "./components/error_message.jsx";
import { Header } from "./components/header.jsx";
import { ExportButton } from "./components/export-button.jsx";
import { ResultsPage } from "./components/results_page.jsx";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "@hyphy_software/gard-analysis-result-visualization";

function binomial(n, k) {
  if (typeof n !== "number" || typeof k !== "number") return false;
  var coeff = 1;
  for (var x = n - k + 1; x <= n; x++) coeff *= x;
  for (x = 1; x <= k; x++) coeff /= x;
  return coeff;
}

function GARDResults(props) {

  if (!props.data) return <div />;

  var number_of_fragments = Object.keys(props.data.trees).length;
  var totalPossibleModels = _.range(number_of_fragments)
    .map(k => binomial(props.data.potentialBreakpoints, k + 1))
    .reduce((a, b) => a + b, 0);

  var totalModelCount = props.data.totalModelCount;

  var percentageExplored = (
    (100 * totalModelCount) /
    totalPossibleModels
  ).toFixed(2);

  var evidence_statement =
    number_of_fragments > 1 ? (
      <span>
        <strong>found evidence</strong> of {props.data.lastImprovedBPC}{" "}
        recombination breakpoint
        {props.data.lastImprovedBPC == 1 ? "" : "s"}
      </span>
    ) : (
      <span>
        <strong>found no evidence</strong> of recombination
      </span>
    );

  return (
    <div className="row">
      <div className="col-md-12" />
      <div className="col-md-12">
        <div className="main-result border border-primary border-left-0 border-right-0 mt-3">
          <p>
            GARD {evidence_statement}. GARD examined <b>{totalModelCount}</b>{" "}
            models at a rate of{" "}
            <b>{(totalModelCount / props.data.timeElapsed).toFixed(2)}</b>{" "}
            models per second. The alignment contained{" "}
            <b>{props.data.potentialBreakpoints}</b> potential breakpoints,
            translating into a search space of <b>{totalPossibleModels}</b>{" "}
            models with up to <b>{number_of_fragments}</b> breakpoints, of which{" "}
            <b>{percentageExplored}%</b> was explored by the genetic algorithm.
          </p>
          <hr />
          <p>
            <small>
              See{" "}
              <a href="http://hyphy.org/methods/selection-methods/#gard">
                here
              </a>{" "}
              for more information about this method.
              <br />
              Please cite{" "}
              <a
                href="http://www.ncbi.nlm.nih.gov/pubmed/16818476"
                id="summary-pmid"
                target="_blank"
              >
                PMID 16818476
              </a>{" "}
              if you use this result in a publication, presentation, or other
              scientific work.
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}

function GARDSimpleTopologyReport(props) {
  if (!props.data) return <div />;
  if (!props.data.improvements) return <div />;

  var currentAIC =
    props.data.baselineScore -
    _.pluck(props.data.improvements, "deltaAICc").reduce((t, n) => t + n);
  const w = Math.exp(0.5 * (currentAIC - props.data.singleTreeAICc));
  var conclusion =
    w > 0.01 ? (
      <i>
        some or all of the breakpoints may reflect rate variation instead of
        topological incongruence
      </i>
    ) : (
      <i>
        at least of one of the breakpoints reflects a true topological
        incongruence
      </i>
    );
  return (
    <div className="row">
      <div className="col-md-12">
        <Header title="Topological incongruence report" />

        <p className="description">
          Comparing the AIC<sub>c</sub> score of the best fitting GARD model,
          that allows for different topologies between segments (
          {currentAIC.toFixed(1)}), and that of the model that assumes the same
          tree for all the partitions inferred by GARD, but allows different
          branch lengths between partitions (
          {props.data.singleTreeAICc.toFixed(1)}) suggests that because the
          multiple tree model {w > 0.01 ? "cannot" : "can"} be preferred over
          the single tree model by an evidence ratio of 100 or greater,{" "}
          {conclusion}.
        </p>
      </div>
    </div>
  );
}

class GARDContents extends React.Component {
  bodyRef = React.createRef();
  figureRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = { data: null, main: null };
  }

  componentDidMount() {
    this.processData(this.props.json);
  }

  componentWillReceiveProps(nextProps) {
    this.processData(nextProps.json);
  }

  processData(data) {
    if (data.improvements != null) {
      const improvements = Object.values(data.improvements).map(
        improvementObject => ({
          breakpoints: improvementObject.breakpoints,
          deltaAICc: improvementObject.deltaAICc
        })
      );
      data.improvements = improvements;
    }

    // Future correct way.
    this.bodyRef.current.replaceChildren();
    this.figureRef.current.replaceChildren();

    // For browsers that do not support replaceChildren
    $(this.bodyRef.current).empty();
    $(this.figureRef.current).empty();

    const runtime = new Runtime();

    let main = runtime.module(notebook, name => {
      let toInclude = [
        "gard_results_file",
        "tabulatedView",
        "fig1label",
        "fig1",
        "fig2_label",
        "fig2",
        "fig3_label",
        "fig3",
        "fig4_label",
        "viewof variants",
        "variants",
        "fig4",
        "cssStyles",
        "simpleIcons",
        "displayed_trees"
      ];

      if (_.includes(toInclude, name)) {
        if (name == "tabulatedView") {
          return Inspector.into(this.bodyRef.current)(name);
        }
        {
          return Inspector.into(this.figureRef.current)(name);
        }
      }
    });

    this.setState({ data: data, main: main });
  }

  render() {
    if (this.state.main) {
      this.state.main.redefine("gard_results_json", this.state.data);
      this.state.main.redefine(
        "breakpointData",
        this.state.data.breakpointData
      );
    }

    return (
      <div className="gard">
        <div className="clearance" id="summary-div" />

        <div className="border-bottom border-primary mb-3">
          <h1 className="list-group-item-heading">
            GARD
            <h3>Genetic Algorithm for Recombination Detection</h3>
          </h1>
        </div>

        <div>
          <ExportButton
            json={this.props.json}
            fasta={this.props.fasta}
            originalFile={this.props.originalFile}
            analysisLog={this.props.analysisLog}
            partitionedData={this.props.partitionedData}
          />

          <ErrorMessage />

          <div id="body-tab">
            <div ref={this.bodyRef}></div>
          </div>
          <GARDResults data={this.state.data} />
          <div id="figures-tab" className="row">
            <div className="col-md-12">
              <Header title="Figures" />
              <div ref={this.figureRef}></div>
            </div>
          </div>
          <GARDSimpleTopologyReport data={this.state.data} />
        </div>
      </div>
    );
  }
}

export function GARD(props) {
  return (
    <ResultsPage
      data={props.data}
      scrollSpyInfo={[]}
      methodName="Genetic Algorithm for Recombination Detection"
      fasta={props.fasta}
      originalFile={props.originalFile}
      analysisLog={props.analysisLog}
      partitionedData={props.partitionedData}
      displaySummary={false}
    >
      {GARDContents}
    </ResultsPage>
  );
}

export default function render_gard(
  data,
  element,
  fasta,
  originalFile,
  analysisLog,
  partitionedData
) {
  ReactDOM.render(
    <GARD
      data={data}
      fasta={fasta}
      originalFile={originalFile}
      analysisLog={analysisLog}
      partitionedData={partitionedData}
    />,
    document.getElementById(element)
  );
}
