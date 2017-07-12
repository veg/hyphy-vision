var React = require("react");
var datamonkey = require("../../datamonkey/datamonkey.js");
import { InputInfo } from "./input_info.jsx";

var SLACBanner = React.createClass({
  dm_countSites: function(json, cutoff) {
    var result = {
      all: 0,
      positive: 0,
      negative: 0
    };

    result.all = datamonkey.helpers.countSitesFromPartitionsJSON(json);

    result.positive = datamonkey.helpers.sum(json["MLE"]["content"], function(
      partition
    ) {
      return _.reduce(
        partition["by-site"]["RESOLVED"],
        function(sum, row) {
          return sum + (row[8] <= cutoff ? 1 : 0);
        },
        0
      );
    });

    result.negative = datamonkey.helpers.sum(json["MLE"]["content"], function(
      partition
    ) {
      return _.reduce(
        partition["by-site"]["RESOLVED"],
        function(sum, row) {
          return sum + (row[9] <= cutoff ? 1 : 0);
        },
        0
      );
    });

    return result;
  },

  dm_computeState: function(state, pvalue) {
    return {
      sites: this.dm_countSites(state, pvalue)
    };
  },

  dm_formatP: d3.format(".3f"),

  getInitialState: function() {
    return this.dm_computeState(this.props.analysis_results, this.props.pValue);
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(
      this.dm_computeState(nextProps.analysis_results, nextProps.pValue)
    );
  },

  render: function() {
    return (
      <div className="row" id="summary-div">

        <div className="col-md-12">
          <h3 className="list-group-item-heading">
            <span className="summary-method-name">Single-Likelihood Ancestor Counting</span>
            <br />
            <span className="results-summary">results summary</span>
          </h3>
        </div>

        <div className="col-md-12">
          <InputInfo input_data={this.props.input_data}/>
        </div>

        <div className="col-md-12">
          <div className="main-result">
            <p>
              Evidence<sup>&dagger;</sup> of pervasive{" "}
              <span className="hyphy-highlight">diversifying</span>/<span className="hyphy-highlight">purifying</span>{" "}
              selection was found at
              <strong className="hyphy-highlight">
                {" "}{this.state.sites.positive}
              </strong>{" "}
              /{" "}
              <strong className="hyphy-navy">
                {this.state.sites.negative}
              </strong>{" "}
              sites
              among {this.state.sites.all} tested sites.
            </p>
            <div style={{ marginBottom: "0em" }}>
              <small>
                <sup>&dagger;</sup>Extended binomial test, p &le;{" "}
                {this.dm_formatP(this.props.pValue)}
                <div
                  className="dropdown hidden-print"
                  style={{ display: "inline", marginLeft: "0.25em" }}
                >
                  <button
                    id="dm.pvalue.slider"
                    type="button"
                    className="btn btn-primary btn-xs dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="caret" />
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dm.pvalue.slider"
                  >
                    <li>
                      <a href="#">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          value={this.props.pValue}
                          step="0.01"
                          onChange={this.props.pAdjuster}
                        />
                      </a>
                    </li>
                  </ul>
                </div>
                <emph> not</emph> corrected for multiple testing; ambiguous
                characters resolved to minimize substitution counts.<br />
                <i className="fa fa-exclamation-circle" /> Please cite{" "}
                <a
                  href="http://www.ncbi.nlm.nih.gov/pubmed/15703242"
                  target="_blank"
                >
                  PMID 15703242
                </a>{" "}
                if you use this result in a publication, presentation, or other
                scientific work.
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports.SLACBanner = SLACBanner;
