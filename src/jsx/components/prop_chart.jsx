var React = require('react');
var datamonkey = require('../../datamonkey/datamonkey.js');

var PropChart = React.createClass({

  getDefaultProps : function() {
    return {
      svg_id : null,
      dimensions : { width : 600, height : 400 },
      margins : { 'left': 50, 'right': 15, 'bottom': 25, 'top': 35 },
      has_zeros : false,
      legend_id : null,
      do_log_plot : true,
      k_p : null,
      plot : null,
    };

  },

  getInitialState: function() {
    return { 
             model_name : this.props.name, 
             omegas : this.props.omegas,
             settings : this.props.settings,
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

    // clear svg
		d3.select("#prop-chart").html("");

    this.data_to_plot = this.state.omegas;

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
      this.has_zeros = this.data_to_plot.some(function(d) { return d.omega <= 0; });
    }

    this.plot_width = dimensions["width"] - margins['left'] - margins['right'],
    this.plot_height = dimensions["height"] - margins['top'] - margins['bottom'];

    var domain = this.state.settings["domain"];

    this.omega_scale = (this.do_log_plot 
        ? (this.has_zeros 
        ? d3.scale.pow().exponent (0.2) : d3.scale.log()) : d3.scale.linear())
        .range([0, this.plot_width]).domain(domain).nice();

    this.proportion_scale = d3.scale.linear().range([this.plot_height, 0]).domain([-0.05, 1]).clamp(true);

    // compute margins -- circle AREA is proportional to the relative weight
    // maximum diameter is (height - text margin)
    this.svg = d3.select("#" + this.svg_id)
                .attr("width", dimensions.width + margins['left'] + margins['right'])
                .attr("height", dimensions.height + margins['top'] + margins['bottom']);

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

    this.plot.attr("transform", "translate(" + this.margins["left"] + " , " + this.margins["top"] + ")");
    this.reference_omega_lines = this.plot.selectAll(".hyphy-omega-line-reference"),
    this.displacement_lines = this.plot.selectAll(".hyphy-displacement-line");

    this.createNeutralLine();
    this.createXAxis();
    this.createYAxis();
    this.setEvents();
    this.createOmegaLine(this.state.omegas);
		console.log('initialized everything');
    //_.map(this.props.omegas, function(d) { return this.createOmegaLine(d["omega"],d["prop"]); });

		console.log(this.svg);
    

  },

  createOmegaLine : function(omegas) {

    var self = this;
    var data_to_plot = this.data_to_plot;

    // generate color wheel from omegas
    self.colores_g = _.shuffle([ "#1f77b4"
      ,"#ff7f0e"
      ,"#2ca02c"
      ,"#d62728"
      ,"#9467bd"
      ,"#8c564b"
      ,"#e377c2"
      ,"#7f7f7f"
      ,"#bcbd22"
      ,"#17becf"
    ]);


    // ** Omega Line (Red) ** //
    var omega_lines = this.plot.selectAll(".hyphy-omega-line").data(omegas);
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
						return self.proportion_scale(d.prop);
				})
				.style("stroke", function(d) {
					var color = _.take(self.colores_g);
					self.colores_g = _.rest(self.colores_g);
					return color;
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

    if (this.do_log_plot) {
        xAxis.ticks(10, this.has_zeros ? ".2r" : ".1r");
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

    x_axis.attr("transform", "translate(" + this.margins["left"] + "," + (this.plot_height + this.margins["top"]) + ")")
        .call(xAxis);
    x_label = x_label.attr("transform", "translate(" + this.plot_width + "," + this.margins["bottom"] + ")")
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
    y_axis.attr("transform", "translate(" + this.margins["left"] + "," + this.margins["top"] + ")")
        .call(yAxis);
    y_label = y_label.attr("transform", "translate(" + (-this.margins["left"]) + "," + 0 + ")")
        .selectAll("text").data(["Proportion of sites"]);
    y_label.enter().append("text");
    y_label.text(function(d) {
        return d
    }).style("text-anchor", "start")
      .attr("dy", "-1em")

  },

  componentDidMount: function() {
    try {
      this.initialize();
    } catch(e) {};
  },

  componentWillReceiveProps: function(nextProps) {

    this.setState({
                    model_name : nextProps.name, 
                    omegas : nextProps.omegas
                  });

  },

  componentDidUpdate : function() {
    try {
      this.initialize();
    } catch(e) {};

  },

  render: function() {

    this.save_svg_id = "export-" + this.svg_id + "-svg";
    this.save_png_id = "export-" + this.svg_id + "-png";

    return (
        <div className="panel panel-default" id={ this.state.model_name }>
            <div className="panel-heading">
                <h3 className="panel-title"><strong>{ this.state.model_name}</strong></h3>
                <p>&omega; distribution</p>
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
    );
  }
});

function render_prop_chart(model_name, omegas, settings) {
  return React.render(
    <PropChart name={model_name} omegas={omegas} settings={settings} />,
    document.getElementById("primary-omega-tag")
  );
}

function rerender_prop_chart(model_name, omeags, settings) {

  $("#primary-omega-tag").empty();
  return render_prop_chart(model_name, omeags, settings);

}

module.exports.render_prop_chart = render_prop_chart;
module.exports.rerender_prop_chart = rerender_prop_chart;
module.exports.PropChart = PropChart;

