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
            <span className="summary-method-name">adaptive Branch Site REL</span>
            <br />
            <span className="results-summary">results summary</span>
          </h3>
      </div>
      
      
        <div className="col-md-12">
          <InputInfo input_data={this.props.input_data}/>
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

  loadFromServer: function() {

    var self = this;

    d3.json(this.props.url, function(data) {
      data["fits"]["MG94"]["branch-annotations"] = self.formatBranchAnnotations(
        data,
        "MG94"
      );
      data["fits"]["Full model"][
        "branch-annotations"
      ] = self.formatBranchAnnotations(data, "Full model");

      // GH-#18 Add omega annotation tag
      data["fits"]["MG94"]["annotation-tag"] = "ω";
      data["fits"]["Full model"]["annotation-tag"] = "ω";

      self.setState({
        annotations: data["fits"]["Full model"]["branch-annotations"],
        json: data,
        pmid: data["PMID"],
        fits: data["fits"],
        full_model: data["fits"]["Full model"],
        test_results: data["test results"],
        input_data: data["input_data"],
        tree: d3.layout.phylotree()(data["fits"]["Full model"]["tree string"])
      });
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
        //reference_omega_weight = prop_format(0),
        //distro = "";

      if (annotations) {
        //reference_omega_weight = annotations.omegas[0].prop;

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

          //if (i) {
          //  distro += "<br/>";
          //}

          //distro +=
          //  "&omega;<sub>" +
          //  (i + 1) +
          //  "</sub> = " +
          //  omega_value +
          //  " (" +
            //omega_weight +
            //")";
        });

        tooltip += "<br/><i>p = " + omega_format(annotations["p"]) + "</i>";

        $(element[0][0]).tooltip({
          title: tooltip,
          html: true,
          trigger: "hover",
          container: "body",
          placement: "auto"
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
      tree: null
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
            data["fits"]["MG94"][
              "branch-annotations"
            ] = self.formatBranchAnnotations(data, "MG94");
            data["fits"]["Full model"][
              "branch-annotations"
            ] = self.formatBranchAnnotations(data, "Full model");

            var annotations = data["fits"]["Full model"]["branch-annotations"],
              json = data,
              pmid = data["PMID"],
              full_model = json["fits"]["Full model"],
              test_results = data["test results"],
              input_data = data["input_data"],
              fits = data["fits"];

            data["fits"]["MG94"]["annotation-tag"] = "ω";
            data["fits"]["Full model"]["annotation-tag"] = "ω";

            self.setState({
              annotations: annotations,
              json: json,
              pmid: pmid,
              full_model: full_model,
              test_results: test_results,
              input_data: input_data,
              fits: fits,
              tree: d3.layout.phylotree()(
                data["fits"]["Full model"]["tree string"]
              )
            });
          };
        })(f);
        reader.readAsText(f);
      }
      e.preventDefault();
    });
  },

  formatBranchAnnotations: function(json, key) {
    var initial_branch_annotations = json["fits"][key]["branch-annotations"];

    if (!initial_branch_annotations) {
      initial_branch_annotations = json["fits"][key]["rate distributions"];
    }

    // Iterate over objects
    var branch_annotations = _.mapObject(initial_branch_annotations, function(
      val,
      key
    ) {
      var vals = [];
      try {
        vals = JSON.parse(val);
      } catch (e) {
        vals = val;
      }

      var omegas = {
        omegas: _.map(vals, function(d) {
          return _.object(["omega", "prop"], d);
        })
      };
      var test_results = _.clone(json["test results"][key]);
      _.extend(test_results, omegas);
      return test_results;
    });

    return branch_annotations;
  },

  componentDidUpdate(prevProps, prevState) {
    $("body").scrollspy({
      target: ".bs-docs-sidebar",
      offset: 50
    });
    $('[data-toggle="popover"]').popover();
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
      models = self.state.json.fits;
    }

    return (
      <div>
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
                  />
                  <div className="row">
                    <div id="hyphy-tree-summary" className="col-md-12">
                      <TreeSummary
                        model={self.state.full_model}
                        test_results={self.state.test_results}
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
                      to the data. Here, <strong>MG94</strong> refers to the
                      MG94xREV baseline model that infers a single &omega; rate
                      category per branch. <strong>Full Model</strong> refers to
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

module.exports = render_absrel;
