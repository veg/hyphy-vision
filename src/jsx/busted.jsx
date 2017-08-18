require("phylotree");

var React = require("react"),
  ReactDOM = require("react-dom"),
  d3 = require("d3"),
  d3_save_svg = require("d3-save-svg");

import { Tree } from "./components/tree.jsx";
import { ModelFits } from "./components/model_fits.jsx";
import { PropChart } from "./components/prop_chart.jsx";
import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";
import { DatamonkeyTable } from "./components/tables.jsx";
import { saveSvgAsPng } from "save-svg-as-png";
import { InputInfo } from "./components/input_info";


var datamonkey = require("../datamonkey/datamonkey.js");
var _ = require("underscore");

function BUSTEDSummary(props) {
  var significant = props.p < 0.05,
    input_data = props.input_data ? {
      filename: props.input_data['file name'],
      sequences: props.input_data['number of sequences'],
      sites: props.input_data['number of sites']
    } : null,
    message;
  if (significant) {
    message = (<p>
      BUSTED <strong className="hyphy-highlight">
        found evidence
      </strong>{" "}
      (LRT, p-value={props.p ? props.p.toFixed(3) : null} &le; .05) of gene-wide episodic diversifying selection
      in the selected foreground of your phylogeny. Therefore, there is
      evidence that at least one site on at least one foreground branch has
      experienced diversifying selection.{" "}
    </p>);
  } else {
    message = (
      <p>
        BUSTED <strong className="hyphy-highlight">
          found no evidence
        </strong>{" "}
        (LRT, p-value &le; .05) of gene-wide episodic diversifying selection
        in the selected foreground of your phylogeny. Therefore, there is no
        evidence that any sites have experienced diversifying selection along
        the foreground branch(es).{" "}
      </p>
    );
  }
  return (
    <div className="row">
    <div className="clearance" id="summary-div"></div>
      <div className="col-md-12">
        <h3 className="list-group-item-heading">
          <span className="summary-method-name">
            Branch-Site Unrestricted Statistical Test for Episodic
            Diversification
          </span>
          <br />
          <span className="results-summary">results summary</span>
        </h3>
      </div>
      <div className="col-md-12">
        <InputInfo input_data={input_data} />
      </div>
      <div className="col-md-12">
        <div className="main-result">
          {message}
          <hr />
          <p>
            <small>
              See{" "}
              <a href="http://hyphy.org/methods/selection-methods/#busted">
                here
              </a>{" "}
              for more information about the BUSTED method.
              <br />Please cite{" "}
              <a
                href="http://www.ncbi.nlm.nih.gov/pubmed/25701167"
                id="summary-pmid"
                target="_blank"
              >
                PMID 25701167
              </a>{" "}
              if you use this result in a publication, presentation, or other
              scientific work.
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}

var BUSTEDSiteChartAndTable = React.createClass({
  getInitialState: function() {
    return {
      lower_site_range: 0,
      upper_site_range: null,
      constrained_evidence_ratio_threshold: "-Infinity",
      optimized_null_evidence_ratio_threshold: "-Infinity",
      brushend_event: false
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      upper_site_range: nextProps.data.length + 1,
      brushend_event: false
    });
  },
  componentDidUpdate: function() {
    if (!this.state.brushend_event) {
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
        optimized_null_evidence_ratio_threshold: event.target.value
      });
    } else if (event.target.value == "-I") {
      this.setState({
        optimized_null_evidence_ratio_threshold: "-Infinity"
      });
    } else if (event.target.value == "-Infinit") {
      this.setState({
        optimized_null_evidence_ratio_threshold: ""
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
        constrained_evidence_ratio_threshold: event.target.value
      });
    } else if (event.target.value == "-I") {
      this.setState({
        constrained_evidence_ratio_threshold: "-Infinity"
      });
    } else if (event.target.value == "-Infinit") {
      this.setState({
        constrained_evidence_ratio_threshold: ""
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
              <span className="glyphicon glyphicon-floppy-save" /> Export Chart
              to SVG
            </button>
            <button
              id="export-chart-png"
              type="button"
              className="btn btn-default btn-sm pull-right btn-export"
            >
              <span className="glyphicon glyphicon-floppy-save" /> Export Chart
              to PNG
            </button>
          </div>
          <div id="chart-id" className="col-lg-12" />

          <div className="col-lg-6 clear-padding justify-content">
            <div className="form-group">
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
            </div>
          </div>
          
          <div className="col-lg-6 justify-content">
            <div className="form-group">
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

function BUSTEDModelTable(props){
  if(!props.fits) return <div></div>;
  var rows = _.map(props.fits, (val, key) => {
    var distributions = val['Rate Distributions'];
    return [(<tr>
      <td>{key}</td>
      <td>{val['Log Likelihood'] ? val['Log Likelihood'].toFixed(1) : null}</td>
      <td>{val['estimated parameters']}</td>
      <td>{val['AIC-c'].toFixed(1)}</td>
      <td>Test</td>
      <td>{distributions["Test"]["0"].omega.toFixed(2)} ({(100*distributions["Test"]["0"].proportion).toFixed(0)}%)</td>
      <td>{distributions["Test"]["1"].omega.toFixed(2)} ({(100*distributions["Test"]["1"].proportion).toFixed(0)}%)</td>
      <td>{distributions["Test"]["2"].omega.toFixed(2)} ({(100*distributions["Test"]["2"].proportion).toFixed(0)}%)</td>
    </tr>)];
  });
  return (<div>
    <h4 className="dm-table-header">
      Model fits
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
    <table
      className="dm-table table table-hover table-condensed list-group-item-text"
      style={{ marginTop: "0.5em" }}
    >
      <thead id="summary-model-header1">
        <tr>
          <th>Model</th>
          <th><em>log</em> L</th>
          <th>#. params</th>
          <th>AIC<sub>c</sub></th>
          <th>Branch set</th>
          <th>&omega;<sub>1</sub></th>
          <th>&omega;<sub>2</sub></th>
          <th>&omega;<sub>3</sub></th>
        </tr>
      </thead>
      <tbody id="summary-model-table">
        {_.flatten(rows)}
      </tbody>
    </table>
  </div>); 
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
    data["fits"]["Constrained model"][
      "branch-annotations"
    ] = this.formatBranchAnnotations(data);

    this.setState({
      p: data['test results']['p-value'],
      input_data: data['input'],
      fits: data['fits'],
      omegas: formatted_omegas,
      json: data,
      evidence_ratio_data: _.map(_.range(data.input['number of sites']), function(i){
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
      margins: { left: 50, right: 15, bottom: 15, top: 15 },
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

  initialize: function() {
    var json = this.state.json;

    if (!json) {
      return;
    }

    // delete existing tree
    d3.select("#tree_container").select("svg").remove();
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
  },

  render: function() {

    var self = this;
    self.initialize();
    var scrollspy_info = [
      { label: "summary", href: "summary-div" },
      { label: "model statistics", href: "hyphy-model-fits" },
      { label: "tree", href: "phylogenetic-tree" },
      { label: "ω distribution", href: "primary-omega-dist" }
    ];

    var models = {};
    if (!_.isNull(self.state.json)) {
      models = self.state.json.fits;
    }

    return (
      <div>
        <NavBar onFileChange={this.onFileChange} />
        <div className="container">
          <div className="row">
            <ScrollSpy info={scrollspy_info} />

            <div className="col-lg-10">
              <div id="results">
                <div id="summary-tab">
                  <BUSTEDSummary
                    p={this.state.p}
                    input_data={self.state.input_data}
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
                <div className="col-md-12">
                  <h4 className="dm-table-header">&omega; distribution</h4>
                  <div id="primary-omega-dist">
                    <PropChart
                      name='Test'
                      omegas={self.state.omegas}
                      settings={self.props.distro_settings}
                    />
                  </div>
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

module.exports = render_busted;
