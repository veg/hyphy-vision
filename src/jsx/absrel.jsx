var _ = require("underscore");

require("phylotree");
require("phylotree.css");

import React from "react";
import ReactDOM from "react-dom";
import { ErrorMessage } from "./components/error_message.jsx";
import { ExportButton } from "./components/export-button.jsx";
import { ResultsPage } from "./components/results_page.jsx";

import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "@spond/absrel";

class BSRELContents extends React.Component {

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

  processData = data => {

    // Observable
    this.figureRef.current.replaceChildren();

    $(this.figureRef.current).empty();

    const runtime = new Runtime();

    let displaySwitch = false;

    let main = runtime.module(notebook, name => {

      let displayBlacklist = ['rate_table', 'tree_id', 'treeLabels', 'branch_length', 'color_branches', 'treeDim', 'which_branch', 'table3', 'table1', 'fig1_controls', 'plot_type'];

      const node = Inspector.into(this.figureRef.current)(name);

      if(name == "intro") {
        displaySwitch = true;
      }

      if(name == "figure2") {
        displaySwitch = false;
      }

      if(name == "bustedStyle") {
        displaySwitch = true;
      }

      if(displaySwitch) {

        if(name == "viewof table1") {
          node._node.classList.add('table')
          node._node.classList.add('table-striped')
        }

        if(_.includes(displayBlacklist, name)) {
          return;
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


  };

  render() {

    let self = this;

    if (this.state.main) {
      this.state.main.redefine("results_json", this.state.data);
    }


    return (
      <div className="absrel">
        <div className="border-bottom border-primary mb-3">
          <h1 className="list-group-item-heading">
            aBSREL
            <h3>adaptive Branch Site REL</h3>
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

export function BSREL(props) {
  return (
    <ResultsPage
      data={props.data}
      scrollSpyInfo={[]}
      methodName="adaptive Branch Site REL"
      fasta={props.fasta}
      originalFile={props.originalFile}
      analysisLog={props.analysisLog}
      displaySummary={false}
    >
      {BSRELContents}
    </ResultsPage>
  );
}

export default function render_absrel(
  data,
  element,
  fasta,
  originalFile,
  analysisLog
) {
  ReactDOM.render(
    <BSREL
      data={data}
      fasta={fasta}
      originalFile={originalFile}
      analysisLog={analysisLog}
    />,
    document.getElementById(element)
  );
}
