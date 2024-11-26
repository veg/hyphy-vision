const React = require("react"),
  ReactDOM = require("react-dom"),
  _ = require("underscore");

require("phylotree");
require("phylotree.css");

import { ErrorMessage } from "./components/error_message.jsx";
import { ExportButton } from "./components/export-button.jsx";
import { ResultsPage } from "./components/results_page.jsx";
import { Inspector, Runtime } from "@observablehq/runtime";
import notebook from "@spond/meme";

class MEMEContents extends React.Component {
  figureRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      input: null,
      fits: {},
    };
  }

  componentDidMount() {
    this.processData(this.props.json);
  }

  componentWillReceiveProps(nextProps) {
    this.processData(nextProps.json);
  }

  processData(data) {
    // Observable
    this.figureRef.current.replaceChildren();
    $(this.figureRef.current).empty();

    const runtime = new Runtime();

    let main = runtime.module(notebook, (name) => {
      let toInclude = [
        "intro",
        "citation",
        "viewof pv",
        "summary_table",
        "alignmentHeader",
        "cssStyles",
        "bustedStyle",
        "simpleIcons",
        "viewof rate_table",
        "viewof plot_type",
        "distComparisonPlot",
        //"viewof table_filter",
        //"viewof plot_type",
        "fig1caption",
        "figure1",
        "table1caption",
        "viewof table1",
        "table1legend",
        "viewof tree_id",
        "viewof branch_length",
        "viewof treeLabels",
        "viewof color_branches",
        "viewof treeDim",
        "treeLegend",
        "fig2legend",
        "fig2render",
        //undefined
      ];

      if (_.includes(toInclude, name) || name == undefined) {
        const node = Inspector.into(this.figureRef.current)(name);
        if (name == "viewof table1") {
          node._node.classList.add("table");
          node._node.classList.add("table-striped");
        }
        return node;
      }

      if (name == undefined) {
        //const node = Inspector.into(this.figureRef.current)(name);
        //if(node._node.innerHTML.match(/style/) || node._node.innerHTML.match(/link/)) {
        // return node;
        //}
      }
    });

    this.setState({
      input: data.input,
      fits: data.fits,
      main: main,
      data: data,
    });
  }

  render() {
    if (this.state.main) {
      this.state.main.redefine("results_json", this.state.data);
    }

    return (
      <div className="busted">
        <div className="border-bottom border-primary mb-3">
          <span></span>
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
        </div>

        <div id="results">
          <div id="notebook">
            <div ref={this.figureRef}></div>
          </div>
        </div>
      </div>
    );
  }
}

export function MEME(props) {
  return (
    <ResultsPage
      data={props.data}
      scrollSpyInfo={[]}
      methodName="Branch-Site Unrestricted Statistical Test for Episodic Diversification"
      fasta={props.fasta}
      originalFile={props.originalFile}
      analysisLog={props.analysisLog}
      displaySummary={false}
    >
      {MEMEContents}
    </ResultsPage>
  );
}

export default function render_busted(
  data,
  element,
  fasta,
  originalFile,
  analysisLog
) {
  ReactDOM.render(
    <MEME
      data={data}
      fasta={fasta}
      originalFile={originalFile}
      analysisLog={analysisLog}
    />,
    document.getElementById(element)
  );
}
