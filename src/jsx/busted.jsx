require("phylotree");

var React = require("react"),
  ReactDOM = require("react-dom"),
  d3 = require("d3"),
  d3_save_svg = require("d3-save-svg"),
  _ = require("underscore");

import { Tree } from "./components/tree.jsx";
import { PropChart } from "./components/prop_chart.jsx";
import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";
import { DatamonkeyTable } from "./components/tables.jsx";
import { saveSvgAsPng } from "save-svg-as-png";
import { Header } from "./components/header.jsx";
import { MethodHeader } from "./components/methodheader.jsx";
import { MainResult } from "./components/mainresult.jsx";


var BUSTEDSiteChartAndTable = React.createClass({
  getInitialState: function() {
    return {
      lower_site_range: 0,
      upper_site_range: null,
      constrained_evidence_ratio_threshold: "-Infinity",
      optimized_null_evidence_ratio_threshold: "-Infinity",
      brushend_event: false,
      CERwarning: false,
      ONERwarning: false,
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      upper_site_range: nextProps.data.length + 1,
      brushend_event: false
    });
  },
  componentDidUpdate: function() {
    if (!this.state.brushend_event && !_.isEmpty(this.props.data)) {
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
      height = 320 - margin.top - margin.bottom,
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
      yAxisDelta = Math.max(2, 2*Math.floor(((ymax-ymin)/10)/2)),
      yAxisTicks = d3.range(
        yAxisDelta * Math.ceil(ymin / yAxisDelta),
        yAxisDelta * Math.floor(ymax / yAxisDelta) + 1,
        yAxisDelta 
      ),
      xAxisDelta = 5*Math.floor((number_of_sites/30)/5),
      xAxis = d3.svg
        .axis()
        .scale(x)
        .orient("bottom")
        .tickValues(d3.range(xAxisDelta, number_of_sites, xAxisDelta)),
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
        .attr("height", height + margin.top + margin.bottom);

    svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white");

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
      .text("2*Log Evidence Ratio");
    var c_legend = svg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        "translate( " + (0.9 * width) + "," + (0.05 * height) + ")"
      )
      .attr("text-anchor", "start");
    c_legend
      .append("text")
      .text("Constrained")
      .attr("x", 20)
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
        "translate( " + (0.9 * width) + "," + (0.15 * height) + ")"
      )
      .attr("text-anchor", "start");
    on_legend
      .append("text")
      .text("Optimized Null")
      .attr("x", 20)
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
        optimized_null_evidence_ratio_threshold: event.target.value,
        ONERwarning: false
      });
    } else if (event.target.value == "-I") {
      this.setState({
        optimized_null_evidence_ratio_threshold: "-Infinity",
        ONERwarning: false
      });
    } else if (event.target.value == "-Infinit") {
      this.setState({
        optimized_null_evidence_ratio_threshold: "",
        ONERwarning: false
      });
    } else {
      this.setState({
        ONERwarning: true
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
        constrained_evidence_ratio_threshold: event.target.value,
        CERwarning: false
      });
    } else if (event.target.value == "-I") {
      this.setState({
        constrained_evidence_ratio_threshold: "-Infinity",
        CERwarning: false
      });
    } else if (event.target.value == "-Infinit") {
      this.setState({
        constrained_evidence_ratio_threshold: "",
        CERwarning: false
      });
    } else {
      this.setState({
        CERwarning: true
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
    "Optimized Null Likelihood",
    "Constrained Statistic",
    "Optimized Null Statistic"
  ],
  render: function() {
    if(_.isEmpty(this.props.data)){
      return (<div className="row" style={{marginBottom:"20px"}}>
        <div className="col-md-12">     
          <Header title='Model Test Statistics Per Site' popover='No information to display.' />
          <p className="description">No data to display.</p>
        </div>
      </div>);
    }
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
         
        <div className="row hyphy-busted-site-table" style={{marginBottom:"20px"}}>
        
          <div className="col-md-12">     
            <h4 className="dm-table-header">
              Model Test Statistics Per Site
              <span
                className="glyphicon glyphicon-info-sign"
                style={{ verticalAlign: "middle", float: "right", minHeight:"30px", minWidth: "30px" }}
                aria-hidden="true"
                data-toggle="popover"
                data-trigger="hover"
                title="Actions"
                data-html="true"
                data-content='<ul><li>Click the figure and drag to filter by given sites. The resulting "brush" can be resized, dragged, or cleared by clicking unselected sites.</li><li>Filter out rows below a given statistic value by typing in the input boxes below.</li></ul>'
                data-placement="bottom"
              />
            </h4>
          </div>
          <div className="col-lg-12">
            <button
              id="export-chart-svg"
              type="button"
              className="btn btn-default btn-sm pull-right btn-export"
              onClick={()=>{d3_save_svg.save(d3.select("#chart").node(), {filename: "busted"});}}
            >
              <span className="glyphicon glyphicon-floppy-save" /> Export Chart
              to SVG
            </button>
            <button
              id="export-chart-png"
              type="button"
              className="btn btn-default btn-sm pull-right btn-export"
              onClick={()=>{saveSvgAsPng(document.getElementById("chart"), "busted-chart.png");}}
            >
              <span className="glyphicon glyphicon-floppy-save" /> Export Chart
              to PNG
            </button>
          </div>
          <div id="chart-id" className="col-lg-12" />

          <div className="col-lg-6 clear-padding justify-content">
            <div className={"form-group" + (this.state.CERwarning ? " has-error" : "")}>
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
            {this.state.CERwarning ? <span className="help-block">Enter a floating point number.</span> : ''}
            </div>
          </div>
          
          <div className="col-lg-6 justify-content">
            <div className={"form-group" + (this.state.ONERwarning ? " has-error" : "")}>
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
            {this.state.ONERwarning ? <span className="help-block">Enter a floating point number.</span> : ''}
            </div>
          </div>

        </div>

        <div className="row site-table">
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

    );
  }

});

class BUSTEDModelTable extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      model: "Unconstrained model",
      branch: "Test",
      active: null
    }
  }
  render() {
    if(!this.props.fits) return <div></div>;
    var distro_settings = {
      dimensions: {
        width: 600,
        height: 400
      },
      margins: {
        left: 50,
        right: 15,
        bottom: 15,
        top: 15
      },
      legend: false,
      domain: [0.00001, 10000],
      do_log_plot: true,
      k_p: null,
      plot: null,
      svg_id: "prop-chart"
    };

    var self = this,
      omegas = _.values(this.props.fits[this.state.model]['Rate Distributions'][this.state.branch]).map(val => {
        return {
          omega: val.omega,
          prop: val.proportion
        };
      });
    function modalShower(model, branch){
      return function(){
        this.setState({model: model, branch:branch});
        $("#myModal").modal("show");
      }
    }
    function makeActive(model){
      return function(){
        this.setState({active: model});
      }
    }
    function makeInactive(){
      this.setState({active: null});
    }
    var rows = _.map(_.pick(this.props.fits,["Unconstrained model", "Constrained model"]), (val, key) => {
      var distributions = val['Rate Distributions'],
        onClick = modalShower(key, "Test").bind(self),
        onMouseEnter = makeActive(key).bind(self),
        onMouseLeave = makeInactive.bind(self),
        className = key == self.state.active ? 'active' : '',
        test_row = (<tr onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={className}> 
        <td>{key}</td>
        <td>{val['Log Likelihood'] ? val['Log Likelihood'].toFixed(1) : null}</td>
        <td>{val['estimated parameters']}</td>
        <td>{val['AIC-c'].toFixed(1)}</td>
        <td>Test</td>
        <td>{distributions["Test"]["0"].omega.toFixed(2)} ({(100*distributions["Test"]["0"].proportion).toFixed(2)}%)</td>
        <td>{distributions["Test"]["1"].omega.toFixed(2)} ({(100*distributions["Test"]["1"].proportion).toFixed(2)}%)</td>
        <td>{distributions["Test"]["2"].omega.toFixed(2)} ({(100*distributions["Test"]["2"].proportion).toFixed(2)}%)</td>
        <td><i className="fa fa-bar-chart" aria-hidden="true"></i></td>
      </tr>);
      if(distributions['Background']){
        var onClick = modalShower(key, "Background").bind(self);
        var background_row = (<tr onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={className}>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>Background</td>
          <td>{distributions["Background"]["0"].omega.toFixed(2)} ({(100*distributions["Background"]["0"].proportion).toFixed(2)}%)</td>
          <td>{distributions["Background"]["1"].omega.toFixed(2)} ({(100*distributions["Background"]["1"].proportion).toFixed(2)}%)</td>
          <td>{distributions["Background"]["2"].omega.toFixed(2)} ({(100*distributions["Background"]["2"].proportion).toFixed(2)}%)</td>
          <td><i className="fa fa-bar-chart" aria-hidden="true"></i></td>
        </tr>)
        return [test_row, background_row];
      }
      return test_row;
    });
    return (<div>
      <h4 className="dm-table-header">
        Model fits
        <span
          className="glyphicon glyphicon-info-sign"
          style={{ verticalAlign: "middle", float: "right", minHeight:"30px", minWidth: "30px"}}
          aria-hidden="true"
          data-toggle="popover"
          data-trigger="hover"
          title="Actions"
          data-html="true"
          data-content="<ul><li>Hover over a column header for a description of its content.</li><li>Click a row to view the corresponding rate distribution.</li></ul>"
          data-placement="bottom"
        />
      </h4>
      <table
        className="dm-table table table-hover table-condensed list-group-item-text"
        style={{ marginTop: "0.5em" }}
      >
        <thead id="summary-model-header1">
          <tr>
            <th>Model</th>
            <th>
              <span data-toggle="tooltip" title="" data-original-title="Log likelihood of model fit">
                <em>log</em> L
              </span>
            </th>
            <th>
              <span data-toggle="tooltip" title="" data-original-title="Number of parameters">
                #. params
              </span>
            </th>
            <th>
              <span data-toggle="tooltip" title="" data-original-title="Small-sample correct Akaike information criterion">
                AIC<sub>c</sub>
              </span>
            </th>
            <th>
              <span data-toggle="tooltip" title="" data-original-title="Indicates which branch set each parameter belongs to">
                Branch set
              </span>
            </th>
            <th>
              <span data-toggle="tooltip" title="" data-original-title="First omega rate class">
                &omega;<sub>1</sub>
              </span>
            </th>
            <th>
              <span data-toggle="tooltip" title="" data-original-title="Second omega rate class">
                &omega;<sub>2</sub>
              </span>
            </th>
            <th>
              <span data-toggle="tooltip" title="" data-original-title="Third omega rate class">
                &omega;<sub>3</sub>
              </span>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody id="summary-model-table">
          {_.flatten(rows)}
        </tbody>
      </table>

      <div
        className="modal fade"
        id="myModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title" id="myModalLabel">
                BUSTED Site Proportion Chart
              </h4>
            </div>
            <div className="modal-body" id="modal-body">
              <h4 className="dm-table-header">&omega; distribution</h4>
                <PropChart
                  name={self.state.model + ', ' + self.state.branch + ' branches'}
                  omegas={omegas}
                  settings={distro_settings}
                />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>); 
  }
}

var BUSTED = React.createClass({
  float_format: d3.format(".2f"),
  p_value_format: d3.format(".4f"),
  fit_format: d3.format(".2f"),

  processData: function(data) {
    data.fits = _.mapObject(data.fits, (val, key) => {
      val['log-likelihood'] = val['Log Likelihood'];
      val['parameters'] = val['estimated parameters'];
      val['display-order'] = val['display order'];
      return val;
    });

    var omegas = data['fits']['Unconstrained model']['Rate Distributions']['Test'], 
      formatted_omegas = _.map(_.values(omegas), function(d) {
        d.prop = d.proportion;
        return d;
      });

    data['trees'] = _.map(data['input']['trees'], (val, key) => {
      var branchLengths = {
        'Unconstrained model': _.mapObject(data['branch attributes'][key], val1 => val1.unconstrained),
        'Constrained model': _.mapObject(data['branch attributes'][key], val1 => val1.constrained)
      };
      return {newickString: val, branchLengths: branchLengths};
    });

    data["fits"]["Unconstrained model"][
      "branch-annotations"
    ] = this.formatBranchAnnotations(data);
    if(data["fits"]["Constrained model"]) {
      data["fits"]["Constrained model"][
        "branch-annotations"
      ] = this.formatBranchAnnotations(data);
    }

    this.setState({
      p: data['test results']['p-value'],
      input_data: data['input'],
      fits: data['fits'],
      omegas: formatted_omegas,
      json: data,
      evidence_ratio_data: _.isEmpty(data['Evidence Ratios']) ? {} :
        _.map(_.range(data.input['number of sites']), function(i){
          return {
            site_index: i+1,
            unconstrained_likelihood: data["Site Log Likelihood"]["unconstrained"][0][i],
            constrained_likelihood: data["Site Log Likelihood"]["constrained"][0][i],
            optimized_null_likelihood: data["Site Log Likelihood"]["optimized null"][0][i],
            constrained_evidence_ratio: 2*Math.log(data['Evidence Ratios']['constrained'][0][i]),
            optimized_null_evidence_ratio: 2*Math.log(data['Evidence Ratios']['optimized null'][0][i])
          };
        })
    });
  },

  getSummaryForClipboard: function() {
    var self = this;
    var significant = this.state.p < 0.05; 
    var userMessageForClipboard;
    if (significant) {
      userMessageForClipboard = "BUSTED found evidence (LRT, p-value = " +
        // TODO: Format the pValue (I want to just use "self.state.p ? self.state.toFixted(3) : null" but this isn't working and I think the issue may be easier to fix if this page was using the resultsPageTemplate component so that the lifecyle would be easier to understand
        self.state.p +
        " < .05) of gene-wide episodic diversifying selection in the selected test branches of your phylogeny. Therefore, there is evidence that at least one site on at least one test branch has experienced diversifying selection."
    } else {
      userMessageForClipboard = "BUSTED found no evidence (LRT, p-value = " +
        // TODO: Format the pValue (I want to just use "self.state.p ? self.state.toFixted(3) : null" but this isn't working and I think the issue may be easier to fix if this page was using the resultsPageTemplate component so that the lifecyle would be easier to understand
        self.state.p +
        " > .05) of gene-wide episodic diversifying selection in the selected test branches of your phylogeny. Therefore, there is no evidence that any sites have experienced diversifying selection along the test branch(es)."
    }
    return (userMessageForClipboard);
  },

  getSummaryForRendering: function() {
    var significant = this.state.p < 0.05, 
      message;
    if (significant) {
      message = (<p>
        BUSTED <strong className="hyphy-highlight">
          found evidence
        </strong>{" "}
        (LRT, p-value = {this.state.p ? this.state.p.toFixed(3) : null} &le; .05) of gene-wide episodic diversifying selection
        in the selected test branches of your phylogeny. Therefore, there is
        evidence that at least one site on at least one test branch has
        experienced diversifying selection.{" "}
      </p>);
    } else {
      message = (
        <p>
          BUSTED <strong>
            found no evidence
          </strong>{" "}
          (LRT, p-value = {this.state.p ? this.state.p.toFixed(3) : null} &ge; .05) of gene-wide episodic diversifying selection
          in the selected test branches of your phylogeny. Therefore, there is no
          evidence that any sites have experienced diversifying selection along
          the test branch(es).{" "}
        </p>
      );
    }
    return (message);
  },

  loadFromServer: function() {
    var self = this;

    d3.json(this.props.url, function(data) {
      self.processData(data);
    });
  },

  onFileChange: function(e){
    var self = this,
      files = e.target.files; // FileList object

    if (files.length == 1) {
      var f = files[0],
        reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          var data = JSON.parse(this.result);
          self.processData(data);
        };
      })(f);
      reader.readAsText(f);
    }
    e.preventDefault();
  },

  colorGradient: ["#00a99d", "#000000"],
  grayScaleGradient: [
    "#444444",
    "#000000"
  ],

  getDefaultProps: function() {

    var edgeColorizer = function(element, data, foreground_color) {

      var is_foreground = data.target.annotations.is_foreground,
        color_fill = foreground_color(0);

      element
        .style("stroke", is_foreground ? color_fill : "black")
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
      margins: { left: 50, right: 15, bottom: 35, top: 15 },
      legend: false,
      domain: [0.00001, 10000],
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
      fits: null,
      input_data: null,
      json: null
    };
  },

  formatBranchAnnotations: function(json) {
    // attach is_foreground to branch annotations
    var branch_annotations = d3.range(json.trees.length).map(i=>{
      return _.mapObject(json['tested'][i], (val, key)=>{
        return {is_foreground: val == 'test'};
      });
    });
    return branch_annotations;
  },

  componentWillMount: function() {
    this.loadFromServer();
  },

  componentDidUpdate(prevProps, prevState) {
    $("body").scrollspy({
      target: ".bs-docs-sidebar",
      offset: 50
    });
    $('[data-toggle="popover"]').popover();
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
    $('.dropdown-toggle').dropdown();
  },

  render: function() {

    var self = this;
    var scrollspy_info = [
      { label: "summary", href: "summary-div" },
      { label: "model statistics", href: "hyphy-model-fits" },
      { label: "tree", href: "phylogenetic-tree" }
    ];

    var models = {};
    if (!_.isNull(self.state.json)) {
      models = _.pick(self.state.json.fits, ['Unconstrained model', 'Constrained model']);
    }

    return (
      <div>
        {self.props.hyphy_vision ? <NavBar onFileChange={this.onFileChange} /> : ''}
        <div className="container">
          <div className="row">
            <ScrollSpy info={scrollspy_info} />

            <div className="col-md-12 col-lg-10">
              <div>
                <div id="summary-tab">
                 <MethodHeader
                    methodName="Branch-site Unrestricted Statistical Test for Episodic Diversification"
                    input_data={self.state.input_data}
                    json={self.state.json}
                    hyphy_vision={self.props.hyphy_vision}
                  />
                  <MainResult
                    summary_for_clipboard={this.getSummaryForClipboard()}
                    summary_for_rendering={this.getSummaryForRendering()} 
                    method_ref="http://hyphy.org/methods/selection-methods/#busted"
                    citation_ref="hhttp://www.ncbi.nlm.nih.gov/pubmed/25701167"
                    citation_number="PMID 25701167"
                  />
                </div>
              </div>

              <div className="row">
                <div id="hyphy-model-fits" className="col-lg-12">
                  <BUSTEDModelTable fits={self.state.fits} />
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
                    method={'busted'}
                    multitree
                  />
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

var render_hv_busted = function(url, element) {
  ReactDOM.render(<BUSTED url={url} hyphy_vision />, document.getElementById(element));
};

module.exports = render_busted;
module.exports.hv = render_hv_busted;
module.exports.BUSTED = BUSTED;

