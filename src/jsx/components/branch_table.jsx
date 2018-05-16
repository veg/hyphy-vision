var React = require("react");
import { PropChart } from "./prop_chart.jsx";

var BranchTable = React.createClass({
  getInitialState: function() {
    // add the following
    var table_row_data = this.getBranchRows(
        this.props.tree,
        this.props.test_results,
        this.props.annotations
      ),
      initial_model_name = _.take(_.keys(this.props.annotations)),
      initial_omegas = this.props.annotations
        ? this.props.annotations[initial_model_name]["omegas"]
        : null;


    return {
      tree: this.props.tree,
      test_results: this.props.test_results,
      annotations: this.props.annotations,
      table_row_data: table_row_data,
      current_model_name: initial_model_name,
      current_omegas: initial_omegas
    };
  },

  getBranchLength: function(m, tree) {
    if (tree.get_node_by_name(m))
      return d3.format(".4f")(tree.get_node_by_name(m).attribute);
    return "";
  },

  getLRT: function(branch) {
    var formatted = d3.format(".4f")(branch["LRT"]);
    if (formatted == "NaN") {
      return branch["LRT"];
    } else {
      return formatted;
    }
  },

  getPVal: function(branch) {
    return d3.format(".4f")(branch["p"]);
  },

  getUncorrectedPVal: function(branch) {
    return d3.format(".4f")(branch["uncorrected p"]);
  },

  getOmegaDistribution: function(m, annotations) {
    if (!annotations) {
      return "";
    }

    var omega_string = "";

    for (var i in annotations[m]["omegas"]) {
      var omega = parseFloat(annotations[m]["omegas"][i]["omega"]);
      var formatted_omega = "∞";
      if (omega < 1e20) {
        formatted_omega = d3.format(".3r")(omega);
      }
      omega_string +=
        "&omega;<sub>" +
        (parseInt(i) + 1) +
        "</sub> = " +
        formatted_omega +
        " (" +
        d3.format(".2p")(annotations[m]["omegas"][i]["prop"]) +
        ")<br/>";
    }

    return omega_string;
  },

  getBranchRows: function(tree, test_results, annotations) {

    var table_row_data = [];

    for (var m in test_results) {
      var branch_row = [];
      var branch = test_results[m];

      branch_row = [
        m,
        this.getBranchLength(m, tree),
        this.getLRT(branch),
        this.getPVal(branch),
        this.getUncorrectedPVal(branch),
        this.getOmegaDistribution(m, annotations),
        `<button id=${m} class="fa fa-bar-chart hyphy-omega-chart-btn" aria-hidden="true"></button>`
      ];

      table_row_data.push(branch_row);
    }

    table_row_data.sort(function(a, b) {
      if (a[2] == "test not run" && b[2] != "test not run") return 1;
      if (a[2] != "test not run" && b[2] == "test not run") return -1;

      if (a[0] == b[0]) {
        return a[1] < b[1] ? -1 : a[1] == b[1] ? 0 : 1;
      }

      return a[3] - b[3];
    });

    return table_row_data;
  },

  setEvents: function() {
    var self = this;

    if (self.state.annotations) {
      var chart_links =  d3.selectAll(".hyphy-omega-chart-btn");

      chart_links.on("click", function(d) {
        var label = this.id;
        self.setState({
          current_model_name: label,
          current_omegas: self.state.annotations[label]["omegas"]
        });
        $("#branchTableModal").modal("show");
      });
    }
  },

  createDistroChart: function() {
    this.settings = {
      dimensions: {
        width: 600,
        height: 400
      },
      margins: {
        left: 50,
        right: 15,
        bottom: 15,
        top: 15
      },
      has_zeros: true,
      legend_id: null,
      do_log_plot: true,
      k_p: null,
      plot: null,
      svg_id: "prop-chart"
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var table_row_data = this.getBranchRows(
        nextProps.tree,
        nextProps.test_results,
        nextProps.annotations
      ),
      initial_model_name = _.take(_.keys(nextProps.annotations)),
      initial_omegas = nextProps.annotations
        ? nextProps.annotations[initial_model_name]["omegas"]
        : null;

    if (nextProps.test_results && nextProps.annotations) {
      this.setState({
        tree: nextProps.tree,
        test_results: nextProps.test_results,
        annotations: nextProps.annotations,
        table_row_data: table_row_data,
        current_model_name: initial_model_name,
        current_omegas: initial_omegas
      });
    }
  },

  componentDidUpdate: function() {
    d3.select('#table-branch-table').html('');
    var branch_rows = d3
      .select("#table-branch-table")
      .selectAll("tr")
      .data(this.state.table_row_data);

    branch_rows.enter().append("tr").attr('class', d=>d[3]<.05?'highlight':'');
    branch_rows.exit().remove();
    branch_rows.style("font-weight", function(d) {
      return d[3] <= 0.05 ? "bold" : "normal";
    });

    branch_rows = branch_rows.selectAll("td").data(function(d) {
      return d;
    });

    branch_rows.enter().append("td").style("text-align", "center");
    branch_rows.html(function(d) {
      return d;
    });

    this.createDistroChart();
    this.setEvents();
  },

  render: function() {
    var self = this;
    var distro_settings = {
      dimensions: {
        width: 600,
        height: 400
      },
      margins: {
        left: 50,
        right: 15,
        bottom: 15,
        top: 15
      },
      legend: false,
      domain: [0.00001, 10000],
      do_log_plot: true,
      k_p: null,
      plot: null,
      svg_id: "prop-chart"
    };

    return (
      <div className="row">
        <div id="hyphy-branch-table" className="col-md-12">
          <h4 className="dm-table-header">
            Detailed results
            <span
              className="glyphicon glyphicon-info-sign"
              style={{ verticalAlign: "middle", float: "right", minHeight:"30px", minWidth: "30px"}}
              aria-hidden="true"
              data-toggle="popover"
              data-trigger="hover"
              title="Detailed results"
              data-html="true"
              data-content="<ul><li><strong>Darker rows</strong> correspond to positively-selected branches at P ≤ 0.05.</li><li>Click on the chart icon at the end of any row to see a visualization of its inferred rate distribution.</li><li>Hover over a column header for a description of its content.</li></ul>"
              data-placement="bottom"
            />
          </h4>
          <table className="table table-hover table-smm dm-table">
            <thead id="table-branch-header">
              <tr>
                <th>
                  <span
                    data-toggle="tooltip"
                    title="Branch of interest"
                    data-placement="top"
                  >
                    Name
                  </span>
                </th>
                <th>
                  <span data-toggle="tooltip" title="Optimized branch length">
                    B{" "}
                  </span>
                </th>
                <th>
                  <span
                    data-toggle="tooltip"
                    title="Likelihood ratio test statistic for selection"
                  >
                    LRT
                  </span>
                </th>
                <th>
                  <span
                    data-toggle="tooltip"
                    title="P-value corrected for multiple testing"
                  >
                    Test p-value
                  </span>
                </th>
                <th>
                  <span
                    data-toggle="tooltip"
                    title="Raw P-value without correction for multiple testing"
                  >
                    Uncorrected p-value
                  </span>
                </th>
                <th>
                  <span
                    data-toggle="tooltip"
                    title="Inferred ω estimates and respective proportion of sites"
                  >
                    ω distribution over sites
                  </span>
                </th>
                <th>
                </th>
              </tr>
            </thead>
            <tbody id="table-branch-table" />
          </table>
        </div>

        <div
          className="modal fade"
          id="branchTableModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">
                  aBSREL Site Proportion Chart
                </h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>

              </div>
              <div className="modal-body" id="modal-body">
                <h4 className="dm-table-header">&omega; distribution</h4>
                <PropChart
                  name={self.state.current_model_name}
                  omegas={self.state.current_omegas}
                  settings={distro_settings}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn.btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <p className="description" />
        </div>
      </div>
    );
  }
});

// Will need to make a call to this
// omega distributions
function render_branch_table(tree, test_results, annotations, element) {
  React.render(
    <BranchTable
      tree={tree}
      test_results={test_results}
      annotations={annotations}
    />,
    $(element)[0]
  );
}

// Will need to make a call to this
// omega distributions
function rerender_branch_table(tree, test_results, annotations, element) {
  $(element).empty();
  render_branch_table(tree, test_results, annotations, element);
}

module.exports.BranchTable = BranchTable;
module.exports.render_branch_table = render_branch_table;
module.exports.rerender_branch_table = rerender_branch_table;
