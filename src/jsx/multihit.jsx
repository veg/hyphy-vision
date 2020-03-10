var React = require("react"),
  ReactDOM = require("react-dom"),
  _ = require("underscore"),
  d3 = require("d3");

import { Header } from "./components/header.jsx";
import { DatamonkeyTable } from "./components/tables.jsx";
import { DatamonkeySeries, DatamonkeyGraphMenu } from "./components/graphs.jsx";
import { MainResult } from "./components/mainresult.jsx";
import { ResultsPage } from "./components/results_page.jsx";
import { Circos } from "./components/circos.jsx";
import { CHORDS } from "./components/tracks.js";

import translationTable from "./fixtures/translation_table.json";
import layout from "./fixtures/months.json";
import heatmap from "./fixtures/heatmap.json";
import example from "./fixtures/example.json";

class MultiHitContents extends React.Component {
  floatFormat = d3.format(".3f");

  prepareForCircos(subs) {
    let counts = {};

    // Merge all objects together
    let transitions = _.values(subs);

    _.each(transitions, source => {
      _.each(source, (targets, sourceKey) => {
        if (!counts[sourceKey]) {
          counts[sourceKey] = {};
        }

        _.each(targets, (target, targetKey) => {
          if (!counts[sourceKey][targetKey]) {
            counts[sourceKey][targetKey] = 0;
          }

          let c = _.keys(target).length;
          counts[sourceKey][targetKey] += c;
        });
      });
    });

    let chordData = [];

    _.each(counts, (targets, sourceKey) => {
      _.each(targets, (target, targetKey) => {
        chordData.push({
          count: target,
          source: {
            id: "codon-" + sourceKey,
            start: 0,
            end: 10,
            codon: sourceKey
          },
          target: {
            id: "codon-" + targetKey,
            start: 0,
            end: 10,
            codon: targetKey
          }
        });
      });
    });

    // get unique sources and targets from counts
    let codons = _.uniq(
      _.flatten(_.map(chordData, d => [d.source.codon, d.target.codon]))
    );
    let chordLayout = _.map(codons, this.getCodonLayout);

    console.log(chordLayout);

    return { chordLayout: chordLayout, chordData: chordData };
  }

  getCodonLayout(codon) {
    // Create layout from chord data
    //{
    //  "len": 756,
    //  "color": "rgb(150, 61, 179)",
    //  "label": "GCA",
    //  "id": "codon-GCA",
    //  "aa": "A"
    //}

    let idx = {};
    let c = 0;

    _.each(translationTable, (aa, i) => {
      idx[aa] = c / 20;
      c++;
    });

    let codonColors = d3.scale.category20();

    let len = 500;
    let color = codonColors(idx[translationTable[codon]]);
    let label = codon;
    let id = "codon-" + codon;
    let aa = translationTable[codon];

    let codonLayout = {
      len: len,
      color: color,
      label: label,
      id: id,
      aa: aa
    };

    return codonLayout;
  }

  constructor(props) {
    super(props);

    let testedSets = [];

    if (props.json.tested) {
      testedSets = props.json.tested[0];
    }

    let uniqTestedSets = _.uniq(_.values(testedSets));

    let colorMap = _.object(
      uniqTestedSets,
      _.take(d3.scale.category10().range(), _.size(uniqTestedSets))
    );

    // These variables are to be used for DatamonkeyTable
    const erHeaders = [
      ["Site", "Site Index"],
      ['<i class="fas fa-dice-three fa-3x"></i>', "Three-hit"],
      [
        '<i class="fas fa-dice-three fa-2x"></i> vs. <i class="fas fa-dice-two fa-2x"></i>',
        "Three-hit islands vs 2-hit"
      ],
      [
        '<i class="fas fa-compass fa-3x"></i>',
        "Three-hit vs three-hit islands"
      ],
      ['<i class="fas fa-dice-two fa-3x"></i>', "Two-hit"]
    ];

    const siteLogLHeaders = [
      ["Site", "Site Index"],
      [
        '<i class="fas fa-dice-three fa-2x"></i> and <i class="fas fa-dice-two fa-2x"></i>',
        "MG94 with double and triple instantaneous substitutions"
      ],
      [
        '<i class="fas fa-compass fa-3x"></i>',
        "MG94 with double and triple instantaneous substitutions [only synonymous islands]"
      ],
      [
        '<i class="fas fa-dice-two fa-3x"></i>',
        "MG94 with double instantaneous substitutions"
      ],
      ['<i class="fas fa-dice-one fa-3x"></i>', "Standard MG94"]
    ];

    let siteTableHeaders = {
      "Evidence Ratios": this.formatHeadersForTable(erHeaders),
      "Site Log Likelihood": this.formatHeadersForTable(siteLogLHeaders)
    };

    let siteTableContent = {
      "Evidence Ratios": {},
      "Site Log Likelihood": {}
    };

    let whichTable = "Evidence Ratios";

    this.toggleTableSelection = this.toggleTableSelection.bind(this);

    let circosConfiguration = {
      innerRadius: 300,
      outerRadius: 350,
      cornerRadius: 0,
      gap: 0.04,
      labels: {
        display: true,
        position: "center",
        size: "14",
        color: "black",
        radialOffset: 60
      },
      ticks: {
        display: false,
        color: "grey",
        spacing: 10000000,
        labels: true,
        labelSpacing: 10,
        labelSuffix: "",
        labelDenominator: 1,
        labelDisplay0: true,
        labelSize: 10,
        labelColor: "#000",
        labelFont: "default",
        majorSpacing: 5,
        size: Object
      },
      events: {},
      opacity: 1,
      onClick: null,
      onMouseOver: null,
      zIndex: 100
    };

    this.state = {
      siteTableHeaders: siteTableHeaders,
      siteTableContent: siteTableContent,
      whichTable: whichTable,
      testResults: [],
      xaxis: "Site",
      yaxis: "Three-hit",
      xOptions: ["Site"],
      yOptions: [],
      copy_transition: false,
      pvalThreshold: 0.1,
      positively_selected: [],
      negatively_selected: [],
      pvals: {},
      input: null,
      testedSets: props.json.tested[0],
      uniqTestedSets: uniqTestedSets,
      colorMap: colorMap,
      circosLayout: [],
      circosChordData: [],
      circosConfiguration: circosConfiguration,
      fits: {}
    };
  }

  componentDidMount() {
    this.processData(this.props.json);
  }

  componentDidUpdate() {}

  componentWillReceiveProps(nextProps) {
    this.processData(nextProps.json);
  }

  toggleTableSelection(event) {
    let whichTable = event.target.children[0].dataset["name"];

    let yOptions = _.keys(this.state.data[whichTable]);
    let yaxis = this.state.yaxis;

    if (yOptions.length) {
      yaxis = yOptions[0];
    }

    this.setState({
      whichTable: whichTable,
      yOptions: yOptions,
      yaxis: yaxis
    });
  }

  processData(data) {
    const floatFormat = d3.format(".3f");

    // Prepare values for siteTable
    let erValues = _.map(_.values(data["Evidence Ratios"]), d => d[0]);

    erValues = _.map(erValues, d => {
      return _.map(d, g => {
        return floatFormat(g);
      });
    });

    let siteLogLValues = _.map(
      _.values(data["Site Log Likelihood"]),
      d => d[0]
    );

    siteLogLValues = _.map(siteLogLValues, d => {
      return _.map(d, g => {
        return floatFormat(g);
      });
    });

    let sigContent = {
      "Evidence Ratios": _.map(_.zip(...erValues), (d, i) => [i + 1].concat(d)),
      "Site Log Likelihood": _.map(_.zip(...siteLogLValues), (d, i) =>
        [i + 1].concat(d)
      )
    };

    // Prepare values for summary component
    const testResults = data["test results"];

    let yOptions = _.keys(data[this.state.whichTable]);
    let yaxis = this.state.yaxis;

    let substitutionMatrix = data["Site substitutions"];
    let { chordLayout, chordData } = this.prepareForCircos(substitutionMatrix);

    if (yOptions.length) {
      yaxis = yOptions[0];
    }

    this.setState({
      circosLayout: chordLayout,
      circosChordData: chordData,
      //circosLayout : example[0],
      //circosChordData : example[1],
      siteTableContent: sigContent,
      testResults: testResults,
      input: data.input,
      fits: data.fits,
      yOptions: yOptions,
      yaxis: yaxis,
      data: data
    });
  }

  definePlotData(x_label, y_label) {
    let x = [];
    let y = [];

    if (!this.state.data) {
      return { x: x, y: [y] };
    }

    // get which table
    let chartType = this.state.whichTable;
    let chartVals = this.state.data[chartType][y_label][0];

    if (!this.state.data[chartType]) {
      return { x: x, y: [y] };
    }

    x = _.range(1, chartVals.length);

    y = _.map(chartVals, d => {
      return this.floatFormat(d);
    });

    return { x: x, y: [y] };
  }

  formatHeadersForTable(mle) {
    let newHeaders = _.map(mle, function(d) {
      return _.object(["value", "abbr"], d);
    });
    _.each(newHeaders, function(d) {
      return (d["sortable"] = true);
    });

    return newHeaders;
  }

  updateAxisSelection = e => {
    let state_to_update = {},
      dimension = e.target.dataset.dimension,
      axis = e.target.dataset.axis;

    state_to_update[axis] = dimension;

    this.setState(state_to_update);
  };

  updatePvalThreshold = e => {
    // Get number of positively and negatively selected sites by p-value threshold
    let pvalThreshold = parseFloat(e.target.value);

    this.setState(
      {
        pvalThreshold: pvalThreshold
      },
      () => {
        this.processData(this.props.json);
      }
    );
  };

  formatBranchAnnotations(json) {
    // attach is_foreground to branch annotations
    var branch_annotations = d3.range(json.trees.length).map(i => {
      return _.mapObject(json["tested"][i], (val, key) => {
        return { is_foreground: val == "test" };
      });
    });
    return branch_annotations;
  }

  getSummaryForClipboard() {
    return <div></div>;
  }

  getPvalSummary(pval_item) {
    let ref_str = pval_item.test;

    if (pval_item.reference) {
      ref_str += " vs " + pval_item.reference;
    }

    return (
      <p>
        <i className="fa fa-search" aria-hidden="true">
          {" "}
        </i>{" "}
        Found
        <span className="hyphy-highlight"> {pval_item.count} </span>
        sites with different <strong>{ref_str}</strong> dN/dS {}
      </p>
    );
  }

  getSummaryForSource() {
    var items = " ";

    if (_.keys(this.state.pvals).length) {
      items = _.map(_.values(this.state.pvals), this.getPvalSummary, this);
    }

    return (
      <div>
        {items}
        <p>
          with p-value threshold of
          <input
            style={{
              display: "inline-block",
              marginLeft: "5px",
              width: "100px"
            }}
            className="form-control"
            type="number"
            defaultValue={this.state.pvalThreshold}
            step="0.01"
            min="0"
            max="1.0"
            onChange={this.updatePvalThreshold}
          />
          .
        </p>
      </div>
    );
  }

  getTestResultCard(title, item) {
    if (!item) {
      return <div></div>;
    }

    // card classes
    let cardClasses = "card bg-light mb-3";
    let pBadgeClasses = "badge";

    if (item["p-value"] < this.state.pvalThreshold) {
      cardClasses = cardClasses + " border-primary";
      pBadgeClasses = pBadgeClasses + " badge-primary";
    }

    return (
      <div className="col-sm-4">
        <div className={cardClasses} style={{ maxWidth: "18rem" }}>
          <div
            className="card-header"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <div className="card-body">
            <ul className="list-group">
              <li className="list-group-item">
                <span className="badge badge-secondary">LRT</span>{" "}
                {this.floatFormat(item["LRT"])}
              </li>
              <li className="list-group-item">
                <span className={pBadgeClasses}>p-value</span>{" "}
                {this.floatFormat(item["p-value"])}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  getSummaryForRendering() {
    // {this.getSummaryForSource()}

    return (
      <div className="container">
        <h3>Likelihood Test Results</h3>
        <div className="row">
          {this.getTestResultCard(
            '<i class="fas fa-dice-three"></i> Triple-hit vs single-hit',
            this.state.testResults["Triple-hit vs single-hit"]
          )}
          {this.getTestResultCard(
            '<i class="fas fa-dice-three"></i> vs. <i class="fas fa-dice-two"></i> Triple-hit vs double-hit',
            this.state.testResults["Triple-hit vs double-hit"]
          )}
          {this.getTestResultCard(
            '<i class="fas fa-compass"></i> Triple-hit vs. Triple-hit-island',
            this.state.testResults["Triple-hit vs Triple-hit-island"]
          )}
        </div>
        <div className="row">
          {this.getTestResultCard(
            '<i class="fas fa-dice-two"></i> Double-hit vs Single-hit Test',
            this.state.testResults["Double-hit vs single-hit"]
          )}
          {this.getTestResultCard(
            "Triple-hit-island vs double-hit",
            this.state.testResults["Triple-hit-island vs double-hit"]
          )}
        </div>
      </div>
    );
  }

  getSummary() {
    return (
      <div>
        <div className="main-result border border-primary border-left-0 border-right-0 mt-3">
          <p>
            <p>
              MultiHit{" "}
              <strong className="hyphy-highlight"> found evidence</strong> of
            </p>
            <p>
              <i className="fa fa-plus-circle" aria-hidden="true">
                {" "}
              </i>{" "}
              pervasive positive/diversifying selection at
              <span className="hyphy-highlight">
                {" "}
                {this.state.positively_selected.length}{" "}
              </span>
              sites
            </p>
            <p>
              <i className="fa fa-minus-circle" aria-hidden="true">
                {" "}
              </i>{" "}
              pervasive negative/purifying selection at
              <span className="hyphy-highlight">
                {" "}
                {this.state.negatively_selected.length}{" "}
              </span>
              sites
            </p>
            <p>
              with p-value threshold of
              <input
                style={{
                  display: "inline-block",
                  marginLeft: "5px",
                  width: "100px"
                }}
                className="form-control"
                type="number"
                defaultValue="0.1"
                step="0.01"
                min="0"
                max="1"
                onChange={this.updatePvalThreshold}
              />
              .
            </p>
          </p>
          <hr />
          <p>
            <small>
              See <a href="//hyphy.org/methods/selection-methods/#fel">here</a>{" "}
              for more information about the MultiHit method.
              <br />
              Please cite PMID{" "}
              <a href="//www.ncbi.nlm.nih.gov/pubmed/15703242">15703242</a> if
              you use this result in a publication, presentation, or other
              scientific work.
            </small>
          </p>
        </div>
      </div>
    );
  }

  render() {
    let newick = this.props.json.input.trees[0];

    var { x: x, y: y } = this.definePlotData(
      this.state.xaxis,
      this.state.yaxis
    );

    const edgeColorizer = (element, data) => {
      // Color based on partition
      let color = this.state.colorMap[this.state.testedSets[data.target.name]];

      element
        .style("stroke", color)
        .style("stroke-linejoin", "round")
        .style("stroke-linejoin", "round")
        .style("stroke-linecap", "round");
    };

    var legendCreator = function() {
      let svg = this.svg;

      if (!this.state.omega_color || !this.state.omega_scale) {
        return;
      }

      var margins = {
        bottom: 30,
        top: 15,
        left: 0,
        right: 0
      };

      d3.selectAll("#color-legend").remove();

      var dc_legend = svg
        .append("g")
        .attr("id", "color-legend")
        .attr("class", "dc-legend")
        .attr(
          "transform",
          "translate(" + margins["left"] + "," + margins["top"] + ")"
        );

      let cnt = 0;

      _.each(self.state.colorMap, (v, k) => {
        var color_fill = v;

        var legend_item = dc_legend
          .append("g")
          .attr("class", "dc-legend-item")
          .attr("transform", "translate(0," + cnt * 20 + ")");

        legend_item
          .append("rect")
          .attr("width", "13")
          .attr("height", "13")
          .attr("fill", color_fill);

        legend_item
          .append("text")
          .attr("x", "15")
          .attr("y", "11")
          .text(k);

        cnt = cnt + 1;
      });
    };

    var tree_settings = {
      "tree-options": {
        /* value arrays have the following meaning
                    [0] - the value of the attribute
                    [1] - does the change in attribute value trigger tree re-layout?
                */
        "hyphy-tree-model": ["Unconstrained model", true],
        "hyphy-tree-highlight": ["RELAX.test", false],
        "hyphy-tree-branch-lengths": [false, true],
        "hyphy-tree-hide-legend": [true, false],
        "hyphy-tree-fill-color": [true, false]
      },
      "hyphy-tree-legend-type": legendCreator,
      "suppress-tree-render": false,
      "chart-append-html": true,
      edgeColorizer: edgeColorizer
    };

    let chordData = this.state.circosChordData;

    return (
      <div>
        <div
          id="datamonkey-error"
          className="alert alert-danger alert-dismissible"
          role="alert"
          style={{ display: "none" }}
        >
          <button type="button" className="close" id="datamonkey-error-hide">
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Close</span>
          </button>
          <strong>Error!</strong> <span id="datamonkey-error-text" />
        </div>

        <div id="results">
          <MainResult
            summary_for_clipboard={this.getSummaryForClipboard()}
            summary_for_rendering={this.getSummaryForRendering()}
            method_ref="http://hyphy.org/methods/selection-methods/#multi-hit"
            citation_ref="//www.ncbi.nlm.nih.gov/pubmed/15703242"
            citation_number="PMID 15703242"
          />

          <div id="table-tab" className="row hyphy-row">
            <div id="hyphy-mle-fits" className="col-md-12">
              <Header
                title="Model Test Statistics Per Site"
                popover="<p>Hover over a column header for a description of its content.</p>"
              />

              <DatamonkeyGraphMenu
                x_options={this.state.xOptions}
                y_options={this.state.yOptions}
                axisSelectionEvent={this.updateAxisSelection}
                export_images
              />

              <DatamonkeySeries
                x={x}
                y={y}
                x_label={this.state.xaxis}
                y_label={this.state.yaxis}
                marginLeft={50}
                width={
                  $("#results").width() == null ? 935 : $("#results").width()
                }
                transitions={true}
                doDots={true}
              />

              <div className="row">
                <div
                  className="col-md-12 mt-3 mb-3 btn-group btn-group-toggle"
                  data-toggle="buttons"
                  onClick={this.toggleTableSelection}
                >
                  <label
                    className="col-md-6 btn btn-secondary active"
                    onClick={this.toggleTableSelection}
                  >
                    <input
                      type="radio"
                      name="options"
                      data-name="Evidence Ratios"
                      id="Evidence Ratios"
                      defaultChecked={true}
                    />{" "}
                    Evidence Ratios
                  </label>
                  <label
                    className="col-md-6 btn btn-secondary"
                    onClick={this.toggleTableSelection}
                  >
                    <input
                      type="radio"
                      name="options"
                      data-name="Site Log Likelihood"
                      id="Site Log Likelihood"
                    />{" "}
                    Site Log Likelihood
                  </label>
                </div>
              </div>

              <DatamonkeyTable
                headerData={this.state.siteTableHeaders[this.state.whichTable]}
                bodyData={this.state.siteTableContent[this.state.whichTable]}
                classes={"table table-smm table-striped"}
                paginate={20}
                export_csv
              />

              <Header
                title="Circos Plot"
                popover="<p>Hover over a column header for a description of its content.</p>"
              />

              <div id="plot-tab" className="offset-1">
                <Circos
                  size={800}
                  layout={this.state.circosLayout}
                  config={this.state.circosConfiguration}
                  tracks={[
                    {
                      id: "flow",
                      type: CHORDS,
                      data: chordData,
                      config: { color: "grey", opacity: 0.5 }
                    }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function MultiHit(props) {
  return (
    <ResultsPage
      data={props.data}
      scrollSpyInfo={[
        { label: "summary", href: "summary-tab" },
        { label: "table", href: "table-tab" },
        { label: "plot", href: "plot-tab" },
        { label: "tree", href: "tree-tab" }
      ]}
      methodName="Multi-Hit"
      fasta={props.fasta}
      originalFile={props.originalFile}
      analysisLog={props.analysisLog}
    >
      {MultiHitContents}
    </ResultsPage>
  );
}

function render_multihit(data, element, fasta, originalFile, analysisLog) {
  ReactDOM.render(
    <MultiHit
      data={data}
      fasta={fasta}
      originalFile={originalFile}
      analysisLog={analysisLog}
    />,
    document.getElementById(element)
  );
}

export { MultiHit, render_multihit };
