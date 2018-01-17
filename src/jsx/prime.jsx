var React = require("react"),
  ReactDOM = require("react-dom"),
  _ = require("underscore"),
  chi = require("chi-squared");

import { DatamonkeyTable } from "./components/tables.jsx";
import {
  DatamonkeyMultiScatterplot
} from "./components/graphs.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";

class PRIME extends React.Component {
  constructor(props) {
    super(props);

    this.float_format = d3.format(".3f");
    this.initial_pvalue_threshold = 0.1;

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

    // calculate p-values
    results = _.map(results, d => {
      return _.extend(d, { pvalues: this.calculatePvalues(d) });
    });

    var codons = _.map(results, d => {
      return parseInt(d.codon);
    });

    var property_headers = _.keys(
      _.omit(results[0]["Full model"]["MLES"], "_felScaler")
    );

    // format property_values for table
    var property_values = _.unzip(
      _.map(results, d => {
        return _.map(
          _.values(_.omit(d["Full model"]["MLES"], "_felScaler")),
          d => {
            return this.float_format(d);
          }
        );
      })
    );

    // add pvalue to header
    var table_property_headers = _.map(
      _.flatten(_.zip(property_headers, property_headers)),
      (d, k) => {
        if (k % 2) {
          return d + "_pval";
        } else return d;
      }
    );

    // prepend with codon
    table_property_headers = ["codon"].concat(table_property_headers);
    var table_property_values = this.formatValuesForTable(
      codons,
      results,
      this.initial_pvalue_threshold
    );


    // format data into variables usable by components
    var all_mle_props = _.flatten(
      _.map(results, d => {
        return _.zip(
          _.values(_.omit(d["Full model"]["MLES"], "_felScaler")),
          _.values(d["pvalues"])
        );
      }), true
    );

    var changing_properties = _.filter(all_mle_props, d => {
      return d[0] < 0 && d[1] < this.initial_pvalue_threshold;
    });

    var conserved_properties = _.filter(all_mle_props, d => {
      return d[0] > 0 && d[1] < this.initial_pvalue_threshold;
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
      results: results,
      all_mle_props: all_mle_props,
      codons: codons,
      property_plot_done: false,
      property_headers: property_headers,
      property_values: property_values,
      table_property_headers: table_property_headers,
      table_property_values: table_property_values,
      changing_properties: changing_properties,
      conserved_properties: conserved_properties,
      pvalue_threshold: this.initial_pvalue_threshold,
      total_sites_found: results.length,
      plot_width: plot_width
    };
  }

  formatValuesForTable(codons, results, pvalue) {
    // update property values to state whether they are conserved or changing
    var table_property_values = _.unzip(
      _.map(results, rows => {
        return _.map(
          _.omit(rows["Full model"]["MLES"], "_felScaler"),
          (d, k) => {
            var classes = "";
            if (rows["pvalues"][k] < pvalue) {
              if (d < 0) {
                classes = "success";
              } else {
                classes = "danger";
              }
            }
            return { value: d, classes: classes };
          },
          this
        );
      })
    );

    var p_values = _.unzip(
      _.map(results, d => {
        return _.map(_.values(d["pvalues"]), d => {
          return { value: this.float_format(d) };
        });
      })
    );

    table_property_values = _.flatten(
      _.zip(table_property_values, p_values),
      true
    );

    // prepend with codon sites
    table_property_values = [codons].concat(table_property_values);

    return table_property_values;
  }

  calculatePvalues(values) {
    var property_keys = ["alpha_0", "alpha_1", "alpha_2", "alpha_3", "alpha_4"];
    var full_model_logl = values["Full model"]["LogL"];
    var full_model_df = values["Full model"]["DF"];

    // Must get log-likelihood of each test property
    var pvals = _.map(this.props.properties, d => {
      var logl = values[d]["LogL"];
      var n = 2 * (full_model_logl - logl);
      var df = full_model_df - values[d]["DF"];
      return 1 - chi.cdf(n, df);
    });

    return _.object(property_keys, pvals);
  }

  updatePvalThreshold(e) {

    var pvalue_threshold = parseFloat(e.target.value);

    var table_property_values = this.formatValuesForTable(
      this.state.codons,
      this.state.results,
      pvalue_threshold
    );

    // update conserved and changing properties count
    var changing_properties = _.filter(this.state.all_mle_props, d => {
      return d[0] < 0 && d[1] < pvalue_threshold;
    });

    var conserved_properties = _.filter(this.state.all_mle_props, d => {
      return d[0] > 0 && d[1] < pvalue_threshold;
    });


    this.setState({
      table_property_headers: this.state.table_property_headers,
      pvalue_threshold: pvalue_threshold,
      table_property_values: table_property_values,
      conserved_properties : conserved_properties,
      changing_properties: changing_properties
    });
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
            </p>
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
                  onChange={self.updatePvalThreshold.bind(this)}
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
              Please cite PMID <a href=""> TBA </a> if you use this result in a
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

    var order_table_rows = _.unzip(this.state.table_property_values);

    return (
      <div>
        <div className="container">
          <div className="row">
            <ScrollSpy info={scrollspy_info} />
            <div className="col-sm-10">
              <div className="clearance" id="summary-div"></div>
              <div id="results">
                <h3 className="list-group-item-heading">
                  <span id="summary-method-name">
                    PRIME - PRoperty Informed Models of Evolution{" "}
                  </span>
                  <br />
                  <span className="results-summary"> results summary </span>
                </h3>
                {this.getSummary()}
              </div>

              <div id="plot-tab" className="row hyphy-row">
                <h3 className="dm-table-header">Property Importance Plot</h3>

                <DatamonkeyMultiScatterplot
                  x={this.state.codons}
                  y={this.state.property_values}
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
                    headerData={this.state.table_property_headers}
                    bodyData={order_table_rows}
                    classes={"table table-condensed table-striped"}
                    paginate={20}
                    export_csv
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
  _use_q_values: false,
  properties: [
    "Test property 1",
    "Test property 2",
    "Test property 3",
    "Test property 4",
    "Test property 5"
  ]
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
