import _ from 'lodash';
require("react");
require("d3");

var OmegaPlot = React.createClass({

  getDefaultProps : function() {
    return {
      svg_id : null,
      dimensions : { width : 600, height : 400 },
      margins : { 'left': 50, 'right': 15, 'bottom': 35, 'top': 35 },
      has_zeros : false,
      legend_id : null,
      do_log_plot : true,
      k_p : null,
      plot : null,
    };

  },

  setEvents : function() {
    var self = this;

    d3.select("#" + this.save_svg_id).on('click', function(e) {
      datamonkey.save_image("svg", "#" + self.svg_id);
    });

    d3.select("#" + this.save_png_id).on('click', function(e) {
      datamonkey.save_image("png", "#" + self.svg_id);
    });
  },

  initialize : function() {

    if(!this.state.omegas || !this.state.omegas["Reference"]) {
      return;
    }

    var data_to_plot = this.state.omegas["Reference"];
    var secondary_data = this.state.omegas["Test"];

    // Set props from settings
    this.props.svg_id = this.props.settings.svg_id;
    this.props.dimensions = this.props.settings.dimensions || this.props.dimensions;
    this.props.legend_id = this.props.settings.legend || this.props.legend_id;
    this.props.do_log_plot = this.props.settings.log || this.props.do_log_plot;
    this.props.k_p = this.props.settings.k || this.props.k_p;

    var dimensions = this.props.dimensions;
    var margins = this.props.margins;

    if (this.props.do_log_plot) {
      this.props.has_zeros = data_to_plot.some(function(d) {return d.omega <= 0;});
      if (secondary_data) {
        this.props.has_zeros = this.props.has_zeros || data_to_plot.some(function(d) {return d.omega <= 0;});
      }
    }

    this.plot_width = dimensions["width"] - margins['left'] - margins['right'],
    this.plot_height = dimensions["height"] - margins['top'] - margins['bottom'];

    var domain = this.state.settings["domain"] || d3.extent(secondary_data ? secondary_data.map(function(d) {
        return d.omega;
    }).concat(data_to_plot.map(function(d) {
        return d.omega;
    })) : data_to_plot.map(function(d) {
        return d.omega;
    }));

    domain[0] *= 0.5;

    this.omega_scale = (this.props.do_log_plot ? (this.props.has_zeros ? d3.scale.pow().exponent (0.2) : d3.scale.log()) : d3.scale.linear())
        .range([0, this.plot_width]).domain(domain).nice();

    this.proportion_scale = d3.scale.linear().range([this.plot_height, 0]).domain([-0.05, 1]).clamp(true);

    // compute margins -- circle AREA is proportional to the relative weight
    // maximum diameter is (height - text margin)
    this.svg = d3.select("#" + this.props.settings.svg_id).attr("width", dimensions.width).attr("height", dimensions.height);
    this.plot = this.svg.selectAll(".container");

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

    this.plot.attr("transform", "translate(" + this.props.margins["left"] + " , " + this.props.margins["top"] + ")");
    this.reference_omega_lines = this.plot.selectAll(".hyphy-omega-line-reference"),
    this.displacement_lines = this.plot.selectAll(".hyphy-displacement-line");

    this.createDisplacementLine();
    this.createNeutralLine();
    this.createOmegaLine();
    this.createReferenceLine();
    this.createXAxis();
    this.createYAxis();
    this.setEvents();

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

    var self = this;
    var data_to_plot = this.state.omegas["Reference"];
    var secondary_data = this.state.omegas["Test"];

    if(secondary_data) {
        var diffs = data_to_plot.map(function(d, i) {
            return {
                'x1': d.omega,
                'x2': secondary_data[i].omega,
                'y1': d.weight * 0.98,
                'y2': secondary_data[i].weight * 0.98
            };
        });

      this.displacement_lines = this.displacement_lines.data(diffs);
      this.displacement_lines.enter().append("path");
      this.displacement_lines.exit().remove();
      this.displacement_lines.transition().attr("d", function(d) {
          return self.makeSpring(self.omega_scale(d.x1),
              self.omega_scale(d.x2),
              self.proportion_scale(d.y1 * 0.5),
              self.proportion_scale(d.y2 * 0.5),
              5,
              5);
      }).attr("marker-end", "url(#arrowhead)")
        .attr("class", "hyphy-displacement-line");
    }

  },
  createReferenceLine : function () {

    var data_to_plot = this.state.omegas["Reference"];
    var secondary_data = this.state.omegas["Test"];
    var self = this;

    if(secondary_data) {
        this.reference_omega_lines = this.reference_omega_lines.data(data_to_plot);
        this.reference_omega_lines.enter().append("line");
        this.reference_omega_lines.exit().remove();

        this.reference_omega_lines.transition().attr("x1", function(d) {
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
                return "#d62728";
            })
            .attr("class", "hyphy-omega-line-reference");
    } else {
        this.reference_omega_lines.remove();
        this.displacement_lines.remove();
    }

  },
  createOmegaLine : function() {

    var data_to_plot = this.state.omegas["Reference"];
    var secondary_data = this.state.omegas["Test"];
    var self = this;

    // ** Omega Line (Red) ** //
    var omega_lines = this.plot.selectAll(".hyphy-omega-line").data(secondary_data ? secondary_data : data_to_plot);
    omega_lines.enter().append("line");
    omega_lines.exit().remove();
    omega_lines.transition().attr("x1", function(d) {
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
          return "#1f77b4";
        })
        .attr("class", "hyphy-omega-line");
  },
  createNeutralLine : function() {
    var self = this;

    // ** Neutral Line (Blue) ** //
    var neutral_line = this.plot.selectAll(".hyphy-neutral-line").data([1]);
    neutral_line.enter().append("line").attr("class", "hyphy-neutral-line");
    neutral_line.exit().remove();
    neutral_line.transition().attr("x1", function(d) {
        return self.omega_scale(d);
    }).attr("x2", function(d) {
          return self.omega_scale(d);
      })
      .attr("y1", 0)
      .attr("y2", this.plot_height);

  },
  createXAxis : function() {

    // *** X-AXIS *** //
    var xAxis = d3.svg.axis()
        .scale(this.omega_scale)
        .orient("bottom");

    if (this.props.do_log_plot) {
        xAxis.ticks(10, this.props.has_zeros ? ".2r" : ".1r");
    }

    var x_axis = this.svg.selectAll(".x.axis");
    var x_label;

    if (x_axis.empty()) {
        x_axis = this.svg.append("g")
            .attr("class", "x hyphy-axis");

        x_label = x_axis.append("g").attr("class", "hyphy-axis-label x-label");
    } else {
        x_label = x_axis.select(".axis-label.x-label");
    }

    x_axis.attr("transform", "translate(" + this.props.margins["left"] + "," + (this.plot_height + this.props.margins["top"]) + ")")
        .call(xAxis);
    x_label = x_label.attr("transform", "translate(" + this.plot_width + "," + this.props.margins["bottom"] + ")")
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
        .scale(this.proportion_scale)
        .orient("left")
        .ticks(10, ".1p");

    var y_axis = this.svg.selectAll(".y.hyphy-axis");
    var y_label;

    if (y_axis.empty()) {
        y_axis = this.svg.append("g")
            .attr("class", "y hyphy-axis");
        y_label = y_axis.append("g").attr("class", "hyphy-axis-label y-label");
    } else {
        y_label = y_axis.select(".hyphy-axis-label.y-label");
    }
    y_axis.attr("transform", "translate(" + this.props.margins["left"] + "," + this.props.margins["top"] + ")")
        .call(yAxis);
    y_label = y_label.attr("transform", "translate(" + (-this.props.margins["left"]) + "," + 0 + ")")
        .selectAll("text").data(["Proportion of sites"]);
    y_label.enter().append("text");
    y_label.text(function(d) {
        return d
    }).style("text-anchor", "start")
      .attr("dy", "-1em")

  },

  getInitialState: function() {
    return { 
              omegas : this.props.omegas,
              settings : this.props.settings
           };
  },

  componentWillReceiveProps: function(nextProps) {

    this.setState({
             omegas : nextProps.omegas 
           });
  },

  componentDidUpdate : function() {
    this.initialize();
  },

  componentDidMount: function() {
    this.initialize();
  },

  render: function() {

    var key = this.props.omegas.key,
        label = this.props.omegas.label;

    this.svg_id = key + "-svg";
    this.save_svg_id = "export-" + key + "-svg";
    this.save_png_id = "export-" + key + "-png";
    

    return (
      <div className="col-lg-6">
          <div className="panel panel-default" id={ key }>
              <div className="panel-heading">
                  <h3 className="panel-title">&omega; distributions under the <strong>{ label }</strong> model</h3>
                  <p>
                      <small>Test branches are shown in <span className="hyphy-blue">blue</span> and reference branches are shown in <span className="hyphy-red">red</span></small>
                  </p>
                  <div className="btn-group">
                      <button id={ this.save_svg_id } type="button" className="btn btn-default btn-sm">
                          <span className="glyphicon glyphicon-floppy-save"></span> SVG
                      </button>
                      <button id={ this.save_png_id } type="button" className="btn btn-default btn-sm">
                          <span className="glyphicon glyphicon-floppy-save"></span> PNG
                      </button>
                  </div>
              </div>
              <div className="panel-body">
                  <svg id ={ this.svg_id } />
              </div>
          </div>
      </div>
    );
  }
});

var OmegaPlotGrid = React.createClass({

  getInitialState: function() {
    return { omega_distributions: this.getDistributions(this.props.json) };
  },

  componentWillReceiveProps : function(nextProps) {

    this.setState({ 
      omega_distributions: this.getDistributions(nextProps.json) 
    });

  },

  getDistributions : function(json) {

    var omega_distributions = {};

    if(!json) {
      return [];
    }

    for (var m in json["fits"]) {
        var this_model = json["fits"][m];
        omega_distributions[m] = {};
        var distributions = [];
        for (var d in this_model["rate-distributions"]) {
            var this_distro = this_model["rate-distributions"][d];
            var this_distro_entry = [d, "", "", ""];
            omega_distributions[m][d] = this_distro.map(function(d) {
                return {
                    'omega': d[0],
                    'weight': d[1]
                };
            });
        }
    }

    _.each(omega_distributions, function(item,key) { 
      item.key   = key.toLowerCase().replace(/ /g, '-'); 
      item.label = key; 
    });

    var omega_distributions = _.filter(omega_distributions, function(item) {
      return _.isObject(item["Reference"]);
    });

    return omega_distributions;
  },

  render: function() {

    var OmegaPlots = _.map(this.state.omega_distributions, function(item, key) {

      var model_name = key;
      var omegas = item;

      var settings = {
        svg_id : omegas.key + '-svg',
        dimensions : { width : 600, height : 400 },
        margins : { 'left': 50, 'right': 15, 'bottom': 35, 'top': 35 },
        has_zeros : false,
        legend_id : null,
        do_log_plot : true,
        k_p : null,
        plot : null
      };

      return (
        <OmegaPlot name={model_name} omegas={omegas} settings={settings} />
      )

    });

    return (
    <div>
      {OmegaPlots}
    </div>
    );
  }

});
