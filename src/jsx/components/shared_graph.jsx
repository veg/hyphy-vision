var React = require('react');
var datamonkey = require('../../datamonkey/datamonkey.js');

var _dmGraphDefaultColorPallette = d3.scale.category10().domain (_.range (10));

var GraphNav = React.createClass({

  getDefaultProps() {
    return {
      fields: ''  
    }
  },

  render: function() {
    return(<nav className="navbar">
        <form className="navbar-form ">
          <div className="form-group navbar-left">
              <div className="input-group">
                 <span className="input-group-addon">X-axis:</span>
                  <ul className="dropdown-menu">
                   {_.map(['Site'].concat(_.pluck (self.props.headers,0)), function (value) {
                        return (
                        <li key = {value}>
                            <a href="#" tabIndex="-1" onClick={_.partial(self.dm_xAxis,value)}>
                                {value}
                             </a>
                        </li>
                        );
                        }
                    )
                    }
                  </ul>
                  <button className="btn btn-default btn-sm dropdown-toggle form-control" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {self.state.xLabel}
                    <span className="caret"></span>
                  </button>
                </div>
              <div className="input-group">
                 <span className="input-group-addon">Y-axis:</span>

                   <ul className="dropdown-menu">
                   {_.map (_.pluck (self.props.headers,0), function (value) {
                        return (
                        <li key = {value}>
                            <a href="#" tabIndex="-1" onClick={_.partial(self.dm_yAxis,value)}>
                                {value}
                             </a>
                        </li>
                        );
                        }
                    )
                    }
                  </ul>
                  <button className="btn btn-default btn-sm dropdown-toggle form-control" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {self.state.yLabel}
                    <span className="caret"></span>
                  </button>
              </div>
              <div className="input-group">
                  <span className="input-group-addon">Ambiguities </span>
                      <ul className="dropdown-menu">
                            {
                                _.map (this.state.ambigOptions, function (value, index) {
                                    return (
                                        <li key={index}>
                                            <a href="#" tabIndex="-1" onClick={_.partial(self.dm_setAmbigOption,value)}>
                                                {value}
                                            </a>
                                        </li>
                                    );
                                })
                            }
                      </ul>
                  <button className="btn btn-default btn-sm dropdown-toggle form-control" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {self.state.ambigHandling} <span className="caret"></span>
                  </button>

            </div>
            </div>

        </form>
    </nav>);
  }

});

var _dmGraphBaseDefinitions = {



    getDefaultProps : function () {
        return {
            width  : 800,
            height : 400,
            marginLeft: 35,
            marginRight: 10,
            marginTop: 10,
            marginBottom: 35,
            marginXaxis : 5,
            marginYaxis : 5,
            graphData: null,
            renderStyle: {"axis" : {"class" : "hyphy-axis"}, "points" : {"class" : ""}},
            xScale : "linear",
            yScale : "linear",
            xAxis: true,
            yAxis: true,
            transitions: false,
            numberFormat: d3.format (".4r"),
            tracker: true,
            xLabel : null,
            yLabel : null,
            x: [],
            y: [],
        };
    },

    getInitialState: function () {
        return null;
    },

    dm_computeRanges: function () {
        return {
            x_range : d3.extent (this.props.x),
            y_range : d3.extent (_.flatten (_.map (this.props.y, function (data_point) {return d3.extent (data_point);})))
        };
    },

    dm_computeDimensions : function () {
        return {
            main :  {width: this.props.width - this.props.marginLeft - this.props.marginRight,
                     height: this.props.height - this.props.marginTop - this.props.marginBottom}

        };
    },

    componentWillReceiveProps: function (nextProps)  {

    },

    /*shouldComponentUpdate: function () {
        return false;
    },*/

    componentDidMount : function () {

        //this.dm_renderGraph (x_scale, y_scale, ReactDOM.findDOMNode(this));
    },

    dm_makeTitle: function (point) {
         return ("x = " + this.props.numberFormat(point[0]) + " y = " + this.props.numberFormat(point[1]));
    },

    dm_setTracker: function (main_graph, point) {
        if (this.props.tracker) {
            var tracker = main_graph.selectAll (".graph-tracker").data ([[""]]);
            tracker.enter().append ("g");
            tracker.attr ("transform", "translate (50,50)").classed ("graph-tracker", true);

             if (point) {
                var text_element = tracker.selectAll ("text").data (function (d) {return d;});
                text_element.enter().append ("text");
                text_element.text (this.dm_makeTitle (point)).attr ("background-color", "red");
             } else {
                tracker.selectAll ("text").remove();
             }
        }
    },

    dm_renderGraph: function (x_scale, y_scale, dom_element) {

        var main_graph  = d3.select (dom_element);
        var self = this;
        var dot_classes = this.dm_makeClasses ("points");


       _.each (this.props.y, _.bind (function (y, i) {
            var series_color = _dmGraphDefaultColorPallette (i);

            var data_points = main_graph.selectAll ("circle.series_" + i).data (_.zip (this.props.x, y));
            data_points.enter().append ("circle");
            data_points.exit().remove ();

            data_points.on ("mouseover", function (t) {
                           self.dm_setTracker (main_graph, t);
                       }).on ("mouseout", function (t) {
                            self.dm_setTracker (main_graph, null);
                       });

            this.dm_doTransition(data_points.classed ("series_" + i, true)).attr ("cx", function (d) {return x_scale (d[0]);})
                       .attr ("cy", function (d) {return y_scale (d[1]);})
                       .attr ("r", function (d) {return 3;})
                       .attr ("fill", series_color);
        }
        , this));



    },

    dm_doTransition : function (d3sel) {
        if (this.props.transitions) {
            return d3sel.transition();
        }
        return d3sel;
    },

    dm_renderAxis : function (scale, location, label, dom_element) {

        var xAxis = d3.svg.axis()
                    .scale(scale)
                    .orient(location); // e.g. bottom

         this.dm_doTransition(d3.select(dom_element))
              .call(xAxis);

         if (label) {
            var axis_label = dom_element.selectAll (".");
         }
    },

    dm_makeClasses: function (key) {
        var className = null, styleDict = null;

        if (key in this.props.renderStyle) {
            if ("class" in this.props.renderStyle[key]) {
                className = this.props.renderStyle[key]["class"];
            }
            if ("style" in this.props.renderStyle[key]) {
                styleDict = this.props.renderStyle[key]["style"]
            }
        }



        return {className : className, style: styleDict};
    },

    dm_makeScale: function (type, domain, range) {
        var scale;
        if (_.isFunction (type)) {
            scale = type;
        } else {
            switch (type) {
                case 'linear':
                    scale = d3.scale.linear();
                    break;
                case 'log':
                    scale = d3.scale.log ();
                    break;
                default:
                    scale = d3.scale.linear();
            }
        }
        return scale.domain(domain).range(range);
    },

    render: function () {
        var {main} = this.dm_computeDimensions(),
            {x_range, y_range} = this.dm_computeRanges();

        var x_scale = this.dm_makeScale (this.props.xScale, x_range, [0, main.width]),
            y_scale = this.dm_makeScale (this.props.yScale, y_range, [main.height, 0]);


        return (
            <svg width = {this.props.width} height = {this.props.height}>
                <g transform = {"translate("+ this.props.marginLeft + "," + this.props.marginTop + ")"} ref = {_.partial (this.dm_renderGraph, x_scale, y_scale)}/>
                {
                    this.props.xAxis ?
                    (<g {...this.dm_makeClasses ("axis")} transform = {"translate(" + this.props.marginLeft + "," + (main.height+this.props.marginTop+this.props.marginXaxis) + ")"} ref = {_.partial (this.dm_renderAxis, x_scale, "bottom", this.props.xLabel)}/>):
                    null
                }
                {
                    this.props.yAxis ?
                    (<g {...this.dm_makeClasses ("axis")} transform = {"translate(" + (this.props.marginLeft-this.props.marginYaxis) + "," + this.props.marginTop + ")"} ref = {_.partial (this.dm_renderAxis, y_scale, "left", this.props.yLabel)}/>):
                    null
                }
            </svg>
        );
    }
};

var _dmGraphSeriesDefinitions = _.clone (_dmGraphBaseDefinitions);

_dmGraphSeriesDefinitions.dm_renderGraph = function (x_scale, y_scale, dom_element) {

        var main_graph  = d3.select (dom_element);
        var self = this;

       _.each (this.props.y, _.bind (function (y, i) {
            var series_color = _dmGraphDefaultColorPallette (i);

            var series_line = d3.svg.area()
                .interpolate("step")
                .y1(function(d) {
                    return y_scale(d[1]);
                })
                .x(function(d) {
                    return x_scale(d[0]);
                });

            if (y_scale.domain()[0] < 0) {
                series_line.y0 (function (d) {
                    return y_scale(0);
                });
            }  else {
                series_line.y0 (y_scale (y_scale.domain ()[0]));
            }

            var data_points = main_graph.selectAll ("path.series_" + i).data ([_.zip (this.props.x, y)]);
            data_points.enter().append ("path");
            data_points.exit().remove ();


            this.dm_doTransition(data_points.classed ("series_" + i, true)).attr ("d", series_line)
                       .attr ("fill", series_color).attr("fill-opacity", 0.25).attr ("stroke", series_color).attr ("stroke-width", "0.5px");

            if (this.props.doDots) {

                var data_points = main_graph.selectAll ("circle.series_" + i).data (_.zip (this.props.x, y));
                data_points.enter().append ("circle");
                data_points.exit().remove ();


                data_points.on ("mouseover", function (t) {
                                 self.dm_setTracker (main_graph, t);
                           }).on ("mouseout", function (t) {
                                 self.dm_setTracker (main_graph, null);
                           });


                this.dm_doTransition(data_points.classed ("series_" + i, true)).attr ("cx", function (d) {return x_scale (d[0]);})
                           .attr ("cy", function (d) {return y_scale (d[1]);})
                           .attr ("r", function (d) {return 2;})
                           .attr ("fill", series_color);
            }
        }, this));



    };

var DatamonkeyScatterplot = React.createClass (_dmGraphBaseDefinitions);
var DatamonkeySeries = React.createClass (_dmGraphSeriesDefinitions);

module.exports.DatamonkeyScatterplot=DatamonkeyScatterplot;
module.exports.DatamonkeySeries=DatamonkeySeries;

