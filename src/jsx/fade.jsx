import React from "react";
import ReactDOM from "react-dom";
import d3 from "d3";

import { ResultsPage } from "./components/results_page.jsx";
import { Header } from "./components/header.jsx";
import { Tree } from "./components/tree.jsx";
import { DatamonkeyTable, DatamonkeyModelTable } from "./components/tables.jsx";

// TODO: Add "any amino acid".
const amino_acids = [
  "A",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "K",
  "L",
  "M",
  "N",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "V",
  "W",
  "Y"
];

const float_format = d3.format(".2f");

function FADESummary(props) {
  if (!props.json) return <div />;
  return (
    <div className="row">
      <div className="col-md-12" />
      <div className="col-md-12">
        <div className="main-result">
          <p>
            FADE found{" "}
            <strong className="hyphy-highlight">{props.numberOfSites}</strong>{" "}
            sites under selection bias towards{" "}
            <strong className="hyphy-highlight">
              {props.selectedAminoAcid}
            </strong>{" "}
            (Bayes Factor >=
            <input
              style={{
                display: "inline-block",
                marginLeft: "5px",
                width: "100px"
              }}
              className="form-control"
              type="number"
              defaultValue={props.bayesFactorThreshold}
              step="1"
              min="0"
              max="1000"
              onChange={props.updateBayesFactorThreshold}
            />{" "}
            )
          </p>

          <hr />
          <p>
            <small>
              See{" "}
              <a href="http://www.hyphy.org/methods/selection-methods/#fade">
                here
              </a>{" "}
              for more information about the FADE method.
              <br />Please cite{" "}
              <a
                href="https://academic.oup.com/bioinformatics/article/21/5/676/220389"
                id="summary-pmid"
                target="_blank"
              >
                PMID 23420840
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

class FADETable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedAminoAcid: this.props.selectedAminoAcid };
  }

  render() {
    if (!this.props.json) return null;
    const title =
      "Sites Under Selection Bias Towards " +
      this.props.selectedAminoAcid +
      " (BF >= " +
      this.props.bayesFactorThreshold +
      " )";
    var headerData = this.props.json.MLE.headers.map(function(header) {
      return { value: header[0], abbr: header[1], sortable: true };
    });
    headerData.unshift({ value: "site", abbr: "site", sortable: true });

    return (
      <div className="row">
        <div className="col-md-12">
          <div id="table-tab">
            <Header
              title={title}
              popover="This will be more informative once this work is reviewed."
            />
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {amino_acids.map(aa => {
                var style = null;
                if (aa == this.props.selectedAminoAcid) {
                  style = { backgroundColor: "darkgray", color: "white" };
                }
                return (
                  <button
                    className="hyphy-omega-chart-btn"
                    style={style}
                    onClick={() => this.props.updateSelectedAminoAcid(aa)}
                  >
                    {aa}
                  </button>
                );
              })}
            </div>
            <DatamonkeyTable
              headerData={headerData}
              bodyData={this.props.MLEBodyData}
              paginate={20}
              classes={"table table-smm table-striped"}
              export_csv
            />
          </div>
        </div>
      </div>
    );
  }
}

class FADETree extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { json } = this.props;
    if (!json) return null;

    return (
      <div className="row">
        <div id="tree-tab" className="col-md-12">
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

class FADEContents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bayesFactorThreshold: 2, // This is probably very low... the FADE write-up on hyphy.org lists a bayes factor of >= 100.
      selectedAminoAcid: "A",
      numberOfSites: 20,
      MLEBodyData: null
    };
  }

  componentDidMount() {
    this.getFilteredMLEBodyData();
  }

  updateBayesFactorThreshold = e => {
    this.setState({
      bayesFactorThreshold: e.target.value
    });
  };

  updateSelectedAminoAcid = aa => {
    this.setState({
      selectedAminoAcid: aa
    });
  };

  getFilteredMLEBodyData = () => {
    var bayesFactorThreshold = this.state.bayesFactorThreshold;
    // Get the data for the table filtered by selectedAminoAcid and only sites with bayes factors above the threshold.
    var MLEDataForSelectedAminoAcid = this.props.json.MLE.content[
      this.state.selectedAminoAcid
    ][0];
    var bodyData = MLEDataForSelectedAminoAcid.map(function(row, index) {
      var siteNumber = index + 1;
      var rowData = row.slice(); // Copied by value to prevent appending site number multiple times.
      rowData.unshift(siteNumber);
      if (rowData[4] >= bayesFactorThreshold) {
        return rowData.map(function(d, rowIndex) {
          if (rowIndex != 0) {
            return { value: float_format(d), classes: "" };
          } else {
            return { value: d, classes: "" };
          }
        });
      }
    });
    bodyData = bodyData.filter(function(el) {
      return el != undefined;
    });
    //this.setState({MLEBodyData: bodyData})
    return bodyData;
  };

  render() {
    return (
      <div>
        <FADESummary
          json={this.props.json}
          bayesFactorThreshold={this.state.bayesFactorThreshold}
          selectedAminoAcid={this.state.selectedAminoAcid}
          numberOfSites={this.state.numberOfSites}
          updateBayesFactorThreshold={this.updateBayesFactorThreshold}
        />
        <FADETable
          json={this.props.json}
          MLEBodyData={this.getFilteredMLEBodyData()}
          bayesFactorThreshold={this.state.bayesFactorThreshold}
          selectedAminoAcid={this.state.selectedAminoAcid}
          updateSelectedAminoAcid={this.updateSelectedAminoAcid}
        />
        <FADETree json={this.props.json} />
        <div id="fits-tab">
          <DatamonkeyModelTable fits={this.props.json.fits} />
        </div>
      </div>
    );
  }
}

function FADE(props) {
  return (
    <ResultsPage
      data={props.data}
      hyphy_vision={props.hyphy_vision}
      scrollSpyInfo={[
        { label: "summary", href: "summary-tab" },
        { label: "table", href: "table-tab" },
        { label: "tree", href: "tree-tab" },
        { label: "model fits", href: "fits-tab" }
      ]}
      methodName="FUBAR Approach to Directional Evolution"
    >
      {FADEContents}
    </ResultsPage>
  );
}

function render_fade(data, element) {
  ReactDOM.render(<FADE data={data} />, document.getElementById(element));
}

function render_hv_fade(data, element) {
  ReactDOM.render(
    <FADE data={data} hyphy_vision />,
    document.getElementById(element)
  );
}

module.exports = render_fade;
module.exports.hv = render_hv_fade;
module.exports.FADE = FADE;
