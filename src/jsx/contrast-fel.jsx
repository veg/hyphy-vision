var React = require("react"),
  ReactDOM = require("react-dom"),
  _ = require("underscore");

import { Tree } from "./components/tree.jsx";
import { Header } from "./components/header.jsx";
import { DatamonkeyTable, DatamonkeyModelTable } from "./components/tables.jsx";
import { DatamonkeySeries, DatamonkeyGraphMenu } from "./components/graphs.jsx";
import { MainResult } from "./components/mainresult.jsx";
import { ResultsPage } from "./components/results_page.jsx";

class ContrastFELContents extends React.Component {
  constructor(props) {
    super(props);

    let tested_sets = [];

    if (props.json.tested) {
      tested_sets = props.json.tested[0];
    }

    let uniq_tested_sets = _.uniq(_.values(tested_sets));
    let color_map = _.object(
      uniq_tested_sets,
      _.take(d3.scale.category10().range(), _.size(uniq_tested_sets))
    );

    this.state = {
      mle_headers: [],
      mle_content: [],
      xaxis: "Site",
      yaxis: "alpha",
      copy_transition: false,
      pvalue_threshold: 0.1,
      positively_selected: [],
      negatively_selected: [],
      pvals: {},
      input: null,
      tested_sets: props.json.tested[0],
      uniq_tested_sets: uniq_tested_sets,
      color_map: color_map,
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

  getPvals(mle_results) {
    //["alpha", "Synonymous substitution rate at a site"],
    //["beta (SOURCE)", "Non-synonymous substitution rate at a site for SOURCE branches"],
    //["beta (POOP)", "Non-synonymous substitution rate at a site for POOP branches"],
    //["beta (PEE)", "Non-synonymous substitution rate at a site for PEE branches"],
    //["beta (background)", "Non-synonymous substitution rate at a site for background branches"],
    //["subs (SOURCE)", "Substitutions mapped to SOURCE branches"],
    //["subs (POOP)", "Substitutions mapped to POOP branches"],
    //["subs (PEE)", "Substitutions mapped to PEE branches"],
    //["P-value (overall)", "P-value for the test that non-synonymous rates differ between any of the selected groups: SOURCE,POOP,PEE"],
    //["Q-value (overall)", "Q-value for the test that non-synonymous rates differ between any of the selected groups: SOURCE,POOP,PEE"],
    //["P-value for SOURCE vs POOP", "P-value for  the test that non-synonymous rates differ between SOURCE and POOP branches"],
    //["P-value for SOURCE vs PEE", "P-value for  the test that non-synonymous rates differ between SOURCE and PEE branches"],
    //["P-value for POOP vs PEE", "P-value for  the test that non-synonymous rates differ between POOP and PEE branches"],
    //["Permutation p-value", "Label permutation test for significant sites"],
    //["Total branch length", "The total length of branches contributing to inference at this site, and used to scale beta-alpha"]

    // Get keys
    let header_keys = _.keys(mle_results[0]);

    let pval_keys = _.filter(header_keys, d => d.indexOf("P-value") !== -1);

    // Get significant counts for each test
    let pval_counts = _.map(pval_keys, key => {
      return {
        count: _.filter(
          mle_results,
          mr => parseFloat(mr[key]) <= this.state.pvalue_threshold
        ).length
      };
    });

    let pvals = _.object(pval_keys, pval_counts);

    let regex = /P-value for (.*?) vs (.*?)$/;

    _.each(pval_keys, g => {
      let found = regex.exec(g);
      if (found) {
        pvals[g]["reference"] = found[1];
        pvals[g]["test"] = found[2];
      } else {
        pvals[g]["test"] = "Overall";
      }
    });

    return pvals;
  }

  processData(data) {
    const float_format = d3.format(".3f");
    const mle = data["MLE"];

    // These variables are to be used for DatamonkeyTable
    var mle_headers = mle.headers || [];
    var mle_content = _.flatten(_.values(mle.content), true);
    mle_headers = this.formatHeadersForTable(mle_headers);

    _.each(mle_headers, function(d) {
      return (d["sortable"] = true);
    });

    // Insert the omega (beta/alpha) into the content. The if statment is to make sure it doesn't get inserted twice.
    if (mle_content[0].length == 6) {
      _.map(mle_content, function(d) {
        var omega = d[1] / d[0];
        d.splice(2, 0, omega);
      });
    }

    // format content
    mle_content = _.map(mle_content, d => {
      return _.map(d, g => {
        return float_format(g);
      });
    });

    // add a partition entry to both headers and content
    mle_headers = [
      {
        value: "Partition",
        sortable: true,
        abbr: "Partition that site belongs to"
      }
    ].concat(mle_headers);

    var partition_column = d3.range(mle_content.length).map(d => 0);
    _.each(data["data partitions"], (val, key) => {
      val.coverage[0].forEach(d => {
        partition_column[d] = +key + 1;
      });
    });

    mle_content = _.map(mle_content, function(d, key) {
      return [partition_column[key]].concat(d);
    });

    // add a site count to both headers and content
    mle_headers = [
      { value: "Site", sortable: true, abbr: "Site Position" }
    ].concat(mle_headers);

    mle_content = _.map(mle_content, function(d, key) {
      var k = key + 1;
      return [k].concat(d);
    });

    // Create datatype that is a bit more manageable for use with DatamonkeySeries
    var mle_header_values = _.map(mle_headers, function(d) {
      return d.value;
    });

    var orig_mle_results = _.map(mle_content, function(c) {
      return _.object(mle_header_values, c);
    });

    // Map betas
    let betas = _.filter(
      _.keys(orig_mle_results[0]),
      g => g.indexOf("beta") !== -1
    );

    let beta_keys = _.map(betas, k => {
      let label = k.split(" ")[1].slice(1, -1);
      return _.object(["label", "value"], [label, betas[k]]);
    });

    let beta_obj = _.object(betas, beta_keys);

    // Get number of positively and negatively selected sites by p-value threshold
    let mle_results = _.map(orig_mle_results, d => {
      _.each(_.keys(beta_obj), key => {
        beta_obj[key]["is_positive"] =
          parseFloat(d[key]) / parseFloat(d["alpha"]) > 1 &&
          parseFloat(d["p-value"]) <= this.state.pvalue_threshold;
        beta_obj[key]["is_negative"] =
          parseFloat(d[key]) / parseFloat(d["alpha"]) < 1 &&
          parseFloat(d["p-value"]) <= this.state.pvalue_threshold;
      });

      d["betas"] = beta_obj;

      d.is_positive = _.some(d["betas"], e => e["is_positive"]);
      d.is_negative = _.some(d["betas"], e => e["is_negative"]);

      return d;
    });

    var positively_selected = _.filter(mle_results, function(d) {
      return _.some(d["betas"], e => e["is_positive"]);
    });

    var negatively_selected = _.filter(mle_results, function(d) {
      return _.some(d["betas"], e => e["is_negative"]);
    });

    // highlight mle_content with whether they are significant or not
    mle_content = _.map(mle_results, function(d, key) {
      var classes = "";
      if (mle_results[key].is_positive) {
        classes = "positive-selection-row";
      } else if (mle_results[key].is_negative) {
        classes = "negative-selection-row";
      }
      return _.map(_.values(d), function(g) {
        return { value: g, classes: classes };
      }).slice(0, mle_content[0].length);
    });

    data["trees"] = _.map(data["input"]["trees"], (val, key) => {
      var branchLengths = {
        "Global MG94xREV": _.mapObject(
          data["branch attributes"][key],
          val1 => val1["Global MG94xREV"]
        ),
        "Nucleotide GTR": _.mapObject(
          data["branch attributes"][key],
          val1 => val1["Nucleotide GTR"]
        )
      };

      return { newickString: val, branchLengths: branchLengths };
    });

    data["fits"]["Global MG94xREV"][
      "branch-annotations"
    ] = this.formatBranchAnnotations(data);
    if (data["fits"]["Nucleotide GTR"]) {
      data["fits"]["Nucleotide GTR"][
        "branch-annotations"
      ] = this.formatBranchAnnotations(data);
    }

    if (data["fits"]["Nucleotide GTR"]) {
      data["fits"]["Nucleotide GTR"]["Rate Distributions"] = {};
    }

    let pvals = this.getPvals(mle_results);

    this.setState({
      beta_obj: beta_obj,
      mle_headers: mle_headers,
      mle_content: mle_content,
      mle_results: mle_results,
      orig_mle_results: orig_mle_results,
      positively_selected: positively_selected,
      negatively_selected: negatively_selected,
      input: data.input,
      fits: data.fits,
      pvals: pvals,
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
    return _.map(mle, function(d) {
      return _.object(["value", "abbr"], d);
    });
  }

  updateAxisSelection = e => {
    var state_to_update = {},
      dimension = e.target.dataset.dimension,
      axis = e.target.dataset.axis;

    state_to_update[axis] = dimension;

    this.setState(state_to_update);
  };

  updatePvalThreshold = e => {
    // Get number of positively and negatively selected sites by p-value threshold
    let pvalue_threshold = parseFloat(e.target.value);

    this.setState(
      {
        pvalue_threshold: pvalue_threshold
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
    var no_selected =
      this.state.mle_content.length -
      this.state.positively_selected.length -
      this.state.negatively_selected.length;
    var summary_text =
      "Contrast-FEL found evidence of pervasive positive/diversifying selection at " +
      this.state.positively_selected.length +
      " sites in your alignment. In addition, Contrast-FEL found evidence with p-value " +
      this.state.pvalue_threshold +
      " of pervasive negative/purifying selection at " +
      this.state.negatively_selected.length +
      " sites in your alignment. Contrast-FEL did not find evidence for either positive or negative selection in the remaining " +
      no_selected +
      " sites in your alignment.";
    return summary_text;
  }

  // ** Found _6_ sites with different _overall_ dN/dS at p <= 0.35**
  // ** Found _11_ sites with different _SOURCE vs POOP_ dN/dS at p <= 0.35**
  // ** Found _6_ sites with different _SOURCE vs PEE_ dN/dS at p <= 0.35**
  // ** Found _1_ site with different _POOP vs PEE_ dN/dS at p <= 0.35**

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
            defaultValue={this.state.pvalue_threshold}
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

  getSummaryForRendering() {
    return (
      <p>
        <p>
          ContrastFEL{" "}
          <strong className="hyphy-highlight"> found evidence</strong> of
        </p>
        {this.getSummaryForSource()}
      </p>
    );
  }

  getSummary() {
    return (
      <div>
        <div className="main-result border border-primary border-left-0 border-right-0 mt-3">
          <p>
            <p>
              ContrastFEL{" "}
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
              for more information about the ContrastFEL method.
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
    var self = this;

    var { x: x, y: y } = this.definePlotData(
      this.state.xaxis,
      this.state.yaxis
    );

    var x_options = "Site";
    var y_options = ["alpha"];

    if (this.state.mle_results) {
      y_options = _.keys(this.state.mle_results[0]);
    }

    var edgeColorizer = (element, data) => {
      // Color based on partition
      let color =
        self.state.color_map[self.state.tested_sets[data.target.name]];

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

      _.each(self.state.color_map, (v, k) => {
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

    var models = {};
    if (this.state.data) {
      models = this.state.data.fits;
    }

    return (
      <div>
        <div
          id="datamonkey-fel-error"
          className="alert alert-danger alert-dismissible"
          role="alert"
          style={{ display: "none" }}
        >
          <button
            type="button"
            className="close"
            id="datamonkey-fel-error-hide"
          >
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Close</span>
          </button>
          <strong>Error!</strong> <span id="datamonkey-fel-error-text" />
        </div>

        <div id="results">
          <MainResult
            summary_for_clipboard={this.getSummaryForClipboard()}
            summary_for_rendering={this.getSummaryForRendering()}
            method_ref="http://hyphy.org/methods/selection-methods/#fel"
            citation_ref="//www.ncbi.nlm.nih.gov/pubmed/15703242"
            citation_number="PMID 15703242"
          />

          <div id="table-tab" className="row hyphy-row">
            <div id="hyphy-mle-fits" className="col-md-12">
              <Header
                title="ContrastFEL Table"
                popover="<p>Hover over a column header for a description of its content.</p>"
              />
              <DatamonkeyTable
                headerData={this.state.mle_headers}
                bodyData={this.state.mle_content}
                classes={"table table-smm table-striped"}
                paginate={20}
                export_csv
              />
            </div>
          </div>

          <div id="plot-tab">
            <h3 className="dm-table-header border-primary mb-3">Contrast-FEL Site Plot</h3>

            <DatamonkeyGraphMenu
              x_options={x_options}
              y_options={y_options}
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
          </div>

          <div id="tree-tab">
            <Tree
              models={models}
              json={this.state.data}
              settings={tree_settings}
              method={"fel"}
              color_gradient={["#00a99d", "#000000"]}
              grayscale_gradient={["#444444", "#000000"]}
              multitree
            />
          </div>

          <div className="col-md-12" id="fits-tab">
            <DatamonkeyModelTable fits={this.state.fits} />
            <p className="description">
              This table reports a statistical summary of the models fit to the
              data. Here, <strong>MG94</strong> refers to the MG94xREV baseline
              model that infers a single &omega; rate category per branch.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export function ContrastFEL(props) {
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
      methodName="Contrast-FEL"
      fasta={props.fasta}
      originalFile={props.originalFile}
      analysisLog={props.analysisLog}
    >
      {ContrastFELContents}
    </ResultsPage>
  );
}

export default function render_contrast_fel(
  data,
  element,
  fasta,
  originalFile,
  analysisLog
) {
  ReactDOM.render(
    <ContrastFEL
      data={data}
      fasta={fasta}
      originalFile={originalFile}
      analysisLog={analysisLog}
    />,
    document.getElementById(element)
  );
}
