/* Distribution plotters */

// *** Main Plot *** //
var OmegaPlot = React.createClass({

  getDefaultProps : function() {
    return {
      svg_id : "primary_omega_plot",
      dimensions : { width : 600, height : 400 },
      margins : { 'left': 50, 'right': 15, 'bottom': 35, 'top': 35 },
      has_zeros : false,
      legend_id : null,
      do_log_plot : true,
      k_p : null,
      plot : null
    };
  },

  getInitialState: function() {
    return {settings: {}};
  },

  initialize : function() {

    // Set props from settings
    this.props.dimensions = this.state.settings["dimensions"] || this.props.dimensions;
    this.props.svg_id = this.state.settings["svg"] || this.props.svg_id;
    this.props.legend_id = settings["legend"] || this.props.legend_id;
    this.props.do_log_plot = settings["log"] || this.props.do_log_plot;
    this.props.k_p = settings["k"] || this.props.k_p;

    var dimensions = this.props.dimensions;
    var margins = this.props.margins;

    if (this.props.do_log_plot) {
      this.props.has_zeros = data_to_plot.some(function(d) {return d.omega <= 0;});
      if (secondary_data) {
        this.props.has_zeros = this.props.has_zeros || data_to_plot.some(function(d) {return d.omega <= 0;});
      }
    }

    this.omega_scale = (this.props.do_log_plot ? (this.props.has_zeros ? d3.scale.pow().exponent (0.2) : d3.scale.log()) : d3.scale.linear())
        .range([0, plot_width]).domain(domain).nice();

    this.proportion_scale = d3.scale.linear().range([plot_height, 0]).domain([-0.05, 1]).clamp(true);

    this.props.plot_width = dimensions["width"] - margins['left'] - margins['right'],
    this.props.plot_height = dimensions["height"] - margins['top'] - margins['bottom'];

    var domain = this.state.settings["domain"] || d3.extent(secondary_data ? secondary_data.map(function(d) {
        return d.omega;
    }).concat(data_to_plot.map(function(d) {
        return d.omega;
    })) : data_to_plot.map(function(d) {
        return d.omega;
    }));

    domain[0] *= 0.5;

    // compute margins -- circle AREA is proportional to the relative weight
    // maximum diameter is (height - text margin)
    this.svg = d3.select("#" + svg_id).attr("width", dimensions.width)
        .attr("height", dimensions.height),

    this.plot = svg.selectAll(".container");
    this.svg.selectAll("defs").remove();
    this.svg.append("defs").append("marker")
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

    this.plot.attr("transform", "translate(" + margins["left"] + " , " + margins["top"] + ")");
    this.reference_omega_lines = this.plot.selectAll(".hyphy-omega-line-reference"),
    this.displacement_lines = this.selectAll(".hyphy-displacement-line");

    this.createDisplacementLine();
    this.createNeutralLine();
    this.createOmegaLine();
    this.createReferenceLine();
    this.createXAxis();
    this.createYAxis();

  },
  makeSpring : function(x1, x2, y1, y2, step, displacement) {

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
        while (x1 < x2 && point[0] < x2 - 15 || x1 > x2 && point[0] > x2 + 15) {
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
  createDisplacementLine : function() {
    this.displacement_lines = this.displacement_lines.data(diffs);
    this.displacement_lines.enter().append("path");
    this.displacement_lines.exit().remove();
    this.displacement_lines.transition().attr("d", function(d) {
        return this.makeSpring(omega_scale(d.x1),
            omega_scale(d.x2),
            proportion_scale(d.y1 * 0.5),
            proportion_scale(d.y2 * 0.5),
            5,
            5);
    }).attr("marker-end", "url(#arrowhead)")
      .attr("class", "hyphy-displacement-line");
  },
  createReferenceLine : function () {

    // Reference Line
    if (this.state.secondary_data) {
        var diffs = data_to_plot.map(function(d, i) {
            return {
                'x1': d.omega,
                'x2': this.state.secondary_data[i].omega,
                'y1': d.weight * 0.98,
                'y2': this.state.secondary_data[i].weight * 0.98
            };
        });

        this.reference_omega_lines = this.reference_omega_lines.data(data_to_plot);
        this.reference_omega_lines.enter().append("line");
        this.reference_omega_lines.exit().remove();

        this.reference_omega_lines.transition().attr("x1", function(d) {
            return omega_scale(d.omega);
        })
            .attr("x2", function(d) {
                return omega_scale(d.omega);
            })
            .attr("y1", function(d) {
                return proportion_scale(-0.05);
            })
            .attr("y2", function(d) {
                return proportion_scale(d.weight);
            })
            .style("stroke", function(d) {
                return "#d62728";
            })
            .attr("class", "hyphy-omega-line-reference");
    } else {
        this.reference_omega_lines.remove();
        this.displacement_lines.remove();
    }

  },
  createOmegaLine : function() {
    // ** Omega Line (Red) ** //
    var omega_lines = this.plot.selectAll(".hyphy-omega-line").data(secondary_data ? secondary_data : data_to_plot);
    omega_lines.enter().append("line");
    omega_lines.exit().remove();
    omega_lines.transition().attr("x1", function(d) {
        return omega_scale(d.omega);
    })
        .attr("x2", function(d) {
            return omega_scale(d.omega);
        })
        .attr("y1", function(d) {
            return proportion_scale(-0.05);
        })
        .attr("y2", function(d) {
            return proportion_scale(d.weight);
        })
        .style("stroke", function(d) {
          return "#1f77b4";
        })
        .attr("class", "hyphy-omega-line");
  },
  createNeutralLine : function() {

    // ** Neutral Line (Blue) ** //
    var neutral_line = this.plot.selectAll(".hyphy-neutral-line").data([1]);
    neutral_line.enter().append("line").attr("class", "hyphy-neutral-line");
    neutral_line.exit().remove();
    neutral_line.transition().attr("x1", function(d) {
        return omega_scale(d);
    }).attr("x2", function(d) {
          return omega_scale(d);
      })
      .attr("y1", 0)
      .attr("y2", plot_height);

  },
  createXAxis : function() {

    // *** X-AXIS *** //
    var xAxis = d3.svg.axis()
        .scale(omega_scale)
        .orient("bottom");

    if (this.props.do_log_plot) {
        xAxis.ticks(10, has_zeros ? ".2r" : ".1r");
    }


    var x_axis = this.svg.selectAll(".x.axis");
    var x_label;

    if (x_axis.empty()) {
        x_axis = svg.append("g")
            .attr("class", "x hyphy-axis");

        x_label = x_axis.append("g").attr("class", "hyphy-axis-label x-label");
    } else {
        x_label = x_axis.select(".axis-label.x-label");
    }

    x_axis.attr("transform", "translate(" + margins["left"] + "," + (plot_height + margins["top"]) + ")")
        .call(xAxis);
    x_label = x_label.attr("transform", "translate(" + plot_width + "," + margins["bottom"] + ")")
        .selectAll("text").data(["\u03C9"]);
    x_label.enter().append("text");
    x_label.text(function(d) {
        return d
    }).style("text-anchor", "end")
      .attr("dy", "0.0em");

  },
  createYAxis : function() {

    // *** Y-AXIS *** //
    var yAxis = d3.svg.axis()
        .scale(proportion_scale)
        .orient("left")
        .ticks(10, ".1p");

    var y_axis = this.svg.selectAll(".y.hyphy-axis");
    var y_label;

    if (y_axis.empty()) {
        y_axis = svg.append("g")
            .attr("class", "y hyphy-axis");
        y_label = y_axis.append("g").attr("class", "hyphy-axis-label y-label");
    } else {
        y_label = y_axis.select(".hyphy-axis-label.y-label");
    }
    y_axis.attr("transform", "translate(" + margins["left"] + "," + margins["top"] + ")")
        .call(yAxis);
    y_label = y_label.attr("transform", "translate(" + (-margins["left"]) + "," + 0 + ")")
        .selectAll("text").data(["Proportion of sites"]);
    y_label.enter().append("text");
    y_label.text(function(d) {
        return d
    }).style("text-anchor", "start")
      .attr("dy", "-1em")

  },
  getInitialState: function() {
    //return {jobs: []};
  },
  componentDidMount: function() {
    this.initialize();
  },
  render: function() {
    return (
      <div class="col-lg-6">
          <div class="panel panel-default" id='{ this.model.props.key }'>
              <div class="panel-heading">
                  <h3 class="panel-title">&omega; distributions under the <strong>{ this.props.model.label }</strong> model</h3>
                  <p>
                      <small>Test branches are shown in <span class="hyphy-blue">blue</span> and reference branches are shown in <span class="hyphy-red">red</span></small>
                  </p>
                  <div class="btn-group">
                      <button id="export-{{this.props.model.key}}-svg" type="button" class="btn btn-default btn-sm">
                          <span class="glyphicon glyphicon-floppy-save"></span> SVG
                      </button>
                      <button id="export-{{this.props.model.key}}-png" type="button" class="btn btn-default btn-sm">
                          <span class="glyphicon glyphicon-floppy-save"></span> PNG
                      </button>
                  </div>
              </div>
              <div class="panel-body">
                  <svg id = "{ this.props.model.key }-svg" />
              </div>
          </div>
      </div>
    );
  }
});

// Will need to make a call to this
// omega distributions
React.render(
  <JobTable settings='settings' />,
  document.getElementById('table')
);


