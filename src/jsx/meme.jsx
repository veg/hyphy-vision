var React = require("react"),
  ReactDOM = require("react-dom"),
  d3 = require("d3"),
  _ = require("underscore");

import { InputInfo } from "./components/input_info.jsx";
import { DatamonkeyTable, DatamonkeyModelTable } from "./components/tables.jsx";
import { DatamonkeySiteGraph } from "./components/graphs.jsx";
import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";

class MEMESummary extends React.Component {
  render() {
    var user_message,
      was_evidence = true;
    if (was_evidence) {
      user_message = (
        <p className="list-group-item-text label_and_input">
          MEME <strong className="hyphy-highlight">found evidence</strong> of
          positive selection in your phylogeny.
        </p>
      );
    } else {
      user_message = (
        <p className="list-group-item-text label_and_input">
          MEME <strong>found no evidence</strong> of positive selection in your
          phylogeny.
        </p>
      );
    }

    return (
      <div className="row" id="summary-tab">
        <div className="clearance" id="summary-div"></div>
        <div className="col-md-12">
          <h3 className="list-group-item-heading">
            <span id="summary-method-name">
              Mixed Effects Model of Evolution
            </span>
            <br />
            <span className="results-summary">results summary</span>
          </h3>
        </div>
        <div className="col-md-12">
          <InputInfo input_data={this.props.input_data} />
        </div>
        <div className="col-md-12">
          <div className="main-result">
            {user_message}
            <hr />
            <p>
              <small>
                See{" "}
                <a href="http://www.hyphy.org/methods/selection-methods/#meme">
                  here
                </a>{" "}
                for more information about the MEME method.
                <br />Please cite{" "}
                <a
                  href="http://www.ncbi.nlm.nih.gov/pubmed/22807683"
                  id="summary-pmid"
                  target="_blank"
                >
                  PMID 22807683
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
}

class MEMETable extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.state = {
      bodyData: null,
      value: 10,
      filter: 0.1
    };
  }
  componentWillReceiveProps(nextProps) {
    var formatter = d3.format(".2f"),
      new_rows = nextProps.rows.map(row => row.map(entry => formatter(entry)));
    this.setState({
      bodyData: new_rows
    });
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  handleMouseUp(event) {
    this.setState({ filter: event.target.value / 100 });
  }
  render() {
    if (this.props.header) {
      var headerData = this.props.header.map(pair => {
          return { value: pair[0], abbr: pair[1] };
        }),
        bodyData = this.state.bodyData.filter(
          row => row[6] < this.state.filter
        );
    }
    var self = this;
    return (
      <div className="row">
        <div className="col-md-12" id="table-tab">
          <h4 className="dm-table-header">
            MEME data
            <span
              className="glyphicon glyphicon-info-sign"
              style={{ verticalAlign: "middle", float: "right" }}
              aria-hidden="true"
              data-toggle="popover"
              data-trigger="hover"
              title="Actions"
              data-html="true"
              data-content="<ul><li>Hover over a column header for a description of its content.</li></ul>"
              data-placement="bottom"
            />
          </h4>
          <div style={{ width: "500px" }}>
            <span
              style={{
                width: "35%",
                display: "inline-block",
                verticalAlign: "middle"
              }}
            >
              p-value threshold: {self.state.value / 100}
            </span>
            <input
              type="range"
              id="myRange"
              value={self.state.value}
              style={{
                width: "65%",
                display: "inline-block",
                verticalAlign: "middle"
              }}
              onChange={this.handleChange}
              onMouseUp={this.handleMouseUp}
            />
          </div>
          <DatamonkeyTable
            headerData={headerData}
            bodyData={bodyData}
            paginate={20}
            classes={"table table-condensed table-striped"}
            export_csv
          />
        </div>
      </div>
    );
  }
}

class MEME extends React.Component {
  constructor(props) {
    super(props);
    this.updateAxisSelection = this.updateAxisSelection.bind(this);
    this.state = {
      input_data: null,
      data: null,
      fits: null,
      header: null,
      rows: null,
      xaxis: "Site",
      yaxis: "&alpha;"
    };
  }

  updateAxisSelection(e) {
    var state_to_update = {},
      dimension = e.target.dataset.dimension,
      axis = e.target.dataset.axis;

    state_to_update[axis] = dimension;
    this.setState(state_to_update);
  }

  loadFromServer() {
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

  render() {
    var self = this,
      site_graph,
      scrollspy_info = [
        { label: "summary", href: "summary-tab" },
        { label: "table", href: "table-tab" },
        { label: "fits", href: "fit-tab" },
        { label: "plot", href: "plot-tab" }
      ];
    
    if(this.state.data){
      site_graph = <DatamonkeySiteGraph 
        columns={_.pluck(self.state.header, 0)}
        rows={self.state.rows}
      />;
    }
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
                <div className="col-md-12">
                  <h4 className="dm-table-header">Plot Summary</h4>
                  {site_graph}
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    );
  }
}

function render_meme(url, element) {
  ReactDOM.render(<MEME url={url} />, document.getElementById(element));
}

module.exports = render_meme;
