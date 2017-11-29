var React = require("react"),
  _ = require("underscore");

import { DatamonkeyTable } from "./tables.jsx";

/**
 * Generates a table that contains tree summary information
 * @param model -- the model to obtain information from
 * @param test results -- the general test result information
 */
var TreeSummary = React.createClass({
  getDefaultProps() {
    return {
      model: {},
      test_results: {}
    };
  },

  getInitialState: function() {
    var table_row_data = this.getSummaryRows(
      this.props.model,
      this.props.test_results,
      this.props.branch_attributes
    ),
      table_columns = this.getTreeSummaryColumns(table_row_data);

    return {
      table_row_data: table_row_data,
      table_columns: table_columns
    };
  },

  getRateClasses: function(branch_annotations) {
    // Get count of all rate classes
    var all_branches = _.values(branch_annotations);

    return _.countBy(all_branches, function(branch) {
      return branch.omegas.length;
    });
  },

  getBranchProportion: function(rate_classes) {
    var sum = _.reduce(_.values(rate_classes), function(memo, num) {
      return memo + num;
    });
    return _.mapObject(rate_classes, function(val, key) {
      return d3.format(".2p")(val / sum);
    });
  },

  getBranchLengthProportion: function(branch_attributes) {
    var rate_classes = _.groupBy(branch_attributes, (val, key) => val['Rate Distributions'].length),
      lengths = _.mapObject(rate_classes, (val,key)=>d3.sum(_.pluck(val,'Full adaptive model'))),
      total_length = d3.sum(_.values(lengths)),
      percentages = _.mapObject(lengths, length=>length/total_length),
      formatter = d3.format(".2p"),
      formatted_percentages = _.mapObject(percentages, formatter);
    return formatted_percentages;
  },

  getNumUnderSelection: function(
    rate_classes,
    branch_annotations,
    test_results
  ) {
    var num_under_selection = _.mapObject(rate_classes, function(d) {
      return 0;
    });

    for (var key in branch_annotations) {
      num_under_selection[branch_annotations[key].omegas.length] +=
        test_results[key]["p"] <= 0.05;
    }

    return num_under_selection;
  },

  getSummaryRows: function(model, test_results, branch_attributes) {
    if (!model || !test_results) {
      return [];
    }

    // Create an array of phylotrees from fits

    var branch_annotations = model["branch-annotations"];
    var rate_classes = this.getRateClasses(branch_annotations),
      proportions = this.getBranchProportion(rate_classes),
      length_proportions = this.getBranchLengthProportion(branch_attributes),
      num_under_selection = this.getNumUnderSelection(
        rate_classes,
        branch_annotations,
        test_results
      );

    // zip objects into matrix
    var keys = _.keys(rate_classes);

    var summary_rows = _.zip(
      keys,
      _.values(rate_classes),
      _.values(proportions),
      _.values(length_proportions),
      _.values(num_under_selection)
    );

    summary_rows.sort(function(a, b) {
      if (a[0] == b[0]) {
        return a[1] < b[1] ? -1 : a[1] == b[1] ? 0 : 1;
      }
      return a[0] - b[0];
    });

    return summary_rows;
  },

  getTreeSummaryColumns: function(table_row_data) {
    var omega_header = "ω rate classes",
      branch_num_header = "# of branches",
      branch_prop_header = "% of branches",
      branch_prop_length_header = "% of tree length",
      under_selection_header = "# under selection";

    // inspect table_row_data and return header
    var all_columns = [
      {
        value: omega_header,
        abbr: "Number of ω rate classes inferred"
      },
      {
        value: branch_num_header,
        abbr: "Number of branches with this many rate classes"
      },
      {
        value: branch_prop_header,
        abbr: "Percentage of branches with this many rate classes"
      },
      {
        value: branch_prop_length_header,
        abbr: "Percentage of tree length with this many rate classes"
      },
      {
        value: under_selection_header,
        abbr: "Number of selected branches with this many rate classes"
      }
    ];

    // validate each table row with its associated header
    if (table_row_data.length == 0) {
      return [];
    }

    // trim columns to length of table_row_data
    var column_headers = _.take(all_columns, table_row_data[0].length);
    return column_headers;
  },

  componentWillReceiveProps: function(nextProps) {
    var table_row_data = this.getSummaryRows(
      nextProps.model,
      nextProps.test_results,
      nextProps.branch_attributes
    ),
      table_columns = this.getTreeSummaryColumns(table_row_data);

    this.setState({
      table_row_data: table_row_data,
      table_columns: table_columns
    });
  },

  render: function() {
    return (
      <div>
        <h4 className="dm-table-header">
          Tree summary
          <span
            aria-hidden="true"
            data-toggle="popover"
            data-trigger="hover"
            title="Actions"
            data-html="true"
            data-content="<ul><li>Hover over a column header for a description of its content.</li></ul>"
            data-placement="bottom"
            className="glyphicon glyphicon-info-sign"
            style={{ verticalAlign: "middle", float: "right", minHeight: "30px", minWidth: "30px"}}
          />
        </h4>
        <DatamonkeyTable
          headerData={this.state.table_columns}
          bodyData={this.state.table_row_data}
        />
        <p className="description">
          This table contains a summary of the inferred aBSREL model complexity.
          Each row provides information about the branches that were best
          described by the given number of ω rate categories.
        </p>
      </div>
    );
  }
});

// Will need to make a call to this
// omega distributions
function render_tree_summary(json, element) {
  React.render(
    <TreeSummary model={model} test_results={test_results} />,
    $(element)[0]
  );
}

// Will need to make a call to this
// omega distributions
function rerender_tree_summary(tree, element) {
  $(element).empty();
  render_tree_summary(tree, element);
}

module.exports.TreeSummary = TreeSummary;
module.exports.render_tree_summary = render_tree_summary;
module.exports.rerender_tree_summary = rerender_tree_summary;
