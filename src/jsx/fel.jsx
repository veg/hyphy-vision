<<<<<<< Updated upstream
var React = require("react"),
  ReactDOM = require("react-dom");

var _ = require("underscore");

import { DatamonkeyTable } from "./components/shared_summary.jsx";
import { DatamonkeySeries, DatamonkeyGraphMenu } from "./components/graphs.jsx";
import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";

var React = require("react");

var FEL = React.createClass({
  float_format: d3.format(".3f"),

  loadFromServer: function() {
=======
var React = require('react'),
		ReactDOM = require('react-dom');

var datamonkey = require('../datamonkey/datamonkey.js'),
    _ = require('underscore'),
		busted = require('../busted/busted.js');

import {DatamonkeyTable} from "./components/shared_summary.jsx";
import {DatamonkeySeries} from "./components/shared_graph.jsx";
import {NavBar} from "./components/navbar.jsx";
import {ScrollSpy} from "./components/scrollspy.jsx";

var React = require('react');

var FEL = React.createClass({

  float_format : d3.format(".3f"),

  loadFromServer : function() {
>>>>>>> Stashed changes

    var self = this;

    d3.json(this.props.url, function(data) {

      var mle = data["MLE"];
      var mle_headers = mle.headers || [];
      var mle_content = mle.content[0] || [];

      mle_headers = self.formatHeadersForTable(mle_headers);
<<<<<<< Updated upstream

      _.each(mle_headers, function(d) {
        return (d["sortable"] = true);
      });

      // format content
      mle_content = _.map(mle_content, function(d) {
        return _.map(d, function(g) {
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

      self.setState({
        mle_headers: mle_headers,
        mle_content: mle_content
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

    // get index of label by looking at header
    var header_labels = _.map(self.state.mle_headers, function(d) {
      return d.value;
    });
=======
      _.each(mle_headers, function(d) { return d["sortable"] = true});

      // format content
      mle_content = _.map(mle_content, function(d) { return _.map(d, function(g) { return self.float_format(g); }) });

      // add a site count to both headers and content
      mle_headers = [{"value": "Site", "sortable":true, "abbr" : "Site Position"}].concat(mle_headers);
      mle_content = _.map(mle_content, function(d, key) { var k = key + 1; return [k].concat(d); });

      self.setState({
        mle_headers : mle_headers,
        mle_content : mle_content
      });

    });

  },

  formatHeadersForTable : function(mle) {
    return _.map(mle, function(d) { return _.object(["value","abbr"], d); });
  },

  definePlotData : function(x_label, y_label) {

    var self = this;

    // get index of label by looking at header
    var header_labels = _.map(self.state.mle_headers, function(d) { return d.value });
>>>>>>> Stashed changes

    var x_index = _.indexOf(header_labels, x_label);
    var y_index = _.indexOf(header_labels, y_label);

    var x = [];
    var y = [];

    if (x_index == -1 || y_index == -1) {
<<<<<<< Updated upstream
      return { x: x, y: y };
    }

    x = _.map(self.state.mle_content, function(d) {
      return d[x_index];
    });
    y = _.map(self.state.mle_content, function(d) {
      return d[y_index];
    });

    return { x: x, y: [y] };
=======
      return { x: x, y: y};
    }
    
    x = _.map(self.state.mle_content, function(d) { return d[x_index]} );
    y = _.map(self.state.mle_content, function(d) { return d[y_index]} );

    return {x: x, y: [y]};

>>>>>>> Stashed changes
  },

  getDefaultProps: function() {
    return {};
  },

  getInitialState: function() {
<<<<<<< Updated upstream
    return {
      mle_headers: [],
      mle_content: [],
      xLabel: "Site",
      yLabel: "alpha"
    };
=======

    return {
      mle_headers : [],
      mle_content : [],
      xLabel : "Site",
      yLabel : "alpha"
    };

>>>>>>> Stashed changes
  },

  componentWillMount: function() {
    this.loadFromServer();
<<<<<<< Updated upstream
  },

  setEvents: function() {},

  componentDidUpdate(prevProps) {
    $("body").scrollspy({
      target: ".bs-docs-sidebar",
      offset: 50
    });
=======
    //this.setEvents();
  },

  setEvents : function() {

    var self = this;

    // 20170508 : We can probably abstract this out
    //$("#datamonkey-absrel-json-file").on("change", function(e) {
    //    var files = e.target.files; // FileList object
    //    if (files.length == 1) {
    //        var f = files[0];
    //        var reader = new FileReader();
    //        reader.onload = (function(theFile) {
    //            return function(e) {
    //              var data = JSON.parse(this.result);
    //              data["fits"]["MG94"]["branch-annotations"] = self.formatBranchAnnotations(data, "MG94");
    //              data["fits"]["Full model"]["branch-annotations"] = self.formatBranchAnnotations(data, "Full model");
    //              var annotations = data["fits"]["Full model"]["branch-annotations"],
    //                  json = data,
    //                  pmid = data["PMID"],
    //                  full_model = json["fits"]["Full model"],
    //                  test_results = data["test results"],
    //                  input_data = data["input_data"],
    //                  fits = data["fits"];
    //              self.setState({
    //                annotations : annotations,
    //                json : json,
    //                pmid : pmid,
    //                full_model : full_model,
    //                test_results : test_results,
    //                input_data : input_data,
    //                fits : fits
    //              });
    //            };
    //        })(f);
    //        reader.readAsText(f);
    //    }
    //    $("#datamonkey-absrel-toggle-here").dropdown("toggle");
    //    e.preventDefault();
    //});

  },

  componentDidUpdate(prevProps, prevState) {
    $('body').scrollspy({
        target: '.bs-docs-sidebar',
        offset: 50
      });
>>>>>>> Stashed changes
  },

  render: function() {

    var self = this;
<<<<<<< Updated upstream

    var scrollspy_info = [
      { label: "summary", href: "summary-tab" },
      { label: "plots", href: "plot-tab" },
      { label: "table", href: "table-tab" }
    ];

    var { x: x, y: y } = self.definePlotData(
      self.state.xLabel,
      self.state.yLabel
    );

    return (
      <div>
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            <ScrollSpy info={scrollspy_info} />
            <div id="fel-results" className="col-sm-10">
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

              <h3 className="list-group-item-heading">
                <span id="summary-method-name">
                  FEL - Fixed Effects Likelihood - Results
                </span>
              </h3>

              <div id="results">

                <div id="summary-tab" className="row hyphy-row">

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
                      tested branches ({self.state.total_branches} total
                      branches).
                    </p>
                  </div>
                </div>

                <div id="plot-tab" className="row hyphy-row">

                  <h3 className="dm-table-header">Plot Summary</h3>

                  <DatamonkeyGraphMenu
                    headers={_.map(self.state.mle_headers, function(d) {
                      return d.value;
                    })}
                  />

                  <DatamonkeySeries
                    headers={_.map(self.state.mle_headers, function(d) {
                      return d.value;
                    })}
                    x={x}
                    y={y}
                    marginLeft={50}
                    width={$("#fel-results").width()}
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
=======
	
    var scrollspy_info = [
      { label: "summary", href: "summary-tab"},
      { label: "plots", href: "plot-tab"},
      { label: "table", href: "table-tab"}
    ];

    var {x: x, y: y} = self.definePlotData(self.state.xLabel, self.state.yLabel);

    return (
    <div>
      <NavBar />
      <div className='container-fluid'>
        <div className="row">
          <ScrollSpy info={scrollspy_info}/>
          <div id="fel-results" className="col-sm-10">
            <div id='datamonkey-fel-error' className="alert alert-danger alert-dismissible" role="alert" style={{display: "none"}}>
              <button type="button" className="close" id='datamonkey-fel-error-hide'><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
              <strong>Error!</strong> <span id='datamonkey-fel-error-text'></span>
            </div>

            <h3 className="list-group-item-heading">
                <span id="summary-method-name">FEL - Fixed Effects Likelihood - Results</span> 
            </h3>

            <div id="results">

              <div id="summary-tab" className="row hyphy-row">
                <div className="main-result">
                  <p className="list-group-item-text label_and_input">
                     Evidence<sup>†</sup> of episodic diversifying selection was found on
                     <span className="hyphy-highlight"><strong> {self.state.branches_with_evidence}</strong> out 
                     of {self.state.test_branches}</span> tested branches ({self.state.total_branches} total branches).
                  </p>
                </div>
              </div>

              <div id="plot-tab" className="row hyphy-row">
                <h3 className="dm-table-header">Plot Summary</h3>
                <DatamonkeySeries x={x} y={y} marginLeft={50} width={$("#fel-results").width()} transitions={true} doDots={true}/>
              </div>

              <div id="table-tab" className="row hyphy-row">
                <div id="hyphy-mle-fits" className="col-md-12">
                  <h3 className="dm-table-header">Table Summary</h3>
                  <DatamonkeyTable headerData={self.state.mle_headers} bodyData={self.state.mle_content} classes = {"table table-condensed"}/>
                </div>
              </div>

>>>>>>> Stashed changes
            </div>
          </div>
        </div>
      </div>
<<<<<<< Updated upstream
    );
  }
=======
      </div>
      )
  }

>>>>>>> Stashed changes
});

// Will need to make a call to this
// omega distributions
function render_fel(url, element) {
<<<<<<< Updated upstream
  ReactDOM.render(<FEL url={url} />, document.getElementById(element));
}

=======
  ReactDOM.render(
    <FEL url={url} />,
    document.getElementById(element)
  );
}


>>>>>>> Stashed changes
module.exports = render_fel;
