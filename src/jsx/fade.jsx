import React from "react";
import ReactDOM from "react-dom";
import d3 from "d3";

import { ResultsPage } from "./components/results_page.jsx";
import { Header } from "./components/header.jsx";
import { DatamonkeyTable } from "./components/tables.jsx";

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
          <p>FADE analyzed your data.</p>
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
    this.state = { amino_acid: "A" };
  }
  render() {
    const { json } = this.props;
    if (!json) return null;
    const headerData = json.MLE.headers.map(function(header) {
        return { value: header[0], abbr: header[1], sortable: true };
      }),
      bodyData = json.MLE.content[this.state.amino_acid][0].map(function(row) {
        return row.map(function(d) {
          return { value: float_format(d), classes: "" };
        });
      });

    return (
      <div className="row">
        <div id="table-tab" className="col-md-12">
          <Header
            title="Amino acid maximum likelihood estimate"
            popover="This will be more informative once this work is reviewed."
          />
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {amino_acids.map(aa => {
              return (
                <button
                  className="hyphy-omega-chart-btn"
                  onClick={() => this.setState({ amino_acid: aa })}
                >
                  {aa}
                </button>
              );
            })}
          </div>
          <DatamonkeyTable
            headerData={headerData}
            bodyData={bodyData}
            paginate={20}
            classes={"table table-smm table-striped"}
            export_csv
          />
        </div>
      </div>
    );
  }
}

class FADEContents extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <FADESummary json={this.props.json} />
        <FADETable json={this.props.json} />
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
        { label: "table", href: "table-tab" }
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
