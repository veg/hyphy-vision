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
                showIntervals: canDoCI,
                hasCI : canDoCI,
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


  dm_changeAmbig : function (event) {

    this.setState ({
                        ambigHandling : event.target.value,
                   });
  },

  dm_toggleIntervals : function (event) {
     this.setState ({
                        showIntervals : !this.state.showIntervals,
                   });
  },

  dm_toggleVariableFilter: function (event) {

    var filterState = new Object (null);
    _.extend (filterState,  this.state.filters);
    filterState ["variable"] = (this.state.filters["variable"] == "on") ? "off" : "on";
    this.setState ({filters: filterState});

  },

  dm_makeFilterFunction: function () {

    var filterFunction = null;

    _.each (this.state.filters, function (value, key) {
        var composeFunction = null;

        switch (key) {
            case "variable" : {
                if (value == "on") {
                    composeFunction = function (f, partitionIndex, index, site, siteData) {
                        return (!f || f (partitionIndex, index, site, siteData)) && (siteData[2] + siteData[3] > 0);
                    }
                }
                break;
            }
        }

        if (composeFunction) {
         filterFunction = _.wrap (filterFunction, composeFunction);
        }
    });

     return filterFunction;
  },

  dm_makeHeaderRow : function () {

        var headers = ['Partition', 'Site'],
            doCI = this.state.showIntervals;

        if (doCI) {
            var secondRow = ['',''];

            _.each (this.props.headers, function (value) {
                headers.push ({value : value[0], abbr: value[1], span: 4, style: {textAlign: 'center'}});
                secondRow.push ('MLE');
                secondRow.push ('Med');
                secondRow.push ('2.5%');
                secondRow.push ('97.5%');
            });
            return [headers, secondRow];

       } else {

            _.each (this.props.headers, function (value) {
                headers.push ({value : value[0], abbr: value[1]});
            });

        }
        return headers;
  },

  dm_makeDataRows: function (filter) {

    var rows           = [],
        partitionCount = datamonkey.helpers.countPartitionsJSON (this.props.partitionSites),
        partitionIndex = 0,
        self = this,
        doCI = this.state.showIntervals;

    while (partitionIndex < partitionCount) {

        _.each (self.props.partitionSites [partitionIndex].coverage[0], function (site, index) {
            var siteData = self.props.mle[partitionIndex][self.state.ambigHandling][index];
            if (!filter || filter (partitionIndex, index, site, siteData)) {
                var thisRow   = [partitionIndex+1, site+1];
                    //secondRow = doCI ? ['',''] : null;

                _.each (siteData, function (estimate, colIndex) {

                    if (doCI) {
                        thisRow.push ({value : estimate, format : self.dm_formatNumber});
                        thisRow.push ({value : self.props.sample25[partitionIndex][self.state.ambigHandling][index][colIndex], format : self.dm_formatNumberShort});
                        thisRow.push ({value : self.props.sampleMedian[partitionIndex][self.state.ambigHandling][index][colIndex], format : self.dm_formatNumberShort});
                        thisRow.push ({value : self.props.sample975[partitionIndex][self.state.ambigHandling][index][colIndex], format : self.dm_formatNumberShort});

                        /*thisRow.push ({value: [estimate, self.props.sample25[partitionIndex][self.state.ambigHandling][index][colIndex],
                                                         self.props.sampleMedian[partitionIndex][self.state.ambigHandling][index][colIndex],
                                                         self.props.sample975[partitionIndex][self.state.ambigHandling][index][colIndex]],
                                       format: self.dm_formatInterval,

                                       }); */
                    } else {
                        thisRow.push ({value : estimate, format : self.dm_formatNumber});
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

    return rows;
  },

  render: function() {

        var self = this;


        var result = (

                <div className="table-responsive">
                    <form className="form-inline navbar-form navbar-left">
                      <div className="form-group">

                      <div className="btn-group">
                          <button className="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Display Options <span className="caret"></span>
                          </button>
                          <ul className="dropdown-menu">
                            <li key = "variable">
                                <div className = "checkbox">
                                    <input type="checkbox" checked = {self.state.filters["variable"] == "on" ? true : false} defaultChecked = {self.state.filters["variable"] == "on" ? true : false} onChange={self.dm_toggleVariableFilter}/> Variable sites only
                                </div>
                            </li>
                            {self.state.hasCI ? (
                            <li key = "intervals">
                                <div className = "checkbox">
                                    <input type="checkbox" checked = {self.state.showIntervals} defaultChecked = {self.state.showIntervals} onChange={self.dm_toggleIntervals}/> Show sampling confidence intervals
                                </div>
                            </li>) : null}
                          </ul>
                        </div>


                        <div className="input-group">
                          <div className="input-group-addon">Ambiguities are </div>
                          <select className="form-control input-sm" defaultValue={self.state.ambigHandling} onChange={self.dm_changeAmbig}>
                                {
                                    _.map (this.state.ambigOptions, function (value, index) {
                                        return (
                                            <option key={index} value={value}>{value}</option>
                                        );
                                    })
                                }
                          </select>
                        </div>
                      </div>
                    </form>

                    <DatamonkeyTable headerData = {this.dm_makeHeaderRow()} bodyData = {this.dm_makeDataRows (this.dm_makeFilterFunction())}/>
                </div>);


        return result;


  }
});

module.exports.SLACSites = SLACSites;
