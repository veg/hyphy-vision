var React = require("react"),
  ReactDOM = require("react-dom"),
  d3 = require("d3"),
  _ = require("underscore");

require("phylotree");
require("phylotree.css");

import { MEMESummary } from "./components/meme_summary.jsx";
import { MEMETable } from "./components/meme_table.jsx";
import { DatamonkeyModelTable } from "./components/tables.jsx";
import { DatamonkeySeries, DatamonkeyGraphMenu } from "./components/graphs.jsx";
import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";


var MEME = React.createClass({
  getInitialState: function() {
    return {
      input_data: null,
      data: null,
      fits: null,
      header: null,
      rows: null,
      xaxis: "Site",
      yaxis: "&alpha;"
    };
  },

  updateAxisSelection: function(e) {
    var state_to_update = {},
      dimension = e.target.dataset.dimension,
      axis = e.target.dataset.axis;

    state_to_update[axis] = dimension;
    this.setState(state_to_update);
  },

  loadFromServer: function() {
    var self = this;
    d3.json(this.props.url, function(data) {
      self.setState({
        input_data: data["input_data"],
        data: data,
        fits: data["fits"],
        header: data["MLE"]["headers"],
        rows: data["MLE"]["content"]["0"]
      });
    });
  },

  componentWillMount: function() {
    this.loadFromServer();
  },

  componentDidUpdate(prevProps, prevState) {
    $("body").scrollspy({
      target: ".bs-docs-sidebar",
      offset: 50
    });
  },

  render: function() {
    var self = this,
      scrollspy_info = [
        { label: "summary", href: "summary-tab" },
        { label: "table", href: "table-tab" },
        { label: "fits", href: "fit-tab" },
        { label: "plot", href: "plot-tab" }
      ],
      x = this.state.rows ? _.range(1, this.state.rows.length+1) : [],
      index = this.state.yaxis == "&alpha;" ? 0 : 1,
      y = this.state.rows ? [_.map(this.state.rows, d=>d[index])] : [[]];
    
    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="row">
            <ScrollSpy info={scrollspy_info} />
            <div className="col-sm-10" id="results">
              <MEMESummary input_data={self.state.input_data} />
              <MEMETable header={self.state.header} rows={self.state.rows} />
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

              <div id="plot-tab" className="row hyphy-row">

                <h3 className="dm-table-header">Plot Summary</h3>

                <DatamonkeyGraphMenu
                  x_options={"Site"}
                  y_options={["&alpha;", "&beta;"]}
                  axisSelectionEvent={self.updateAxisSelection}
                />

                <DatamonkeySeries
                  x={x}
                  y={y}
                  x_label={"Site"}
                  y_label={self.state.yaxis}
                  marginLeft={50}
                  width={$("#results").width()}
                  transitions={true}
                  doDots={true}
                />

              </div>


            </div>
          </div>
        </div>
      </div>
    );
  }
});

function render_meme(url, element) {
  ReactDOM.render(<MEME url={url} />, document.getElementById(element));
}

module.exports = render_meme;
