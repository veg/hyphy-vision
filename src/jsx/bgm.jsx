import React from "react";
import ReactDOM from "react-dom";

import { ResultsPage } from "./components/results_page.jsx";
import { Header } from "./components/header.jsx";
import { Tree } from "./components/tree.jsx";

function BGMSummary(props) {
  if (!props.json) return <div />;
  return (
    <div className="row">
      <div className="col-md-12" />
      <div className="col-md-12">
        <div className="main-result">
          <p>BGM analyzed your data.</p>
          <hr />
          <p>
            <small>
              See{" "}
              <a href="http://www.hyphy.org/methods/selection-methods/#bgm">
                here
              </a>{" "}
              for more information about the BGM method.
              <br />Please cite{" "}
              <a
                href="https://www.ncbi.nlm.nih.gov/pubmed/18562270"
                id="summary-pmid"
                target="_blank"
              >
                PMID 18562270
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

class BGMContents extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <BGMSummary json={this.props.json} />
        <div id="tree-tab">
          <Tree
            json={this.props.json}
            tree_string={this.props.json.input.trees[0]}
            models={this.props.json.fits}
            method="bgm"
            settings={{
              omegaPlot: {},
              "tree-options": {
                /* value arrays have the following meaning
                    [0] - the value of the attribute
                    [1] - does the change in attribute value trigger tree re-layout?
                */
                "hyphy-tree-model": ["Full model", true],
                "hyphy-tree-highlight": [null, false],
                "hyphy-tree-branch-lengths": [true, true],
                "hyphy-tree-hide-legend": [false, true],
                "hyphy-tree-fill-color": [true, true]
              },
              "suppress-tree-render": false,
              "chart-append-html": true,
              edgeColorizer: function(e, d) {
                return 0;
              }
            }}
          />
        </div>
      </div>
    );
  }
}

function BGM(props) {
  return (
    <ResultsPage
      data={props.data}
      scrollSpyInfo={[{ label: "summary", href: "summary-tab" }]}
      methodName="SpiderMonkey - Bayesian Graphical Models"
      fasta={props.fasta}
      originalFile={props.originalFile}
      analysisLog={props.analysisLog}
    >
      {BGMContents}
    </ResultsPage>
  );
}

function render_bgm(data, element, fasta, originalFile, analysisLog) {
  ReactDOM.render(
    <BGM
      data={data}
      fasta={fasta}
      originalFile={originalFile}
      analysisLog={analysisLog}
    />,
    document.getElementById(element)
  );
}

function render_hv_fade(data, element) {
  ReactDOM.render(
    <FADE data={data} hyphy_vision />,
    document.getElementById(element)
  );
}

module.exports = render_bgm;
module.exports.BGM = BGM;
