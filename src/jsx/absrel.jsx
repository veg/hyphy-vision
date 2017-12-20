var _ = require("underscore");

require("phylotree");
require("phylotree.css");

import React from "react";
import ReactDOM from "react-dom";
import { DatamonkeyModelTable } from "./components/tables.jsx";
import { TreeSummary } from "./components/tree_summary.jsx";
import { Tree } from "./components/tree.jsx";
import { BranchTable } from "./components/branch_table.jsx";
import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";
import { InputInfo } from "./components/input_info.jsx";


var BSRELSummary = React.createClass({
  float_format: d3.format(".2f"),

  countBranchesTested: function(branches_tested) {
    if (branches_tested) {
      return branches_tested.split(";").length;
    } else {
      return 0;
    }
  },

  getBranchesWithEvidence: function(test_results) {
    return _.filter(test_results, function(d) {
      return d.p <= 0.05;
    }).length;
  },

  getTestBranches: function(test_results) {
    return _.filter(test_results, function(d) {
      return d.tested > 0;
    }).length;
  },

  getTotalBranches: function(test_results) {
    return _.keys(test_results).length;
  },

  getInitialState: function() {
    var self = this;

    return {
      branches_with_evidence: this.getBranchesWithEvidence(
        self.props.test_results
      ),
      test_branches: this.getTestBranches(self.props.test_results),
      total_branches: this.getTotalBranches(self.props.test_results)
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      branches_with_evidence: this.getBranchesWithEvidence(
        nextProps.test_results
      ),
      test_branches: this.getTestBranches(nextProps.test_results),
      total_branches: this.getTotalBranches(nextProps.test_results)
    });
  },

  render: function() {
    var self = this,
      user_message,
      was_evidence = self.state.branches_with_evidence > 0;

    if (was_evidence) {
      user_message = (
        <p className="list-group-item-text label_and_input">
          aBSREL <strong className="hyphy-highlight">found evidence</strong> of
          episodic diversifying selection on{" "}
          <span className="hyphy-highlight">
            <strong>{self.state.branches_with_evidence}</strong>
          </span>{" "}
          out
          of{" "}
          <span className="hyphy-highlight">
            <strong>{self.state.total_branches}</strong>
          </span>{" "}
          branches in your phylogeny.
        </p>
      );
    } else {
      user_message = (
        <p className="list-group-item-text label_and_input">
          aBSREL <strong>found no evidence</strong> of episodic diversifying
          selection in your phylogeny.
        </p>
      );
    }

    return (
      <div className="row">
      <div className="clearance" id="summary-div"></div>
        <div className="col-md-12">
          <h3 className="list-group-item-heading">
            <span id="summary-method-name">adaptive Branch Site REL</span>
            <br />
            <span className="results-summary">results summary</span>
          </h3>
      </div>
      
      
        <div className="col-md-12">
          <InputInfo input_data={this.props.input_data} json={this.props.json} hyphy_vision={this.props.hyphy_vision}/>
        </div>
      
      
        <div className="col-md-12">
          <div className="main-result">
            {user_message}
            <p>
              A total of{" "}
              <strong className="hyphy-highlight">
                {self.state.test_branches}
              </strong>{" "}
              branches were formally tested for diversifying selection.
              Significance was assessed using the Likelihood Ratio Test at a
              threshold of p ≤ 0.05, after correcting for multiple testing.
              Significance and number of rate categories inferred at each branch
              are provided in the <a href="#table-tab">detailed results</a>{" "}
              table.
            </p>
            <hr />
            <p>
              <small>
                See{" "}
                <a href="http://hyphy.org/methods/selection-methods/#absrel">
                  here
                </a>{" "}
                for more information about the aBSREL method.
                <br />Please cite{" "}
                <a
                  href="http://www.ncbi.nlm.nih.gov/pubmed/25697341"
                  id="summary-pmid"
                  target="_blank"
                >
                  PMID 25697341
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
});

var BSREL = React.createClass({
  float_format: d3.format(".2f"),

  processData: function(data){
    var test_results = _.mapObject(data['branch attributes']['0'], (val, key) => {
      var tested = val.LRT != null;

      return {
        LRT: tested ? val.LRT : 'test not run',
        p: tested ? val['Corrected P-value'] : 1,
        'uncorrected p': tested ? val['Uncorrected P-value'] : 1,
        tested: tested
      };
    });

    data["fits"]["Full adaptive model"][
      "branch-annotations"
    ] = this.formatBranchAnnotations(data, "Full adaptive model");

    data["fits"]["Baseline MG94xREV"]["branch-annotations"] = this.formatBranchAnnotations(
      data,
      "Baseline MG94xREV"
    );

    // GH-#18 Add omega annotation tag
    data["fits"]["Baseline MG94xREV"]["annotation-tag"] = "ω";
    data["fits"]["Full adaptive model"]["annotation-tag"] = "ω";

    data["trees"] = {
      branchLengths: {
        "Baseline MG94xREV": _.mapObject(data["branch attributes"][0], val=>val["Baseline MG94xREV"]),
        "Full adaptive model": _.mapObject(data["branch attributes"][0], val=>val["Full adaptive model"])
      }
    }
    _.each(_.keys(data.fits), model=>{delete data.fits[model]['Rate Distributions'];});
    this.setState({
      annotations: data["fits"]["Full adaptive model"]["branch-annotations"],
      json: data,
      pmid: data["PMID"],
      fits: data["fits"],
      full_model: data["fits"]["Full adaptive model"],
      test_results: test_results,
      input_data: data["input"],
      tree: d3.layout.phylotree()(data.input['trees'][0]),
      branch_attributes: data["branch attributes"][0]
    });
  },

  loadFromServer: function() {
    var self = this;
    d3.json(self.props.url, function(data) {
      self.processData(data);
    });
  },

  omegaColorGradient: ["#000000", "#888888", "#DFDFDF", "#77CCC6", "#00a99d"],
  omegaGrayScaleGradient: [
    "#DDDDDD",
    "#AAAAAA",
    "#888888",
    "#444444",
    "#000000"
  ],

  getDefaultProps: function() {},

  getInitialState: function() {
    var edgeColorizer = function(element, data, omega_color) {
      var svg = d3.select("#tree_container svg"),
        svg_defs = d3.select(".phylotree-definitions");

      if (svg_defs.empty()) {
        svg_defs = svg.append("defs").attr("class", "phylotree-definitions");
      }

      // clear existing linearGradients
      var omega_format = d3.format(".3r"),
        prop_format = d3.format(".2p");

      var createBranchGradient = function(node) {
        function generateGradient(
          svg_defs,
          grad_id,
          annotations,
          already_cumulative
        ) {
          var current_weight = 0;
          var this_grad = svg_defs.append("linearGradient").attr("id", grad_id);

          annotations.forEach(function(d, i) {
            if (d.prop) {
              var new_weight = current_weight + d.prop;
              this_grad
                .append("stop")
                .attr("offset", "" + current_weight * 100 + "%")
                .style("stop-color", omega_color(d.omega));
              this_grad
                .append("stop")
                .attr("offset", "" + new_weight * 100 + "%")
                .style("stop-color", omega_color(d.omega));
              current_weight = new_weight;
            }
          });
        }

        // Create svg definitions
        if (self.gradient_count == undefined) {
          self.gradient_count = 0;
        }

        if (node.annotations) {
          if (node.annotations.length == 1) {
            node["color"] = omega_color(node.annotations[0]["omega"]);
          } else {
            self.gradient_count++;
            var grad_id = "branch_gradient_" + self.gradient_count;
            generateGradient(svg_defs, grad_id, node.annotations.omegas);
            node["grad"] = grad_id;
          }
        }
      };

      var annotations = data.target.annotations,
        alpha_level = 0.05,
        tooltip = "<b>" + data.target.name + "</b>";

      if (annotations) {
        annotations.omegas.forEach(function(d, i) {
          var omega_value = d.omega > 1e20 ? "&infin;" : omega_format(d.omega),
            omega_weight = prop_format(d.prop);

          tooltip +=
            "<br/>&omega;<sub>" +
            (i + 1) +
            "</sub> = " +
            omega_value +
            " (" +
            omega_weight +
            ")";
        });

        tooltip += "<br/><i>p = " + omega_format(annotations["p"]) + "</i>";
        $(element[0][0]).mouseover(e=>{
          $('#tooltip_container').css({'display':'block','opacity':0})
            .animate({'opacity':1},250)
            .css('left', e.pageX)
            .css('top', e.pageY)
            .html(tooltip);
        });

        $(element[0][0]).mouseout(e=>{
          $('#tooltip_container').css({'display':'none'})
            .html('');
        });

        createBranchGradient(data.target);

        if (data.target.grad) {
          element.style("stroke", "url(#" + data.target.grad + ")");
        } else {
          element.style("stroke", data.target.color);
        }

        element
          .style("stroke-width", annotations["p"] <= alpha_level ? "12" : "5")
          .style("stroke-linejoin", "round")
          .style("stroke-linecap", "round");
      }
    };

    var tree_settings = {
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
      edgeColorizer: edgeColorizer
    };

    return {
      annotations: null,
      json: null,
      pmid: null,
      model_fits: {},
      settings: tree_settings,
      test_results: null,
      input_data: null,
      tree: null,
      branch_attributes: null
    };

  },
  componentWillMount: function() {
    this.loadFromServer();
  },

  componentDidMount: function() {
    this.setEvents();
  },

  setEvents: function() {
    var self = this;

    $("#dm-file").on("change", function(e) {
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
    });
  },

  formatBranchAnnotations: function(json, model) {
    var branch_annotations = _.mapObject(json['branch attributes']['0'], (val, key) =>{
      var tested = val.LRT != null,
        omegas; 
      if(model=='Full adaptive model'){
        omegas = val['Rate Distributions'].map(entry=>({ omega: entry[0], prop: entry[1]}));
      }else{
        omegas = [{omega: val['Baseline MG94xREV omega ratio'], prop: 1}];
      }
      return {
        LRT: tested ? val.LRT : 'test not run',
        omegas: omegas,
        p: tested ? val['Corrected P-value'] : 1,
        'uncorrected p': tested ? val['Uncorrected P-value'] : 1,
        tested: tested
      };
    });
    return branch_annotations;
  },

  componentDidUpdate(prevProps, prevState) {
    $("body").scrollspy({
      target: ".bs-docs-sidebar",
      offset: 50
    });
    $('[data-toggle="popover"]').popover();
    $('.dropdown-toggle').dropdown();
  },

  render: function() {
    var self = this;

    var scrollspy_info = [
      { label: "summary", href: "summary-tab" },
      { label: "tree", href: "hyphy-tree-summary" },
      { label: "table", href: "table-tab" },
      { label: "model fits", href: "hyphy-model-fits" }
    ];

    var models = {};
    if (!_.isNull(self.state.json)) {
      // List full adaptive model first
      models = {
        "Full adaptive model": self.state.json.fits["Full adaptive model"],
        "Baseline MG94xREV": self.state.json.fits["Baseline MG94xREV"]
      };
    }
    return (
      <div>
        {self.props.hyphy_vision ? <NavBar /> : ''}
        <div className="container">
          <div className="row">
            <ScrollSpy info={scrollspy_info} />

            <div className="col-sm-10">
              <div
                id="datamonkey-absrel-error"
                className="alert alert-danger alert-dismissible"
                role="alert"
                style={{ display: "none" }}
              >
                <button
                  type="button"
                  className="close"
                  id="datamonkey-absrel-error-hide"
                >
                  <span aria-hidden="true">&times;</span>
                  <span className="sr-only">Close</span>
                </button>
                <strong>Error!</strong>{" "}
                <span id="datamonkey-absrel-error-text" />
              </div>

              <div id="results">
                <div id="summary-tab">
                  <BSRELSummary
                    test_results={self.state.test_results}
                    pmid={self.state.pmid}
                    input_data={self.state.input_data}
                    json={self.state.json}
                    hyphy_vision={self.props.hyphy_vision}
                  />
                  <div className="row">
                    <div id="hyphy-tree-summary" className="col-md-12">
                      <TreeSummary
                        model={self.state.full_model}
                        test_results={self.state.test_results}
                        branch_attributes={self.state.branch_attributes}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div id="tree-tab" className="col-md-12">
                    <Tree
                      json={self.state.json}
                      settings={self.state.settings}
                      models={models}
                      color_gradient={self.omegaColorGradient}
                      grayscale_gradient={self.omegaGrayscaleGradient}
                      method='absrel'
                    />
                  </div>
                </div>

                <div className="row">
                  <div id="table-tab" className="col-md-12">
                    <BranchTable
                      tree={self.state.tree}
                      test_results={self.state.test_results}
                      annotations={self.state.annotations}
                    />
                  </div>
                  <div id="hyphy-model-fits" className="col-md-12">
                    <DatamonkeyModelTable fits={self.state.fits} />
                    <p className="description">
                      This table reports a statistical summary of the models fit
                      to the data. Here, <strong>Baseline MG94xREV</strong> refers to the
                      MG94xREV baseline model that infers a single &omega; rate
                      category per branch. <strong>Full adaptive model</strong> refers to
                      the adaptive aBSREL model that infers an optimized number
                      of &omega; rate categories per branch.
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
function render_absrel(url, element) {
  ReactDOM.render(<BSREL url={url} />, document.getElementById(element));
}

function render_hv_absrel(url, element) {
  ReactDOM.render(<BSREL url={url} hyphy_vision={true} />, document.getElementById(element));
}

module.exports = render_absrel;
module.exports.hv = render_hv_absrel;

