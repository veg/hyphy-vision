var React = require("react"),
  ReactDOM = require("react-dom"),
  _ = require("underscore"),
  d3_save_svg = require("d3-save-svg"),
  datamonkey = require("../datamonkey/datamonkey.js");

import {
  DatamonkeyTable,
  DatamonkeyPartitionTable,
  DatamonkeyModelTable,
  DatamonkeyTimersTable
} from "./components/tables.jsx";
import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";
import { DatamonkeyScatterplot, DatamonkeySeries } from "./components/graphs.jsx";
import { InputInfo } from "./components/input_info.jsx";
import PropTypes from 'prop-types';
import { saveSvgAsPng } from "save-svg-as-png";

require("../datamonkey/helpers.js");


var SLACSites = React.createClass({
  propTypes: {
    headers: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.string)
    ).isRequired,
    mle: PropTypes.object.isRequired,
    sample25: PropTypes.object,
    sampleMedian: PropTypes.object,
    sample975: PropTypes.object,
    initialAmbigHandling: PropTypes.string.isRequired,
    partitionSites: PropTypes.object.isRequired
  },

  getInitialState: function() {
    var canDoCI =
      this.props.sample25 && this.props.sampleMedian && this.props.sample975;

    return {
      ambigOptions: this.dm_AmbigOptions(this.props),
      ambigHandling: this.props.initialAmbigHandling,
      filters: new Object(null),
      showIntervals: false,
      showCellColoring: canDoCI,
      hasCI: canDoCI,
      filterField: ["Site", -1],
      filterOp: "AND",
      canAddFilter: false,
      lowerFilterBound: -Infinity,
      upperFilterBound: Infinity
    };
  },

  getDefaultProps: function() {
    return {
      sample25: null,
      sampleMedian: null,
      sample975: null,
      initialAmbigHandling: "RESOLVED"
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      ambigOptions: this.dm_AmbigOptions(nextProps),
      ambigHandling: nextProps.initialAmbigHandling
    });
  },

  dm_formatNumber: d3.format(".3r"),
  dm_formatNumberShort: d3.format(".2r"),
  dm_rangeColorizer: d3.scale
    .linear()
    .range([d3.rgb("blue"), d3.rgb("white"), d3.rgb("red")])
    .clamp(true)
    .domain([-1, 0, 1]),
  dm_rangeTextColorizer: d3.scale
    .linear()
    .range([d3.rgb("white"), d3.rgb("black"), d3.rgb("black")])
    .clamp(true)
    .domain([-1, -0.25, 1]),

  dm_log10times: _.before(10, function(v) {
    //console.log(v);
    return 0;
  }),

  dm_formatInterval: function(values) {
    //this.dm_log10times (values);

    return (
      this.dm_formatNumber(values[0]) +
      " / " +
      this.dm_formatNumber(values[2]) +
      " [" +
      this.dm_formatNumber(values[1]) +
      " : " +
      this.dm_formatNumber(values[3]) +
      "]"
    );
  },

  dm_AmbigOptions: function(theseProps) {
    return _.keys(theseProps.mle[0]);
  },

  dm_setAmbigOption: function(value) {
    this.setState({
      ambigHandling: value
    });
  },

  dm_toggleIntervals: function(event) {
    this.setState({
      showIntervals: !this.state.showIntervals,
      showCellColoring: this.state.showIntervals
        ? this.state.showCellColoring
        : false
    });
  },

  dm_toggleCellColoring: function(event) {
    this.setState({
      showCellColoring: !this.state.showCellColoring
    });
  },

  dm_toggleVariableFilter: function(event) {
    var filterState = new Object(null);
    _.extend(filterState, this.state.filters);
    if (!("variable" in this.state.filters)) {
      filterState["variable"] = true;
    } else {
      delete filterState["variable"];
    }
    this.setState({ filters: filterState });
  },

  dm_makeFilterFunction: function() {
    var filterFunction = null;

    _.each(this.state.filters, function(value, key) {
      var composeFunction = null;

      switch (key) {
        case "variable": {
          if (filterFunction) {
            composeFunction = function(
              f,
              partitionIndex,
              index,
              site,
              siteData
            ) {
              return (
                f(partitionIndex, index, site, siteData) &&
                siteData[2] + siteData[3] > 0
              );
            };
          } else {
            filterFunction = function(partitionIndex, index, site, siteData) {
              return siteData[2] + siteData[3] > 0;
            };
          }
          break;
        }
        default: {
          if (_.isArray(value)) {
            var new_condition = null,
              filter_index = value[0][1];
            switch (filter_index) {
              case -2:
                new_condition = function(
                  partitionIndex,
                  index,
                  site,
                  siteData
                ) {
                  return (
                    partitionIndex >= value[1] && partitionIndex <= value[2]
                  );
                };
                break;
              case -1:
                new_condition = function(
                  partitionIndex,
                  index,
                  site,
                  siteData
                ) {
                  return site >= value[1] && site <= value[2];
                };
                break;
              default:
                new_condition = function(
                  partitionIndex,
                  index,
                  site,
                  siteData
                ) {
                  return (
                    siteData[filter_index] >= value[1] &&
                    siteData[filter_index] <= value[2]
                  );
                };
            }

            if (new_condition) {
              if (value[3] == "AND") {
                composeFunction = function(
                  f,
                  partitionIndex,
                  index,
                  site,
                  siteData
                ) {
                  return (
                    (!f || f(partitionIndex, index, site, siteData)) &&
                    new_condition(partitionIndex, index, site, siteData)
                  );
                };
              } else {
                if (filterFunction) {
                  composeFunction = function(
                    f,
                    partitionIndex,
                    index,
                    site,
                    siteData
                  ) {
                    return (
                      f(partitionIndex, index, site, siteData) ||
                      new_condition(partitionIndex, index, site, siteData)
                    );
                  };
                } else {
                  filterFunction = function(
                    partitionIndex,
                    index,
                    site,
                    siteData
                  ) {
                    return new_condition(partitionIndex, index, site, siteData);
                  };
                }
              }
            }
          }
        }
      }

      if (composeFunction) {
        filterFunction = _.wrap(filterFunction, composeFunction);
      }
    });

    return filterFunction;
  },

  dm_makeHeaderRow: function() {
    var headers = [
      { value: "Partition", sortable: true },
      { value: "Site", sortable: true }
    ],
      doCI = this.state.showIntervals,
      filterable = [["Partition", -2], ["Site", -1]];

    if (doCI) {
      var secondRow = ["", ""];

      _.each(this.props.headers, function(value, index) {
        headers.push({
          value: value[0],
          abbr: value[1],
          span: 4,
          style: { textAlign: "center" }
        });
        filterable.push([value[0], index]);
        _.each(["MLE", "Med", "2.5%", "97.5%"], function(v) {
          secondRow.push({ value: v, sortable: true });
        });
      });
      return { headers: [headers, secondRow], filterable: filterable };
    } else {
      _.each(this.props.headers, function(value, index) {
        headers.push({ value: value[0], abbr: value[1], sortable: true });
        filterable.push([value[0], index]);
      });
    }
    return { headers: headers, filterable: filterable };
  },

  dm_makeDataRows: function(filter) {
    var rows = [],
      partitionCount = datamonkey.helpers.countPartitionsJSON(
        this.props.partitionSites
      ),
      partitionIndex = 0,
      self = this,
      doCI = this.state.showIntervals,
      siteCount = 0;

    while (partitionIndex < partitionCount) {
      _.each(self.props.partitionSites[partitionIndex].coverage[0], function(
        site,
        index
      ) {
        var siteData =
          self.props.mle[partitionIndex][self.state.ambigHandling][index];
        if (
          !filter ||
          filter(partitionIndex + 1, index + 1, site + 1, siteData)
        ) {
          var thisRow = [partitionIndex + 1, site + 1];
          //secondRow = doCI ? ['',''] : null;
          siteCount++;

          _.each(siteData, function(estimate, colIndex) {
            var sampled_range = null,
              scaled_median_mle_dev = 0;

            if (self.state.hasCI) {
              sampled_range = [
                self.props.sampleMedian[partitionIndex][
                  self.state.ambigHandling
                ][index][colIndex],
                self.props.sample25[partitionIndex][self.state.ambigHandling][
                  index
                ][colIndex],
                self.props.sample975[partitionIndex][self.state.ambigHandling][
                  index
                ][colIndex]
              ];

              var range = sampled_range[2] - sampled_range[1];
              if (range > 0) {
                scaled_median_mle_dev = (estimate - sampled_range[0]) / range;
              }
            }

            if (doCI) {
              thisRow.push({ value: estimate, format: self.dm_formatNumber });
              thisRow.push({
                value: sampled_range[0],
                format: self.dm_formatNumberShort
              });
              thisRow.push({
                value: sampled_range[1],
                format: self.dm_formatNumberShort
              });
              thisRow.push({
                value: sampled_range[2],
                format: self.dm_formatNumberShort
              });
            } else {
              var this_cell = { value: estimate, format: self.dm_formatNumber };
              if (self.state.hasCI) {
                if (self.state.showCellColoring) {
                  this_cell.style = {
                    backgroundColor: self.dm_rangeColorizer(
                      scaled_median_mle_dev
                    ),
                    color: self.dm_rangeTextColorizer(scaled_median_mle_dev)
                  };
                }
                this_cell.tooltip =
                  self.dm_formatNumberShort(sampled_range[0]) +
                  " [" +
                  self.dm_formatNumberShort(sampled_range[1]) +
                  " - " +
                  self.dm_formatNumberShort(sampled_range[2]) +
                  "]";
              }
              thisRow.push(this_cell);
            }
          });
          rows.push(thisRow);
          //if (secondRow) {
          //    rows.push (secondRow);
          //}
        }
      });

      partitionIndex++;
    }

    return { rows: rows, count: siteCount };
  },

  dm_handleLB: function(e) {
    var new_value = parseFloat(e.target.value);
    this.setState({
      lowerFilterBound: _.isFinite(new_value) ? new_value : -Infinity
    });
  },

  dm_handleUB: function(e) {
    var new_value = parseFloat(e.target.value);
    this.setState({
      upperFilterBound: _.isFinite(new_value) ? new_value : Infinity
    });
  },

  dm_handleFilterField: function(value) {
    this.setState({ filterField: value });
  },

  dm_checkFilterValidity: function() {
    if (_.isFinite(this.state.lowerFilterBound)) {
      if (_.isFinite(this.state.upperFilterBound)) {
        return this.state.lowerFilterBound <= this.state.upperFilterBound;
      }
      return true;
    }
    return _.isFinite(this.state.upperFilterBound);
  },

  dm_unique_filter_ID: 0,

  dm_handleAddCondition: function(e) {
    e.preventDefault();
    var filterState = new Object(null);
    _.extend(filterState, this.state.filters);
    filterState[this.dm_unique_filter_ID++] = [
      this.state.filterField,
      this.state.lowerFilterBound,
      this.state.upperFilterBound,
      this.state.filterOp
    ];

    this.setState({ filters: filterState });
  },

  dm_handleRemoveCondition: function(key, e) {
    e.preventDefault();
    var filterState = new Object(null);
    _.extend(filterState, this.state.filters);
    delete filterState[key];
    //console.log ('dm_handleRemoveCondition', key, this.state.filters,filterState);

    this.setState({ filters: filterState });
  },

  render: function() {
    var self = this;
    var { rows, count } = this.dm_makeDataRows(this.dm_makeFilterFunction());
    var { headers, filterable } = this.dm_makeHeaderRow();

    var show_ci_menu = function() {
      if (self.state.hasCI) {
        var ci_menu = [
          <li key="ci_divider" className="divider" />,
        ];
        if (!self.state.showIntervals) {
          ci_menu.push(
            <li key="coloring">
              <a
                href="#"
                data-value="showIntervals"
                tabIndex="-1"
                onClick={self.dm_toggleCellColoring}
              >
                <input
                  type="checkbox"
                  checked={self.state.showCellColoring}
                  defaultChecked={self.state.showCellColoring}
                  onChange={self.dm_toggleCellColoring}
                />&nbsp;Color cells based on MLE-median
              </a>
            </li>
          );
        }
        return ci_menu;
      }
      return null;
    };

    var result = (
      <div className="table-responsive">
        <nav className="navbar">
          <form className="navbar-form ">
            <div className="form-group navbar-left">

              <div className="input-group">

                <ul className="dropdown-menu">
                  <li key="variable">
                    <a
                      href="#"
                      data-value="variable"
                      tabIndex="-1"
                      onClick={self.dm_toggleVariableFilter}
                    >
                      <input
                        type="checkbox"
                        checked={"variable" in self.state.filters}
                        defaultChecked={"variable" in self.state.filters}
                        onChange={self.dm_toggleVariableFilter}
                      />&nbsp;Variable sites only
                    </a>
                  </li>
                  {show_ci_menu()}
                </ul>
                <button
                  className="btn btn-default btn-sm dropdown-toggle form-control"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Display<span className="caret" />
                </button>
              </div>

              <div className="input-group">
                <ul className="dropdown-menu">
                  {_.map(this.state.ambigOptions, function(value, index) {
                    return (
                      <li key={index}>
                        <a
                          href="javascript:void(0);"
                          tabIndex="-1"
                          onClick={_.partial(self.dm_setAmbigOption, value)}
                        >
                          {value}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <button
                  className="btn btn-default btn-sm dropdown-toggle form-control"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Ambiguities <span className="caret" />
                </button>

              </div>
            </div>
            <div className="form-group navbar-right">
              <div className="input-group">
                <ul className="dropdown-menu">
                  {_.map(filterable, function(d, index) {
                    return (
                      <li key={index}>
                        <a
                          href="javascript:void(0);"
                          tabIndex="-1"
                          onClick={_.partial(self.dm_handleFilterField, d)}
                        >
                          {d[0]}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <button
                  className="btn btn-default btn-sm dropdown-toggle form-control"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {self.state.filterField[0]} <span className="caret" />
                </button>
              </div>
              <div className="input-group">
                <span className="input-group-addon"> {"is in ["} </span>
                <input
                  type="text"
                  className="form-control"
                  style={{width: "75px"}}
                  placeholder="-∞"
                  defaultValue={"-" + String.fromCharCode(8734)}
                  onChange={self.dm_handleLB}
                />
              </div>
              <div className="input-group">
                <span className="input-group-addon">,</span>
                <input
                  type="text"
                  className="form-control"
                  style={{width: "75px"}}
                  placeholder="∞"
                  defaultValue={String.fromCharCode(8734)}
                  onChange={self.dm_handleUB}
                />
                <span className="input-group-addon">]</span>
              </div>

              <div className="input-group">
                <ul className="dropdown-menu">
                  {_.map(["AND", "OR"], function(d, index) {
                    return (
                      <li key={index}>
                        <a
                          href="#"
                          tabIndex="-1"
                          onClick={function() {
                            self.setState({ filterOp: d });
                          }}
                        >
                          {d}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <button
                  className="btn btn-default btn-sm dropdown-toggle form-control"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {self.state.filterOp} <span className="caret" />
                </button>
              </div>

               <div className="input-group">
                <button
                  className={
                    "btn btn-default " +
                    (self.dm_checkFilterValidity() ? "" : "disabled")
                  }
                  onClick={self.dm_handleAddCondition}
                >
                  {" "}Add filter{" "}
                </button>
              </div>

           </div>

          </form>
        </nav>

        {self.state.hasCI
          ? <div className="alert alert-info alert-dismissable">
              <button
                type="button"
                className="close pull-right"
                data-dismiss="alert"
                aria-hidden="true"
              >
                {" "}&times;{" "}
              </button>
              <p>
                <strong>Color legend:</strong> MLE is &nbsp;
                <span
                  className="blue-badge"
                >
                  is much less
                </span>
                &nbsp;
                <span
                  className="white-badge"
                >
                  is the same as
                </span>
                &nbsp;
                <span
                  className="red-badge"
                >
                  is much greater
                </span>
                &nbsp;
                than the sampled median.
              </p>
              <p>
                Default table shading is used to indicate the magnitude of
                difference between the estimate
                of a specific quantity using the MLE ancestral state
                reconstruction, and the median
                of the estimate using a sample from the distribution of ancestral
                state reconstructions.
              </p>
              <small>
                You can mouse over the cells to see
                individual sampling intervals.
              </small>
            </div>
          : null}

        {_.keys(self.state.filters).length > 0
          ? <div className="well well-sm">
              {_.map(self.state.filters, function(value, key) {
                if (key == "variable") {
                  return (
                    <div
                      className="input-group"
                      style={{ display: "inline" }}
                      key={key}
                    >
                      <span className="badge badge-info">
                        (AND) variable sites
                        <i
                          className="fa fa-times-circle"
                          style={{ marginLeft: "0.25em" }}
                          onClick={self.dm_toggleVariableFilter}
                        />
                      </span>
                    </div>
                  );
                } else {
                  var label =
                    (value[3] == "AND" ? " (AND) " : " (OR) ") + value[0][0];

                  if (_.isFinite(value[1])) {
                    if (_.isFinite(value[2])) {
                      label +=
                        String.fromCharCode(8712) +
                        "[" +
                        value[1] +
                        "," +
                        value[2] +
                        "]";
                    } else {
                      label += String.fromCharCode(8805) + value[1];
                    }
                  } else {
                    label += String.fromCharCode(8804) + value[2];
                  }

                  return (
                    <div
                      className="input-group"
                      style={{ display: "inline" }}
                      key={key}
                    >
                      <span className="badge badge-info">
                        {label}
                        <i
                          className="fa fa-times-circle"
                          style={{ marginLeft: "0.25em" }}
                          onClick={_.bind(
                            _.partial(self.dm_handleRemoveCondition, key),
                            self
                          )}
                        />
                      </span>
                    </div>
                  );
                }
              })}
            </div>
          : null}

        <DatamonkeyTable
          headerData={headers}
          bodyData={rows}
          initialSort={1}
          paginate={20}
          export_csv
        />
      </div>
    );

    return result;
  }
});

var SLACBanner = React.createClass({
  dm_countSites: function(json, cutoff) {
    var result = {
      all: 0,
      positive: 0,
      negative: 0
    };

    result.all = datamonkey.helpers.countSitesFromPartitionsJSON(json);

    result.positive = datamonkey.helpers.sum(json["MLE"]["content"], function(partition) {
      return _.reduce(partition["by-site"]["RESOLVED"], function(sum, row) {
          return sum + (row[8] <= cutoff ? 1 : 0);
        },
        0
      );
    });

    result.negative = datamonkey.helpers.sum(json["MLE"]["content"], function(partition) {
      return _.reduce(partition["by-site"]["RESOLVED"], function(sum, row) {
          return sum + (row[9] <= cutoff ? 1 : 0);
        },
        0
      );
    });

    return result;
  },

  dm_computeState: function(state, pvalue) {
    return {
      sites: this.dm_countSites(state, pvalue)
    };
  },

  dm_formatP: d3.format(".3f"),

  getInitialState: function() {
    return this.dm_computeState(this.props.analysis_results, this.props.pValue);
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(
      this.dm_computeState(nextProps.analysis_results, nextProps.pValue)
    );
  },

  render: function() {
    return (<div className="row">
      <div className="clearance" id="slac-summary"></div>
      <div className="col-md-12">
        <h3 className="list-group-item-heading">
          <span id="summary-method-name">
          Single-Likelihood Ancestor Counting</span>
          <br />
          <span className="results-summary">results summary</span>
        </h3>
      </div>

      <div className="col-md-12">
        <InputInfo input_data={this.props.input_data}/>
      </div>

      <div className="col-md-12">
        <div className="main-result">
          <p>
            SLAC <strong className="hyphy-highlight">found evidence</strong> of pervasive
          </p>
          <p>
            <i className="fa fa-plus-circle" aria-hidden="true">
              {" "}
            </i>{" "}
            positive/diversifying selection at
            <span className="hyphy-highlight">
              {" "}{this.state.sites.positive}{" "}
            </span>
            sites
          </p> 
          <p>
            <i className="fa fa-plus-circle" aria-hidden="true">
              {" "}
            </i>{" "}
            negative/purifying selection at
            <span className="hyphy-highlight">
              {" "}{this.state.sites.negative}{" "}
            </span>
            sites
          </p> 
          <p>
            with p-value threshold of
            <input
              style={{display: "inline-block", marginLeft: "5px", width: "100px"}}
              className="form-control"
              type="number"
              defaultValue="0.1"
              step="0.01"
              min="0"
              max="1"
              onChange={this.props.pAdjuster}
            />.
          </p>          
          <hr /> 
          <p>
            <small>
              See{" "}
              <a href="http://hyphy.org/methods/selection-methods/#slac">
                here
              </a>{" "}
              for more information about the SLAC method.

              Please cite{" "}
              <a
                href="http://www.ncbi.nlm.nih.gov/pubmed/15703242"
                target="_blank"
              >
                PMID 15703242
              </a>{" "}
              if you use this result in a publication, presentation, or other
              scientific work.
            </small> 
          </p>
          
        </div>
      </div>
    </div>);
  }
});

var SLACGraphs = React.createClass({
  getInitialState: function() {
    return {
      ambigHandling: this.props.initialAmbigHandling,
      ambigOptions: this.dm_AmbigOptions(this.props),
      xLabel: "Site",
      yLabel: "dN-dS"
    };
  },

  getDefaultProps: function() {
    return {
      mle: null,
      partitionSites: null,
      initialAmbigHandling: "RESOLVED"
    };
  },

  dm_AmbigOptions: function(theseProps) {
    return _.keys(theseProps.mle[0]);
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      ambigOptions: this.dm_AmbigOptions(nextProps),
      ambigHandling: nextProps.initialAmbigHandling
    });
  },

  dm_makePlotData: function(xlabel, ylabels) {
    var self = this;

    var x = [];
    var y = [[]];

    var partitionCount = datamonkey.helpers.countPartitionsJSON(
      this.props.partitionSites
    ),
      partitionIndex = 0,
      siteCount = 0,
      col_index = [],
      x_index = -1;

    _.each(self.props.headers, function(d, i) {
      if (
        _.find(ylabels, function(l) {
          return l == d[0];
        })
      ) {
        col_index.push(i);
      }
    });

    x_index = _.pluck(self.props.headers, 0).indexOf(xlabel);

    y = _.map(col_index, function() {
      return [];
    });

    while (partitionIndex < partitionCount) {
      _.each(self.props.partitionSites[partitionIndex].coverage[0], function(
        site,
        index
      ) {
        var siteData =
          self.props.mle[partitionIndex][self.state.ambigHandling][index];
        siteCount++;
        if (x_index < 0) {
          x.push(siteCount);
        } else {
          x.push(siteData[x_index]);
        }
        _.each(col_index, function(ci, i) {
          y[i].push(siteData[ci]);
        });
      });

      partitionIndex++;
    }

    return { x: x, y: y };
  },

  dm_xAxis: function(column) {
    this.setState({ xLabel: column });
  },

  dm_yAxis: function(column) {
    this.setState({ yLabel: column });
  },

  dm_setAmbigOption: function(value) {
    this.setState({
      ambigHandling: value
    });
  },

  dm_doScatter: function() {
    return this.state.xLabel != "Site";
  },

  savePNG(){
    saveSvgAsPng(document.getElementById("dm-chart"), "datamonkey-chart.png");
  },
  
  saveSVG(){
    d3_save_svg.save(d3.select("#dm-chart").node(), {filename: "datamonkey-chart"});
  },


  render: function() {
    var self = this;
    var { x: x, y: y } = this.dm_makePlotData(this.state.xLabel, [
      this.state.yLabel
    ]);

    return (
      <div className="table-responsive">
        <nav className="navbar" style={{borderBottom:"none"}}>
          <form className="navbar-form ">
            <div className="form-group navbar-left">
              <div className="input-group">
                <span className="input-group-addon">X-axis:</span>

                <ul className="dropdown-menu">
                  {_.map(
                    ["Site"].concat(_.pluck(self.props.headers, 0)),
                    function(value) {
                      return (
                        <li key={value}>
                          <a
                            href="javascript:void(0);"
                            tabIndex="-1"
                            onClick={_.partial(self.dm_xAxis, value)}
                          >
                            {value}
                          </a>
                        </li>
                      );
                    }
                  )}
                </ul>
                <button
                  className="btn btn-default btn-sm dropdown-toggle form-control"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {self.state.xLabel}
                  <span className="caret" />
                </button>
              </div>
              <div className="input-group">
                <span className="input-group-addon">Y-axis:</span>

                <ul className="dropdown-menu">
                  {_.map(_.pluck(self.props.headers, 0), function(value) {
                    return (
                      <li key={value}>
                        <a
                          href="javascript:void(0);"
                          tabIndex="-1"
                          onClick={_.partial(self.dm_yAxis, value)}
                        >
                          {value}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <button
                  className="btn btn-default btn-sm dropdown-toggle form-control"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {self.state.yLabel}
                  <span className="caret" />
                </button>
              </div>
              <div className="input-group">
                <span className="input-group-addon">Ambiguities </span>
                <ul className="dropdown-menu">
                  {_.map(this.state.ambigOptions, function(value, index) {
                    return (
                      <li key={index}>
                        <a
                          href="javascript:void(0);"
                          tabIndex="-1"
                          onClick={_.partial(self.dm_setAmbigOption, value)}
                        >
                          {value}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <button
                  className="btn btn-default btn-sm dropdown-toggle form-control"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {self.state.ambigHandling} <span className="caret" />
                </button>

              </div>
            </div>
            <div className="form-group navbar-right">
              <div className="input-group">
                <button
                  id="export-chart-png"
                  type="button"
                  className="btn btn-default btn-sm pull-right btn-export"
                  onClick={self.savePNG}
                >
                  <span className="glyphicon glyphicon-floppy-save" /> Export to PNG
                </button>
                <button
                  id="export-chart-png"
                  type="button"
                  className="btn btn-default btn-sm pull-right btn-export"
                  onClick={self.saveSVG}
                >
                  <span className="glyphicon glyphicon-floppy-save" /> Export to SVG
                </button>

              </div>
            </div>
            {/*<div className="form-group navbar-right">
                                <span className="badge" style={{marginLeft : "0.5em"}}>X: {self.state.currentX}</span>
                                <span className="badge" style={{marginLeft : "0.5em"}}>Y: {self.state.currentY}</span>
                          </div>*/}
          </form>
        </nav>

        {self.dm_doScatter()
          ? <DatamonkeyScatterplot
              x={x}
              y={y}
              marginLeft={50}
              transitions={true}
            />
          : <DatamonkeySeries
              x={x}
              y={y}
              marginLeft={50}
              transitions={true}
              doDots={true}
            />}

      </div>
    );
  }
});

var SLAC = React.createClass({
  float_format: d3.format(".2f"),

  dm_loadFromServer: function() {
    /* 20160721 SLKP: prefixing all custom (i.e. not defined by REACT) with dm_
     to make it easier to recognize scoping immediately */

    var self = this;

    d3.json(self.props.url, function(request_error, data) {
      if (!data) {
        var error_message_text = request_error.status == 404
          ? self.props.url + " could not be loaded"
          : request_error.statusText;
        self.setState({ error_message: error_message_text });
      } else {
        self.dm_initializeFromJSON(data);
      }
    });
  },

  dm_initializeFromJSON: function(data) {
    if(data["fits"]["Nucleotide GTR"]){
      data["fits"]["Nucleotide GTR"]["Rate Distributions"] = {};      
    }
    this.setState({
      analysis_results: data,
      input_data: data.input
    });
  },

  getDefaultProps: function() {
    /* default properties for the component */

    return {
      url: "#"
    };
  },

  getInitialState: function() {
    return {
      analysis_results: null,
      error_message: null,
      pValue: 0.1,
      input_data: null
    };
  },

  componentWillMount: function() {
    this.dm_loadFromServer();
  },

  onFileChange: function(e) {
    var self = this,
      files = e.target.files; // FileList object

    if (files.length == 1) {
      var f = files[0];
      var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          var data = JSON.parse(this.result);
          self.dm_initializeFromJSON(data);
        };
      })(f);

      reader.readAsText(f);
    }
    e.preventDefault();
  },

  dm_adjustPvalue: function(event) {
    this.setState({ pValue: parseFloat(event.target.value) });
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

    if (self.state.error_message) {
      return (
        <div
          id="datamonkey-error"
          className="alert alert-danger alert-dismissible"
          role="alert"
        >
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <strong>{self.state.error_message}</strong>{" "}
          <span id="datamonkey-error-text" />
        </div>
      );
    }

    if (self.state.analysis_results) {
      var scrollspy_info = [
        { label: "summary", href: "slac-summary" },
        { label: "information", href: "datamonkey-slac-tree-summary" },
        { label: "table", href: "slac-table" },
        { label: "graph", href: "slac-graph" }
      ];

      var trees = self.state.analysis_results ? {
        newick: self.state.analysis_results.input.trees,
        tested: self.state.analysis_results.tested
      } : null;

      return (
        <div>
          {this.props.hyphy_vision ? <NavBar onFileChange={this.onFileChange} /> : ''}
          <div className="container">
            <div className="row">
              <ScrollSpy info={scrollspy_info} />
              <div className="col-md-10">
              <div id="results">
                <SLACBanner
                  analysis_results={self.state.analysis_results}
                  pValue={self.state.pValue}
                  pAdjuster={_.bind(self.dm_adjustPvalue, self)}
                  input_data={self.state.input_data}
                />

                <div className="row hidden-print">
                  <div
                    id="datamonkey-slac-tree-summary"
                    className="col-md-12"
                  >
                    <h4 className="dm-table-header">
                      Partition information
                    </h4>
                     
                      <DatamonkeyPartitionTable
                        pValue={self.state.pValue}
                        trees={trees}
                        partitions={self.state.analysis_results['data partitions']}
                        branchAttributes={
                          self.state.analysis_results["branch attributes"]
                        }
                        siteResults={self.state.analysis_results.MLE}
                        accessorPositive={function(json, partition) {
                          if(!json["content"][partition]) return null;
                          return _.map(
                            json["content"][partition]["by-site"]["AVERAGED"],
                            function(v) {
                              return v[8];
                            }
                          );
                        }}
                        accessorNegative={function(json, partition) {
                          if(!json["content"][partition]) return null;
                          return _.map(
                            json["content"][partition]["by-site"]["AVERAGED"],
                            function(v) {
                              return v[9];
                            }
                          );
                        }}
                      />
                     
                  </div>
                  <div
                    id="datamonkey-slac-model-fits"
                    className="col-md-8"
                  >
                     
                      {
                        <DatamonkeyModelTable
                          fits={self.state.analysis_results.fits}
                        />
                      }
                     
                  </div>
                  <div
                    id="datamonkey-slac-timers"
                    className="col-md-4"
                  >
                    <h4 className="dm-table-header">
                      Execution time
                    </h4>
                     
                      <DatamonkeyTimersTable
                        timers={self.state.analysis_results.timers}
                        totalTime={"Total time"}
                      />
                     
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12" id="slac-table">
                    <h4 className="dm-table-header">
                      Site table
                    </h4>
                    <SLACSites
                      headers={self.state.analysis_results.MLE.headers}
                      mle={datamonkey.helpers.map(
                        datamonkey.helpers.filter(
                          self.state.analysis_results.MLE.content,
                          function(value, key) {
                            return _.has(value, "by-site");
                          }
                        ),
                        function(value, key) {
                          return value["by-site"];
                        }
                      )}
                      sample25={self.state.analysis_results["sample-2.5"]}
                      sampleMedian={
                        self.state.analysis_results["sample-median"]
                      }
                      sample975={self.state.analysis_results["sample-97.5"]}
                      partitionSites={self.state.analysis_results['data partitions']}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12" id="slac-graph">
                    <h4 className="dm-table-header">
                      Site graph
                    </h4>
                    <SLACGraphs
                      mle={datamonkey.helpers.map(
                        datamonkey.helpers.filter(
                          self.state.analysis_results.MLE.content,
                          function(value, key) {
                            return _.has(value, "by-site");
                          }
                        ),
                        function(value, key) {
                          return value["by-site"];
                        }
                      )}
                      partitionSites={self.state.analysis_results['data partitions']}
                      headers={self.state.analysis_results.MLE.headers}
                    />
                  </div>
                </div>

              </div>
              </div>

              <div className="col-md-1" />
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
});

// Will need to make a call to this
// omega distributions
function render_slac(url, element) {
  ReactDOM.render(<SLAC url={url} />, document.getElementById(element));
}

function render_hv_slac(url, element) {
  ReactDOM.render(<SLAC url={url} hyphy_vision />, document.getElementById(element));
}

module.exports = render_slac;
module.exports.hv = render_hv_slac;

