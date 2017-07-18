var React = require("react"),
  ReactDOM = require("react-dom"),
  _ = require("underscore");

import { DatamonkeyTable } from "./components/tables.jsx";
import {
  DatamonkeyMultiScatterplot,
  DatamonkeyGraphMenu
} from "./components/graphs.jsx";
import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";
import CopyToClipboard from "react-copy-to-clipboard";

class PRIME extends React.Component {
  constructor(props) {
    super(props);

    var results = _.map(this.props.prime_results, function(d, k) {
      d["codon"] = k;
      return d;
    });

    results = _.filter(results, function(d) {
      return _.has(d, "Full model");
    });

    // filter out sites that are constant
    results = _.filter(results, function(d) {
      return d.CONSTANT != 1;
    });

    var codons = _.map(results, d => {
      return parseInt(d.codon);
    });

    // format data into variables usable by components
    var all_mle_props = _.flatten(
      _.map(results, d => {
        return _.values(_.omit(d["Full model"]["MLES"], "_felScaler"));
      })
    );

    var property_headers = _.keys(
      _.omit(results[0]["Full model"]["MLES"], "_felScaler")
    );
    var property_values = _.unzip(
      _.map(results, d => {
        return _.values(_.omit(d["Full model"]["MLES"], "_felScaler"));
      })
    );

    // TODO: Need to annotate with p-values and filter based on that
    var changing_properties = _.filter(all_mle_props, d => {
      return d < 0;
    });
    var conserved_properties = _.filter(all_mle_props, d => {
      return d > 0;
    });

    // Get plot width according to bootstrap conventions
    var plot_width = 960;

    switch (true) {
      case window.innerWidth >= 992:
        plot_width = 960;
        break;
      case window.innerWidth >= 768:
        plot_width = 460;
        break;
      case window.innerWidth <= 576:
        plot_width = 460;
        break;
      default:
        plot_width = 0;
    }

    this.state = {
      codons: codons,
      property_plot_done: false,
      property_headers: property_headers,
      property_values: property_values,
      changing_properties: changing_properties,
      conserved_properties: conserved_properties,
      pvalue_threshold: 0.1,
      total_sites_found: results.length,
      plot_width: plot_width
    };
  }

  definePlotData() {}

  getClipboard() {
    if (this.state.copy_transition) {
      return <i> Copied! </i>;
    } else {
      return (
        <a href="#">
          {" "}<i className="fa fa-clipboard" aria-hidden="true" />{" "}
        </a>
      );
    }
  }

  onCopy() {
    this.setState({
      copy_transition: true
    });
    setTimeout(() => {
      this.setState({
        copy_transition: false
      });
    }, 1000);
  }

  getSummary() {
    var self = this;

    return (
      <div>
        <div className="main-result">
          <p>
            <p>
              PRIME {" "}
              <strong className="hyphy-highlight"> found evidence </strong> of{" "}
            </p>{" "}
            <p>
              <span className="hyphy-highlight">
                {" "} {self.state.conserved_properties.length} {" "}
              </span>
              conserved properties found.{" "}
            </p>
            <p>
              <span className="hyphy-highlight">
                {" "} {self.state.changing_properties.length} {" "}
              </span>
              changing properties found.{" "}
            </p>
            <div
              className="row"
              style={{
                marginTop: "20px"
              }}
            >
              <div className="col-md-3">With p-value threshold of</div>
              <div
                className="col-md-2"
                style={{
                  top: "-5px"
                }}
              >
                <input
                  className="form-control"
                  type="number"
                  defaultValue="0.1"
                  step="0.01"
                  min="0"
                  max="1"
                  onChange={self.updatePvalThreshold}
                />
              </div>
            </div>
          </p>
          <hr />
          <p>
            <small>
              See {" "}
              <a href="//hyphy.org/methods/selection-methods/#prime">
                here{" "}
              </a>{" "}
              for more information about the PRIME method <br />
              Please cite PMID  <a href=""> TBA </a> if you use this result in a
              publication, presentation, or other scientific work
            </small>
          </p>
        </div>
      </div>
    );
  }

  componentWillMount() {}

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    $("body").scrollspy({
      target: ".bs-docs-sidebar",
      offset: 50
    });
  }

  render() {
    var scrollspy_info = [
      {
        label: "summary",
        href: "summary-tab"
      },
      {
        label: "plots",
        href: "plot-tab"
      },
      {
        label: "table",
        href: "table-tab"
      }
    ];

    var x = this.state.codons;
    var y = this.state.property_values;

    return (
      <div>
        <NavBar />
        <div className="container">
          <div id="results" className="row">
            <ScrollSpy info={scrollspy_info} />
            <div className="col-sm-10">
              <div
                id="datamonkey-prime-error"
                className="alert alert-danger alert-dismissible"
                role="alert"
                style={{
                  display: "none"
                }}
              >
                <button
                  type="button"
                  className="close"
                  id="datamonkey-prime-error-hide"
                >
                  <span aria-hidden="true"> & times; </span>{" "}
                  <span className="sr-only"> Close </span>{" "}
                </button>{" "}
                <strong> Error! </strong> {" "}
                <span id="datamonkey-prime-error-text" />
              </div>
              <div id="results">
                <h3 className="list-group-item-heading">
                  <span id="summary-method-name">
                    PRIME - PRoperty Informed Models of Evolution{" "}
                  </span>{" "}
                  <br />
                  <span className="results-summary">
                    {" "}results summary{" "}
                  </span>{" "}
                </h3>
                {this.getSummary()}
              </div>

              <div id="plot-tab" className="row hyphy-row">
                <h3 className="dm-table-header">Property Importance Plot</h3>
                <DatamonkeyMultiScatterplot
                  x={x}
                  y={y}
                  width={this.state.plot_width}
                  x_label={"test"}
                  y_labels={this.state.property_headers}
                  transitions={true}
                />
              </div>

              <div id="table-tab" className="row hyphy-row">
                <div id="hyphy-mle-fits" className="col-md-12">
                  <h3 className="dm-table-header">Table Summary</h3>
                  <div className="col-md-6 alert alert-danger" role="alert">
                    Conserved properties with evidence are highlighted in red.
                  </div>
                  <div className="col-md-6 alert alert-success" role="alert">
                    Changing properties with evidence are highlighted in green.
                  </div>
                  <DatamonkeyTable
                    headerData={this.state.property_headers}
                    bodyData={_.unzip(this.state.property_values)}
                    classes={"table table-condensed table-striped"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PRIME.defaultProps = {
  _use_q_values: false
};

// Will need to make a call to this
// omega distributions
function prime(prime_results, element) {
  ReactDOM.render(
    <PRIME prime_results={prime_results} />,
    document.getElementById(element)
  );
}

module.exports = prime;
