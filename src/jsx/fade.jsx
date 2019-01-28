import React from "react";
import ReactDOM from "react-dom";
import d3 from "d3";

import { ResultsPage } from "./components/results_page.jsx";
import { Header } from "./components/header.jsx";
import { Tree } from "./components/tree.jsx";
import {
  DatamonkeyGraphMenu,
  DatamonkeyScatterplot
} from "./components/graphs.jsx";
import { DatamonkeyTable, DatamonkeyModelTable } from "./components/tables.jsx";
import { SubstitutionChordDiagram } from "./components/substitutionChordDiagram";
const substitutionParser = require("./../helpers/substitutionParser");

// prettier-ignore
const amino_acids = ["Any", "A", "C", "D", "E", "F", "G", "H", "I", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "Y"];

// ---- Subcomponents used by FADE ----
function FADESummary(props) {
  var evidenceStatment =
    props.numberOfSites != 0 ? (
      <div>
        <p>
          FADE <strong className="hyphy-highlight"> found evidence </strong>
          of selection bias toward
          {props.selectedAminoAcid == "Any" ? (
            <strong className="hyphy-highlight">
              {" "}
              a particular amino acid
            </strong>
          ) : null}
          {props.selectedAminoAcid != "Any" ? " amino acid " : null}
          {props.selectedAminoAcid != "Any" ? (
            <strong className="hyphy-highlight">
              {props.selectedAminoAcid}
            </strong>
          ) : null}
          {" at "}
          <strong className="hyphy-highlight">
            {props.numberOfSites}
          </strong>{" "}
          site{props.numberOfSites != 1 ? "s " : " "}
        </p>
      </div>
    ) : (
      <p>
        FADE <strong> found no evidence </strong>
        of selection bias toward amino acid{" "}
        <strong className="hyphy-highlight">
          {props.selectedAminoAcid}
        </strong>{" "}
      </p>
    );

  return (
    <div className="row">
      <div className="col-md-12" />
      <div className="col-md-12">
        <div className="main-result">
          {evidenceStatment}
          <p>
            with Bayes Factor >=
            <input
              style={{
                display: "inline-block",
                marginLeft: "5px",
                width: "100px"
              }}
              className="form-control"
              type="number"
              value={props.bayesFactorThreshold}
              step="1"
              min="0"
              max="1000"
              onChange={props.updateBayesFactorThreshold}
            />
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

class FADESubstitutionChordDiagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorConnectionsBy: "powderblue"
    };
  }

  updateSiteInFocus = event => {
    const value = event.target.value;
    this.props.updateSiteInFocusState(value);
  };

  updateColorOption = event => {
    const value = event.target.value;
    this.setState({ colorConnectionsBy: value });
  };

  render() {
    return (
      <div className="row" id="scroll-target-for-site-table-on-click">
        <div className="col-md-12">
          <div id="substitution-chord-diagram-tab">
            <Header
              title={this.props.title}
              popover="Inferred substitutions from one amino acid to another at the selected site"
            />
            <div style={{ paddingTop: "5px" }}>
              <label>Site Index :</label>
              <input
                id="site_index"
                className="form-control"
                type="number"
                onChange={this.updateSiteInFocus}
                value={this.props.siteInFocus}
                step="1"
                min="1"
                max={this.props.numberOfSites}
              />
              <div style={{ float: "right" }}>
                <label>Color Connections :</label>
                <select
                  id="analysis-type"
                  defaultValue="powderblue"
                  onChange={this.updateColorOption}
                >
                  <option value="powderblue">All Blue</option>
                  <option value="source">From</option>
                  <option value="target">To</option>
                </select>
              </div>
            </div>

            <SubstitutionChordDiagram
              matrix={this.props.matrix}
              width={this.props.width}
              height={this.props.height}
              colorConnectionsBy={this.state.colorConnectionsBy}
            />
          </div>
        </div>
      </div>
    );
  }
}

class AminoAcidSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedAminoAcid: this.props.selectedAminoAcid };
  }
  render() {
    return (
      <div
        className="row"
        style={{ position: "sticky", top: "40px", zIndex: "100" }}
        id="amino-acid-selector-parent-div"
      >
        <div className="col-md-12">
          <div id="amino-acid-selector">
            <Header
              title="Select the Amino Acid of Interest and Bayes Factor Threshold"
              popover="This will be more informative once this work is reviewed."
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                backgroundColor: "white"
              }}
            >
              {amino_acids.map(aa => {
                var style = null;
                if (this.props.aminoAcidsAboveThreshold.includes(aa)) {
                  style = { fontWeight: "bold", color: "#00a99d" };
                }
                if (aa == this.props.selectedAminoAcid) {
                  style = { backgroundColor: "darkgray", color: "white" };
                }
                if (
                  aa == this.props.selectedAminoAcid &&
                  this.props.aminoAcidsAboveThreshold.includes(aa)
                ) {
                  style = {
                    backgroundColor: "darkgray",
                    fontWeight: "bold",
                    color: "#00a99d"
                  };
                }
                return (
                  <button
                    className="hyphy-omega-chart-btn"
                    style={style}
                    onClick={() => this.props.updateSelectedAminoAcid(aa)}
                    key={aa}
                  >
                    {aa}
                  </button>
                );
              })}
              <div>BF>=</div>
              <input
                style={{
                  display: "inline-block",
                  marginLeft: "5px",
                  width: "100px"
                }}
                className="form-control"
                type="number"
                value={this.props.bayesFactorThreshold}
                step="1"
                min="0"
                max="1000"
                onChange={this.props.updateBayesFactorThreshold}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class FADESitesGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xaxis: "Site Index",
      yaxis: "Bayes Factor"
    };
  }

  getGraphData = () => {
    if (this.props.selectedAminoAcid == "Any") {
      return;
    }
    var filteredMLEData = this.getFilteredMLEBodyDataForParticularAA();
    var bayesFactorData = [];
    var logBayesFactorData = [];
    var siteIndexData = [];
    var biasData = [];
    var rateData = [];
    var probabilityData = [];

    for (var site in filteredMLEData) {
      var siteData = filteredMLEData[site];
      bayesFactorData.push(parseFloat(siteData[4]["value"]));
      logBayesFactorData.push(parseFloat(Math.log(siteData[4]["value"])));
      siteIndexData.push(parseInt(siteData[0]["value"]));
      biasData.push(parseFloat(siteData[2]["value"]));
      rateData.push(parseFloat(siteData[1]["value"]));
      probabilityData.push(parseFloat(siteData[3]["value"]));

      var dataForGraph = {
        "Bayes Factor": bayesFactorData,
        "Log(Bayes Factor)": logBayesFactorData,
        "Site Index": siteIndexData,
        Bias: biasData,
        Rate: rateData,
        Probability: probabilityData
      };
    }

    return dataForGraph;
  };

  getFilteredMLEBodyDataForParticularAA = () => {
    var MLEDataForSelectedAminoAcid = this.props.json.MLE.content[
      this.props.selectedAminoAcid
    ][0];
    var bodyData = MLEDataForSelectedAminoAcid.map(function(row, index) {
      var siteNumber = index + 1;
      var rowData = row.slice(); // Copied by value to prevent appending site number multiple times.
      rowData.unshift(siteNumber);
      return rowData.map(function(d, rowIndex) {
        if (rowIndex != 0) {
          return { value: d3.format(".2f")(d), classes: "" };
        } else {
          return { value: d, classes: "" };
        }
      });
    });
    return bodyData;
  };

  updateAxisSelection = e => {
    var state_to_update = {};
    var dimension = e.target.dataset.dimension;
    var axis = e.target.dataset.axis;

    state_to_update[axis] = dimension;
    this.setState(state_to_update);
  };

  render() {
    var title = "FADE Sites Graph";
    this.props.selectedAminoAcid != "Any"
      ? (title = title + " (Amino Acid " + this.props.selectedAminoAcid + " )")
      : null;

    var graphData = this.getGraphData();
    var axis_options = [
      "Bayes Factor",
      "Log(Bayes Factor)",
      "Site Index",
      "Bias",
      "Rate"
    ];

    return (
      <div className="row">
        <div className="col-md-12">
          <div id="site-graph-tab">
            <Header
              title={title}
              popover="This will be more informative once this work is reviewed."
            />

            {this.props.selectedAminoAcid == "Any" ? (
              <div>
                {" "}
                Select a particular amino acid (above) to display the site graph
                for that residue{" "}
              </div>
            ) : (
              <div>
                <DatamonkeyGraphMenu
                  x_options={axis_options}
                  y_options={axis_options}
                  axisSelectionEvent={this.updateAxisSelection}
                  export_images
                />
                <DatamonkeyScatterplot
                  x={graphData[this.state.xaxis]}
                  y={[graphData[this.state.yaxis]]}
                  x_label={this.state.xaxis}
                  y_label={this.state.yaxis}
                  marginLeft={50}
                  width={
                    $(".results").width() == null ? 935 : $(".results").width()
                  }
                  transitions={false}
                  tracker={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

class FADETable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedAminoAcid: this.props.selectedAminoAcid };
  }

  render() {
    var title =
      "FADE Site Table (Bayes Factor >= " +
      this.props.bayesFactorThreshold +
      " )";
    this.props.selectedAminoAcid != "Any"
      ? (title = title + " (Amino Acid " + this.props.selectedAminoAcid + " )")
      : null;

    return (
      <div className="row">
        <div className="col-md-12">
          <div id="table-tab">
            <Header
              title={title}
              popover="This will be more informative once this work is reviewed."
            />

            <DatamonkeyTable
              headerData={this.props.MLEHeaderData}
              bodyData={this.props.MLEBodyData}
              onClick={this.props.rowOnClick}
              paginate={20}
              classes={"table table-smm table-striped fade-site-table"}
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

// ---- The main FADE component ----
class FADEContents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bayesFactorThreshold: 100,
      selectedAminoAcid: "Any",
      numberOfSites: this.props.json["site annotations"]["site annotations"][0]
        .length,
      siteInFocus: 1
    };
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

  getAminoAcidsAboveThreshold = bayesFactorThreshold => {
    var aminoAcidsAboveThreshold = [];
    for (var aminoAcid in this.props.json.MLE.content) {
      var MLEDataForSelectedAminoAcid = this.props.json.MLE.content[
        aminoAcid
      ][0];
      for (var row in MLEDataForSelectedAminoAcid) {
        const bayesFactorForSiteAndAA = MLEDataForSelectedAminoAcid[row][3];
        if (bayesFactorForSiteAndAA >= bayesFactorThreshold) {
          aminoAcidsAboveThreshold.push(aminoAcid);
          break;
        }
      }
    }
    return aminoAcidsAboveThreshold;
  };

  getFilteredMLEBodyData = () => {
    if (this.state.selectedAminoAcid == "Any") {
      return this.getFilteredMLEBodyDataForAnyAA();
    } else {
      return this.getFilteredMLEBodyDataForParticularAA();
    }
  };

  getFilteredMLEBodyDataForAnyAA = () => {
    var bayesFactorThreshold = this.state.bayesFactorThreshold;

    // loop or map through each AA
    var bodyData = [];
    for (var aminoAcid in this.props.json.MLE.content) {
      var MLEDataForSelectedAminoAcid = this.props.json.MLE.content[
        aminoAcid
      ][0];
      var bodyDataForAA = MLEDataForSelectedAminoAcid.map(function(row, index) {
        var siteNumber = index + 1;
        var rowData = row.slice(); // Copied by value to prevent appending site number multiple times.
        rowData.unshift(siteNumber);
        rowData.unshift(aminoAcid);
        if (rowData[5] >= bayesFactorThreshold) {
          return rowData.map(function(d, rowIndex) {
            if (rowIndex > 1) {
              return { value: d3.format(".2f")(d), classes: "" };
            } else {
              return { value: d, classes: "" };
            }
          });
        }
      });
      bodyDataForAA = bodyDataForAA.filter(function(el) {
        return el != undefined;
      });
      bodyData = bodyData.concat(bodyDataForAA);
    }
    const siteAnnotationsData = this.props.json["site annotations"][
      "site annotations"
    ]["0"];
    bodyData = this.appendSiteAnnotationsToMLEBodyData(
      bodyData,
      siteAnnotationsData
    );
    return bodyData;
  };

  getFilteredMLEBodyDataForParticularAA = () => {
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
            return { value: d3.format(".2f")(d), classes: "" };
          } else {
            return { value: d, classes: "" };
          }
        });
      }
    });
    bodyData = bodyData.filter(function(el) {
      return el != undefined;
    });
    const siteAnnotationsData = this.props.json["site annotations"][
      "site annotations"
    ]["0"];
    bodyData = bodyData = this.appendSiteAnnotationsToMLEBodyData(
      bodyData,
      siteAnnotationsData
    );
    return bodyData;
  };

  appendSiteAnnotationsToMLEBodyData = (MLEBodyData, siteAnnotations) => {
    var MLEBodyDataWithSiteAnnotations = [];
    for (let i = 0; i < MLEBodyData.length; i++) {
      const rowData = MLEBodyData[i];
      let siteIndex;
      rowData.length == 5
        ? (siteIndex = rowData[0]["value"])
        : (siteIndex = rowData[1]["value"]);
      const siteSpecificAnnotations = siteAnnotations[siteIndex - 1];
      rowData.push({
        value: siteSpecificAnnotations[0],
        classes: "",
        style: { overflowWrap: "break-word" }
      });
      rowData.push({
        value: siteSpecificAnnotations[1],
        classes: "",
        style: { overflowWrap: "break-word" }
      });
      MLEBodyDataWithSiteAnnotations.push(rowData);
    }
    return MLEBodyData;
  };

  getMLEHeaderData = selectedAminoAcid => {
    function formatHeader(header) {
      if (header == "Prob[bias>0]") {
        return "prob [bias>0]";
      } else if (header == "BayesFactor[bias>0]") {
        return "bayes factor [bias>0]";
      } else {
        return header;
      }
    }

    var MLEHeaderData = this.props.json.MLE.headers.map(function(header) {
      return {
        value: formatHeader(header[0]),
        abbr: header[1],
        sortable: true,
        style: { overflowWrap: "break-word" }
      };
    });
    MLEHeaderData.unshift({
      value: "site index",
      abbr: "site",
      sortable: true
    });
    selectedAminoAcid == "Any"
      ? MLEHeaderData.unshift({
          value: "amino acid",
          abbr: "AA",
          sortable: true
        })
      : null;
    MLEHeaderData.push({
      value: "composition",
      abbr: "Amino acid composition of site",
      sortable: false,
      style: { width: "200px" }
    });
    MLEHeaderData.push({
      value: "substitutions",
      abbr: "Substitution history on selected branches",
      sortable: false,
      style: { width: "250px" }
    });
    return MLEHeaderData;
  };

  getSubstitutionMatrix = siteInFocus => {
    const siteAnnotationsData = this.props.json["site annotations"][
      "site annotations"
    ]["0"];
    const siteSpecificSubstitutionString =
      siteAnnotationsData[siteInFocus - 1][1];
    const siteSubstitutionMatrix = substitutionParser(
      siteSpecificSubstitutionString
    );
    return siteSubstitutionMatrix;
  };

  updateSiteInFocusState = newSiteInFocus => {
    this.setState({ siteInFocus: newSiteInFocus });
  };

  rowOnClick = rowData => {
    const siteNumberIndex = rowData.length - 7;
    const siteInFocus = rowData[siteNumberIndex]["value"];
    this.updateSiteInFocusState(siteInFocus);
    document
      .getElementById("scroll-target-for-site-table-on-click")
      .scrollIntoView();
  };

  render() {
    const filteredMLEBodyData = this.getFilteredMLEBodyData();
    const MLEHeaderData = this.getMLEHeaderData(this.state.selectedAminoAcid);
    const substitutionMatrix = this.getSubstitutionMatrix(
      this.state.siteInFocus
    );

    return (
      <div>
        <FADESummary
          bayesFactorThreshold={this.state.bayesFactorThreshold}
          selectedAminoAcid={this.state.selectedAminoAcid}
          numberOfSites={filteredMLEBodyData.length}
          updateBayesFactorThreshold={this.updateBayesFactorThreshold}
        />
        <FADESubstitutionChordDiagram
          matrix={substitutionMatrix}
          updateSiteInFocusState={this.updateSiteInFocusState}
          title={"Inferred Amino Acid Substitutions"}
          width={700}
          height={500}
          numberOfSites={this.state.numberOfSites}
          siteInFocus={this.state.siteInFocus}
        />
        <AminoAcidSelector
          selectedAminoAcid={this.state.selectedAminoAcid}
          updateSelectedAminoAcid={this.updateSelectedAminoAcid}
          bayesFactorThreshold={this.state.bayesFactorThreshold}
          updateBayesFactorThreshold={this.updateBayesFactorThreshold}
          aminoAcidsAboveThreshold={this.getAminoAcidsAboveThreshold(
            this.state.bayesFactorThreshold
          )}
        />
        <FADESitesGraph
          json={this.props.json}
          MLEBodyData={filteredMLEBodyData}
          bayesFactorThreshold={this.state.bayesFactorThreshold}
          selectedAminoAcid={this.state.selectedAminoAcid}
        />
        <FADETable
          MLEHeaderData={MLEHeaderData}
          MLEBodyData={filteredMLEBodyData}
          rowOnClick={this.rowOnClick}
          bayesFactorThreshold={this.state.bayesFactorThreshold}
          selectedAminoAcid={this.state.selectedAminoAcid}
        />
        <FADETree json={this.props.json} />
        <div id="fits-tab">
          <DatamonkeyModelTable fits={this.props.json.fits} />
        </div>
      </div>
    );
  }
}

// ---- The stock compenents that are needed for each vision page ----
function FADE(props) {
  return (
    <ResultsPage
      data={props.data}
      scrollSpyInfo={[
        { label: "summary", href: "summary-tab" },
        { label: "substitution graph", href: "substitution-chord-diagram-tab" },
        { label: "site graph", href: "site-graph-tab" },
        { label: "site table", href: "table-tab" },
        { label: "tree", href: "tree-tab" },
        { label: "model fits", href: "fits-tab" }
      ]}
      methodName="FADE (FUBAR Approach to Directional Evolution)"
      fasta={props.fasta}
      originalFile={props.originalFile}
      analysisLog={props.analysisLog}
    >
      {FADEContents}
    </ResultsPage>
  );
}

function render_fade(data, element, fasta, originalFile, analysisLog) {
  ReactDOM.render(
    <FADE
      data={data}
      fasta={fasta}
      originalFile={originalFile}
      analysisLog={analysisLog}
    />,
    document.getElementById(element)
  );
}

module.exports = render_fade;
module.exports.FADE = FADE;
