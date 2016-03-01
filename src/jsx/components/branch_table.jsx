// TODO: Write documentation
var BranchTable = React.createClass({

  getInitialState: function() {
    var table_row_data = this.getBranchRows();
    var table_columns = this.getBranchColumns(table_row_data);
    return { table_row_data: table_row_data, table_columns: table_columns};
  },

  getBranchLength : function(m) {
    return d3.format(".4f")(this.tree.get_node_by_name(m).attribute);
  },

  getLRT : function(branch) {
    var formatted = d3.format(".4f")(branch["LRT"]);
    if(formatted == "NaN") {
      return branch["LRT"];
    } else {
      return formatted;
    }
  },

  getPVal : function(branch) {
    return d3.format(".4f")(branch["p"]);
  },

  getUncorrectedPVal : function(branch) {
    return d3.format(".4f")(branch["uncorrected p"]);
  },

  getOmegaDistribution : function(m, annotations) {

    var omega_string = "";

    for(var i in annotations[m]["omegas"]) {
      var omega = parseFloat(annotations[m]["omegas"][i]["omega"]);
      var formatted_omega = "∞";
      if(omega<1e+20) {
        formatted_omega = d3.format(".3r")(omega)
      }
      omega_string += "&omega;<sub>" + (parseInt(i) + 1) + "</sub> = " + formatted_omega + " (" + d3.format(".2p")(annotations[m]["omegas"][i]["prop"]) + ")<br/>";
    }

    return omega_string;

  },


  getBranchRows : function() {

    var self = this;

    self.tree = this.props.tree;
    var test_results = this.props.test_results;
    var annotations = this.props.annotations;

    var table_row_data = [];
    var omega_format = d3.format(".3r");
    var prop_format = d3.format(".2p");

    for (var m in test_results) {

      var branch_row = [];
      branch = test_results[m];

      branch_row = [
        m,
        this.getBranchLength(m),
        this.getLRT(branch),
        this.getPVal(branch),
        this.getUncorrectedPVal(branch),
        this.getOmegaDistribution(m, annotations)
      ];

      table_row_data.push(branch_row);

    }

    table_row_data.sort(function(a, b) {

      if (a[0] == b[0]) {
          return a[1] < b[1] ? -1 : (a[1] == b[1] ? 0 : 1);
      }
      return a[0] - b[0];

    });

    return table_row_data;

  },

  getBranchColumns : function(table_row_data) {

    var name_header = '<th>Name</th>',
        length_header = '<th><abbr title="Branch Length">B</abbr></th>',
        lrt_header = '<th><abbr title="Likelihood ratio test statistic">LRT</abbr></th>',
        pvalue_header = '<th>Test p-value</th>',
        uncorrected_pvalue_header = '<th>Uncorrected p-value</th>',
        omega_header = '<th>ω distribution over sites</th>';

    // inspect table_row_data and return header
    all_columns = [ 
                    name_header,
                    length_header,
                    lrt_header,
                    pvalue_header,
                    uncorrected_pvalue_header,
                    omega_header
                  ];

    // validate each table row with its associated header

    // trim columns to length of table_row_data
    column_headers = _.take(all_columns, table_row_data[0].length)

    // remove all columns that have 0, null, or undefined rows
    items = d3.transpose(table_row_data);
    

    return column_headers;

  },

  componentDidMount: function() {

    var branch_columns = d3.select('#table-branch-header');
    branch_columns = branch_columns.selectAll("th").data(this.state.table_columns);
    branch_columns.enter().append("th");
    branch_columns.html(function(d) {
        return d;
    });

    var branch_rows = d3.select('#table-branch-table').selectAll("tr").data(this.state.table_row_data);
    branch_rows.enter().append('tr');
    branch_rows.exit().remove();
    branch_rows = branch_rows.selectAll("td").data(function(d) {
        return d;
    });
    branch_rows.enter().append("td");
    branch_rows.html(function(d) {
        return d;
    });

  },

  render: function() {

    return (
        <div className="col-md-7">
            <table className="table table-hover table-condensed">
                <thead id="table-branch-header"></thead>
                <tbody id="table-branch-table"></tbody>
            </table>
        </div>
      )
  }

});

// Will need to make a call to this
// omega distributions
function render_branch_table(tree, test_results, annotations, element) {
  React.render(
    <BranchTable tree={tree} test_results={test_results} annotations={annotations} />,
    $(element)[0]
  );
}

// Will need to make a call to this
// omega distributions
function rerender_branch_table(tree, test_results, annotations, element) {
  $(element).empty();
  render_branch_table(tree, test_results, annotations, element);
}

