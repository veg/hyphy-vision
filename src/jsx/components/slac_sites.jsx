var React = require('react');
var datamonkey = require('../../datamonkey/datamonkey.js');

import {DatamonkeyTable} from "./shared_summary.jsx";

var SLACSites = React.createClass({
    propTypes: {
     headers: React.PropTypes.arrayOf (React.PropTypes.arrayOf (React.PropTypes.string)).isRequired,
     mle  : React.PropTypes.object.isRequired,
     sample25 : React.PropTypes.object,
     sampleMedian: React.PropTypes.object,
     sample975: React.PropTypes.object,
     initialAmbigHandling: React.PropTypes.string.isRequired,
     partitionSites: React.PropTypes.object.isRequired,
    },

  getInitialState: function() {
    var canDoCI = this.props.sample25 && this.props.sampleMedian && this.props.sample975;

    return {

                ambigOptions: this.dm_AmbigOptions (this.props),
                ambigHandling: this.props.initialAmbigHandling,
                filters: new Object (null),
                showIntervals: false,
                showCellColoring: canDoCI,
                hasCI : canDoCI,
                filterField: ["Site",-1],
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
                initialAmbigHandling: "RESOLVED",
           };
  },



  componentWillReceiveProps: function(nextProps) {
        this.setState (
           {

                ambigOptions: this.dm_AmbigOptions (nextProps),
                ambigHandling: nextProps.initialAmbigHandling,
           }
        );
  },

  dm_formatNumber: d3.format (".3r"),
  dm_formatNumberShort: d3.format (".2r"),
  dm_rangeColorizer : d3.scale.linear ().range ([d3.rgb("blue"), d3.rgb("white"), d3.rgb ("red")]).clamp (true).domain ([-1,0,1]),
  dm_rangeTextColorizer : d3.scale.linear ().range ([d3.rgb("white"), d3.rgb("black"), d3.rgb ("black")]).clamp (true).domain ([-1,-0.25,1]),

  dm_log10times: _.before (10, function (v) {
    console.log (v);
    return 0;
  }),

  dm_formatInterval: function (values) {
    //this.dm_log10times (values);

    return this.dm_formatNumber (values[0]) + " / " + this.dm_formatNumber (values[2]) +
                " ["  + this.dm_formatNumber (values[1])  +
                " : " + this.dm_formatNumber (values[3]) + "]";
  },

  dm_AmbigOptions: function (theseProps) {
    return _.keys (theseProps.mle[0]);
  },


  dm_setAmbigOption : function (value) {
    this.setState ({
                        ambigHandling : value,
                   });
  },

  dm_toggleIntervals : function (event) {
     this.setState ({
                        showIntervals : !this.state.showIntervals,
                        showCellColoring : this.state.showIntervals ? this.state.showCellColoring : false
                   });
  },

  dm_toggleCellColoring : function (event) {
     this.setState ({
                        showCellColoring : !this.state.showCellColoring,
                   });
  },

  dm_toggleVariableFilter: function (event) {

    var filterState = new Object (null);
    _.extend (filterState,  this.state.filters);
    if (! ("variable" in this.state.filters)) {
        filterState ["variable"] = true;
    }
    else {
        delete filterState ["variable"];
    }
    this.setState ({filters: filterState});

  },

  dm_makeFilterFunction: function () {

    var filterFunction = null;

    _.each (this.state.filters, function (value, key) {
        var composeFunction = null;

        switch (key) {
            case "variable" : {
                if (filterFunction) {
                    composeFunction = function (f, partitionIndex, index, site, siteData) {
                        return (f (partitionIndex, index, site, siteData)) && (siteData[2] + siteData[3] > 0);
                    }

                } else {
                    filterFunction = function (partitionIndex, index, site, siteData) {
                        return siteData[2] + siteData[3] > 0;
                    }
                }
                break;
            }
            default: {
                if (_.isArray (value)) {
                    var new_condition = null,
                        filter_index = value[0][1];
                    switch (filter_index) {
                        case -2:
                            new_condition = function (partitionIndex, index, site, siteData) {
                                return partitionIndex >= value[1] && partitionIndex <= value[2];
                            };
                            break;
                        case -1:
                            new_condition = function (partitionIndex, index, site, siteData) {
                                return site >= value[1] && site <= value[2];
                            };
                            break;
                        default:
                            new_condition = function (partitionIndex, index, site, siteData) {
                                return siteData[filter_index] >= value[1] && siteData[filter_index] <= value[2];
                            };
                    }

                     if (new_condition) {
                         if (value[3] == "AND") {
                             composeFunction = function (f, partitionIndex, index, site, siteData) {
                                return (!f || f (partitionIndex, index, site, siteData)) && new_condition (partitionIndex, index, site, siteData);

                             }
                        } else {
                             if (filterFunction) {
                                 composeFunction = function (f,  partitionIndex, index, site, siteData) {
                                    return (f (partitionIndex, index, site, siteData)) || new_condition (partitionIndex, index, site, siteData);
                                 }
                            } else {
                                 filterFunction = function (partitionIndex, index, site, siteData) {
                                    return new_condition (partitionIndex, index, site, siteData);
                                 }

                            }
                        }
                    }
                }
            }
        }

        if (composeFunction) {
            filterFunction = _.wrap (filterFunction, composeFunction);
        }
    });

     return filterFunction;
  },

  dm_makeHeaderRow : function () {

        var headers = [{value : 'Partition', sortable : true}, {value : 'Site', sortable: true}],
            doCI = this.state.showIntervals,
            filterable = [['Partition',-2], ['Site',-1]];

        if (doCI) {
            var secondRow = ['',''];

            _.each (this.props.headers, function (value, index) {
                headers.push ({value : value[0], abbr: value[1], span: 4, style: {textAlign: 'center'}});
                filterable.push ([value[0], index]);
                _.each (['MLE', 'Med', '2.5%', '97.5%'], function (v) {
                    secondRow.push ({value : v, sortable: true});
                });
             });
            return {headers: [headers, secondRow], filterable : filterable};

       } else {

            _.each (this.props.headers, function (value, index) {
                headers.push ({value : value[0], abbr: value[1], sortable: true});
                filterable.push ([value[0], index]);
            });

        }
        return {headers: headers, filterable : filterable};
  },

  dm_makeDataRows: function (filter) {

    var rows           = [],
        partitionCount = datamonkey.helpers.countPartitionsJSON (this.props.partitionSites),
        partitionIndex = 0,
        self = this,
        doCI = this.state.showIntervals,
        siteCount = 0;

    while (partitionIndex < partitionCount) {

        _.each (self.props.partitionSites [partitionIndex].coverage[0], function (site, index) {
            var siteData = self.props.mle[partitionIndex][self.state.ambigHandling][index];
            if (!filter || filter (partitionIndex+1, index+1, site+1, siteData)) {
                var thisRow   = [partitionIndex+1, site+1];
                    //secondRow = doCI ? ['',''] : null;
                siteCount++;

                _.each (siteData, function (estimate, colIndex) {
                    var sampled_range         = null,
                        scaled_median_mle_dev = 0;

                    if (self.state.hasCI) {
                        sampled_range = [self.props.sampleMedian[partitionIndex][self.state.ambigHandling][index][colIndex],
                                         self.props.sample25[partitionIndex][self.state.ambigHandling][index][colIndex],
                                         self.props.sample975[partitionIndex][self.state.ambigHandling][index][colIndex]
                                         ];

                        var range = (sampled_range[2]-sampled_range[1]);
                        if (range > 0) {
                            scaled_median_mle_dev = (estimate - sampled_range[0]) / range;
                        }

                    }

                    if (doCI) {
                        thisRow.push ({value : estimate, format : self.dm_formatNumber});
                        thisRow.push ({value : sampled_range[0], format : self.dm_formatNumberShort});
                        thisRow.push ({value : sampled_range[1], format : self.dm_formatNumberShort});
                        thisRow.push ({value : sampled_range[2], format : self.dm_formatNumberShort});

                    } else {
                        var this_cell = {value : estimate, format : self.dm_formatNumber}
                        if (self.state.hasCI) {
                            if (self.state.showCellColoring) {
                                this_cell.style = {backgroundColor: self.dm_rangeColorizer (scaled_median_mle_dev), color: self.dm_rangeTextColorizer (scaled_median_mle_dev)};
                            }
                            this_cell.tooltip = self.dm_formatNumberShort (sampled_range[0]) +
                                              " [" + self.dm_formatNumberShort (sampled_range[1]) +
                                            " - " + self.dm_formatNumberShort (sampled_range[2]) + "]";
                        }
                        thisRow.push (this_cell);

                    }
                });
                rows.push (thisRow);
                //if (secondRow) {
                //    rows.push (secondRow);
                //}
            }
        });

        partitionIndex ++;
    }

    return {rows: rows, count: siteCount};
  },

  dm_handleLB : function (e) {
    var new_value = parseFloat (e.target.value);
    this.setState ({lowerFilterBound : _.isFinite (new_value) ? new_value : -Infinity});
  },

  dm_handleUB : function (e) {
    var new_value = parseFloat (e.target.value);
    this.setState ({upperFilterBound : _.isFinite (new_value) ? new_value : Infinity});
  },

  dm_handleFilterField: function (value) {
    this.setState ({filterField : value});
  },

  dm_checkFilterValidity: function () {
    if (_.isFinite (this.state.lowerFilterBound)) {
        if (_.isFinite (this.state.upperFilterBound)) {
            return this.state.lowerFilterBound <= this.state.upperFilterBound;
        }
        return true;
    }
    return _.isFinite (this.state.upperFilterBound);
  },

  dm_unique_filter_ID : 0,

  dm_handleAddCondition: function (e) {
    e.preventDefault();
    var filterState = new Object (null);
    _.extend (filterState,  this.state.filters);
    filterState [this.dm_unique_filter_ID++] =
        [this.state.filterField, this.state.lowerFilterBound, this.state.upperFilterBound, this.state.filterOp];

    this.setState ({filters: filterState});
  },

  dm_handleRemoveCondition: function (key,e) {
    e.preventDefault();

    _.extend (filterState,  this.state.filters);
    delete filterState[key];
    //console.log (key, this.state.filters,filterState);

    this.setState ({filters: filterState});
  },

  render: function() {

        var self = this;
        var {rows, count} = this.dm_makeDataRows (this.dm_makeFilterFunction());
        var {headers,filterable}       = this.dm_makeHeaderRow();

        var show_ci_menu  = function () {
            if (self.state.hasCI) {
                var ci_menu = [
                        (<li key = "ci_divider" className="divider"></li>),
                        (<li key = "intervals">
                            <a href="#" data-value="showIntervals" tabIndex="-1" onClick = {self.dm_toggleIntervals}>
                                <input type="checkbox" checked = {self.state.showIntervals} defaultChecked = {self.state.showIntervals} onChange={self.dm_toggleIntervals}/>&nbsp;Show sampling confidence intervals
                            </a>
                         </li>)
                       ];

                if (!self.state.showIntervals) {
                    ci_menu.push  (( <li key = "coloring">
                            <a href="#" data-value="showIntervals" tabIndex="-1" onClick = {self.dm_toggleCellColoring}>
                                <input type="checkbox" checked = {self.state.showCellColoring} defaultChecked = {self.state.showCellColoring} onChange={self.dm_toggleCellColoring}/>&nbsp;Color cells based on MLE-median
                            </a>
                         </li>));
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
                             <span className="input-group-addon">Display Options </span>

                              <ul className="dropdown-menu">
                                <li key = "variable">
                                    <a href="#" data-value="variable" tabIndex="-1" onClick = {self.dm_toggleVariableFilter}>
                                        <input type="checkbox" checked = {"variable" in self.state.filters} defaultChecked = {"variable" in self.state.filters} onChange={self.dm_toggleVariableFilter}/>&nbsp;Variable sites only
                                    </a>
                                </li>
                                {show_ci_menu()}
                              </ul>
                              <button className="btn btn-default btn-sm dropdown-toggle form-control" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
                      <div className="form-group navbar-right">
                            <div className="input-group">
                              <ul className="dropdown-menu">
                                    {
                                        _.map (filterable, function (d, index) {
                                            return (
                                                <li key = {index}>
                                                    <a href="#" tabIndex="-1" onClick={_.partial (self.dm_handleFilterField, d)}>
                                                        {d[0]}
                                                    </a>
                                                </li>
                                            );
                                        })
                                    }
                              </ul>
                              <button className="btn btn-default btn-sm dropdown-toggle form-control" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {self.state.filterField[0]} <span className="caret"></span>
                              </button>
                            </div>
                            <div className="input-group" >
                                <span className="input-group-addon"> {'is in ['} </span>
                                <input type="text" className="form-control" placeholder="-∞" defaultValue = {'-' + String.fromCharCode(8734)} onChange = {self.dm_handleLB}/>
                            </div>
                            <div className="input-group">
                                <span className="input-group-addon">,</span>
                                <input type="text" className="form-control" placeholder="∞" defaultValue = {String.fromCharCode(8734)} onChange = {self.dm_handleUB}/>
                                 <span className="input-group-addon">]</span>
                           </div>

                            <div className="input-group">
                                <button className={"btn btn-default " + (self.dm_checkFilterValidity() ? "" : "disabled")} onClick = {self.dm_handleAddCondition}> Add condition as </button>
                            </div>

                             <div className="input-group">
                                <ul className="dropdown-menu">
                                    {
                                        _.map (["AND", "OR"], function (d, index) {
                                            return (
                                                <li key = {index}>
                                                    <a href="#" tabIndex="-1" onClick={function () {self.setState ({filterOp:d});}}>
                                                        {d}
                                                    </a>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                                <button className="btn btn-default btn-sm dropdown-toggle form-control" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {self.state.filterOp} <span className="caret"></span>
                               </button>
                            </div>


                            <span className="badge" style={{marginLeft : "0.5em"}}>{count}</span> sites shown
                      </div>


                    </form>
                </nav>

                { self.state.hasCI ?
                (<div className = "alert alert-info alert-dismissable">
                    <button type = "button" className = "close pull-right" data-dismiss = "alert" aria-hidden="true"> &times; </button>
                     Default table shading is used to indicate the magnitude of difference between the estimate
                     of a specific quantity using the MLE ancestral state reconstruction, and the median
                     of the estimate using a sample from the distribution of ancestral state reconstructions.
                     <br/>
                     <strong>Color legend:</strong> MLE is &nbsp;
                     <span className = "badge" style={{backgroundColor: self.dm_rangeColorizer(-1)}}>
                        is much less
                     </span>
                     &nbsp;
                     <span className = "badge" style={{backgroundColor: self.dm_rangeColorizer(0), color: "black"}}>
                        is the same as
                     </span>
                     &nbsp;
                     <span className = "badge" style={{backgroundColor: self.dm_rangeColorizer(1)}}>
                        is much greater
                     </span>
                     &nbsp;
                     than the sampled median. You can mouse over the cells to see individual sampling intervals.
                </div>) : null}

                {_.keys (self.state.filters).length > 0 ? (
                    <div className="well well-sm">
                        {
                            _.map (self.state.filters, function (value, key) {
                                if (key == "variable") {
                                    return (
                                    <div className="input-group" style = {{display: 'inline'}} key = {key}>
                                        <span className="badge badge-info">(AND) variable sites
                                        <i className="fa fa-times-circle" style = {{marginLeft : "0.25em"}} onClick={self.dm_toggleVariableFilter}></i>
                                        </span>
                                    </div>);
                                } else {

                                    var label = (value[3] == "AND" ? " (AND) " : " (OR) ") +  value[0][0];

                                    if (_.isFinite (value[1])) {
                                        if (_.isFinite (value[2])) {
                                            label +=  String.fromCharCode(8712) + "[" + value[1] + "," + value[2] + "]";
                                        } else {
                                            label +=  String.fromCharCode(8805) + value[1];
                                        }
                                    } else {
                                             label +=  String.fromCharCode(8804) + value[2];
                                    }

                                    return (
                                        <div className="input-group" style = {{display: 'inline'}} key = {key}>
                                            <span className="badge badge-info">{label}
                                            <i className="fa fa-times-circle" style = {{marginLeft : "0.25em"}} onClick={_.bind(_.partial (self.dm_handleRemoveCondition, key), self)}></i>
                                            </span>
                                        </div>
                                   );
                                }
                            })
                        }
                    </div>
                    ) : null}

                <DatamonkeyTable headerData = {headers} bodyData = {rows} initialSort={1}/>
            </div>);


        return result;


  }
});

module.exports.SLACSites = SLACSites;
