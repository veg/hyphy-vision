var React = require("react"),
  ReactDOM = require("react-dom"),
  _ = require("underscore");

import { DatamonkeyTable } from "./components/tables.jsx";
import { DatamonkeySeries, DatamonkeyGraphMenu } from "./components/graphs.jsx";
import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";

var FEL = React.createClass({

  float_format: d3.format(".3f"),

  loadFromServer: function() {
    var self = this;

    d3.json(this.props.url, function(data) {

      var mle = data["MLE"];

      // These variables are to be used for DatamonkeyTable
      var mle_headers = mle.headers || [];
      var mle_content = mle.content[0] || [];

      mle_headers = self.formatHeadersForTable(mle_headers);

      _.each(mle_headers, function(d) {
        return (d["sortable"] = true);
      });

      // format content
      mle_content = _.map(mle_content, function(d) {
        return _.map(d, function(g) {
          //return self.float_format(g);
          return self.float_format(g);
        });
      });

      // add a site count to both headers and content
      mle_headers = [
        { value: "Site", sortable: true, abbr: "Site Position" }
      ].concat(mle_headers);

      mle_content = _.map(mle_content, function(d, key) {
        var k = key + 1;
        return [k].concat(d);
      });

      // Create datatype that is a bit more manageable for use with DatamonkeySeries
      var mle_header_values = _.map(mle_headers, function(d) {
        return d.value;
      });
      var mle_results = _.map(mle_content, function(c) {
        return _.object(mle_header_values, c);
      });

      self.setState({
        mle_headers: mle_headers,
        mle_content: mle_content,
        mle_results: mle_results
      });
    });
  },

  formatHeadersForTable: function(mle) {
    return _.map(mle, function(d) {
      return _.object(["value", "abbr"], d);
    });
  },

  definePlotData: function(x_label, y_label) {
    var self = this;

    var x = _.map(self.state.mle_results, function(d) {
      return d[x_label];
    });

    var y = _.map(self.state.mle_results, function(d) {
      return d[y_label];
    });

    return { x: x, y: [y] };
  },

  getDefaultProps: function() {
    return {};
  },

  getInitialState: function() {
    return {
      mle_headers: [],
      mle_content: [],
      xaxis: "Site",
      yaxis: "alpha"
    };
  },

  componentWillMount: function() {
    this.loadFromServer();
  },

  setEvents: function() {},

  componentDidUpdate(prevProps) {
    $("body").scrollspy({
      target: ".bs-docs-sidebar",
      offset: 50
    });
  },

  updateAxisSelection: function(e) {
    var state_to_update = {},
      dimension = e.target.dataset.dimension,
      axis = e.target.dataset.axis;

    state_to_update[axis] = dimension;
    this.setState(state_to_update);
  },

  render: function() {
    var self = this;

    var scrollspy_info = [
      { label: "summary", href: "summary-tab" },
      { label: "plots", href: "plot-tab" },
      { label: "table", href: "table-tab" }
    ];

    var { x: x, y: y } = self.definePlotData(
      self.state.xaxis,
      self.state.yaxis
    );

    var x_options = "Site";
    var y_options = _.filter(
      _.map(self.state.mle_headers, function(d) {
        return d.value;
      }),
      function(d) {
        return d != "Site";
      }
    );

    return (
      <div>

        <NavBar />

        <div className="container">

          <div className="row">

            <ScrollSpy info={scrollspy_info} />

            <div className="col-sm-10">

              <div
                id="datamonkey-fel-error"
                className="alert alert-danger alert-dismissible"
                role="alert"
                style={{ display: "none" }}
              >
                <button
                  type="button"
                  className="close"
                  id="datamonkey-fel-error-hide"
                >
                  <span aria-hidden="true">&times;</span>
                  <span className="sr-only">Close</span>
                </button>
                <strong>Error!</strong> <span id="datamonkey-fel-error-text" />
              </div>

              <div id="results">

                <h3 className="list-group-item-heading">
                  <span id="summary-method-name">
                    FEL - Fixed Effects Likelihood
                  </span>
                </h3>

                <div>
                  <div className="main-result">
                    <p className="list-group-item-text label_and_input">
                      Evidence<sup>†</sup> of episodic diversifying selection
                      was found on
                      <span className="hyphy-highlight">
                        <strong>
                          {" "}{self.state.branches_with_evidence}
                        </strong>{" "}
                        out
                        of {self.state.test_branches}
                      </span>{" "}
                      tested branches({self.state.total_branches} total
                      branches).
                    </p>
                  </div>
                </div>

                <div id="plot-tab" className="row hyphy-row">

                  <h3 className="dm-table-header">Plot Summary</h3>

                  <DatamonkeyGraphMenu
                    x_options={x_options}
                    y_options={y_options}
                    axisSelectionEvent={self.updateAxisSelection}
                  />

                  <DatamonkeySeries
                    x={x}
                    y={y}
                    marginLeft={50}
                    width={$("#results").width()}
                    transitions={true}
                    doDots={true}
                  />

                </div>

                <div id="table-tab" className="row hyphy-row">
                  <div id="hyphy-mle-fits" className="col-md-12">
                    <h3 className="dm-table-header">Table Summary</h3>
                    <DatamonkeyTable
                      headerData={self.state.mle_headers}
                      bodyData={self.state.mle_content}
                      classes={"table table-condensed"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

// Will need to make a call to this
// omega distributions
function render_fel(url, element) {
  ReactDOM.render(<FEL url={url} />, document.getElementById(element));
}

module.exports = render_fel;
