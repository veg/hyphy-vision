var React = require("react"),
  ReactDOM = require("react-dom"),
  _ = require("underscore");

import { Tree } from "./components/tree.jsx";
import { Header } from "./components/header.jsx";
import { InputInfo } from "./components/input_info.jsx";
import { DatamonkeyTable, DatamonkeyModelTable } from "./components/tables.jsx";
import { DatamonkeySeries, DatamonkeyGraphMenu } from "./components/graphs.jsx";
import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";
import CopyToClipboard from "react-copy-to-clipboard";


var FEL = React.createClass({
  definePlotData: function(x_label, y_label) {

    var x = _.map(this.state.mle_results, function(d) {
      return d[x_label];
    });

    var y = _.map(this.state.mle_results, function(d) {
      return d[y_label];
    });

    return { x: x, y: [y] };
  },

  float_format: d3.format(".3f"),

  formatHeadersForTable: function(mle) {
    return _.map(mle, function(d) {
      return _.object(["value", "abbr"], d);
    });
  },

  updateAxisSelection: function(e) {
    var state_to_update = {},
      dimension = e.target.dataset.dimension,
      axis = e.target.dataset.axis;

    state_to_update[axis] = dimension;
    this.setState(state_to_update);
  },

  updatePvalThreshold: function(e) {

    // Get number of positively and negatively selected sites by p-value threshold
    var pvalue_threshold = parseFloat(e.target.value);

    // Get number of positively and negatively selected sites by p-value threshold
    var mle_results = _.map(this.state.mle_results, function(d) {
      d["is_positive"] =
        parseFloat(d["beta"]) / parseFloat(d["alpha"]) > 1 &&
        parseFloat(d["p-value"]) <= pvalue_threshold;
      d["is_negative"] =
        parseFloat(d["beta"]) / parseFloat(d["alpha"]) < 1 &&
        parseFloat(d["p-value"]) <= pvalue_threshold;
      return d;
    });

    var positively_selected = _.filter(this.state.mle_results, function(d) {
      return d["is_positive"];
    });
    var negatively_selected = _.filter(this.state.mle_results, function(d) {
      return d["is_negative"];
    });

    // highlight mle_content with whether they are significant or not
    var mle_content = _.map(this.state.mle_results, function(d, key) {
      var classes = "";
      if (mle_results[key].is_positive) {
        classes = "positive-selection-row";
      } else if (mle_results[key].is_negative) {
        classes = "negative-selection-row";
      }
      return _.map(_.values(d), function(g) {
        return { value: g, classes: classes };
      }).slice(0,8);
    });

    this.setState({
      positively_selected: positively_selected,
      negatively_selected: negatively_selected,
      pvalue_threshold: pvalue_threshold,
      mle_results: mle_results,
      mle_content: mle_content
    });
  },

  getDefaultProps: function() {
    return {};
  },

  getInitialState: function() {
    return {
      mle_headers: [],
      mle_content: [],
      xaxis: "Site",
      yaxis: "alpha",
      copy_transition: false,
      pvalue_threshold: 0.1,
      positively_selected: [],
      negatively_selected: [],
      input: null,
      fits: {}
    };
  },

  formatBranchAnnotations: function(json) {
    // attach is_foreground to branch annotations
    var branch_annotations = d3.range(json.trees.length).map(i=>{
      return _.mapObject(json['tested'][i], (val, key)=>{
        return {is_foreground: val == 'test'};
      });
    });
    return branch_annotations;
  },

  processData: function(data){
    var mle = data["MLE"];

    // These variables are to be used for DatamonkeyTable
    var mle_headers = mle.headers || [];
    var mle_content = _.flatten(_.values(mle.content), true);
    mle_headers = this.formatHeadersForTable(mle_headers);

    _.each(mle_headers, function(d) {
      return (d["sortable"] = true);
    });

    // format content
    mle_content = _.map(mle_content, d => {
      return _.map(d, g => {
        return this.float_format(g);
      });
    });


    // add a partition entry to both headers and content
    mle_headers = [
      { value: "Partition", sortable: true, abbr: "Partition that site belongs to" }
    ].concat(mle_headers);

    var partition_column = d3.range(mle_content.length).map(d=>0);
    _.each(data['data partitions'], (val, key)=>{
      val.coverage[0].forEach(d=>{
        partition_column[d] = +key+1;
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

    var mle_results = _.map(mle_content, function(c) {
      return _.object(mle_header_values, c);
    });

    // Get number of positively and negatively selected sites by p-value threshold
    var mle_results = _.map(mle_results, d => {
      d["is_positive"] =
        parseFloat(d["beta"]) / parseFloat(d["alpha"]) > 1 &&
        parseFloat(d["p-value"]) <= this.state.pvalue_threshold;
      d["is_negative"] =
        parseFloat(d["beta"]) / parseFloat(d["alpha"]) < 1 &&
        parseFloat(d["p-value"]) <= this.state.pvalue_threshold;
      return d;
    });

    var positively_selected = _.filter(mle_results, function(d) {
      return d["is_positive"];
    });
    var negatively_selected = _.filter(mle_results, function(d) {
      return d["is_negative"];
    });

    // highlight mle_content with whether they are significant or not
    var mle_content = _.map(mle_results, function(d, key) {
      var classes = "";
      if (mle_results[key].is_positive) {
        classes = "positive-selection-row";
      } else if (mle_results[key].is_negative) {
        classes = "negative-selection-row";
      }
      return _.map(_.values(d), function(g) {
        return { value: g, classes: classes };
      }).slice(0, 8);
    });

    data['trees'] = _.map(data['input']['trees'], (val, key) => {
      var branchLengths = {
        'Global MG94xREV': _.mapObject(data['branch attributes'][key], val1 => val1['Global MG94xREV']),
        'Nucleotide GTR': _.mapObject(data['branch attributes'][key], val1 => val1['Nucleotide GTR'])
      };
      return {newickString: val, branchLengths: branchLengths};
    });

    data["fits"]["Global MG94xREV"][
      "branch-annotations"
    ] = this.formatBranchAnnotations(data);
    if(data["fits"]["Nucleotide GTR"]) {
      data["fits"]["Nucleotide GTR"][
        "branch-annotations"
      ] = this.formatBranchAnnotations(data);
    }

    if(data["fits"]["Nucleotide GTR"]){
      data["fits"]["Nucleotide GTR"]["Rate Distributions"] = {};      
    }

    this.setState({
      mle_headers: mle_headers,
      mle_content: mle_content,
      mle_results: mle_results,
      positively_selected: positively_selected,
      negatively_selected: negatively_selected,
      input: data.input,
      fits: data.fits,
      data: data
    });

  },

  loadFromServer: function() {
    var self = this;
    d3.json(this.props.url, (data) => {
      self.processData(data);
    });
  },

  onFileChange(e) {
    var self = this;
    var files = e.target.files; // FileList object

    if (files.length == 1) {
      var f = files[0];
      var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          var data = JSON.parse(this.result);
          self.processData(data);
        };
      })(f);
      reader.readAsText(f);
    }
    e.preventDefault();
  },

  getClipboard() {
    if (this.state.copy_transition) {
      return <i>Copied!</i>;
    } else {
      return (
        <a href="#">
          <i className="fa fa-clipboard" aria-hidden="true" />
        </a>
      );
    }
  },

  onCopy() {
    this.setState({ copy_transition: true });
    setTimeout(() => {
      this.setState({ copy_transition: false });
    }, 1000);
  },

  getSummary() {

    return (
      <div>
        <div className="main-result">
          <p>
            <CopyToClipboard text={this.getSummaryText()} onCopy={this.onCopy}>
              <span id="copy-it" className="pull-right">
                {this.getClipboard()}
              </span>
            </CopyToClipboard>

            <p>
              FEL <strong className="hyphy-highlight">
                {" "}found evidence
              </strong>{" "}
              of
            </p>
            <p>
              <i className="fa fa-plus-circle" aria-hidden="true">
                {" "}
              </i>{" "}
              pervasive positive/diversifying selection at
              <span className="hyphy-highlight">
                {" "}{this.state.positively_selected.length}{" "}
              </span>
              sites
            </p>
            <p>
              <i className="fa fa-minus-circle" aria-hidden="true">
                {" "}
              </i>{" "}
              pervasive negative/purifying selection at
              <span className="hyphy-highlight">
                {" "}{this.state.negatively_selected.length}{" "}
              </span>
              sites
            </p>
            <p>
              with p-value threshold of
              <input
                style={{display: "inline-block", marginLeft: "5px", width: "100px"}}
                className="form-control"
                type="number"
                defaultValue="0.1"
                step="0.01"
                min="0"
                max="1"
                onChange={this.updatePvalThreshold}
              />.
            </p>
          </p>
          <hr />
          <p>
            <small>
              See <a href="//hyphy.org/methods/selection-methods/#fel">
                here
              </a>{" "}
              for more information about the FEL method.
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
  },

  getSummaryText() {

    var no_selected =
      this.state.mle_content.length -
      this.state.positively_selected.length -
      this.state.negatively_selected.length;

    var summary_text = `FEL found evidence of pervasive positive/diversifying selection \
at ${this.state.positively_selected.length} sites/at any sites in your \
alignment. In addition, FEL found evidence with p-value ${this.state
      .pvalue_threshold} of pervasive negative/purifying \
selection at ${this.state.negatively_selected
      .length} sites/at any sites in your \
alignment. FEL did not find evidence for either positive or negative selection \
in the remaining ${no_selected} sites in your alignment.`;

    return summary_text;
  },

  componentWillMount: function() {
    this.loadFromServer();
  },

  componentDidUpdate(prevProps) {
    $("body").scrollspy({
      target: ".bs-docs-sidebar",
      offset: 50
    });
    $('[data-toggle="popover"]').popover();
    $('.dropdown-toggle').dropdown();
  },

  render: function() {

    var scrollspy_info = [
      { label: "summary", href: "summary-tab" },
      { label: "table", href: "table-tab" },
      { label: "plot", href: "plot-tab" },
      { label: "tree", href: "tree-tab" },
      { label: "fits", href: "fits-tab" }
    ];

    var { x: x, y: y } = this.definePlotData(
      this.state.xaxis,
      this.state.yaxis
    );

    var x_options = "Site";
    var y_options = ['alpha', 'beta', 'alpha=beta', 'LRT', 'p-value', 'Total branch length']; 
    var Summary = this.getSummary();

    var edgeColorizer = function(element, data, foreground_color) {

      var is_foreground = data.target.annotations.is_foreground,
        color_fill = foreground_color(0);

      element
        .style("stroke", is_foreground ? color_fill : "black")
        .style("stroke-linejoin", "round")
        .style("stroke-linejoin", "round")
        .style("stroke-linecap", "round");
    };

    var tree_settings = {
          omegaPlot: {},
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
          "hyphy-tree-legend-type": "discrete",
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
        {this.props.hyphy_vision ? <NavBar onFileChange={this.onFileChange} /> : ''}
        <div className="container">
          <div className="row">
            <ScrollSpy info={scrollspy_info} />

            <div className="col-sm-10">
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

              <div className="clearance" id="summary-tab"></div>
              <div id="results">
                <h3 className="list-group-item-heading">
                  <span id="summary-method-name">
                    Fixed Effects Likelihood
                  </span>
                  <br />
                  <span className="results-summary">results summary</span>
                </h3>
                <InputInfo input_data={this.state.input} json={this.state.data} hyphy_vision={this.props.hyphy_vision}/>
                {Summary}

                <div id="table-tab" className="row hyphy-row">
                  <div id="hyphy-mle-fits" className="col-md-12">
                    <Header title='FEL Table' popover='<p>Hover over a column header for a description of its content.</p>' />
                    <div className="col-md-6 alert positive-selection-row">
                      Positively selected sites with evidence are highlighted in
                      green.
                    </div>
                    <div className="col-md-6 alert negative-selection-row">
                      Negatively selected sites with evidence are highlighted in
                      black.
                    </div>
                    <DatamonkeyTable
                      headerData={this.state.mle_headers}
                      bodyData={this.state.mle_content}
                      classes={"table table-condensed table-striped"}
                      paginate={20}
                      export_csv
                    />
                  </div>
                </div>

                <div id="plot-tab" className="row hyphy-row">
                  <h3 className="dm-table-header">FEL Site Plot</h3>

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
                    width={$("#results").width()}
                    transitions={true}
                    doDots={true}
                  />
                </div>

                <div className="row">
                  <div id="tree-tab" className="col-md-12">
                    <Tree
                      models={models}
                      json={this.state.data}
                      settings={tree_settings}
                      method={'fel'}
                      color_gradient={["#00a99d", "#000000"]}
                      grayscale_gradient={["#444444","#000000"]}
                      multitree
                    />
                  </div>
                </div>

              <div className="row">
                <div className="col-md-12" id="fits-tab">
                  <DatamonkeyModelTable fits={this.state.fits} />
                  <p className="description">
                    This table reports a statistical summary of the models fit
                    to the data. Here, <strong>MG94</strong> refers to the
                    MG94xREV baseline model that infers a single &omega; rate
                    category per branch.
                  </p>
                </div>
              </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

// Will need to make a call to this
// omega distributions
function render_fel(url, element) {
  ReactDOM.render(<FEL url={url} />, document.getElementById(element));
}

function render_hv_fel(url, element) {
  ReactDOM.render(<FEL url={url} hyphy_vision />, document.getElementById(element));
}

module.exports = render_fel;
module.exports.hv = render_hv_fel;

