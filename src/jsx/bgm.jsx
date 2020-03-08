import React from "react";
import ReactDOM from "react-dom";
var _ = require("underscore");

import { ResultsPage } from "./components/results_page.jsx";
import { Header } from "./components/header.jsx";
import { Tree } from "./components/tree.jsx";
import { DatamonkeyTable, DatamonkeyModelTable } from "./components/tables.jsx";

function BGMSummary(props) {
  if (!props.json) return <div />;
  return (
    <div className="row">
      <div className="col-md-12" />
      <div className="col-md-12">
        <div className="main-result">
          <p>
            BGM found{" "}
            <strong className="hyphy-highlight">{props.numberOfPairs}</strong>{" "}
            pairs of co-evolving sites (posterior probability >=
            <input
              style={{
                display: "inline-block",
                marginLeft: "5px",
                width: "100px"
              }}
              className="form-control"
              type="number"
              defaultValue={props.probabilityThreshold}
              step="0.01"
              min="0"
              max="1"
              onChange={props.updateProbability}
            />{" "}
            )
          </p>
          <hr />
          <p>
            <small>
              See{" "}
              <a href="http://www.hyphy.org/methods/selection-methods/#bgm">
                here
              </a>{" "}
              for more information about the BGM method.
              <br />
              Please cite{" "}
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
    this.state = {
      MLEHeaders: [],
      MLEData: [],
      probabilityThreshold: 0.5
    };
  }

  componentDidMount() {
    this.processData(this.props.json);
  }

  processData = data => {
    // Temp processing for the SitePairsTable
    var MLEHeaders = [];
    for (var key in data.MLE.headers) {
      MLEHeaders.push({
        value: data.MLE.headers[key][0],
        abbr: data.MLE.headers[key][1],
        sortable: true
      });
    }

    var branchLengths = {};
    const branchAttributesObject = data["branch attributes"]["0"];
    for (key in branchAttributesObject) {
      const branchLengthObject = branchAttributesObject[key];
      const branchLength =
        branchLengthObject[Object.keys(branchLengthObject)[0]];
      branchLengths[key] = branchLength;
    }

    this.setState({
      MLEHeaders: MLEHeaders,
      MLEData: this.getSitePairsAtOrAboveProbabilityThreshold(),
      branchLengths: branchLengths
    });
  };

  getSitePairsAtOrAboveProbabilityThreshold = newProbabilityThreshold => {
    var probabilityThreshold =
      newProbabilityThreshold || this.state.probabilityThreshold;
    var FilteredMLEData = [];
    const allSitePairs = this.props.json.MLE.content;

    function selectivelyFormatNumber(num) {
      if (num.toString().indexOf(".") > -1) {
        if (num > 0.1) {
          return d3.format(".2f")(num);
        } else {
          return d3.format(".3f")(num);
        }
      } else {
        return num;
      }
    }

    for (var i = 0; i < allSitePairs.length; i++) {
      var sitePairData = allSitePairs[i];
      var maxProbability = Math.max(
        sitePairData[2],
        sitePairData[3],
        sitePairData[4]
      );
      if (maxProbability >= probabilityThreshold) {
        var formattedSitePairData = _.map(
          sitePairData,
          selectivelyFormatNumber
        );
        FilteredMLEData.push(formattedSitePairData);
      }
    }
    return FilteredMLEData;
  };

  updateProbability = e => {
    this.setState({
      probabilityThreshold: e.target.value,
      MLEData: this.getSitePairsAtOrAboveProbabilityThreshold(e.target.value)
    });
  };

  render() {
    return (
      <div>
        <BGMSummary
          json={this.props.json}
          numberOfPairs={this.state.MLEData.length}
          probabilityThreshold={this.state.probabilityThreshold}
          updateProbability={this.updateProbability}
        />

        <div id="site-pairs-tab">
          <Header
            title="Co-Evolving Pairs of Sites Detected by BGM"
            popover={
              "<p>Hover over a column header for a description of its content.</p>"
            }
          />

          <DatamonkeyTable
            headerData={this.state.MLEHeaders}
            bodyData={this.state.MLEData}
            paginate={Math.min(10, this.state.MLEData.length)}
            initialSort={0}
            classes={"table table-smm table-striped"}
            export_csv
          />
        </div>

        <div id="tree-tab">
          <Tree
            json={this.props.json}
            tree_string={this.props.json.input.trees[0]}
            models={this.props.json.fits}
            method="bgm"
            branch_lengths={this.state.branchLengths}
            settings={{
              omegaPlot: {},
              "tree-options": {
                /* value arrays have the following meaning
                    [0] - the value of the attribute
                    [1] - does the change in attribute value trigger tree re-layout?
                */
                "hyphy-tree-model": ["Full model", true],
                "hyphy-tree-highlight": [null, false],
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

        <div id="fits-tab">
          <DatamonkeyModelTable fits={this.props.json.fits} />
        </div>
      </div>
    );
  }
}

function BGM(props) {
  return (
    <ResultsPage
      data={props.data}
      scrollSpyInfo={[
        { label: "summary", href: "summary-tab" },
        { label: "table", href: "site-pairs-tab" },
        { label: "tree", href: "tree-tab" },
        { label: "model fits", href: "fits-tab" }
      ]}
      methodName="SpiderMonkey - Bayesian Graphical Models (BGM)"
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

export { BGM, render_bgm };
