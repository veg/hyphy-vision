var React = require("react"),
  ReactDOM = require("react-dom"),
  _ = require("underscore"),
  d3 = require("d3");

//import { Tree } from "./components/tree.jsx";
import { Header } from "./components/header.jsx";
import { DatamonkeyTable, DatamonkeyModelTable } from "./components/tables.jsx";
import { DatamonkeySeries, DatamonkeyGraphMenu } from "./components/graphs.jsx";
import { MainResult } from "./components/mainresult.jsx";
import { ResultsPage } from "./components/results_page.jsx";

class MultiHitContents extends React.Component {
  floatFormat = d3.format(".3f");

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

    this.state = {
      siteTableHeaders: siteTableHeaders,
      siteTableContent: siteTableContent,
      whichTable: whichTable,
      testResults: [],
      xaxis: "Site",
      yaxis: "Three-hit",
      copy_transition: false,
      pvalThreshold: 0.1,
      positively_selected: [],
      negatively_selected: [],
      pvals: {},
      input: null,
      testedSets: props.json.tested[0],
      uniqTestedSets: uniqTestedSets,
      colorMap: colorMap,
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

    this.setState({
      whichTable: whichTable
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

    this.setState({
      siteTableContent: sigContent,
      testResults: testResults,
      input: data.input,
      fits: data.fits,
      data: data
    });
  }

  definePlotData(x_label, y_label) {
    var x = _.map(this.state.mle_results, function(d) {
      return d[x_label];
    });

    var y = _.map(this.state.mle_results, function(d) {
      // plotting NaN or Infinity is tricky... we will replace these with zero for the sake of plotting.
      if (y_label == "omega") {
        var omega = d[y_label];
        if (omega >= 0 && omega < Infinity) {
          return omega;
        } else {
          return 0;
        }
      } else {
        return d[y_label];
      }
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

    if (item["p-value"] < this.state.pvalThreshold) {
      cardClasses = cardClasses + " border-primary";
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
                LRT : {this.floatFormat(item["LRT"])}
              </li>
              <li className="list-group-item">
                p-value : {this.floatFormat(item["p-value"])}
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

        <p className="alert alert-warning">This p-value is derived by</p>
      </div>
    );
  }

  getSummary() {
    return (
      <div>
        <div className="main-result">
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

    if (this.state.mle_results) {
      y_options = _.keys(this.state.mle_results[0]);
    }

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
        { label: "tree", href: "tree-tab" },
        { label: "fits", href: "fits-tab" }
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
