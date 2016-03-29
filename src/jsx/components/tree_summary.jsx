var TreeSummary = React.createClass({

  getInitialState: function() {

    var table_row_data = this.getSummaryRows(this.props.json),
        table_columns = this.getTreeSummaryColumns(table_row_data);

    return { 
              table_row_data: table_row_data, 
              table_columns: table_columns
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

  getBranchLengthProportion : function(rate_classes, branch_annotations, total_branch_length) {

    var self = this;

    // get branch lengths of each rate distribution
    //return prop_format(d[2] / total_tree_length

    // Get count of all rate classes
    var branch_lengths = _.mapObject(rate_classes, function(d) { return 0}); 

    for (var key in branch_annotations) {
      var node = self.tree.get_node_by_name(key);
      branch_lengths[branch_annotations[key].omegas.length] += self.tree.branch_length()(node);
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

  getSummaryRows : function(json) {

    var self = this;

    // Will need to create a tree for each fits
    var analysis_data = json;

    if(!analysis_data) {
      return [];
    }

    // Create an array of phylotrees from fits
    var trees = _.map(analysis_data["fits"], function(d) { return d3.layout.phylotree("body")(d["tree string"]) });
    var tree = trees[0];

    self.tree = tree;
    

    //TODO : Do not hard code model here
    var tree_length = analysis_data["fits"]["Full model"]["tree length"];
    var branch_annotations = analysis_data["fits"]["Full model"]["branch-annotations"];
    var test_results = analysis_data["test results"];

    var rate_classes = this.getRateClasses(branch_annotations),
        proportions = this.getBranchProportion(rate_classes),
        length_proportions = this.getBranchLengthProportion(rate_classes, branch_annotations, tree_length),
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

    var omega_header = '<th>ω rate<br>classes</th>',
        branch_num_header = '<th># of <br>branches</th>',
        branch_prop_header = '<th>% of <br>branches</th>',
        branch_prop_length_header = '<th>% of tree <br>length</th>',
        under_selection_header = '<th># under <br>selection</th>';


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
    column_headers = _.take(all_columns, table_row_data[0].length)

    return column_headers;
  },

  componentWillReceiveProps: function(nextProps) {

    var table_row_data = this.getSummaryRows(nextProps.json),
        table_columns = this.getTreeSummaryColumns(table_row_data);

    this.setState({
                    table_row_data: table_row_data, 
                    table_columns: table_columns
                  });

  },

  componentDidUpdate : function() {

    d3.select('#summary-tree-header').empty();

    var tree_summary_columns = d3.select('#summary-tree-header');

    tree_summary_columns = tree_summary_columns.selectAll("th").data(this.state.table_columns);
    tree_summary_columns.enter().append("th");
    tree_summary_columns.html(function(d) {
        return d;
    });

    var tree_summary_rows = d3.select('#summary-tree-table').selectAll("tr").data(this.state.table_row_data);
    tree_summary_rows.enter().append('tr');
    tree_summary_rows.exit().remove();
    tree_summary_rows = tree_summary_rows.selectAll("td").data(function(d) {
        return d;
    });

    tree_summary_rows.enter().append("td");
    tree_summary_rows.html(function(d) {
        return d;
    });


  },


  render: function() {

    return (
        <ul className="list-group">
            <li className="list-group-item">
              <h4 className="list-group-item-heading"><i className="fa fa-tree"></i>Tree</h4>
              <table className="table table-hover table-condensed list-group-item-text">
                <thead id='summary-tree-header'></thead>
                <tbody id="summary-tree-table"></tbody>
              </table>
            </li>
        </ul>
      )
  }

});

//TODO
//<caption>
//<p className="list-group-item-text text-muted">
//    Total tree length under the branch-site model is <strong id="summary-tree-length">2.30</strong> expected substitutions per nucleotide site, and <strong id="summary-tree-length-mg94">1.74</strong> under the MG94 model.
//</p>
//</caption>


// Will need to make a call to this
// omega distributions
function render_tree_summary(json, element) {
  React.render(
    <TreeSummary json={json} />,
    $(element)[0]
  );
}

// Will need to make a call to this
// omega distributions
function rerender_tree_summary(tree, element) {
  $(element).empty();
  render_tree_summary(tree, element);
}


