const React = require("react"),
  ReactDOM = require("react-dom"),
  _ = require("underscore");

import { ErrorMessage } from "./components/error_message.jsx";
import { ExportButton } from "./components/export-button.jsx";
import { ResultsPage } from "./components/results_page.jsx";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "@hyphy_software/nrm";

class NRMContents extends React.Component {

  figureRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      input: null,
      fits: {}
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

    let main = runtime.module(notebook, name => {

      console.log(name);

      let toInclude = [
        "summaryBox",
        "summary",
        "viewof table1",
        "table1caption",
        "viewof modelForQ",
        "qMatrixColorLegend",
        "viewof table2",
        "table2caption",
        "viewof fig1x",
        "viewof fig1y",
        "fig1_label",
        "fig2label",
        "fig1",
        "viewof treeDim",
        "viewof treeLabels",
        "viewof modelForTree",
        "viewof distanceFunction",
        "treeMatrixColorLegend",
        "figure2",
        "cssStyles",
        "simpleIcons",
      ];

      if (_.includes(toInclude, name)) {
        const node = Inspector.into(this.figureRef.current)(name);
				if(name == "viewof table1") {
					node._node.classList.add('table')
					node._node.classList.add('table-striped')
				}
				return node;
      }

    });

    this.setState({
      input: data.input,
      fits: data.fits,
      main: main,
      data: data
    });
  }

  render() {

    if (this.state.main) {
      this.state.main.redefine("nrm_results_json", this.state.data);
    }

    return (

      <div className="nrm">
        <div className="border-bottom border-primary mb-3">
          <h1 className="list-group-item-heading">
						NRM
            <h3>Test for non-reversibility of the evolutionary process.</h3>
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

export function NRM(props) {
  return (
    <ResultsPage
      data={props.data}
      scrollSpyInfo={[]}
      methodName="Fixed Effects Likelihood"
      fasta={props.fasta}
      originalFile={props.originalFile}
      analysisLog={props.analysisLog}
      displaySummary={false}
    >
      {NRMContents}
    </ResultsPage>
  );
}

export default function render_nrm(
  data,
  element,
  fasta,
  originalFile,
  analysisLog
) {
  ReactDOM.render(
    <NRM
      data={data}
      fasta={fasta}
      originalFile={originalFile}
      analysisLog={analysisLog}
    />,
    document.getElementById(element)
  );
}
