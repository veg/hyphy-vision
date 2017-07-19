var React = require("react"),
  d3 = require("d3"),
  _ = require("underscore"),
  d3_save_svg = require("d3-save-svg"),
  graphDefaultColorPallette = d3.scale.category10().domain(_.range(10));

import { saveSvgAsPng } from "save-svg-as-png";


/* 
 * Creates a dropdown menu to be used with any 
 * component that extends BaseGraph
 */
class GraphMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      xaxis: "Site",
      yaxis: props.y_options ? props.y_options[0] : "alpha"
    };
  }

  handleSelection(e) {
    var dimension = e.target.dataset.dimension;
    var axis = e.target.dataset.axis;

    var state_to_update = {};
    state_to_update[axis] = dimension;
    this.setState(state_to_update);

    this.props.axisSelectionEvent(e);
  }

  dimensionOptionElement(axis, value) {
    var self = this;

    return (
      <li key={value}>
        <a
          href="javascript:void(0);"
          tabIndex="-1"
          data-dimension={value}
          data-axis={axis}
          onClick={self.handleSelection.bind(self)}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </li>
    );
  }

  AxisButton(options, selected, axis, label) {
    var self = this;

    var DimensionOptions = [];

    DimensionOptions = _.map(
      options,
      function(value) {
        return self.dimensionOptionElement(axis, value);
      },
      self
    );

    if (_.size(_.keys(options)) <= 1) {
      return <div />;
    } else {
      return (
        <div className="input-group">
          <span className="input-group-addon">{label}: </span>
          <ul className="dropdown-menu">
            {DimensionOptions}
          </ul>
          <button
            className="btn btn-default btn-sm dropdown-toggle form-control"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            dangerouslySetInnerHTML={{__html: selected+'<span className="caret" />'}}
          />
        </div>
      );
    }
  }

  render() {
    var self = this;
    var XAxisButton = self.AxisButton(
      self.props.x_options,
      self.state.xaxis,
      "xaxis",
      "X-axis"
    );
    var YAxisButton = self.AxisButton(
      self.props.y_options,
      self.state.yaxis,
      "yaxis",
      "Y-axis"
    );

    var navStyle = { borderBottom: "none" };

    return (
      <nav className="navbar" style={navStyle}>
        <form className="navbar-form">
          <div className="form-group navbar-left">
            <div className="input-group">
              {XAxisButton}
              {YAxisButton}
            </div>
          </div>
        </form>
      </nav>
    );
  }
}

class BaseGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x_label: "site",
      y_label: "alpha"
    };
  }

  setXAxis(column) {
    this.setState({ xaxis: column });
  }

  setYAxis(column) {
    this.setState({ yaxis: column });
  }

  computeRanges() {
    var self = this;

    return {
      x_range: d3.extent(self.props.x),
      y_range: d3.extent(
        _.flatten(
          _.map(self.props.y, function(data_point) {
            return d3.extent(data_point);
          })
        )
      )
    };
  }

  computeDimensions() {
    var self = this;

    var height =
      self.props.height - self.props.marginTop - self.props.marginBottom;
    var width =
      self.props.width - self.props.marginLeft - self.props.marginRight;

    return { height: height, width: width };
  }

  makeTitle(point) {
    return (
      "x = " +
      this.props.numberFormat(point[0]) +
      " y = " +
      this.props.numberFormat(point[1])
    );
  }

  setTracker(main_graph, point) {
    if (this.props.tracker) {
      var tracker = main_graph.selectAll(".graph-tracker").data([[""]]);
      tracker.enter().append("g");
      tracker
        .attr("transform", "translate (50,50)")
        .classed("graph-tracker", true);

      if (point) {
        var text_element = tracker.selectAll("text").data(function(d) {
          return d;
        });
        text_element.enter().append("text");
        text_element
          .text(this.makeTitle(point))
          .attr("background-color", "red");
      } else {
        tracker.selectAll("text").remove();
      }
    }
  }

  doTransition(d3sel) {
    if (this.props.transitions) {
      return d3sel.transition();
    }
    return d3sel;
  }

  renderAxis(scale, location, label, dom_element) {
    var self = this;
    var xAxis = d3.svg.axis().scale(scale).orient(location); // e.g. bottom
    self.doTransition(d3.select(dom_element)).call(xAxis);
  }

  xAxisLabel() {
    var transform_x = this.props.width/2;
    var transform_y = this.props.height-(this.props.marginTop/3);
    return(<text textAnchor="middle" transform={"translate("+transform_x+","+transform_y+")"}>{ this.props.x_label }</text>);
  }

  yAxisLabel() {
    var transform_x = (this.props.marginLeft - 25)/2;
    var transform_y = this.props.height/2;
    return(<text
      textAnchor="middle"
      transform={"translate("+transform_x+","+transform_y+")rotate(-90)"}
      dangerouslySetInnerHTML={{ __html: this.props.y_label }}
    />);
  }

  //TODO : See if this can be removed
  makeClasses(key) {
    var className = null,
      styleDict = null;

    if (key in this.props.renderStyle) {
      if ("class" in this.props.renderStyle[key]) {
        className = this.props.renderStyle[key]["class"];
      }
      if ("style" in this.props.renderStyle[key]) {
        styleDict = this.props.renderStyle[key]["style"];
      }
    }

    return { className: className, style: styleDict };
  }

  makeScale(type, domain, range) {
    var scale;
    if (_.isFunction(type)) {
      scale = type;
    } else {
      switch (type) {
        case "linear":
          scale = d3.scale.linear();
          break;
        case "log":
          scale = d3.scale.log();
          break;
        default:
          scale = d3.scale.linear();
      }
    }
    return scale.domain(domain).range(range);
  }

  render() {

    var self = this;

    var main = self.computeDimensions(),
      { x_range, y_range } = self.computeRanges();

    var x_scale = self.makeScale(self.props.xScale, x_range, [0, main.width]),
      y_scale = self.makeScale(self.props.yScale, y_range, [main.height, 0]);

    var xAxisLabel = self.xAxisLabel();
    var yAxisLabel = self.yAxisLabel();

    return (
      <div>
        <svg width={self.props.width} height={self.props.height} id="dm-chart">
          <rect width="100%" height="100%" fill="white" />
          <g
            transform={
              "translate(" +
              self.props.marginLeft +
              "," +
              self.props.marginTop +
              ")"
            }
            ref={_.partial(self.renderGraph, x_scale, y_scale).bind(self)}
          />
          {self.props.xAxis
            ? <g
                {...self.makeClasses("axis")}
                transform={
                  "translate(" +
                  self.props.marginLeft +
                  "," +
                  (main.height +
                    self.props.marginTop +
                    self.props.marginXaxis) +
                  ")"
                }
                ref={_.partial(
                  self.renderAxis,
                  x_scale,
                  "bottom",
                  self.props.xaxis
                ).bind(self)}
              />
            : null}
          {self.props.yAxis
            ? <g
                {...self.makeClasses("axis")}
                transform={
                  "translate(" +
                  (self.props.marginLeft - self.props.marginYaxis) +
                  "," +
                  self.props.marginTop +
                  ")"
                }
                ref={_.partial(
                  self.renderAxis,
                  y_scale,
                  "left",
                  self.props.yLabel
                ).bind(self)}
              />
            : null}
            { xAxisLabel }
            { yAxisLabel }
        </svg>
      </div>
    );
  }
}

BaseGraph.defaultProps = {
  width: 800,
  height: 400,
  marginLeft: 35,
  marginRight: 10,
  marginTop: 10,
  marginBottom: 35,
  marginXaxis: 5,
  marginYaxis: 5,
  graphData: null,
  renderStyle: { axis: { class: "hyphy-axis" }, points: { class: "" } },
  xScale: "linear",
  yScale: "linear",
  xAxis: true,
  yAxis: true,
  transitions: false,
  numberFormat: d3.format(".4r"),
  tracker: true,
  xLabel: null,
  yLabel: null,
  x: [],
  y: []
};

class ScatterPlot extends BaseGraph {
  renderGraph(x_scale, y_scale, dom_element) {
    var self = this,
      main_graph = d3.select(dom_element);

    _.each(
      this.props.y,
      _.bind(function(y, i) {
        var series_color = _dmGraphDefaultColorPallette(i);

        var data_points = main_graph
          .selectAll("circle.series_" + i)
          .data(_.zip(this.props.x, y));
        data_points.enter().append("circle");
        data_points.exit().remove();

        data_points
          .on("mouseover", function(t) {
            self.setTracker(main_graph, t);
          })
          .on("mouseout", function(t) {
            self.setTracker(main_graph, null);
          });

        this.doTransition(data_points.classed("series_" + i, true))
          .attr("cx", function(d) {
            return x_scale(d[0]);
          })
          .attr("cy", function(d) {
            return y_scale(d[1]);
          })
          .attr("r", function(d) {
            return 3;
          })
          .attr("fill", series_color);
      }, this)
    );
  }
}

class Series extends BaseGraph {

  renderGraph(x_scale, y_scale, dom_element) {
    var self = this,
      main_graph = d3.select(dom_element);

    _.each(self.props.y, function(y, i) {
      var series_color = graphDefaultColorPallette(i);

      var series_line = d3.svg
        .area()
        .interpolate("step")
        .y1(function(d) {
          return y_scale(d[1]);
        })
        .x(function(d) {
          return x_scale(d[0]);
        });

      if (y_scale.domain()[0] < 0) {
        series_line.y0(function(d) {
          return y_scale(0);
        });
      } else {
        series_line.y0(y_scale(y_scale.domain()[0]));
      }

      var data_points = main_graph
        .selectAll("path.series_" + i)
        .data([_.zip(self.props.x, y)]);
      data_points.enter().append("path");
      data_points.exit().remove();

      self
        .doTransition(data_points.classed("series_" + i, true))
        .attr("d", series_line)
        .attr("fill", series_color)
        .attr("fill-opacity", 0.25)
        .attr("stroke", series_color)
        .attr("stroke-width", "0.5px");

      if (self.props.doDots) {
        var data_points = main_graph
          .selectAll("circle.series_" + i)
          .data(_.zip(self.props.x, y));
        data_points.enter().append("circle");
        data_points.exit().remove();

        data_points
          .on("mouseover", function(t) {
            self.setTracker(main_graph, t);
          })
          .on("mouseout", function(t) {
            self.setTracker(main_graph, null);
          });

        self
          .doTransition(data_points.classed("series_" + i, true))
          .attr("cx", function(d) {
            return x_scale(d[0]);
          })
          .attr("cy", function(d) {
            return y_scale(d[1]);
          })
          .attr("r", function(d) {
            return 2;
          })
          .attr("fill", series_color);
      }
    });
  }
}

class SiteGraph extends React.Component {
  constructor(props){
    super(props);
    this.updateAxisSelection = this.updateAxisSelection.bind(this);
    this.state = { active_column: props.columns[0] };
  }
  updateAxisSelection(e) {
    var dimension = e.target.dataset.dimension,
      axis = e.target.dataset.axis;

    this.setState({
      axis: dimension,
      active_column: dimension
    });
  }
  savePNG(){
    saveSvgAsPng(document.getElementById("dm-chart"), "datamonkey-chart.png");
  }
  saveSVG(){
    d3_save_svg.save(d3.select("#dm-chart").node(), {filename: "datamonkey-chart"});
  }
  render(){
    var self = this,
      index = this.props.columns.indexOf(this.state.active_column),
      x = _.range(1, this.props.rows.length+1),
      y = [this.props.rows.map(row=>row[index])];

    return (<div className="row">
      <div className="col-md-6">
        <GraphMenu
          x_options={"Site"}
          y_options={this.props.columns}
          axisSelectionEvent={self.updateAxisSelection}
        />
      </div>
      <div className="col-md-6">
        <button
          id="export-chart-svg"
          type="button"
          className="btn btn-default btn-sm pull-right btn-export"
          onClick={self.saveSVG}
        >
          <span className="glyphicon glyphicon-floppy-save" /> Export Chart to SVG
        </button>
        <button
          id="export-chart-png"
          type="button"
          className="btn btn-default btn-sm pull-right btn-export"
          onClick={self.savePNG}
        >
          <span className="glyphicon glyphicon-floppy-save" /> Export Chart to PNG
        </button>

      </div>
      <div className="col-md-12">
        <Series
          x={x}
          y={y}
          x_label={"Site"}
          y_label={self.state.active_column}
          marginLeft={80}
          width={900}
          transitions={true}
          doDots={true}
        />
      </div>
    </div>);
  }
}

module.exports.DatamonkeyGraphMenu = GraphMenu;
module.exports.DatamonkeyScatterplot = ScatterPlot;
module.exports.DatamonkeySeries = Series;
module.exports.DatamonkeySiteGraph = SiteGraph;

