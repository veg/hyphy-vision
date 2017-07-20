require("phylotree");
require("phylotree.css");

var React = require("react"),
  ReactDOM = require("react-dom"),
  d3 = require("d3"),
  d3_save_svg = require("d3-save-svg");

import { Tree } from "./components/tree.jsx";
import { ModelFits } from "./components/model_fits.jsx";
import { PropChart } from "./components/prop_chart.jsx";
import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";
import { DatamonkeyTable } from "./components/tables.jsx";
import { saveSvgAsPng } from "save-svg-as-png";
import { InputInfo } from "./components/input_info";


var datamonkey = require("../datamonkey/datamonkey.js");
var _ = require("underscore");

var BUSTEDSummary = React.createClass({
  render: function() {
    var significant = this.props.test_result.p < 0.05,
      message;
    if (significant) {
      message = (
        <p>
          BUSTED <strong className="hyphy-highlight">
            found evidence
          </strong>{" "}
          (LRT, p-value &le; .05) of gene-wide episodic diversifying selection
          in the selected foreground of your phylogeny. Therefore, there is
          evidence that at least one site on at least one foreground branch has
          experienced diversifying selection.{" "}
        </p>
      );
    } else {
      message = (
        <p>
          BUSTED <strong className="hyphy-highlight">
            found no evidence
          </strong>{" "}
          (LRT, p-value &le; .05) of gene-wide episodic diversifying selection
          in the selected foreground of your phylogeny. Therefore, there is no
          evidence that any sites have experienced diversifying selection along
          the foreground branch(es).{" "}
        </p>
      );
    }
    return (
      <div className="row" id="summary-div">
        <div className="col-md-12">
          <h3 className="list-group-item-heading">
            <span className="summary-method-name">
              Branch-Site Unrestricted Statistical Test for Episodic
              Diversification
            </span>
            <br />
            <span className="results-summary">results summary</span>
          </h3>
        </div>
        <div className="col-md-12">
          <InputInfo input_data={this.props.input_data} />
        </div>
        <div className="col-md-12">
          <div className="main-result">
            {message}
            <hr />
            <p>
              <small>
                See{" "}
                <a href="http://hyphy.org/methods/selection-methods/#busted">
                  here
                </a>{" "}
                for more information about the BUSTED method.
                <br />Please cite{" "}
                <a
                  href="http://www.ncbi.nlm.nih.gov/pubmed/25701167"
                  id="summary-pmid"
                  target="_blank"
                >
                  PMID 25701167
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

var BUSTEDSiteChartAndTable = React.createClass({
  getInitialState: function() {
    return {
      lower_site_range: 0,
      upper_site_range: null,
      constrained_evidence_ratio_threshold: "-Infinity",
      optimized_null_evidence_ratio_threshold: "-Infinity",
      brushend_event: false
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      upper_site_range: nextProps.data.length + 1,
      brushend_event: false
    });
  },
  componentDidUpdate: function() {
    if (!this.state.brushend_event) {
      d3.select("#chart-id").html("");
      this.drawChart();
    }
  },
  componentDidMount: function(){
    d3.select("#export-chart-png").on("click", function(e){
      saveSvgAsPng(document.getElementById("chart"), "busted-chart.png");
    });
    d3.select("#export-chart-svg").on("click", function(e){
      d3_save_svg.save(d3.select("#chart").node(), {filename: "busted"});
    });
  },
  drawChart: function() {
    var self = this,
      number_of_sites = this.props.data.length,
      margin = { top: 20, right: 20, bottom: 40, left: 50 },
      width = $("#chart-id").width() - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom,
      ymin = d3.min(
        self.props.data.map(d =>
          Math.min(
            d.constrained_evidence_ratio,
            d.optimized_null_evidence_ratio
          )
        )
      ),
      ymax = d3.max(
        self.props.data.map(d =>
          Math.max(
            d.constrained_evidence_ratio,
            d.optimized_null_evidence_ratio
          )
        )
      ),
      x = d3.scale.linear().domain([0, number_of_sites]).range([0, width]),
      y = d3.scale.linear().domain([ymin, ymax]).range([height, 0]),
      yAxisTicks = d3.range(
        5 * Math.ceil(ymin / 5),
        5 * Math.floor(ymax / 5) + 1,
        5
      ),
      xAxis = d3.svg
        .axis()
        .scale(x)
        .orient("bottom")
        .tickValues(d3.range(5, number_of_sites, 5)),
      yAxis = d3.svg.axis().scale(y).orient("left").tickValues(yAxisTicks),
      cer_line = d3.svg
        .line()
        .x(function(d, i) {
          return x(d.site_index);
        })
        .y(function(d, i) {
          return y(d.constrained_evidence_ratio);
        }),
      oner_line = d3.svg
        .line()
        .x(function(d, i) {
          return x(d.site_index);
        })
        .y(function(d, i) {
          return y(d.optimized_null_evidence_ratio);
        }),
      svg = d3
        .select("#chart-id")
        .append("svg")
        .attr("id", "chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white")

    var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g
      .selectAll(".axis-line")
      .data(yAxisTicks)
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", d => y(d))
      .attr("y2", d => y(d))
      .style("stroke", "#eee")
      .style("stroke-width", 1);
    g
      .append("path")
      .attr("class", "line")
      .attr("d", oner_line(self.props.data))
      .style("fill", "none")
      .style("stroke-width", 2)
      .style("stroke", "#000");
    g
      .append("path")
      .attr("class", "line")
      .attr("d", cer_line(self.props.data))
      .style("fill", "none")
      .style("stroke-width", 2)
      .style("stroke", "#00a99d");
    g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    g
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom)
      .style("text-anchor", "middle")
      .text("Site index");
    g.append("g").attr("class", "y axis").call(yAxis);
    g
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("2*Logarithm of evidence ratio");
    var c_legend = svg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        "translate( " + 0.8 * width + "," + 0.05 * height + ")"
      )
      .attr("text-anchor", "end");
    c_legend
      .append("text")
      .text("Constrained")
      .attr("x", 115)
      .attr("y", 7.5)
      .attr("dy", ".32em");
    c_legend
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "#00a99d");
    var on_legend = svg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        "translate( " + 0.8 * width + "," + 0.15 * height + ")"
      )
      .attr("text-anchor", "end");
    on_legend
      .append("text")
      .text("Optimized Null")
      .attr("x", 135)
      .attr("y", 7.5)
      .attr("dy", ".32em");
    on_legend
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "#000");

    function brushend() {
      var extent = brush.extent();
      if (extent[0] != extent[1]) {
        self.setState({
          lower_site_range: extent[0],
          upper_site_range: extent[1],
          brushend_event: true
        });
      } else {
        self.setState({
          lower_site_range: 0,
          upper_site_range: self.props.data.length + 1,
          brushend_event: true
        });
      }
    }

    var brush = d3.svg.brush().x(x).on("brushend", brushend);

    g
      .append("g")
      .attr("class", "brush")
      .call(brush)
      .selectAll("rect")
      .attr("height", height);
  },
  handleONERChange: function(event) {
    if (/^-?[0-9]*(\.[0-9]*)?$/.test(event.target.value)) {
      this.setState({
        optimized_null_evidence_ratio_threshold: event.target.value
      });
    } else if (event.target.value == "-I") {
      this.setState({
        optimized_null_evidence_ratio_threshold: "-Infinity"
      });
    } else if (event.target.value == "-Infinit") {
      this.setState({
        optimized_null_evidence_ratio_threshold: ""
      });
    }
  },
  handleONERFocus: function(event) {
    this.setState({
      optimized_null_evidence_ratio_threshold: ""
    });
  },
  handleONERBlur: function(event) {
    if (!event.target.value) {
      this.setState({
        optimized_null_evidence_ratio_threshold: "-Infinity"
      });
    }
  },
  handleCERChange: function(event) {
    if (/^-?[0-9]*(\.[0-9]*)?$/.test(event.target.value)) {
      this.setState({
        constrained_evidence_ratio_threshold: event.target.value
      });
    } else if (event.target.value == "-I") {
      this.setState({
        constrained_evidence_ratio_threshold: "-Infinity"
      });
    } else if (event.target.value == "-Infinit") {
      this.setState({
        constrained_evidence_ratio_threshold: ""
      });
    }
  },
  handleCERFocus: function(event) {
    this.setState({
      constrained_evidence_ratio_threshold: ""
    });
  },
  handleCERBlur: function(event) {
    if (!event.target.value) {
      this.setState({
        constrained_evidence_ratio_threshold: "-Infinity"
      });
    }
  },
  headerData: [
    {
      abbr: "Position of site in multiple sequence alignment.",
      sortable: true,
      value: "Site index"
    },
    {
      abbr: "Likelihood of unconstrained model.",
      sortable: true,
      value: "Unconstrained likelihood"
    },
    {
      abbr: "Likelihood of constrained model.",
      sortable: true,
      value: "Constrained likelihood"
    },
    ,
    "Optimized Null Likelihood",
    "Constrained Statistic",
    "Optimized Null Statistic"
  ],
  render: function() {
    var self = this,
      float_format = d3.format(".2f"),
      bodyData = _.filter(this.props.data, function(element, index) {
        var valid_optimized_null_evidence_ratio =
            _.contains(
              ["-Infinity", "", "-"],
              self.state.optimized_null_evidence_ratio_threshold
            ) ||
            element.optimized_null_evidence_ratio >
              +self.state.optimized_null_evidence_ratio_threshold,
          valid_constrained_evidence_ratio =
            _.contains(
              ["-Infinity", "", "-"],
              self.state.constrained_evidence_ratio_threshold
            ) ||
            element.constrained_evidence_ratio >
              +self.state.constrained_evidence_ratio_threshold,
          valid_ers =
            valid_constrained_evidence_ratio &&
            valid_optimized_null_evidence_ratio,
          valid_site =
            element.site_index > self.state.lower_site_range &&
            element.site_index < self.state.upper_site_range;
        return valid_ers && valid_site;
      }).map(row =>
        _.values(row).map((d, i) => (i != 0 ? +float_format(d) : +d))
      );
    return (
      <div>
        <div className="row hyphy-busted-site-table">
          <div className="col-md-12">
            <h4 className="dm-table-header">
              Model Test Statistics Per Site
              <span
                className="glyphicon glyphicon-info-sign"
                style={{ verticalAlign: "middle", float: "right" }}
                aria-hidden="true"
                data-toggle="popover"
                data-trigger="hover"
                title="Actions"
                data-html="true"
                data-content="<ul><li>Hover over a column header for a description of its content.</li></ul>"
                data-placement="bottom"
              />
            </h4>
          </div>
          <div className="col-lg-12">
            <button
              id="export-chart-svg"
              type="button"
              className="btn btn-default btn-sm pull-right btn-export"
            >
              <span className="glyphicon glyphicon-floppy-save" /> Export Chart
              to SVG
            </button>
            <button
              id="export-chart-png"
              type="button"
              className="btn btn-default btn-sm pull-right btn-export"
            >
              <span className="glyphicon glyphicon-floppy-save" /> Export Chart
              to PNG
            </button>
          </div>
          <div id="chart-id" className="col-lg-12" />
        </div>

        <div className="row site-table">
          <div className="col-lg-6">
            <div className="form-group">
              <label for="er-constrained-threshold">
                Constrained Test Statistic
              </label>
              <input
                type="text"
                className="form-control"
                id="er-constrained-threshold"
                value={this.state.constrained_evidence_ratio_threshold}
                onChange={this.handleCERChange}
                onFocus={this.handleCERFocus}
                onBlur={this.handleCERBlur}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="form-group">
              <label for="er-optimized-null-threshold">
                Optimized Null Test Statistic
              </label>
              <input
                type="text"
                className="form-control"
                id="er-optimized-null-threshold"
                value={this.state.optimized_null_evidence_ratio_threshold}
                onChange={this.handleONERChange}
                onFocus={this.handleONERFocus}
                onBlur={this.handleONERBlur}
              />
            </div>
          </div>
          <div className="col-lg-12">
            <DatamonkeyTable
              headerData={this.headerData}
              bodyData={bodyData}
              paginate={Math.min(20, bodyData.length)}
              initialSort={0}
              classes={"table table-condensed table-striped"}
              export_csv
            />
          </div>
        </div>
      </div>
    );
  }

});

var BUSTED = React.createClass({
  float_format: d3.format(".2f"),
  p_value_format: d3.format(".4f"),
  fit_format: d3.format(".2f"),

  loadFromServer: function() {
    var self = this;

    d3.json(this.props.url, function(data) {
      data["fits"]["Unconstrained model"][
        "branch-annotations"
      ] = self.formatBranchAnnotations(data, "Unconstrained model");
      data["fits"]["Constrained model"][
        "branch-annotations"
      ] = self.formatBranchAnnotations(data, "Constrained model");

      // rename rate distributions
      data["fits"]["Unconstrained model"]["rate-distributions"] =
        data["fits"]["Unconstrained model"]["rate distributions"];
      data["fits"]["Constrained model"]["rate-distributions"] =
        data["fits"]["Constrained model"]["rate distributions"];

      // set display order
      data["fits"]["Unconstrained model"]["display-order"] = 0;
      data["fits"]["Constrained model"]["display-order"] = 1;

      var json = data,
        pmid = "25701167",
        pmid_text = "PubMed ID " + pmid,
        pmid_href = "http://www.ncbi.nlm.nih.gov/pubmed/" + pmid,
        p = json["test results"]["p"],
        statement = p <= 0.05 ? "evidence" : "no evidence";

      var fg_rate =
        json["fits"]["Unconstrained model"]["rate distributions"]["FG"];
      var mapped_omegas = {
        omegas: _.map(fg_rate, function(d) {
          return _.object(["omega", "prop"], d);
        })
      };

      self.setState({
        p: p,
        test_result: {
          statement: statement,
          p: p
        },
        json: json,
        omegas: mapped_omegas["omegas"],
        pmid: {
          text: pmid_text,
          href: pmid_href
        },
        input_data: data["input_data"],
        evidence_ratio_data: _.map(_.range(data.input_data["sites"]), function(
          i
        ) {
          return {
            site_index: i + 1,
            unconstrained_likelihood: data["profiles"]["unconstrained"][0][i],
            constained_likelihood: data["profiles"]["constrained"][0][i],
            optimized_null_likelihood: data["profiles"]["optimized null"][0][i],
            constrained_evidence_ratio:
              2 * Math.log(data["evidence ratios"]["constrained"][0][i]),
            optimized_null_evidence_ratio:
              2 * Math.log(data["evidence ratios"]["optimized null"][0][i])
          };
        })
      });
    });
  },

  colorGradient: ["red", "green"],
  grayScaleGradient: [
    "#444444",
    "#000000"
  ],


  getDefaultProps: function() {

    var edgeColorizer = function(element, data, foreground_color) {

      var is_foreground = data.target.annotations.is_foreground,
        color_fill = foreground_color(0);

      element
        .style("stroke", is_foreground ? color_fill : "gray")
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
        "hyphy-tree-branch-lengths": [true, true],
        "hyphy-tree-hide-legend": [true, false],
        "hyphy-tree-fill-color": [true, false]
      },
      "hyphy-tree-legend-type": "discrete",
      "suppress-tree-render": false,
      "chart-append-html": true,
      edgeColorizer: edgeColorizer
    };

    var distro_settings = {
      dimensions: { width: 600, height: 400 },
      margins: { left: 50, right: 15, bottom: 35, top: 35 },
      legend: false,
      domain: [0.00001, 100],
      do_log_plot: true,
      k_p: null,
      plot: null,
      svg_id: "prop-chart"
    };

    return {
      distro_settings: distro_settings,
      tree_settings: tree_settings,
      constrained_threshold: "Infinity",
      null_threshold: "-Infinity",
      model_name: "FG"
    };
  },

  getInitialState: function() {
    return {
      p: null,
      test_result: {
        statement: null,
        p: null
      },
      json: null,
      omegas: null,
      pmid: {
        href: null,
        text: null
      },
      input_data: null,
      table_rows: []
    };
  },

  setEvents: function() {
    var self = this;

    $("#json-file").on("change", function(e) {
      var files = e.target.files; // FileList object
      if (files.length == 1) {
        var f = files[0];
        var reader = new FileReader();
        reader.onload = (function(theFile) {
          return function(e) {
            var data = JSON.parse(this.result);
            data["fits"]["Unconstrained model"][
              "branch-annotations"
            ] = self.formatBranchAnnotations(data, "Unconstrained model");
            data["fits"]["Constrained model"][
              "branch-annotations"
            ] = self.formatBranchAnnotations(data, "Constrained model");

            // rename rate distributions
            data["fits"]["Unconstrained model"]["rate-distributions"] =
              data["fits"]["Unconstrained model"]["rate distributions"];
            data["fits"]["Constrained model"]["rate-distributions"] =
              data["fits"]["Constrained model"]["rate distributions"];

            var json = data,
              pmid = "25701167",
              pmid_text = "PubMed ID " + pmid,
              pmid_href = "http://www.ncbi.nlm.nih.gov/pubmed/" + pmid,
              p = json["test results"]["p"],
              statement = p <= 0.05 ? "evidence" : "no evidence";

            var fg_rate =
              json["fits"]["Unconstrained model"]["rate distributions"]["FG"];
            var mapped_omegas = {
              omegas: _.map(fg_rate, function(d) {
                return _.object(["omega", "prop"], d);
              })
            };

            self.setState({
              p: p,
              test_result: {
                statement: statement,
                p: p
              },
              json: json,
              omegas: mapped_omegas["omegas"],
              pmid: {
                text: pmid_text,
                href: pmid_href
              },
              input_data: data["input_data"]
            });
          };
        })(f);
        reader.readAsText(f);
      }
      $("#json-file").dropdown("toggle");
      e.preventDefault();
    });
  },

  formatBranchAnnotations: function(json, key) {
    // attach is_foreground to branch annotations
    var foreground = json["test set"].split(",");

    var tree = d3.layout.phylotree(),
      nodes = tree(json["fits"][key]["tree string"]).get_nodes(),
      node_names = _.map(nodes, function(d) {
        return d.name;
      });

    // Iterate over objects
    var branch_annotations = _.object(
      node_names,
      _.map(node_names, function(d) {
        return { is_foreground: _.indexOf(foreground, d) > -1 };
      })
    );

    return branch_annotations;
  },

  initialize: function() {
    var json = this.state.json;

    if (!json) {
      return;
    }

    // delete existing tree
    d3.select("#tree_container").select("svg").remove();

    $("#export-dist-svg").on("click", function(e) {
      datamonkey.save_image("svg", "#primary-omega-dist");
    });

    $("#export-dist-png").on("click", function(e) {
      datamonkey.save_image("png", "#primary-omega-dist");
    });
  },

  componentWillMount: function() {
    this.loadFromServer();
    this.setEvents();
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
    self.initialize();
    var scrollspy_info = [
      { label: "summary", href: "summary-div" },
      { label: "model statistics", href: "hyphy-model-fits" },
      { label: "input tree", href: "phylogenetic-tree" },
      { label: "ω distribution", href: "primary-omega-dist" }
    ];

    var models = {};
    if (!_.isNull(self.state.json)) {
      models = self.state.json.fits;
    }


    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="row">
            <ScrollSpy info={scrollspy_info} />

            <div className="col-lg-10">
              <div id="results">
                <div id="summary-tab">
                  <BUSTEDSummary
                    test_result={this.state.test_result}
                    pmid={this.state.pmid}
                    input_data={self.state.input_data}
                  />
                </div>
              </div>

              <div className="row">
                <div id="hyphy-model-fits" className="col-lg-12">
                  <ModelFits json={self.state.json} />
                  <p className="description">
                    This table reports a statistical summary of the models fit
                    to the data. Here, <strong>Unconstrained model</strong>{" "}
                    refers to the BUSTED alternative model for selection, and{" "}
                    <strong>Constrained model</strong> refers to the BUSTED null
                    model for selection.
                  </p>
                </div>
              </div>

              <BUSTEDSiteChartAndTable data={this.state.evidence_ratio_data} />

              <div className="row">
                <div className="col-md-12" id="phylogenetic-tree">
                  <Tree
                    json={self.state.json}
                    settings={self.props.tree_settings}
                    models={models}
                    color_gradient={self.colorGradient}
                    grayscale_gradient={self.grayscaleGradient}
                  />
                </div>
                <div className="col-md-12">
                  <h4 className="dm-table-header">&omega; distribution</h4>
                  <div id="primary-omega-dist" className="panel-body">
                    <PropChart
                      name={self.props.model_name}
                      omegas={self.state.omegas}
                      settings={self.props.distro_settings}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-1" />
          </div>
        </div>
      </div>
    );
  }
});

// Will need to make a call to this
// omega distributions
var render_busted = function(url, element) {
  ReactDOM.render(<BUSTED url={url} />, document.getElementById(element));
};

module.exports = render_busted;
