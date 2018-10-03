var React = require("react");
var datamonkey = require("../../datamonkey/datamonkey.js");

import { saveSvgAsPng } from "save-svg-as-png";

var PropChart = React.createClass({
  getDefaultProps: function() {
    return {
      svg_id: null,
      dimensions: {
        width: 600,
        height: 400
      },
      margins: {
        left: 50,
        right: 25,
        bottom: 25,
        top: 35
      },
      has_zeros: false,
      legend_id: null,
      do_log_plot: true,
      k_p: null,
      plot: null
    };
  },

  getInitialState: function() {
    return {
      model_name: this.props.name,
      omegas: this.props.omegas
    };
  },

  setEvents: function() {
    var self = this;

    d3.select("#" + this.save_svg_id).on("click", function(e) {
      datamonkey.save_image("svg", "#" + self.svg_id);
    });
  },

  initialize: function() {
    // clear svg
    d3.select("#prop-chart").html("");
    this.data_to_plot = this.state.omegas;
    if (this.state.omegas) {
      this.data_to_plot.forEach(function(data) {
        if (data.omega < 1e-5) data.omega = 1e-5;
        if (data.omega > 1e4) data.omega = 1e4;
      });
    }

    // Set props from settings
    this.svg_id = this.props.settings.svg_id;
    this.dimensions = this.props.settings.dimensions || this.props.dimensions;
    this.margins = this.props.settings.margins || this.props.margins;
    this.legend_id = this.props.settings.legend || this.props.legend_id;
    this.do_log_plot = this.props.settings.log || this.props.do_log_plot;
    this.k_p = this.props.settings.k || this.props.k_p;

    var dimensions = this.props.dimensions;
    var margins = this.props.margins;

    if (this.props.do_log_plot) {
      this.has_zeros = this.data_to_plot.some(function(d) {
        return d.omega <= 0;
      });
    }

    (this.plot_width =
      dimensions["width"] - margins["left"] - margins["right"]),
      (this.plot_height =
        dimensions["height"] - margins["top"] - margins["bottom"]);

    var domain = this.props.settings["domain"];

    this.omega_scale = (this.do_log_plot ? d3.scale.log() : d3.scale.linear())
      .range([0, this.plot_width])
      .domain(domain)
      .nice();

    this.proportion_scale = d3.scale
      .linear()
      .range([this.plot_height, 0])
      .domain([-0.05, 1])
      .clamp(true);

    // compute margins -- circle AREA is proportional to the relative weight
    // maximum diameter is (height - text margin)
    this.svg = d3
      .select("#" + this.svg_id)
      .attr("width", "100%")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr(
        "viewBox",
        "0 0 " + this.dimensions.width + " " + this.dimensions.height
      )
      .attr("height", dimensions.height + margins["top"] + margins["bottom"]);

    this.svg
      .append("rect")
      .attr("width", dimensions["width"])
      .attr("height", dimensions["height"])
      .attr("fill", "white");

    this.plot = this.svg.selectAll(".container");

    this.svg.selectAll("defs").remove();

    this.svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("refX", 10) /*must be smarter way to calculate shift*/
      .attr("refY", 4)
      .attr("markerWidth", 10)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .attr("stroke", "#000")
      .attr("fill", "#000")
      .append("path")
      .attr("d", "M 0,0 V8 L10,4 Z");

    if (this.plot.empty()) {
      this.plot = this.svg.append("g").attr("class", "container");
    }

    this.plot.attr(
      "transform",
      "translate(" + this.margins["left"] + " , " + this.margins["top"] + ")"
    );
    (this.reference_omega_lines = this.plot.selectAll(
      ".hyphy-omega-line-reference"
    )),
      (this.displacement_lines = this.plot.selectAll(
        ".hyphy-displacement-line"
      ));

    this.createNeutralLine();
    this.createXAxis();
    this.createYAxis();
    this.setEvents();
    this.createOmegaLine(this.state.omegas);
  },

  createOmegaLine: function(omegas) {
    var self = this;

    // generate color wheel from omegas
    self.colores_g = _.shuffle([
      "#1f77b4",
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b",
      "#e377c2",
      "#7f7f7f",
      "#bcbd22",
      "#17becf"
    ]);

    var color_scale = d3.scale
      .linear()
      .domain([0.01, 1, 10])
      .range([d3.rgb("#000000"), d3.rgb("#DDDDDD"), d3.rgb("#00A99D")]);

    // ** Omega Line (Red) ** //
    var omega_lines = this.plot.selectAll(".hyphy-omega-line").data(omegas);
    omega_lines.enter().append("line");
    omega_lines.exit().remove();

    omega_lines
      .transition()
      .attr("x1", function(d) {
        return self.omega_scale(d.omega);
      })
      .attr("x2", function(d) {
        return self.omega_scale(d.omega);
      })
      .attr("y1", function(d) {
        return self.proportion_scale(-0.05) + 20;
      })
      .attr("y2", function(d) {
        return self.proportion_scale(d.prop) + 20;
      })
      .style("stroke", function(d) {
        return color_scale(Math.min(10, d.omega));
      })
      .attr("class", "hyphy-omega-line");
  },

  createNeutralLine: function() {
    var self = this;

    // ** Neutral Line (Blue) ** //
    var neutral_line = this.plot.selectAll(".hyphy-neutral-line").data([1]);
    neutral_line
      .enter()
      .append("line")
      .attr("class", "hyphy-neutral-line");
    neutral_line.exit().remove();
    neutral_line
      .transition()
      .attr("x1", function(d) {
        return self.omega_scale(d);
      })
      .attr("x2", function(d) {
        return self.omega_scale(d);
      })
      .attr("y1", 20)
      .attr("y2", this.plot_height + 20);

    // Legend
    this.svg
      .append("g")
      .attr("transform", "translate(" + 0.9 * this.plot_width + ", 25)")
      .append("text")
      .attr("font-size", 14)
      .text("Neutrality (ω=1)");

    this.svg
      .append("g")
      .attr("transform", "translate(" + 0.825 * this.plot_width + ", 20)")
      .append("line")
      .attr("class", "hyphy-neutral-line")
      .attr("x1", 0)
      .attr("x2", 0.05 * this.plot_width)
      .attr("y1", 0)
      .attr("y2", 0);
  },
  createXAxis: function() {
    // *** X-AXIS *** //
    var xAxis = d3.svg
      .axis()
      .scale(this.omega_scale)
      .orient("bottom");

    if (this.do_log_plot) {
      xAxis.ticks(10, this.has_zeros ? ".2r" : ".1r");
    }

    var x_axis = this.svg.selectAll(".x.axis");
    var x_label;

    if (x_axis.empty()) {
      x_axis = this.svg.append("g").attr("class", "x hyphy-axis");

      x_label = x_axis.append("g").attr("class", "hyphy-axis-label x-label");
    } else {
      x_label = x_axis.select(".axis-label.x-label");
    }

    x_axis
      .attr(
        "transform",
        "translate(" +
          this.margins["left"] +
          "," +
          (this.plot_height + this.margins["top"] + 20) +
          ")"
      )
      .call(xAxis);
    x_label = x_label
      .attr(
        "transform",
        "translate(" +
          this.plot_width +
          "," +
          (this.margins["bottom"] - 30) +
          ")"
      )
      .selectAll("text")
      .data(["\u03C9"]);
    x_label.enter().append("text");
    x_label
      .text(function(d) {
        return d;
      })
      .style({
        "text-anchor": "end",
        "font-size": 18
      })
      .attr("dy", "0.0em");
  },
  createYAxis: function() {
    // *** Y-AXIS *** //
    var yAxis = d3.svg
      .axis()
      .scale(this.proportion_scale)
      .orient("left")
      .ticks(10, ".1p");

    var y_axis = this.svg.selectAll(".y.hyphy-axis");
    var y_label;

    if (y_axis.empty()) {
      y_axis = this.svg.append("g").attr("class", "y hyphy-axis");
      y_label = y_axis.append("g").attr("class", "hyphy-axis-label y-label");
    } else {
      y_label = y_axis.select(".hyphy-axis-label.y-label");
    }
    y_axis
      .attr(
        "transform",
        "translate(" +
          this.margins["left"] +
          "," +
          (this.margins["top"] + 20) +
          ")"
      )
      .call(yAxis);
    y_label = y_label
      .attr(
        "transform",
        "translate(" + (-this.margins["left"] + 10) + "," + 0 + ")"
      )
      .selectAll("text")
      .data(["Proportion of sites"]);
    y_label.enter().append("text");
    y_label
      .text(function(d) {
        return d;
      })
      .style({
        "text-anchor": "start",
        "font-size": 18
      })
      .attr("dy", "-1em");
  },

  componentDidMount: function() {
    try {
      this.initialize();
    } catch (e) {}
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      model_name: nextProps.name,
      omegas: nextProps.omegas
    });
  },

  componentDidUpdate: function() {
    try {
      this.initialize();
    } catch (e) {}
  },

  render: function() {
    this.save_svg_id = "export-" + this.svg_id + "-svg";
    this.save_png_id = "export-" + this.svg_id + "-png";

    return (
      <div className="card" id={this.state.model_name}>
        <div className="card-header">
          <div className="row">
            <div className="col v-align">
              <h1 className="card-title">
                <strong style={{ fontSize: "1.5rem" }}>
                  {this.state.model_name}
                </strong>
              </h1>
              <div className="btn-group float-right">
                <button
                  id={this.save_svg_id}
                  type="button"
                  className="btn.btn-secondary btn-sm"
                >
                  <span className="far fa-save" /> SVG
                </button>
                <button
                  id={this.save_png_id}
                  type="button"
                  className="btn.btn-secondary btn-sm"
                  onClick={() =>
                    saveSvgAsPng(
                      document.getElementById(this.svg_id),
                      "datamonkey-chart.png",
                      { scale: 2 }
                    )
                  }
                >
                  <span className="far fa-save" /> PNG
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="card-body col-md-12" style={{ textAlign: "center" }}>
            <svg id={this.svg_id} style={{ width: "100%" }} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports.PropChart = PropChart;
