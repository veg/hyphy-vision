var React = require("react"),
  _ = require("underscore"),
  d3 = require("d3");

import { DatamonkeyTable } from "./shared_summary.jsx";


var BUSTEDSiteChartAndTable = React.createClass({
  getInitialState: function(){
    return {
      lower_site_range: 0,
      upper_site_range: null,
      constrained_evidence_ratio_threshold: "-Infinity",
      optimized_null_evidence_ratio_threshold: "-Infinity",
      brushend_event: false
    }
  },
  componentWillReceiveProps: function(nextProps){
    this.setState({
      upper_site_range: nextProps.data.length+1,
      brushend_event: false
    });
  },
  componentDidUpdate: function(){
    if(!this.state.brushend_event){
      d3.select("#chart-id").html("");
      this.drawChart();
    }
  },
  drawChart: function(){
    var self = this,
      number_of_sites = this.props.data.length,
      margin = {top: 20, right: 20, bottom: 40, left: 50},
      width = $("#chart-id").width() - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom,
      ymin = d3.min(self.props.data.map(d=>
        Math.min(d.constrained_evidence_ratio, d.optimized_null_evidence_ratio)
      )),
      ymax = d3.max(self.props.data.map(d=>
        Math.max(d.constrained_evidence_ratio, d.optimized_null_evidence_ratio)
      )),
      x = d3.scale.linear().domain([0, number_of_sites]).range([0, width]),
      y = d3.scale.linear().domain([ymin, ymax]).range([height, 0]),
      yAxisTicks = d3.range(5*Math.ceil(ymin/5), 5*Math.floor(ymax/5)+1, 5),
      xAxis = d3.svg.axis().scale(x)
        .orient("bottom").tickValues(d3.range(5, number_of_sites, 5)),
      yAxis = d3.svg.axis().scale(y)
        .orient("left").tickValues(yAxisTicks),
      cer_line = d3.svg.line()
        .x(function(d, i) { return x(d.site_index); })
        .y(function(d, i) { return y(d.constrained_evidence_ratio); }),
      oner_line = d3.svg.line()
        .x(function(d, i) { return x(d.site_index); })
        .y(function(d, i) { return y(d.optimized_null_evidence_ratio); }),
      svg = d3.select("#chart-id")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      svg.selectAll(".axis-line")
        .data(yAxisTicks)
        .enter()
          .append("line")
          .attr("x1", 0)
          .attr("x2", width)
          .attr("y1", d=>y(d))
          .attr("y2", d=>y(d))
          .style("stroke", "#eee")
          .style("stroke-width", 1)
      svg.append("path")
        .attr("class", "line")
        .attr("d", oner_line(self.props.data))
        .style("fill", "none")
        .style("stroke-width", 2)
        .style("stroke", "#000");
      svg.append("path")
        .attr("class", "line")
        .attr("d", cer_line(self.props.data))
        .style("fill", "none")
        .style("stroke-width", 2)
        .style("stroke", "#00a99d");
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      svg.append("text")
        .attr("x", width/2)
        .attr("y", height+margin.bottom)
        .style("text-anchor", "middle")
        .text("Site index")
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("2*Logarithm of evidence ratio")
      var c_legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate( " + .8*width + "," + .05*height + ")")
        .attr("text-anchor", "end")
      c_legend.append("text")
        .text("Constrained")
        .attr("x", 115)
        .attr("y", 7.5)
        .attr("dy", ".32em")
      c_legend.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "#00a99d")
      var on_legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate( " + .8*width + "," + .15*height + ")")
        .attr("text-anchor", "end")
      on_legend.append("text")
        .text("Optimized Null")
        .attr("x", 135)
        .attr("y", 7.5)
        .attr("dy", ".32em")
      on_legend.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "#000")

      function brushend() {
        var extent = brush.extent();
        if(extent[0] != extent[1]){
          self.setState({
            lower_site_range: extent[0],
            upper_site_range: extent[1],
            brushend_event: true
          });
        }else{
          self.setState({
            lower_site_range: 0,
            upper_site_range: self.props.data.length+1,
            brushend_event: true
          });
        }
      }

      var brush = d3.svg.brush()
        .x(x)
        .on("brushend", brushend);

      svg.append("g")
        .attr("class", "brush")
        .call(brush)
        .selectAll('rect')
        .attr('height', height);

  },
  handleONERChange: function(event){
    if(/^-?[0-9]*(\.[0-9]*)?$/.test(event.target.value)){
      this.setState({
        optimized_null_evidence_ratio_threshold: event.target.value
      });
    }else if(event.target.value == "-I"){
      this.setState({
        optimized_null_evidence_ratio_threshold: "-Infinity"
      });
    }else if(event.target.value == "-Infinit"){
      this.setState({
        optimized_null_evidence_ratio_threshold: ""
      });
    }
  },
  handleONERFocus: function(event){
    this.setState({
      optimized_null_evidence_ratio_threshold: ""
    })
  },
  handleONERBlur: function(event){
    if(!event.target.value){
      this.setState({
        optimized_null_evidence_ratio_threshold: "-Infinity"
      });
    }
  },
  handleCERChange: function(event){
    if(/^-?[0-9]*(\.[0-9]*)?$/.test(event.target.value)){
      this.setState({
        constrained_evidence_ratio_threshold: event.target.value
      });
    }else if(event.target.value == "-I"){
      this.setState({
        constrained_evidence_ratio_threshold: "-Infinity"
      });
    }else if(event.target.value == "-Infinit"){
      this.setState({
        constrained_evidence_ratio_threshold: ""
      });
    }
  },
  handleCERFocus: function(event){
    this.setState({
      constrained_evidence_ratio_threshold: ""
    })
  },
  handleCERBlur: function(event){
    if(!event.target.value){
      this.setState({
        constrained_evidence_ratio_threshold: "-Infinity"
      });
    }
  },
  headerData: [
    'Site Index',
    'Unconstrained Likelihood',
    'Constrained Likelihood',
    'Optimized Null Likelihood',
    'Constrained Statistic',
    'Optimized Null Statistic'
  ],
  render: function(){
    var self = this,
      float_format = d3.format(".2f"),
      bodyData = _.filter(this.props.data, function(element, index){
        var valid_optimized_null_evidence_ratio = _.contains(["-Infinity","","-"], self.state.optimized_null_evidence_ratio_threshold)
          || element.optimized_null_evidence_ratio > +self.state.optimized_null_evidence_ratio_threshold,
        valid_constrained_evidence_ratio = _.contains(["-Infinity","","-"], self.state.constrained_evidence_ratio_threshold)
          || element.constrained_evidence_ratio > +self.state.constrained_evidence_ratio_threshold,
        valid_ers = valid_constrained_evidence_ratio && valid_optimized_null_evidence_ratio,
        valid_site = element.site_index > self.state.lower_site_range && element.site_index < self.state.upper_site_range;
        return valid_ers && valid_site;
      })
      .map(row => _.values(row).map(
        (d,i) => i != 0 ? +float_format(d) : +d
      ));
    return (<div>
      <div className="row hyphy-busted-site-table">
        <div className="col-md-12">
          <h4 className="dm-table-header">
            Model Evidence Ratios Per Site
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
            <span className="glyphicon glyphicon-floppy-save" /> Export
            Chart to SVG
          </button>
          <button
            id="export-chart-png"
            type="button"
            className="btn btn-default btn-sm pull-right btn-export"
          >
            <span className="glyphicon glyphicon-floppy-save" /> Export
            Chart to PNG
          </button>
        </div>
        <div id="chart-id" className="col-lg-12" />
      </div>

      <div className="row site-table">
        <div className="col-lg-5">
          <div className="input-group">
            <span className="input-group-addon" id="basic-addon3">
              Constrained Evidence Ratio Threshold:
            </span>
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
        <div className="col-lg-5">
          <div className="input-group">
            <span className="input-group-addon" id="basic-addon3">
              Optimized Null Evidence Ratio Threshold
            </span>
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
        <div className="col-lg-2">
          <button
            id="export-csv"
            type="button"
            className="btn btn-default btn-sm pull-right hyphy-busted-btn-export"
          >
            <span className="glyphicon glyphicon-floppy-save" /> Export
            Table to CSV
          </button>
        </div>
        <div className="col-lg-12">
          <DatamonkeyTable
            headerData={this.headerData}
            bodyData={bodyData}
            paginate={Math.min(20, bodyData.length)}
            initialSort={0}
          />
        </div>
      </div>
    </div>);
  }
});

module.exports.BUSTEDSiteChartAndTable = BUSTEDSiteChartAndTable;
