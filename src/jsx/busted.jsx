require("phylotree");

var React = require("react"),
  ReactDOM = require("react-dom"),
  d3 = require("d3"),
  d3_save_svg = require("d3-save-svg"),
  _ = require("underscore"),
  createReactClass = require("create-react-class");

import Phylotree, { placenodes, phylotreev1 } from "react-phylotree";
import { Tree } from "./components/tree.jsx";
import { PropChart } from "./components/prop_chart.jsx";
import { DatamonkeyTable } from "./components/tables.jsx";
import { saveSvgAsPng } from "save-svg-as-png";
import { Header } from "./components/header.jsx";
import { MainResult } from "./components/mainresult.jsx";
import { ResultsPage } from "./components/results_page.jsx";
import { SitePlotAxis, fastaParser } from "alignment.js";
import CodonColumn from "./components/codon_column.jsx";

var BUSTEDSiteChartAndTable = createReactClass({
  getInitialState: function() {
    return {
      lower_site_range: 0,
      upper_site_range: null,
      constrained_evidence_ratio_threshold: "-Infinity",
      optimized_null_evidence_ratio_threshold: "-Infinity",
      brushend_event: false,
      CERwarning: false,
      ONERwarning: false
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (
      nextProps.data.length <= 0 ||
      nextProps.data.length == null ||
      nextProps.data.length == "undefined"
    ) {
      this.setState({
        upper_site_range: 0,
        brushend_event: false
      });
    } else {
      this.setState({
        upper_site_range: nextProps.data.length + 1,
        brushend_event: false
      });
    }
  },
  componentDidUpdate: function() {
    if (
      (!this.state.brushend_event && !_.isEmpty(this.props.data)) ||
      (!this.state.brushend_event && !this.props.data == "undefined")
    ) {
      d3.select("#chart-id").html("");
      this.drawChart();
    }
  },
  componentDidMount: function() {
    d3.select("#export-chart-png").on("click", function(e) {
      saveSvgAsPng(document.getElementById("chart"), "busted-chart.png");
    });
    d3.select("#export-chart-svg").on("click", function(e) {
      d3_save_svg.save(d3.select("#chart").node(), { filename: "busted" });
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
      x = d3.scale
        .linear()
        .domain([0, number_of_sites])
        .range([0, width]),
      y = d3.scale
        .linear()
        .domain([ymin, ymax])
        .range([height, 0]),
      yAxisDelta = Math.max(2, 2 * Math.floor((ymax - ymin) / 10 / 2)),
      yAxisTicks = d3.range(
        yAxisDelta * Math.ceil(ymin / yAxisDelta),
        yAxisDelta * Math.floor(ymax / yAxisDelta) + 1,
        yAxisDelta
      ),
      maxNumberOfxAxisTicks = 20,
      minSitesBetweenxAxisTicks = 10,
      xAxisDelta = Math.max(
        minSitesBetweenxAxisTicks,
        minSitesBetweenxAxisTicks *
          Math.floor(
            number_of_sites /
              (maxNumberOfxAxisTicks * minSitesBetweenxAxisTicks)
          )
      ),
      xAxis = d3.svg
        .axis()
        .scale(x)
        .orient("bottom")
        .tickValues(d3.range(xAxisDelta, number_of_sites, xAxisDelta)),
      yAxis = d3.svg
        .axis()
        .scale(y)
        .orient("left")
        .tickValues(yAxisTicks),
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

    svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white");

    var g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.selectAll(".axis-line")
      .data(yAxisTicks)
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", d => y(d))
      .attr("y2", d => y(d))
      .style("stroke", "#eee")
      .style("stroke-width", 1);
    g.append("path")
      .attr("class", "line")
      .attr("d", oner_line(self.props.data))
      .style("fill", "none")
      .style("stroke-width", 2)
      .style("stroke", "#000");
    g.append("path")
      .attr("class", "line")
      .attr("d", cer_line(self.props.data))
      .style("fill", "none")
      .style("stroke-width", 2)
      .style("stroke", "#00a99d");
    g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom)
      .style("text-anchor", "middle")
      .text("Site index");
    g.append("g")
      .attr("class", "y axis")
      .call(yAxis);
    g.append("text")
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
        "translate( " + 0.9 * width + "," + 0.05 * height + ")"
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
        "translate( " + 0.9 * width + "," + 0.15 * height + ")"
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

    var brush = d3.svg
      .brush()
      .x(x)
      .on("brushend", brushend);

    g.append("g")
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
        <div
          className="row hyphy-busted-site-table"
          style={{ marginBottom: "20px" }}
        >
          <div className="col-md-12">
            <Header
              title="Model Test Statistics Per Site"
              popover={
                '<ul><li>Click the figure and drag to filter by given sites. The resulting "brush" can be resized, dragged, or cleared by clicking unselected sites.</li><li>Filter out rows below a given statistic value by typing in the input boxes below.</li></ul>'
              }
            />
          </div>
          <div className="col-lg-12">
            <button
              id="export-chart-svg"
              type="button"
              className="btn.btn-secondary btn-sm float-right btn-export btn-export-chart-png"
              onClick={() => {
                d3_save_svg.save(d3.select("#chart").node(), {
                  filename: "busted"
                });
              }}
            >
              <span className="far fa-save" /> Export Chart to SVG
            </button>
            <button
              id="export-chart-png"
              type="button"
              className="btn.btn-secondary btn-sm float-right btn-export btn-export-chart-png"
              onClick={() => {
                saveSvgAsPng(
                  document.getElementById("chart"),
                  "busted-chart.png"
                );
              }}
            >
              <span className="far fa-save" /> Export Chart to PNG
            </button>
          </div>
          <div id="chart-id" className="col-lg-12" />

          <div className="col-lg-6 clear-padding justify-content">
            <div
              className={
                "form-group" + (this.state.CERwarning ? " has-error" : "")
              }
            >
              <label htmlFor="er-constrained-threshold">
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
                style={{ marginLeft: "1rem" }}
              />
              {this.state.CERwarning ? (
                <span className=".form-text">
                  Enter a floating point number.
                </span>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="col-lg-6 justify-content">
            <div
              className={
                "form-group" + (this.state.ONERwarning ? " has-error" : "")
              }
            >
              <label htmlFor="er-optimized-null-threshold">
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
                style={{ marginLeft: "1rem" }}
              />
              {this.state.ONERwarning ? (
                <span className=".form-text">
                  Enter a floating point number.
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className="row site-table">
          <DatamonkeyTable
            headerData={this.headerData}
            bodyData={bodyData}
            paginate={Math.min(20, bodyData.length)}
            initialSort={0}
            classes={"table table-smm table-striped"}
            export_csv
          />
        </div>
      </div>
    );
  }
});

function CVSRV(distributions, n_sites) {
  const distribution_values = _.values(distributions),
    sum = (a, b) => a + b,
    mu = distribution_values
      .map(dist => dist.proportion * dist.rate)
      .reduce(sum),
    sigma_sum = distribution_values
      .map(dist => dist.proportion * (dist.rate - mu) ** 2)
      .reduce(sum),
    sigma = Math.sqrt((n_sites * sigma_sum) / (n_sites - 1));
  return (sigma / mu).toFixed(3);
}

class BUSTEDModelTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: "Unconstrained model",
      branch: "Test",
      active: null
    };
  }
  render() {
    if (!this.props.fits) return <div />;
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
      omegas = _.values(
        this.props.fits[this.state.model]["Rate Distributions"][
          this.state.branch
        ]
      ).map(val => {
        return {
          omega: val.omega,
          prop: val.proportion
        };
      });
    function modalShower(model, branch) {
      return function() {
        this.setState({ model: model, branch: branch });
        $("#modelFitsModal").modal("show");
      };
    }
    function makeActive(model) {
      return function() {
        this.setState({ active: model });
      };
    }
    function makeInactive() {
      this.setState({ active: null });
    }
    var rows = _.map(
      _.pick(this.props.fits, ["Unconstrained model", "Constrained model"]),
      (val, key) => {
        var distributions = val["Rate Distributions"],
          onClick = modalShower(key, "Test").bind(self),
          onMouseEnter = makeActive(key).bind(self),
          onMouseLeave = makeInactive.bind(self),
          className = key == self.state.active ? "active" : "",
          test_row = (
            <tr
              onClick={onClick}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              className={className}
              key={key}
            >
              <td>{key}</td>
              <td>
                {val["Log Likelihood"]
                  ? val["Log Likelihood"].toFixed(1)
                  : null}
              </td>
              <td>{val["estimated parameters"]}</td>
              <td>{val["AIC-c"].toFixed(1)}</td>
              {this.props.srv ? (
                <td>
                  {CVSRV(
                    distributions["Synonymous site-to-site rates"],
                    self.props.numberOfSites
                  )}
                </td>
              ) : null}
              <td>Test</td>
              <td>
                {distributions["Test"]["0"].omega.toFixed(2)} (
                {(100 * distributions["Test"]["0"].proportion).toFixed(2)}%)
              </td>
              <td>
                {distributions["Test"]["1"].omega.toFixed(2)} (
                {(100 * distributions["Test"]["1"].proportion).toFixed(2)}%)
              </td>
              <td>
                {distributions["Test"]["2"].omega.toFixed(2)} (
                {(100 * distributions["Test"]["2"].proportion).toFixed(2)}%)
              </td>
              <td>
                <i className="fa fa-bar-chart" aria-hidden="true" />
              </td>
            </tr>
          );
        if (distributions["Background"]) {
          var onClick = modalShower(key, "Background").bind(self);
          var background_row = (
            <tr
              onClick={onClick}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              className={className}
              key={key + "-background"}
            >
              <td />
              <td />
              <td />
              <td />
              {this.props.srv ? <td /> : null}
              <td>Background</td>
              <td>
                {distributions["Background"]["0"].omega.toFixed(2)} (
                {(100 * distributions["Background"]["0"].proportion).toFixed(2)}
                %)
              </td>
              <td>
                {distributions["Background"]["1"].omega.toFixed(2)} (
                {(100 * distributions["Background"]["1"].proportion).toFixed(2)}
                %)
              </td>
              <td>
                {distributions["Background"]["2"].omega.toFixed(2)} (
                {(100 * distributions["Background"]["2"].proportion).toFixed(2)}
                %)
              </td>
              <td>
                <i className="fa fa-bar-chart" aria-hidden="true" />
              </td>
            </tr>
          );
          return [test_row, background_row];
        }
        return test_row;
      }
    );
    return (
      <div>
        <Header
          title="Model fits"
          popover={
            "<ul><li>Hover over a column header for a description of its content.</li><li>Click a row to view the corresponding rate distribution.</li></ul>"
          }
        />
        <table className="dm-table table table-hover table-smm list-group-item-text table-striped">
          <thead id="summary-model-header1">
            <tr>
              <th>Model</th>
              <th>
                <span
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Log likelihood of model fit"
                >
                  <em>log</em> L
                </span>
              </th>
              <th>
                <span
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Number of parameters"
                >
                  #. params
                </span>
              </th>
              <th>
                <span
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Small-sample correct Akaike information criterion"
                >
                  AIC<sub>c</sub>
                </span>
              </th>
              {this.props.srv ? (
                <th>
                  <span
                    data-toggle="tooltip"
                    title=""
                    data-original-title="Coefficient of variation of synonymous rates"
                  >
                    CV(SRV)
                  </span>
                </th>
              ) : null}
              <th>
                <span
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Indicates which branch set each parameter belongs to"
                >
                  Branch set
                </span>
              </th>
              <th>
                <span
                  data-toggle="tooltip"
                  title=""
                  data-original-title="First omega rate class"
                >
                  &omega;<sub>1</sub>
                </span>
              </th>
              <th>
                <span
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Second omega rate class"
                >
                  &omega;<sub>2</sub>
                </span>
              </th>
              <th>
                <span
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Third omega rate class"
                >
                  &omega;<sub>3</sub>
                </span>
              </th>
              <th />
            </tr>
          </thead>
          <tbody id="summary-model-table">{_.flatten(rows)}</tbody>
        </table>

        <div
          className="modal fade"
          id="modelFitsModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="myModalLabel">
                  BUSTED Site Proportion Chart
                </h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" id="modal-body">
                <h4 className="dm-table-header mb-3">&omega; distribution</h4>
                <PropChart
                  name={
                    self.state.model + ", " + self.state.branch + " branches"
                  }
                  omegas={omegas}
                  settings={distro_settings}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn.btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class BUSTEDAlignmentTreeERWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: null,
      sites: null,
      max_site: null,
      current_site: 1,
      fasta: false,
      newick: false
    };
  } 
  initialize(newick, fasta) {
    if (!newick || !fasta){
      return;
    }
    const tree = new phylotreev1(newick);
    placenodes(tree);
    tree.node_order = tree
      .get_tips()
      .sort((a, b) => a.data.abstract_y - b.data.abstract_y)
      .map(node => node.name);
    const node_to_ordered_index = _.object(
      tree.node_order,
      _.range(tree.node_order.length)
    );
    const sequence_data = fastaParser(fasta).sort((a, b) => {
      const a_index = node_to_ordered_index[a.header],
        b_index = node_to_ordered_index[b.header];
      return a_index - b_index;
    });
    this.setState({
      tree: tree,
      sequence_data: sequence_data,
      current_site: 1,
      sites: [0]
    });
  }
  componentDidMount() {
    this.initialize(this.props.newick, this.props.fasta);
  }
  componentDidUpdate(prevProps) {
    const new_fasta = prevProps.fasta != this.props.fasta,
      new_newick = prevProps.newick != this.props.newick,
      new_data = new_fasta || new_newick;
    if (new_data) {
      this.initialize(this.props.newick, this.props.fasta);
    }
  }
  savePNG() {
    saveSvgAsPng(
      document.getElementById("busted-widget"),
      "busted-evidence-ratios.png"
    );
  }
  handleInputChange(e) {
    const new_current_site = e.target.value ? +e.target.value : "",
      new_sites = this.state.sites.map(i => i),
      max_sites = this.props.evidence_ratios["constrained"][0].length;
    if (new_current_site == "") {
      this.setState({
        current_site: ""
      });
    } else if (new_current_site > 0 && new_current_site <= max_sites) {
      new_sites[new_sites.length - 1] = new_current_site - 1;
      this.setState({
        current_site: new_current_site,
        sites: new_sites
      });
    }
  }
  addSite() {
    const n_sites = this.state.sites.length;
    if (n_sites < 5) {
      const new_sites = this.state.sites.concat([0]);
      this.setState(
        {
          current_site: 1,
          sites: new_sites
        },
        () => {
          this.numberInput.focus();
        }
      );
    }
  }
  removeSite() {
    const n_sites = this.state.sites.length;
    if (n_sites > 1) {
      const new_current_site = this.state.sites[n_sites - 2] + 1,
        new_sites = this.state.sites.slice(0, n_sites - 1);
      this.setState({
        current_site: new_current_site,
        sites: new_sites
      });
    }
  }
  render() {
    const has_tree = Boolean(this.state.tree),
      has_evidence_ratios = !_.isEmpty(this.props.evidence_ratios),
      has_fasta = Boolean(this.props.fasta),
      has_data = has_tree && has_evidence_ratios && has_fasta;
    if (!has_data) return <div />;
    const { site_size } = this.props,
      tree_width = 200,
      tree_padding = 10,
      tree_height = site_size * this.state.tree.get_tips().length,
      label_height = 20,
      phylotree_props = {
        width: tree_width - 2 * tree_padding,
        height: tree_height - site_size,
        tree: this.state.tree,
        transform: `translate(${tree_padding}, ${site_size / 2})`
      },
      site_padding = 5,
      codon_label_height = 30,
      vertical_pad = site_size / 2;
    const { sites } = this.state,
      n_sites = sites.length,
      column_padding = 40,
      codon_column_width = 4 * site_size + site_padding + column_padding,
      ccw_nopad = 4 * site_size + site_padding,
      bar_height = 200,
      svg_props = {
        width: tree_width + 10 + n_sites * codon_column_width,
        height: tree_height + codon_label_height + bar_height + label_height
      };
    const log_scale = x => Math.log(1 + x),
      constrained_data = sites.map(
        site => this.props.evidence_ratios["constrained"][0][site]
      ),
      optimized_null_data = sites.map(
        site => this.props.evidence_ratios["optimized null"][0][site]
      ),
      data = constrained_data.concat(optimized_null_data).map(log_scale),
      bar_scale = d3.scale
        .linear()
        .domain([0, d3.max(data)])
        .range([0, bar_height]),
      bar_width = ccw_nopad / 3,
      bar_padding = 2;
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            paddingBottom: 20
          }}
        >
          <span>
            Current site:
            <input
              type="number"
              value={this.state.current_site}
              onChange={e => this.handleInputChange(e)}
              ref={input => {
                this.numberInput = input;
              }}
              style={{ width: 50 }}
            />
          </span>
          <button
            onClick={() => this.addSite()}
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
          >
            Add site
          </button>
          <button
            onClick={() => this.removeSite()}
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
          >
            Remove site
          </button>
          <button
            onClick={() => this.savePNG()}
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
          >
            <span className="far fa-save" />
            PNG
          </button>
        </div>

        <div style={{ textAlign: "center" }}>
          <svg
            {...svg_props}
            id="busted-widget"
            style={{ fontFamily: "sans-serif" }}
          >
            <g transform="translate(0, 5)">
              <rect
                x={0}
                y={0}
                width={svg_props.width}
                height={svg_props.height}
                fill="white"
              />
              <g transform={`translate(${tree_width - 100}, 75)`}>
                <rect x={5} y={10} width={20} height={20} fill="#00a99d" />
                <text x={0} y={20} textAnchor="end" alignmentBaseline="middle">
                  Constrained
                </text>
                <rect x={5} y={40} width={20} height={20} fill="black" />
                <text x={0} y={50} textAnchor="end" alignmentBaseline="middle">
                  Optimized Null
                </text>
              </g>
              <SitePlotAxis
                data={data}
                axis_label="log(1+evidence ratio)"
                height={bar_height}
                label_width={75}
                translateX={tree_width - 75}
                padding={{ top: 0, right: 0, bottom: 0, left: 0 }}
              />
              {constrained_data.map((datum, i) => {
                const current_bar_height = bar_scale(log_scale(datum));
                return (
                  <rect
                    x={
                      tree_width +
                      i * codon_column_width +
                      ccw_nopad / 2 -
                      bar_width -
                      bar_padding
                    }
                    y={bar_height - current_bar_height}
                    key={"busted" + i}
                    width={bar_width}
                    height={current_bar_height}
                    fill="#00a99d"
                  />
                );
              })}
              {optimized_null_data.map((datum, i) => {
                const current_bar_height = bar_scale(log_scale(datum));
                return (
                  <rect
                    x={
                      tree_width +
                      i * codon_column_width +
                      ccw_nopad / 2 +
                      bar_padding
                    }
                    y={bar_height - current_bar_height}
                    key={"busted" + i}
                    width={bar_width}
                    height={current_bar_height}
                    fill="black"
                  />
                );
              })}
              <g transform={`translate(0, ${bar_height + 5})`}>
                <Phylotree {...phylotree_props} />
                {sites.map((site, i) => {
                  return (
                    <CodonColumn
                      site={site}
                      translateX={tree_width + i * codon_column_width}
                      site_size={site_size}
                      site_padding={site_padding}
                      codon_label_height={codon_label_height}
                      key={i}
                      height={tree_height}
                      {...this.state}
                    />
                  );
                })}
              </g>
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

BUSTEDAlignmentTreeERWidget.defaultProps = {
  site_size: 20
};

class BUSTEDContents extends React.Component {
  constructor(props) {
    super(props);
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

    this.state = {
      p: null,
      fits: null,
      input_data: null,
      json: null,
      numberOfSites: null,
      tree_settings: tree_settings,
      colorGradient: ["#00a99d", "#000000"],
      grayScaleGradient: ["#444444", "#000000"]
    };
  }

  componentDidMount = () => {
    this.processData(this.props.json);
  };

  componentWillReceiveProps(nextProps) {
    this.processData(nextProps.json);
  }

  processData(data) {
    data.fits = _.mapObject(data.fits, (val, key) => {
      val["log-likelihood"] = val["Log Likelihood"];
      val["parameters"] = val["estimated parameters"];
      val["display-order"] = val["display order"];
      return val;
    });

    var omegas =
        data["fits"]["Unconstrained model"]["Rate Distributions"]["Test"],
      formatted_omegas = _.map(_.values(omegas), function(d) {
        d.prop = d.proportion;
        return d;
      });

    data["trees"] = _.map(data["input"]["trees"], (val, key) => {
      var branchLengths = {
        "Unconstrained model": _.mapObject(
          data["branch attributes"][key],
          val1 => val1.unconstrained
        ),
        "Constrained model": _.mapObject(
          data["branch attributes"][key],
          val1 => val1.constrained
        )
      };
      return { newickString: val, branchLengths: branchLengths };
    });

    data["fits"]["Unconstrained model"][
      "branch-annotations"
    ] = this.formatBranchAnnotations(data);
    if (data["fits"]["Constrained model"]) {
      data["fits"]["Constrained model"][
        "branch-annotations"
      ] = this.formatBranchAnnotations(data);
    }

    const srv = _.pluck(
      _.pluck(_.values(data.fits), "Rate Distributions"),
      "Synonymous site-to-site rates"
    ).some(x => x);

    this.setState({
      p: data["test results"]["p-value"],
      srv: srv,
      input_data: data["input"],
      fits: data["fits"],
      numberOfSites: data.input["number of sites"],
      omegas: formatted_omegas,
      json: data,
      evidence_ratio_data: _.isEmpty(data["Evidence Ratios"])
        ? {}
        : _.map(_.range(data.input["number of sites"]), function(i) {
            return {
              site_index: i + 1,
              unconstrained_likelihood:
                data["Site Log Likelihood"]["unconstrained"][0][i],
              constrained_likelihood:
                data["Site Log Likelihood"]["constrained"][0][i],
              optimized_null_likelihood:
                data["Site Log Likelihood"]["optimized null"][0][i],
              constrained_evidence_ratio:
                2 * Math.log(data["Evidence Ratios"]["constrained"][0][i]),
              optimized_null_evidence_ratio:
                2 * Math.log(data["Evidence Ratios"]["optimized null"][0][i])
            };
          })
    });
  }

  getSummaryForClipboard = () => {
    var self = this;
    var significant = this.state.p < 0.05;
    var userMessageForClipboard;
    var formattedP = self.state.p ? self.state.p.toFixed(3).toString() : null;
    if (significant) {
      userMessageForClipboard =
        "BUSTED found evidence (LRT, p-value = " +
        formattedP +
        " < .05) of gene-wide episodic diversifying selection in the selected test branches of your phylogeny. Therefore, there is evidence that at least one site on at least one test branch has experienced diversifying selection.";
    } else {
      userMessageForClipboard =
        "BUSTED found no evidence (LRT, p-value = " +
        formattedP +
        " > .05) of gene-wide episodic diversifying selection in the selected test branches of your phylogeny. Therefore, there is no evidence that any sites have experienced diversifying selection along the test branch(es).";
    }
    return userMessageForClipboard;
  };

  getSummaryForRendering = () => {
    var significant = this.state.p < 0.05,
      srv_suffix = this.state.srv ? "" : "out",
      message;
    if (significant) {
      message = (
        <p>
          BUSTED with{srv_suffix} synyonymous rate variation{" "}
          <strong className="hyphy-highlight">found evidence</strong> (LRT,
          p-value = {this.state.p ? this.state.p.toFixed(3) : null} &le; .05) of
          gene-wide episodic diversifying selection in the selected test
          branches of your phylogeny. Therefore, there is evidence that at least
          one site on at least one test branch has experienced diversifying
          selection.{" "}
        </p>
      );
    } else {
      message = (
        <p>
          BUSTED with{srv_suffix} synyonymous rate variation{" "}
          <strong>found no evidence</strong> (LRT, p-value ={" "}
          {this.state.p ? this.state.p.toFixed(3) : null} &ge; .05) of gene-wide
          episodic diversifying selection in the selected test branches of your
          phylogeny. Therefore, there is no evidence that any sites have
          experienced diversifying selection along the test branch(es).{" "}
        </p>
      );
    }
    return message;
  };

  formatBranchAnnotations = json => {
    // attach is_foreground to branch annotations
    var branch_annotations = d3.range(json.trees.length).map(i => {
      return _.mapObject(json["tested"][i], (val, key) => {
        return { is_foreground: val == "test" };
      });
    });
    return branch_annotations;
  };

  render() {
    var self = this;
    var models = {};
    if (!_.isNull(self.state.json)) {
      models = _.pick(self.state.json.fits, [
        "Unconstrained model",
        "Constrained model"
      ]);
    }
    if (_.isEmpty(self.state.evidence_ratio_data) || (this.props.fasta == "undefined") || (this.props.fasta == null) ) {
      var phylo_alignment = false;
    } else {
      var phylo_alignment = true;
    }
    const newick = this.state.json
      ? this.state.json.trees[0].newickString
      : null;
    return (
      <div>
        <div>
          <MainResult
            summary_for_clipboard={this.getSummaryForClipboard()}
            summary_for_rendering={this.getSummaryForRendering()}
            method_ref="http://hyphy.org/methods/selection-methods/#busted"
            citation_ref="http://www.ncbi.nlm.nih.gov/pubmed/25701167"
            citation_number="PMID 25701167"
          />
        </div>

        <div className="row">
          <div id="hyphy-model-fits" className="col-lg-12">
            <BUSTEDModelTable
              fits={self.state.fits}
              srv={self.state.srv}
              numberOfSites={self.state.numberOfSites}
            />
            <p className="description">
              This table reports a statistical summary of the models fit to the
              data. Here, <strong>Unconstrained model</strong> refers to the
              BUSTED alternative model for selection, and{" "}
              <strong>Constrained model</strong> refers to the BUSTED null model
              for selection.
            </p>
          </div>
        </div>

        <BUSTEDSiteChartAndTable data={this.state.evidence_ratio_data} />

        <div className="row">
          <div className="col-md-12" id="phylogenetic-tree">
            <Tree
              json={self.state.json}
              settings={self.state.tree_settings}
              models={models}
              color_gradient={self.state.colorGradient}
              grayscale_gradient={self.state.grayscaleGradient}
              method={"busted"}
              multitree
            />
          </div>
        </div>

        {phylo_alignment ? (
          <div className="row">
            <div className="col-md-12" id="phylo-alignment">
              <Header
                title="Phylogenetic alignment evidence ratio plot"
                popover={
                  "<ul><li>Compare (possibility distant) sites with sequence and phylogentic information.</li><li>Add or remove sites with the corresponding buttons.</li></ul>"
                }
              />
              <BUSTEDAlignmentTreeERWidget
                newick={newick}
                fasta={this.props.fasta}
                evidence_ratios={
                  self.state.json ? self.state.json["Evidence Ratios"] : null
                }
              />
            </div>
          </div>
        ) : <div className="row">
          <div className="col-md-12" id="phylo-alignment">
              <Header
                title="Phylogenetic alignment evidence ratio plot"
              />
              <div className="alert alert-danger">
              <p>Phylogenetic Alignment cannot be rendered for this job.</p>
              <p>In order to view the phylogenetic alignment plot, this job must be completed and rendered on datamonkey.org. Hyphy-Vision will not render this plot.</p>
              <p>If this job was completed on datamonkey.org, and this message is being displayed, then this job did not present the required data for a successful plot. </p>
              <p>This is generally caused by failing to reject the null hypothesis under the unconstrained model, rendering future tests moot to conduct (e.g. constrained model).</p>
              </div>
            </div>
        </div>
        }
      </div>
    );
  }
}

export function BUSTED(props) {
  return (
    <ResultsPage
      data={props.data}
      scrollSpyInfo={[
        { label: "summary", href: "summary-div" },
        { label: "model statistics", href: "hyphy-model-fits" },
        { label: "tree", href: "phylogenetic-tree" },
        { label: "phylo alignment", href: "phylo-alignment" }
      ]}
      methodName="Branch-site Unrestricted Statistical Test for Episodic Diversification"
      fasta={props.fasta}
      originalFile={props.originalFile}
      analysisLog={props.analysisLog}
    >
      {BUSTEDContents}
    </ResultsPage>
  );
}

export default function render_busted(
  data,
  element,
  fasta,
  originalFile,
  analysisLog
) {
  ReactDOM.render(
    <BUSTED
      data={data}
      fasta={fasta}
      originalFile={originalFile}
      analysisLog={analysisLog}
    />,
    document.getElementById(element)
  );
}
