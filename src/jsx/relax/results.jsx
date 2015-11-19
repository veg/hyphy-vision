//var distributions_to_chart = _.filter(omega_distributions, function(d) { return d.hasOwnProperty('Reference') });

//if (settings['chart-append-html']) {
//    $("#hyphy-omega-plots").append(omega_plot_html);
//    settings['chart-append-html'] = false;
//}

// Replace with for loop
//_.each(distributions_to_chart, function(item, key) {

//  var svg_element =  item.key + '-svg';
//  var container_element =  '#' + item.key;
//  var export_svg =  '#export-' + item.key + '-svg';
//  var export_png =  '#export-' + item.key + '-png';

//  if(item.hasOwnProperty('Reference')) {

//    omegaPlot(item["Reference"], item["Test"], {'svg' : svg_element });
//    d3.select(container_element).style ('display', 'block');

//    // TODO: Make this a data-bind
//    $(export_svg).on('click', function(e) { 
//      datamonkey.save_image("svg", '#' + svg_element); 
//    });

//    $(export_png).on('click', function(e) { 
//      datamonkey.save_image("png", '#' + svg_element); 
//    });
//  }

//});

//[> Distribution plotters <]
//omegaPlot = function(data_to_plot, secondary_data, settings) {

// setup //

//    var svg_id = settings["svg"] || "primary_omega_plot";
//    var legend_id   = settings["legend"] || null;
//    var do_log_plot = settings["log"] || true;
//    var has_zeros   = false;
//    if (do_log_plot) {
//        has_zeros = data_to_plot.some (function (d) {return d.omega <= 0;});
//        if (secondary_data) {
//            has_zeros = has_zeros || data_to_plot.some (function (d) {return d.omega <= 0;});
//        }
//    }
//    var dimensions = settings["dimensions"] || {
//        "width": 600,
//        "height": 400
//    };
//    var margins = {
//            'left': 50,
//            'right': 15,
//            'bottom': 35,
//            'top': 35
//        },
//        plot_width = dimensions["width"] - margins['left'] - margins['right'],
//        plot_height = dimensions["height"] - margins['top'] - margins['bottom'];
//    var k_p = settings["k"] || null;
//    var domain = settings["domain"] || d3.extent(secondary_data ? secondary_data.map(function(d) {
//        return d.omega;
//    }).concat(data_to_plot.map(function(d) {
//        return d.omega;
//    })) : data_to_plot.map(function(d) {
//        return d.omega;
//    }));
//    domain[0] *= 0.5;
//    var omega_scale = (do_log_plot ? (has_zeros ? d3.scale.pow().exponent (0.2) : d3.scale.log()) : d3.scale.linear())
//        .range([0, plot_width]).domain(domain).nice(),
//        proportion_scale = d3.scale.linear().range([plot_height, 0]).domain([-0.05, 1]).clamp(true);
//    // compute margins -- circle AREA is proportional to the relative weight
//    // maximum diameter is (height - text margin)


//    var svg = d3.select("#" + svg_id).attr("width", dimensions.width)
//        .attr("height", dimensions.height),
//        plot = svg.selectAll(".container");
//    svg.selectAll("defs").remove();
//    svg.append("defs").append("marker")
//        .attr("id", "arrowhead")
//        .attr("refX", 10) [>must be smarter way to calculate shift<]
//        .attr("refY", 4)
//        .attr("markerWidth", 10)
//        .attr("markerHeight", 8)
//        .attr("orient", "auto")
//        .attr("stroke", "#000")
//        .attr("fill", "#000")
//        .append("path")
//        .attr("d", "M 0,0 V8 L10,4 Z");
//    if (plot.empty()) {
//        plot = svg.append("g").attr("class", "container");
//    }
//    plot.attr("transform", "translate(" + margins["left"] + " , " + margins["top"] + ")");
//    var reference_omega_lines = plot.selectAll(".hyphy-omega-line-reference"),
//        displacement_lines = plot.selectAll(".hyphy-displacement-line");
//    if (secondary_data) {
//        var diffs = data_to_plot.map(function(d, i) {
//            return {
//                'x1': d.omega,
//                'x2': secondary_data[i].omega,
//                'y1': d.weight * 0.98,
//                'y2': secondary_data[i].weight * 0.98
//            };
//        });
//        displacement_lines = displacement_lines.data(diffs);
//        displacement_lines.enter().append("path");
//        displacement_lines.exit().remove();
//        displacement_lines.transition().attr("d", function(d) {
//            return makeSpring(omega_scale(d.x1),
//                omega_scale(d.x2),
//                proportion_scale(d.y1 * 0.5),
//                proportion_scale(d.y2 * 0.5),
//                5,
//                5);
//        })
//            .attr("marker-end", "url(#arrowhead)")
//            .attr("class", "hyphy-displacement-line");
//        reference_omega_lines = reference_omega_lines.data(data_to_plot);
//        reference_omega_lines.enter().append("line");
//        reference_omega_lines.exit().remove();
//        reference_omega_lines.transition().attr("x1", function(d) {
//            return omega_scale(d.omega);
//        })
//            .attr("x2", function(d) {
//                return omega_scale(d.omega);
//            })
//            .attr("y1", function(d) {
//                return proportion_scale(-0.05);
//            })
//            .attr("y2", function(d) {
//                return proportion_scale(d.weight);
//            })
//            .style("stroke", function(d) {
//                return "#d62728";
//            })
//            .attr("class", "hyphy-omega-line-reference");
//    } else {
//        reference_omega_lines.remove();
//        displacement_lines.remove();
//    }




var makeSpring = function(x1, x2, y1, y2, step, displacement) {

  if (x1 == x2) {
      y1 = Math.min(y1, y2);
      return "M" + x1 + "," + (y1 - 40) + "v20";
  }

  var spring_data = [],
      point = [x1, y1],
      angle = Math.atan2(y2 - y1, x2 - x1);

  step = [step * Math.cos(angle), step * Math.sin(angle)];
  //spring_data.push (point);
  k = 0;
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

}


// ** Omega Line (Red) ** //
var omega_lines = plot.selectAll(".hyphy-omega-line").data(secondary_data ? secondary_data : data_to_plot);
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



// ** Neutral Line (Blue) ** //
var neutral_line = plot.selectAll(".hyphy-neutral-line").data([1]);
neutral_line.enter().append("line").attr("class", "hyphy-neutral-line");
neutral_line.exit().remove();
neutral_line.transition().attr("x1", function(d) {
    return omega_scale(d);
}).attr("x2", function(d) {
        return omega_scale(d);
    })
    .attr("y1", 0)
    .attr("y2", plot_height);




// *** X-AXIS *** //
var xAxis = d3.svg.axis()
    .scale(omega_scale)
    .orient("bottom");

if (do_log_plot) {
    xAxis.ticks(10, has_zeros ? ".2r" : ".1r");
}


var x_axis = svg.selectAll(".x.axis");
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


// *** Y-AXIS *** //
var yAxis = d3.svg.axis()
    .scale(proportion_scale)
    .orient("left")
    .ticks(10, ".1p");

var y_axis = svg.selectAll(".y.hyphy-axis");
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

// *** Main Plot *** //

var OmegaPlot = React.createClass({

  // attributes

  //loadJobsFromServer: function() {
  //  var self = this;
  //  d3.json(this.props.url, function(data) {
  //    self.setState({jobs: data});
  //  });
  //},
  getInitialState: function() {
    //return {jobs: []};
  },
  componentDidMount: function() {
    //this.loadJobsFromServer();
    //setInterval(this.loadJobsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div class="col-lg-6">
          <div class="panel panel-default" id='{ this.model.props.key }'>
              <div class="panel-heading">
                  <h3 class="panel-title">&omega; distributions under the <strong>{{ this.props.model.label }}</strong> model</h3>
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
                  <svg id={{this.props.model.key}}-svg />
              </div>
          </div>
      </div>
    );
  }
});

// Will need to make a call to this
// omega distributions
React.render(
  <JobTable data='/jobqueue/json' pollInterval={2000} />,
  document.getElementById('table')
);


