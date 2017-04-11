var React = require('react'),
		_ = require('underscore');

import {DatamonkeyTable} from "./shared_summary.jsx";

var TreeSummary = React.createClass({

  getDefaultProps() {
    return {
      model : {},
      test_results : {}
    }
  },

  getInitialState: function() {

    var table_row_data = this.getSummaryRows(this.props.model, this.props.test_results),
        table_columns = this.getTreeSummaryColumns(table_row_data);

    return { 
              table_row_data: table_row_data, 
              table_columns: table_columns,
           };
  },

  getRateClasses : function(branch_annotations) {

    // Get count of all rate classes
    var all_branches = _.values(branch_annotations);

    return _.countBy(all_branches, function(branch) {
      return branch.omegas.length;
    });

  },

  getBranchProportion : function(rate_classes) {
    var sum = _.reduce(_.values(rate_classes), function(memo, num) { return memo + num; });
    return _.mapObject(rate_classes, function(val, key) { return d3.format(".2p")(val/sum) } );
  },

  getBranchLengthProportion : function(model, rate_classes, branch_annotations, total_branch_length) {

    var self = this;

    // get branch lengths of each rate distribution
    //return prop_format(d[2] / total_tree_length
    if(_.has(model,"tree string")) {
      var tree = d3.layout.phylotree("body")(model["tree string"]);
    } else {
      return null;
    }

    // Get count of all rate classes
    var branch_lengths = _.mapObject(rate_classes, function(d) { return 0}); 

    for (var key in branch_annotations) {
      var node = tree.get_node_by_name(key);
      branch_lengths[branch_annotations[key].omegas.length] += tree.branch_length()(node);
    };

    return _.mapObject(branch_lengths, function(val, key) { return d3.format(".2p")(val/total_branch_length) } );

  },

  getNumUnderSelection : function(rate_classes, branch_annotations, test_results) {

    var num_under_selection = _.mapObject(rate_classes, function(d) { return 0}); 

    for (var key in branch_annotations) {
      num_under_selection[branch_annotations[key].omegas.length] += test_results[key]["p"] <= 0.05;
    };

    return num_under_selection;

  },

  getSummaryRows : function(model, test_results) {

    var self = this;

    if(!model || !test_results) {
      return [];
    }

    // Create an array of phylotrees from fits
    
    var tree_length = model["tree length"];
    var branch_annotations = model["branch-annotations"];

    var rate_classes = this.getRateClasses(branch_annotations),
        proportions = this.getBranchProportion(rate_classes),
        length_proportions = this.getBranchLengthProportion(model, rate_classes, branch_annotations, tree_length),
        num_under_selection = this.getNumUnderSelection(rate_classes, branch_annotations, test_results);

    // zip objects into matrix
    var keys = _.keys(rate_classes);

    var summary_rows = _.zip(
      keys
      ,_.values(rate_classes)
      ,_.values(proportions)
      ,_.values(length_proportions)
      ,_.values(num_under_selection)
    )

    summary_rows.sort(function(a, b) {
      if (a[0] == b[0]) {
          return a[1] < b[1] ? -1 : (a[1] == b[1] ? 0 : 1);
      }
      return a[0] - b[0];
    });

    return summary_rows;

  },

  getTreeSummaryColumns : function(table_row_data) {

    var omega_header = 'ω rate classes',
        branch_num_header = '# of branches',
        branch_prop_header = '% of branches',
        branch_prop_length_header = '% of tree length',
        under_selection_header = '# under selection';


    // inspect table_row_data and return header
    var all_columns = [ 
                    omega_header,
                    branch_num_header, 
                    branch_prop_header, 
                    branch_prop_length_header, 
                    under_selection_header
                  ];

    // validate each table row with its associated header
    if(table_row_data.length == 0) {
      return [];
    }

    // trim columns to length of table_row_data
    var column_headers = _.take(all_columns, table_row_data[0].length)
    return column_headers;

  },

  componentWillReceiveProps: function(nextProps) {

    var table_row_data = this.getSummaryRows(nextProps.model, nextProps.test_results),
        table_columns = this.getTreeSummaryColumns(table_row_data);

    this.setState({
                    table_row_data: table_row_data, 
                    table_columns: table_columns
                  });

  },

  render: function() {

    return (
      <div>
        <h4 className="dm-table-header">Tree</h4>
        <DatamonkeyTable headerData={this.state.table_columns} bodyData={this.state.table_row_data}/>
      </div>
    )

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
