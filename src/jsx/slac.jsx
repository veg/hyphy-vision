var React = require("react"),
  ReactDOM = require("react-dom"),
  _ = require("underscore");

import {
  DatamonkeyPartitionTable,
  DatamonkeyModelTable,
  DatamonkeyTimersTable
} from "./components/tables.jsx";
import { SLACSites } from "./components/slac_sites.jsx";
import { SLACBanner } from "./components/slac_summary.jsx";
import { SLACGraphs } from "./components/slac_graphs.jsx";
import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";

var datamonkey = require("../datamonkey/datamonkey.js");
require("../datamonkey/helpers.js");

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
    this.setState({
      analysis_results: data,
      input_data: data.input_data  
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
    this.dm_setEvents();
  },

  dm_setEvents: function() {
    var self = this;

    $("#datamonkey-json-file").on("change", function(e) {
      var files = e.target.files; // FileList object

      if (files.length == 1) {
        var f = files[0];
        var reader = new FileReader();

        reader.onload = (function(theFile) {
          return function(e) {
            try {
              self.dm_initializeFromJSON(JSON.parse(this.result));
            } catch (error) {
              self.setState({ error_message: error.toString() });
            }
          };
        })(f);

        reader.readAsText(f);
      }

      $("#datamonkey-json-file-toggle").dropdown("toggle");
    });
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
      return (
        <div>
          <NavBar />
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
                    className="col-lg-4 col-md-6 col-sm-12"
                  >
                    <h4 className="dm-table-header">
                      Partition information
                    </h4>
                    <small>
                      <DatamonkeyPartitionTable
                        pValue={self.state.pValue}
                        trees={self.state.analysis_results.trees}
                        partitions={self.state.analysis_results.partitions}
                        branchAttributes={
                          self.state.analysis_results["branch attributes"]
                        }
                        siteResults={self.state.analysis_results.MLE}
                        accessorPositive={function(json, partition) {
                          return _.map(
                            json["content"][partition]["by-site"]["AVERAGED"],
                            function(v) {
                              return v[8];
                            }
                          );
                        }}
                        accessorNegative={function(json, partition) {
                          return _.map(
                            json["content"][partition]["by-site"]["AVERAGED"],
                            function(v) {
                              return v[9];
                            }
                          );
                        }}
                      />
                    </small>
                  </div>
                  <div
                    id="datamonkey-slac-model-fits"
                    className="col-lg-5 col-md-6 col-sm-12"
                  >
                    <small>
                      {
                        <DatamonkeyModelTable
                          fits={self.state.analysis_results.fits}
                        />
                      }
                    </small>
                  </div>
                  <div
                    id="datamonkey-slac-timers"
                    className="col-lg-3 col-md-3 col-sm-12"
                  >
                    <h4 className="dm-table-header">
                      Execution time
                    </h4>
                    <small>
                      <DatamonkeyTimersTable
                        timers={self.state.analysis_results.timers}
                        totalTime={"Total time"}
                      />
                    </small>
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
                      partitionSites={self.state.analysis_results.partitions}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12" i id="slac-graph">
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
                      partitionSites={self.state.analysis_results.partitions}
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

module.exports = render_slac;
