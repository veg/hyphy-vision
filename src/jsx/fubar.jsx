var React = require("react"),
  ReactDOM = require("react-dom"),
  d3 = require("d3"),
  _ = require("underscore"),
  d3_save_svg = require("d3-save-svg");

import { Tree } from "./components/tree.jsx";
import { InputInfo } from "./components/input_info.jsx";
import { DatamonkeyTable, DatamonkeyModelTable } from "./components/tables.jsx";
import { DatamonkeySiteGraph } from "./components/graphs.jsx";
import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";
import { saveSvgAsPng } from "save-svg-as-png";
import { Header } from "./components/header.jsx";


function FUBARSummary(props) {
  var number_of_sites = 0;
  if (props.json) {
    number_of_sites = _.flatten(_.values(props.json.MLE.content), true)
      .filter(row=>row[3]/(row[0] || 1e-10) > 1 && row[6] < props.pValue).length;
  }

  return (
    <div className="row" id="summary-tab">
      <div className="clearance" id="summary-div"></div>
      <div className="col-md-12">
        <h3 className="list-group-item-heading">
          <span id="summary-method-name">
            FUBAR - A Fast, Unconstrained Bayesian AppRoximation for Inferring Selection
          </span>
          <br />
          <span className="results-summary">results summary</span>
        </h3>
      </div>
      <div className="col-md-12">
        <InputInfo input_data={props.json ? props.json.input : null} />
      </div>
      <div className="col-md-12">
        <div className="main-result">
          <p>FUBAR <strong className="hyphy-highlight">found evidence</strong> of</p>
          <p>
            <i className="fa fa-plus-circle" aria-hidden="true">
              {" "}
            </i>{" "}
            episodic positive/diversifying selection at
            <span className="hyphy-highlight">
              {" "}{" "}
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
              onChange={props.updatePValue}
            />.
          </p>
          <hr />
          <p>
            <small>
              See{" "}
              <a href="http://www.hyphy.org/methods/selection-methods/#fubar">
                here
              </a>{" "}
              for more information about the FUBAR method.
              <br />Please cite{" "}
              <a
                href="http://www.ncbi.nlm.nih.gov/pubmed/23420840"
                id="summary-pmid"
                target="_blank"
              >
                PMID 23420840
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

class FUBARViz extends React.Component {
  componentWillReceiveProps(nextProps){
    d3.select('#fubar-viz').html('');
    var grid = nextProps.data.map(row=>[+row[0].toFixed(2), +row[1].toFixed(2), +row[2]]),
        n_gridpoints = Math.sqrt(grid.length),
        gridpoints = grid.map(row=>row[1]).slice(0, n_gridpoints);

      var margin = {top: 15, right: 75, bottom: 75, left: 75},
          width = 800 - margin.left - margin.right,
          height = 800 - margin.top - margin.bottom;

      var svg = d3.select('#fubar-viz')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      svg.append('rect')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('fill', 'white');

      var main = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var x = d3.scale.ordinal()
        .domain(gridpoints)
        .rangePoints([0, width], 1);

      var y = d3.scale.ordinal()
        .domain(gridpoints)
        .rangePoints([height, 0], 1);

      var color = d3.scale.linear()
        .domain([0, 1, 10, 1e10])
        .range(['#000000', '#EEEEEE', '#00A99D', '#00A99D']);

      var magnitude = d3.scale.linear()
        .domain([0, d3.max(grid.map(row=>row[2]))])
        .range([0, width/n_gridpoints]);

      main.selectAll('.dot')
        .data(grid)
        .enter()
        .append('circle')
        .attr('cx', d=>x(d[0]))
        .attr('cy', d=>y(d[1]))
        .attr('r', d=>magnitude(d[2])/2)
        .attr('fill', d=>color(d[1]/(d[0]+0.001)));

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      main.append("g")
        .style('font', '12px')
        .attr('transform', 'translate(0, ' + height + ')')
        .attr('class', 'axis x-axis')
        .call(xAxis);

      main.append("g")
        .attr('class', 'axis axis')
        .call(yAxis);

      d3.selectAll('.x-axis > .tick > text')
        .attr('transform', 'rotate(-90) translate(-20, -15)');

      main.append("text")
        .attr('transform', 'translate(' + (width/2) + ',' + (height+55) + ')')
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text('Synonymous substitution rate');

      main.append("text")
        .attr('transform', 'translate(' + -45 + ',' + (height/2) + ') rotate(-90)')
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text('Non-synonymous substitution rate');

      var linearGradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'colorbar-gradient')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%');

      linearGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#00A99D');

      linearGradient.append('stop')
        .attr('offset', '50%')
        .attr('stop-color', '#EEEEEE');

      linearGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#000000');

      var colorbar = svg.append('g')
        .attr('transform', 'translate(' + (margin.left+width) + ',' + margin.top +')');

      colorbar.append('rect')
        .attr('fill', 'url(#colorbar-gradient)')
        .attr('x', 5)
        .attr('y', 0)
        .attr('width', 20)
        .attr('height', height);

      colorbar.append('text')
        .attr('x', 15)
        .attr('y', height+15)
        .attr('text-anchor', 'middle')
        .text('\u03C9');

      var colorbar_scale = d3.scale.linear()
        .domain([0, 1, 10])
        .range([height, height/2, 0]);

      var colorbar_axis = d3.svg.axis()
        .scale(colorbar_scale)
        .tickValues([0, 1, 10])
        .orient("right");

      colorbar.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(25,0)')
        .call(colorbar_axis);
  }
  render() {
    return(<div className="row">
      <div className="col-md-12">
        <Header title="Posterior rate distribution" />
        <button
          id="export-chart-svg"
          type="button"
          className="btn btn-default btn-sm pull-right btn-export"
          onClick={()=>d3_save_svg.save(d3.select("#fubar-viz").node(), {filename: "datamonkey-chart"})}
        >
          <span className="glyphicon glyphicon-floppy-save" /> Export Chart to SVG
        </button>
        <button
          id="export-chart-png"
          type="button"
          className="btn btn-default btn-sm pull-right btn-export"
          onClick={()=>saveSvgAsPng(document.getElementById("fubar-viz"), "datamonkey-chart.png")}
        >
          <span className="glyphicon glyphicon-floppy-save" /> Export Chart to PNG
        </button>

      </div>
      <div className="col-md-12">
        <svg id="fubar-viz"></svg>
      </div>
    </div>);
  }
}

class FUBAR extends React.Component {
  constructor(props) {
    super(props);
    this.updatePValue = this.updatePValue.bind(this); 
    this.onFileChange = this.onFileChange.bind(this); 
    this.state = {
      input_data: null,
      data: null,
      fits: null,
      header: null,
      bodyData: null,
      partitions: null,
      pValue: .1
    };
  }

  processData(data){
    data['trees'] = _.map(data['input']['trees'], (val, key) => {
      var branchLengths = {
        'Global MG94xREV': _.mapObject(data['branch attributes'][key], val1 => val1['Global MG94xREV']),
        'Nucleotide GTR': _.mapObject(data['branch attributes'][key], val1 => val1['Nucleotide GTR'])
      };
      return {newickString: val, branchLengths: branchLengths};
    });

    if(data["fits"]["Nucleotide GTR"]){
      data["fits"]["Nucleotide GTR"]["Rate Distributions"] = {};      
    }

    this.setState({
      input_data: data["input_data"],
      data: data,
      fits: data["fits"],
      header: data["MLE"]["headers"],
      bodyData: data["MLE"]["content"],
      partitions: data["data partitions"]
    });
  }

  loadFromServer() {
    var self = this;
    d3.json(this.props.url, function(data) {
      self.processData(data);
    });
  }

  onFileChange(e) {
    var self = this;
    var files = e.target.files; // FileList object

    if (files.length == 1) {
      var f = files[0];
      var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          var data = JSON.parse(this.result);
          self.processData(data);
        };
      })(f);
      reader.readAsText(f);
    }
    e.preventDefault();
  }

  componentWillMount() {
    this.loadFromServer();
  }

  componentDidUpdate(prevProps, prevState) {
    $("body").scrollspy({
      target: ".bs-docs-sidebar",
      offset: 50
    });
  }

  updatePValue(e) {
    this.setState({pValue: e.target.value});
  }

  render() {
    var self = this,
      scrollspy_info = [
        { label: "summary", href: "summary-tab" },
        { label: "table", href: "table-tab" },
        { label: "plot", href: "plot-tab" },
        { label: "tree", href: "tree-tab" },
        { label: "fits", href: "fit-tab" }
      ];
    
    var models = {};
    if (!_.isNull(self.state.data)) {
      models = self.state.data.fits;
    }

    var tree_settings = {
      omegaPlot: {},
      "tree-options": {
        /* value arrays have the following meaning
                [0] - the value of the attribute
                [1] - does the change in attribute value trigger tree re-layout?
            */
        "hyphy-tree-model": ["Unconstrained model", true],
        "hyphy-tree-highlight": ["RELAX.test", false],
        "hyphy-tree-branch-lengths": [false, true],
        "hyphy-tree-hide-legend": [true, false],
        "hyphy-tree-fill-color": [true, false]
      },
      "hyphy-tree-legend-type": "discrete",
      "suppress-tree-render": false,
      "chart-append-html": true,
      edgeColorizer: function(e,d){return 0} 
    };
    return (
      <div>
        {this.props.hyphy_vision ? <NavBar onFileChange={this.onFileChange} /> : ''}
        <div className="container">
          <div className="row">
            <ScrollSpy info={scrollspy_info} />
            <div className="col-sm-10" id="results">
              <FUBARSummary json={self.state.data} />

              <FUBARViz data={self.state.data ? self.state.data.grid : null} />

              <div className="row">
                <div id="tree-tab" className="col-md-12">
                  <Tree
                    models={models}
                    json={self.state.data}
                    settings={tree_settings}
                    method={'meme'}
                    multitree
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-12" id="fit-tab">
                  <DatamonkeyModelTable fits={self.state.fits} />
                  <p className="description">
                    This table reports a statistical summary of the models fit
                    to the data. Here, <strong>MG94</strong> refers to the
                    MG94xREV baseline model that infers a single &omega; rate
                    category per branch.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

function render_fubar(url, element) {
  ReactDOM.render(<FUBAR url={url} />, document.getElementById(element));
}

function render_hv_fubar(url, element) {
  ReactDOM.render(<FUBAR url={url} hyphy_vision />, document.getElementById(element));
}

module.exports = render_fubar;
module.exports.hv = render_hv_fubar;

