var React = require('react');
var datamonkey = require('../../datamonkey/datamonkey.js');

import {DatamonkeyScatterplot,DatamonkeySeries} from "./graphs.jsx";


var SLACGraphs = React.createClass({

  getInitialState: function() {

    return {
                ambigHandling : this.props.initialAmbigHandling,
                ambigOptions: this.dm_AmbigOptions (this.props),
                xLabel : "Site",
                yLabel : "dN-dS",
           };
  },

  getDefaultProps: function() {

    return {
                mle: null,
                partitionSites : null,
                initialAmbigHandling: "RESOLVED",
           };
  },



  dm_AmbigOptions: function (theseProps) {
    return _.keys (theseProps.mle[0]);
  },


  componentWillReceiveProps: function(nextProps) {
        this.setState (
           {
              ambigOptions: this.dm_AmbigOptions (nextProps),
              ambigHandling: nextProps.initialAmbigHandling
           }
        );
  },



  dm_makePlotData: function (xlabel, ylabels) {


    var self = this;

    var x = [];
    var y = [[]];

    var partitionCount = datamonkey.helpers.countPartitionsJSON (this.props.partitionSites),
        partitionIndex = 0,
        siteCount = 0,
        col_index = [],
        x_index = -1;

    _.each (self.props.headers, function (d,i) {

        if (_.find (ylabels, function (l) {return l == d[0];})) {
            col_index.push (i);
        }
    });

    x_index = _.pluck (self.props.headers, 0).indexOf (xlabel);


    y = _.map (col_index, function () {return [];});

    while (partitionIndex < partitionCount) {

        _.each (self.props.partitionSites [partitionIndex].coverage[0], function (site, index) {
            var siteData = self.props.mle[partitionIndex][self.state.ambigHandling][index];


            var thisRow   = [partitionIndex+1, site+1];
                siteCount++;
                if (x_index < 0) {
                    x.push (siteCount);
                } else {
                    x.push (siteData[x_index]);
                }
                _.each (col_index, function (ci, i) {
                    y[i].push (siteData[ci]);
                });


        });

        partitionIndex++;

    }

    return {x: x, y: y};

  },

  dm_xAxis : function (column) {
        this.setState ({xLabel : column});
  },

  dm_yAxis : function (column) {
        this.setState ({yLabel : column});
  },

  dm_setAmbigOption : function (value) {
    this.setState ({
                        ambigHandling : value,
                   });
  },

  dm_doScatter : function () {
    return this.state.xLabel != "Site";
  },

  render: function() {

        var self = this;
        var {x: x, y: y} = this.dm_makePlotData(this.state.xLabel, [this.state.yLabel]);

        return (
                <div className = "row">
                    <nav className="navbar">
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

                          {
                          /*<div className="form-group navbar-right">
                                <span className="badge" style={{marginLeft : "0.5em"}}>X: {self.state.currentX}</span>
                                <span className="badge" style={{marginLeft : "0.5em"}}>Y: {self.state.currentY}</span>
                          </div>*/
                          }
                        </form>
                    </nav>

                {self.dm_doScatter() ?
                     (<DatamonkeyScatterplot x={x} y={y} marginLeft={50} transitions={true}/>)
                :    (<DatamonkeySeries x={x} y={y} marginLeft={50} transitions={true} doDots={true}/>)}

            </div>
        )

        return null;


  }
});


module.exports.SLACGraphs = SLACGraphs;

