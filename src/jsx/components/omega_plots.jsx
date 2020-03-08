import { saveSvgAsPng } from "save-svg-as-png";

var React = require("react"),
  createReactClass = require("create-react-class");
var _ = require("underscore");
var d3_save_svg = require("d3-save-svg");

var OmegaPlot = createReactClass({
  componentDidMount: function() {
    this.initialize();
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      omegas: nextProps.omegas
    });
  },

  componentDidUpdate: function() {
    d3.select("#" + this.svg_id).html("");
    this.initialize();
  },

  getInitialState: function() {
    return {
      omegas: this.props.omegas,
      settings: this.props.settings
    };
  },

  getDefaultProps: function() {
    return {
      svg_id: null,
      dimensions: { width: 600, height: 400 },
      margins: { left: 50, right: 15, bottom: 35, top: 35 },
      has_zeros: false,
      legend_id: null,
      do_log_plot: true,
      k_p: null,
      plot: null,
      legendBuffer: 100
    };
  },

  initialize: function() {
    if (!this.state.omegas || !this.state.omegas[this.props.referenceGroup]) {
      return;
    }

    var data_to_plot = this.state.omegas[this.props.referenceGroup];
    var secondary_data = this.state.omegas[this.props.testGroup];

    // Set props from settings
    this.svg_id = this.props.settings.svg_id;
    this.dimensions = this.props.settings.dimensions || this.props.dimensions;
    this.legend_id = this.props.settings.legend || this.props.legend_id;
    this.do_log_plot = this.props.settings.log || this.props.do_log_plot;
    this.k_p = this.props.settings.k || this.props.k_p;

    var dimensions = this.props.dimensions;
    var margins = this.props.margins;

    this.margins = margins;

    if (this.do_log_plot) {
      this.has_zeros = data_to_plot.some(function(d) {
        return d.omega <= 0;
      });
      if (secondary_data) {
        this.has_zeros =
          this.has_zeros ||
          data_to_plot.some(function(d) {
            return d.omega <= 0;
          });
      }
    }

    (this.plot_width =
      dimensions["width"] - margins["left"] - margins["right"]),
      (this.plot_height =
        dimensions["height"] - margins["top"] - margins["bottom"]);

    var domain =
      this.state.settings["domain"] ||
      d3.extent(
        secondary_data
          ? secondary_data
              .map(function(d) {
                return d.omega;
              })
              .concat(
                data_to_plot.map(function(d) {
                  return d.omega;
                })
              )
          : data_to_plot.map(function(d) {
              return d.omega;
            })
      );

    domain[0] *= 0.5;

    this.omega_scale = (this.do_log_plot
      ? this.has_zeros
        ? d3.scale.pow().exponent(0.2)
        : d3.scale.log()
      : d3.scale.linear()
    )
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
      .attr("width", dimensions.width + this.props.settings.legendBuffer)
      .attr("height", dimensions.height);
    this.svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
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

    this.createDisplacementLine();
    this.createNeutralLine();
    this.createOmegaLine();
    this.createReferenceLine();
    this.createXAxis();
    this.createYAxis();
    this.createLegend();
  },

  makeSpring: function(x1, x2, y1, y2, step, displacement) {
    if (x1 == x2) {
      y1 = Math.min(y1, y2);
      return "M" + x1 + "," + (y1 - 40) + "v20";
    }

    var spring_data = [],
      point = [x1, y1],
      angle = Math.atan2(y2 - y1, x2 - x1);

    var step = [step * Math.cos(angle), step * Math.sin(angle)];
    var k = 0;

    if (Math.abs(x1 - x2) < 15) {
      spring_data.push(point);
    } else {
      while (
        (x1 < x2 && point[0] < x2 - 15) ||
        (x1 > x2 && point[0] > x2 + 15)
      ) {
        point = point.map(function(d, i) {
          return d + step[i];
        });
        if (k % 2) {
          spring_data.push([point[0], point[1] + displacement]);
        } else {
          spring_data.push([point[0], point[1] - displacement]);
        }
        k++;
        if (k > 100) {
          break;
        }
      }
    }

    if (spring_data.length > 1) {
      spring_data.pop();
    }

    spring_data.push([x2, y2]);
    var line = d3.svg.line().interpolate("monotone");
    return line(spring_data);
  },

  createDisplacementLine: function() {
    var self = this;
    var data_to_plot = this.state.omegas[this.props.referenceGroup];
    var secondary_data = this.state.omegas[this.props.testGroup];

    if (secondary_data) {
      var diffs = data_to_plot.map(function(d, i) {
        return {
          x1: d.omega,
          x2: secondary_data[i].omega,
          y1: d.weight * 0.98,
          y2: secondary_data[i].weight * 0.98
        };
      });

      this.displacement_lines = this.displacement_lines.data(diffs);
      this.displacement_lines.enter().append("path");
      this.displacement_lines.exit().remove();
      this.displacement_lines
        .transition()
        .attr("d", function(d) {
          return self.makeSpring(
            self.omega_scale(d.x1),
            self.omega_scale(d.x2),
            self.proportion_scale(d.y1 * 0.5),
            self.proportion_scale(d.y2 * 0.5),
            5,
            5
          );
        })
        .attr("marker-end", "url(#arrowhead)")
        .attr("class", "hyphy-displacement-line");
    }
  },

  createReferenceLine: function() {
    var data_to_plot = this.state.omegas[this.props.referenceGroup];
    var secondary_data = this.state.omegas[this.props.testGroup];
    var self = this;

    if (secondary_data) {
      this.reference_omega_lines = this.reference_omega_lines.data(
        data_to_plot
      );
      this.reference_omega_lines.enter().append("line");
      this.reference_omega_lines.exit().remove();

      this.reference_omega_lines
        .transition()
        .attr("x1", function(d) {
          return self.omega_scale(d.omega);
        })
        .attr("x2", function(d) {
          return self.omega_scale(d.omega);
        })
        .attr("y1", function(d) {
          return self.proportion_scale(-0.05);
        })
        .attr("y2", function(d) {
          return self.proportion_scale(d.weight);
        })
        .style("stroke", function(d) {
          return "#000000";
        })
        .attr("class", "hyphy-omega-line-reference");
    } else {
      this.reference_omega_lines.remove();
      this.displacement_lines.remove();
    }
  },

  createOmegaLine: function() {
    var data_to_plot = this.state.omegas[this.props.referenceGroup];
    var secondary_data = this.state.omegas[this.props.testGroup];
    var self = this;

    // ** Omega Line (Red) ** //
    var omega_lines = this.plot
      .selectAll(".hyphy-omega-line")
      .data(secondary_data ? secondary_data : data_to_plot);
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
        return self.proportion_scale(-0.05);
      })
      .attr("y2", function(d) {
        return self.proportion_scale(d.weight);
      })
      .style("stroke", function(d) {
        return "#00a99d";
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
      .attr("y1", 0)
      .attr("y2", this.plot_height);
  },

  createXAxis: function() {
    // *** X-AXIS *** //
    var xAxis = d3.svg
      .axis()
      .scale(this.omega_scale)
      .orient("bottom");

    if (this.do_log_plot) {
      xAxis.ticks(10, ".0e");
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
          (this.plot_height + this.margins["top"]) +
          ")"
      )
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-45)");

    x_label = x_label
      .attr(
        "transform",
        "translate(" + this.plot_width + "," + this.margins["bottom"] + ")"
      )
      .selectAll("text")
      .data(["\u03C9"]);
    x_label.enter().append("text");
    x_label
      .text(function(d) {
        return d;
      })
      .style("text-anchor", "end")
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
        "translate(" + this.margins["left"] + "," + this.margins["top"] + ")"
      )
      .call(yAxis);
    y_label = y_label
      .attr("transform", "translate(" + -this.margins["left"] + "," + 0 + ")")
      .selectAll("text")
      .data(["Proportion of sites"]);
    y_label.enter().append("text");
    y_label
      .text(function(d) {
        return d;
      })
      .style("text-anchor", "start")
      .attr("dy", "-1em");
  },

  createLegend: function() {
    let legendData = [20, 1000];
    let legendColors = ["#00a99d", "black"];
    let labels = [this.props.testGroup, this.props.referenceGroup];
    let legendSquareSize = 20;
    let legendSpacing = 5;
    let legendX = this.props.settings.dimensions.width;
    let fontSizeOffset = 15;

    var legend = this.svg
      .selectAll(".legend")
      .data(legendData)
      .enter()
      .append("g");

    legend
      .append("rect")
      .attr("fill", function(d, i) {
        return legendColors[i];
      })
      .attr("width", legendSquareSize)
      .attr("height", legendSquareSize)
      .attr("y", function(d, i) {
        return legendSquareSize + i * (legendSquareSize + legendSpacing);
      })
      .attr("x", legendX);

    legend
      .append("text")
      .attr("class", "label")
      .attr("y", function(d, i) {
        return (
          legendSquareSize +
          (i * (legendSquareSize + legendSpacing) + fontSizeOffset)
        );
      })
      .attr("x", legendX + legendSquareSize + 5)
      .attr("text-anchor", "start")
      .text(function(d, i) {
        return labels[i];
      });
  },

  render: function() {
    var self = this,
      key = this.props.omegas.key,
      label = this.props.omegas.label;

    this.svg_id = key + "-svg";
    return (
      <div>
        <div className="card" id={key} style={{ textAlign: "center" }}>
          <div className="card-header">
            <h3 className="card-title">
              &omega; distributions under the <strong>{label}</strong> model
            </h3>
            <div className="btn-group">
              <button
                onClick={() => {
                  d3_save_svg.save(d3.select("#" + self.svg_id).node(), {
                    filename: "relax-chart"
                  });
                }}
                type="button"
                className="btn.btn-secondary btn-sm"
              >
                <span className="far fa-save" /> SVG
              </button>
              <button
                type="button"
                className="btn.btn-secondary btn-sm"
                onClick={() => {
                  saveSvgAsPng(
                    document.getElementById(self.svg_id),
                    "relax-chart.png"
                  );
                }}
              >
                <span className="far fa-save" /> PNG
              </button>
            </div>
          </div>
          <div className="card-body">
            <svg id={this.svg_id} />
          </div>
        </div>
      </div>
    );
  }
});

var OmegaPlotGrid = createReactClass({
  getInitialState: function() {
    const referenceGroup = this.props.referenceGroup || "Reference";
    return {
      omega_distributions: this.getDistributions(
        this.props.json,
        referenceGroup
      )
    };
  },

  componentWillReceiveProps: function(nextProps) {
    const referenceGroup = nextProps.referenceGroup || "Reference";
    const testGroup = nextProps.testGroup || "Test";
    this.setState({
      omega_distributions: this.getDistributions(
        nextProps.json,
        referenceGroup
      ),
      referenceGroup: referenceGroup,
      testGroup: testGroup
    });
  },

  getDistributions: function(json, referenceGroup) {
    var omega_distributions = {};

    if (!json) {
      return [];
    }

    for (var m in json["fits"]) {
      var this_model = json["fits"][m];
      omega_distributions[m] = {};
      for (var d in this_model["Rate Distributions"]) {
        var this_distro = this_model["Rate Distributions"][d];
        omega_distributions[m][d] = _.values(this_distro).map(function(d) {
          return {
            omega: d.omega,
            weight: d.proportion
          };
        });
      }
    }

    _.each(omega_distributions, function(item, key) {
      item.key = key
        .slice(0, 8)
        .toLowerCase()
        .replace(/ /g, "-");
      item.label = key;
    });

    var omega_distributions = _.filter(omega_distributions, function(item) {
      return _.isObject(item[referenceGroup]);
    });
    return omega_distributions;
  },

  render: function() {
    const referenceGroup = this.state.referenceGroup || "Reference";
    const testGroup = this.state.testGroup || "Test";

    var OmegaPlots = _.map(this.state.omega_distributions, function(item, key) {
      var model_name = key;
      var omegas = item;

      var settings = {
        svg_id: omegas.key + "-svg",
        dimensions: { width: 600, height: 400 },
        margins: { left: 50, right: 15, bottom: 35, top: 35 },
        has_zeros: false,
        legend_id: null,
        do_log_plot: true,
        k_p: null,
        plot: null,
        legendBuffer: 100
      };

      return (
        <OmegaPlot
          name={model_name}
          omegas={omegas}
          settings={settings}
          key={omegas.key}
          referenceGroup={referenceGroup}
          testGroup={testGroup}
        />
      );
    });

    return <div>{OmegaPlots}</div>;
  }
});

export { OmegaPlot, OmegaPlotGrid };
