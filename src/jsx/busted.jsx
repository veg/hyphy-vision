require("phylotree");
require("phylotree.css");

var React = require('react'),
		ReactDOM = require('react-dom');

import {Tree} from "./components/tree.jsx";
import {ModelFits} from "./components/model_fits.jsx";
import {TreeSummary} from "./components/tree_summary.jsx";
import {PropChart} from './components/prop_chart.jsx';
import {BUSTEDSummary} from './components/busted_summary.jsx';
import {NavBar} from "./components/navbar.jsx";
import {ScrollSpy} from "./components/scrollspy.jsx";

var datamonkey = require('../datamonkey/datamonkey.js'),
		busted = require('../busted/busted.js');

var BUSTED = React.createClass({

  float_format : d3.format(".2f"),
  p_value_format : d3.format(".4f"),
  fit_format : d3.format(".2f"),

  loadFromServer : function() {

    var self = this;

    d3.json(this.props.url, function(data) {

      data["fits"]["Unconstrained model"]["branch-annotations"] = self.formatBranchAnnotations(data, "Unconstrained model");
      data["fits"]["Constrained model"]["branch-annotations"] = self.formatBranchAnnotations(data, "Constrained model");

      // rename rate distributions
      data["fits"]["Unconstrained model"]["rate-distributions"] = data["fits"]["Unconstrained model"]["rate distributions"];
      data["fits"]["Constrained model"]["rate-distributions"] = data["fits"]["Constrained model"]["rate distributions"];

      // set display order
      data["fits"]["Unconstrained model"]["display-order"] = 0;
      data["fits"]["Constrained model"]["display-order"] = 1;

      var json = data,
          pmid = "25701167",
          pmid_text = "PubMed ID " + pmid,
          pmid_href = "http://www.ncbi.nlm.nih.gov/pubmed/" + pmid,
          p = json["test results"]["p"],
          statement = p <= 0.05 ? "evidence" : "no evidence";

      var fg_rate = json["fits"]["Unconstrained model"]["rate distributions"]["FG"];
      var mapped_omegas = {"omegas" : _.map(fg_rate, function(d) { return _.object(["omega","prop"], d)})};

      self.setState({
        p : p,
        test_result : {
          statement: statement,
          p: p
        },
        json : json,
        omegas : mapped_omegas["omegas"],
        pmid : {
          text: pmid_text,
          href : pmid_href
        },
        input_data : data["input_data"]
      });

    });

  },

  getDefaultProps: function() {

    var edgeColorizer = function(element, data) {

      var is_foreground = data.target.annotations.is_foreground,
          color_fill = this.options()["color-fill"] ? "black" : "red";

      element.style ('stroke', is_foreground ? color_fill : 'gray')
             .style ('stroke-linejoin', 'round')
             .style ('stroke-linejoin', 'round')
             .style ('stroke-linecap', 'round');
      
    }


    var tree_settings = {
        'omegaPlot': {},
        'tree-options': {
            /* value arrays have the following meaning
                [0] - the value of the attribute
                [1] - does the change in attribute value trigger tree re-layout?
            */
            'hyphy-tree-model': ["Unconstrained model", true],
            'hyphy-tree-highlight': ["RELAX.test", false],
            'hyphy-tree-branch-lengths': [true, true],
            'hyphy-tree-hide-legend': [true, false],
            'hyphy-tree-fill-color': [true, false]
        },
        'hyphy-tree-legend-type': 'discrete',
        'suppress-tree-render': false,
        'chart-append-html' : true,
        'edgeColorizer' : edgeColorizer
    };


    var distro_settings = {
      dimensions : { width : 600, height : 400 },
      margins : { 'left': 50, 'right': 15, 'bottom': 35, 'top': 35 },
      legend: false,
      domain : [0.00001, 100],
      do_log_plot : true,
      k_p : null,
      plot : null,
      svg_id : "prop-chart"
    };

    return {
      distro_settings : distro_settings,
      tree_settings : tree_settings,
      constrained_threshold : "Infinity",
      null_threshold : "-Infinity",
      model_name : "FG"
    }

  },

  getInitialState: function() {
    return {
      p : null,
      test_result : {
        statement : null,
        p : null
      },
      json : null,
      omegas : null,
      pmid : {
        href : null,
        text : null
      },
      input_data : null
    }
  },

  setEvents : function() {

    var self = this;

    $("#json-file").on("change", function(e) {
      console.log('inside');
      debugger;
        var files = e.target.files; // FileList object
        if (files.length == 1) {

            var f = files[0];
            var reader = new FileReader();
            reader.onload = (function(theFile) {
              return function(e) {

                var data = JSON.parse(this.result);
                data["fits"]["Unconstrained model"]["branch-annotations"] = self.formatBranchAnnotations(data, "Unconstrained model");
                data["fits"]["Constrained model"]["branch-annotations"] = self.formatBranchAnnotations(data, "Constrained model");

                // rename rate distributions
                data["fits"]["Unconstrained model"]["rate-distributions"] = data["fits"]["Unconstrained model"]["rate distributions"]
                data["fits"]["Constrained model"]["rate-distributions"] = data["fits"]["Constrained model"]["rate distributions"]

                var json = data,
                    pmid = "25701167",
                    pmid_text = "PubMed ID " + pmid,
                    pmid_href = "http://www.ncbi.nlm.nih.gov/pubmed/" + pmid,
                    p = json["test results"]["p"],
                    statement = p <= 0.05 ? "evidence" : "no evidence";

                var fg_rate = json["fits"]["Unconstrained model"]["rate distributions"]["FG"];
                var mapped_omegas = {"omegas" : _.map(fg_rate, function(d) { return _.object(["omega","prop"], d)})};

                self.setState({
                  p : p,
                  test_result : {
                    statement: statement,
                    p : p
                  },
                  json : json,
                  omegas : mapped_omegas["omegas"],
                  pmid : {
                    text: pmid_text,
                    href : pmid_href
                  },
                  input_data : data["input_data"]
                });

              }
            })(f);
            reader.readAsText(f);
        }
        $("#json-file").dropdown("toggle");
        e.preventDefault();
    });


  },

  formatBranchAnnotations : function(json, key) {

    // attach is_foreground to branch annotations
    var foreground = json["test set"].split(",");

    var tree = d3.layout.phylotree(),
        nodes = tree(json["fits"][key]["tree string"]).get_nodes(),
        node_names = _.map(nodes, function(d) { return d.name});
    
    // Iterate over objects
    var branch_annotations = _.object(node_names, 
                             _.map(node_names, function(d) {
                               return { is_foreground : _.indexOf(foreground, d) > -1 }
                               })
                            );

    return branch_annotations;

  },

  initialize : function() {

    var json = this.state.json;

    if(!json) {
      return;
    }

    busted.render_histogram("#chart-id", json);

    // delete existing tree
    d3.select('#tree_container').select("svg").remove();

    var fg_rate = json["fits"]["Unconstrained model"]["rate distributions"]["FG"],
        omegas  = fg_rate.map(function (r) {return r[0];}),
        weights = fg_rate.map(function (r) {return r[1];});

    var dsettings = { 
      'log'       : true,
      'legend'    : false,
      'domain'    : [0.00001, 20],
      'dimensions': {'width' : 325, 'height' : 300}
    }

    $("#export-dist-svg").on('click', function(e) { 
      datamonkey.save_image("svg", "#primary-omega-dist"); 
    }); 

    $("#export-dist-png").on('click', function(e) { 
      datamonkey.save_image("png", "#primary-omega-dist"); 
    }); 


  },

  componentWillMount: function() {
    this.loadFromServer();
    this.setEvents();
  },

  componentDidUpdate(prevProps, prevState) {
    $('body').scrollspy({
      target: '.bs-docs-sidebar',
      offset: 50
    });
    $('[data-toggle="popover"]').popover()
  },

  render: function() {

    var self = this;
    self.initialize();
    var scrollspy_info = [
      {label: "summary", href:"summary-div"},
      {label: "model statistics", href:"hyphy-model-fits"},
      {label: "input tree", href:"phylogenetic-tree"},
      {label: "ω distribution", href:"primary-omega-dist"}
    ];

    return (
      <div>
        <NavBar />
        <div className="container-fluid">
          <div className="row">

            <ScrollSpy info={scrollspy_info}/>
      
            <div className="col-lg-10">
              <BUSTEDSummary test_result={this.state.test_result}
                             pmid={this.state.pmid}
                             input_data={self.state.input_data}/>

              <div className="row">
                <div id="hyphy-model-fits" className="col-lg-12">
                  <ModelFits json={self.state.json} />
                </div>
              </div>

              <div className='row hyphy-busted-site-table'>
                <div className="col-md-12">
                  <h4 className="dm-table-header">
                    Model Evidence Ratios Per Site
                    <span className="glyphicon glyphicon-info-sign" style={{"verticalAlign": "middle", "float":"right"}} aria-hidden="true" data-toggle="popover" data-trigger="hover" title="Tree summary" data-html="true" data-content="<ul><li>Hover over a column header for a description of its content.</li></ul>" data-placement="bottom"></span>
                  </h4>
                </div>
                <div className="col-lg-12">
                  <button id="export-chart-svg" type="button" className="btn btn-default btn-sm pull-right btn-export">
                    <span className="glyphicon glyphicon-floppy-save"></span> Export Chart to SVG
                  </button>
                  <button id="export-chart-png" type="button" className="btn btn-default btn-sm pull-right btn-export">
                    <span className="glyphicon glyphicon-floppy-save"></span> Export Chart to PNG
                  </button>
                </div>
                <div id="chart-id" className="col-lg-12">
                </div>
                <div className="col-lg-12">
                  <div className="clearfix"></div>
                </div>
              </div>

              <div className='row site-table'>
                <div className="col-lg-12">
                  <form id="er-thresholds">
                    <div className="form-group">
                      <label for="er-constrained-threshold">Constrained Evidence Ratio Threshold:</label>
                      <input type="text" className="form-control" id="er-constrained-threshold" defaultValue={this.props.constrained_threshold}>
                      </input>
                    </div>
                    <div className="form-group">
                      <label for="er-optimized-null-threshold">Optimized Null Evidence Ratio Threshold:</label>
                      <input type="text" className="form-control" id="er-optimized-null-threshold" defaultValue={this.props.null_threshold}>
                      </input>
                    </div>
                  </form>
                  <button id="export-csv" type="button" className="btn btn-default btn-sm pull-right hyphy-busted-btn-export">
                    <span className="glyphicon glyphicon-floppy-save"></span> Export Table to CSV
                  </button>

                  <button id="apply-thresholds" type="button" className="btn btn-default btn-sm pull-right hyphy-busted-btn-export">
                    Apply Thresholds
                  </button>
                  <table id="sites" className="table sites dc-data-table">
                    <thead>
                      <tr className="header">
                        <th>Site Index</th>
                        <th>Unconstrained Likelihood</th>
                        <th>Constrained Likelihood</th>
                        <th>Optimized Null Likelihood</th>
                        <th>Constrained Evidence Ratio</th>
                        <th>Optimized Null Evidence Ratio</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12" id="phylogenetic-tree">
                  <Tree json={self.state.json} 
                       settings={self.props.tree_settings} />
                </div>
                <div className="col-md-12">
                  <h4 className="dm-table-header">&omega; distribution</h4>
                  <div id="primary-omega-dist" className="panel-body">
                    <PropChart name={self.props.model_name} omegas={self.state.omegas} 
                     settings={self.props.distro_settings} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-1">
            </div>

          </div>
        </div>
      </div>

    )
  }
});



// Will need to make a call to this
// omega distributions
var render_busted = function(url, element) {
  ReactDOM.render(
    <BUSTED url={url} />,
    document.getElementById(element)
  );
}

module.exports = render_busted;
