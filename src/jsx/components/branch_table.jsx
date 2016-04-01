var BranchTable = React.createClass({

  getInitialState: function() {

    // add the following
    var table_row_data = this.getBranchRows(this.props.tree, this.props.test_results, this.props.annotations),
        table_columns = this.getBranchColumns(table_row_data),
        initial_model_name = _.take(_.keys(this.props.annotations)),
        initial_omegas = this.props.annotations ? 
                         this.props.annotations[initial_model_name]["omegas"] : 
                         null;

    var distro_settings = {
      dimensions : { width : 600, height : 400 },
      margins : { 'left': 50, 'right': 15, 'bottom': 35, 'top': 35 },
      legend: false,
      domain : [0.00001, 10],
      do_log_plot : true,
      k_p : null,
      plot : null,
      svg_id : "prop-chart"
    };

    return { 
             tree : this.props.tree,
             test_results : this.props.test_results,
             annotations : this.props.annotations,
             table_row_data : table_row_data, 
             table_columns : table_columns,
             current_model_name : initial_model_name,
             current_omegas : initial_omegas,
             distro_settings : distro_settings
           };
  },

  getBranchLength : function(m) {

    if(!this.state.tree) {
      return '';
    }

    return d3.format(".4f")(this.state.tree.get_node_by_name(m).attribute);
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

    if(!annotations) {
      return '';
    }

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

  getBranchRows : function(tree, test_results, annotations) {

    var self = this;

    var table_row_data = [],
        omega_format = d3.format(".3r"),
        prop_format = d3.format(".2p");

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

      return a[3] - b[3];

    });

    return table_row_data;

  },

  setEvents : function() {

    var self = this;

    if(self.state.annotations) {
      var branch_table = d3.select('#table-branch-table').selectAll("tr");

      branch_table.on("click", function(d) {
        var label = d[0];
        self.setState({
                        current_model_name : label, 
                        current_omegas : self.state.annotations[label]["omegas"]
                      });
      });
    }

  },

  createDistroChart : function() {

    var self = this;

    this.settings = {
      dimensions : { width : 600, height : 400 },
      margins : { 'left': 50, 'right': 15, 'bottom': 35, 'top': 35 },
      has_zeros : true,
      legend_id : null,
      do_log_plot : true,
      k_p : null,
      plot : null,
      svg_id : "prop-chart"
    };

  },

  getBranchColumns : function(table_row_data) {

    if(table_row_data.length <= 0) {
      return null;
    }

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

  componentWillReceiveProps: function(nextProps) {

    var table_row_data = this.getBranchRows(nextProps.tree, 
                                            nextProps.test_results, 
                                            nextProps.annotations),
        table_columns = this.getBranchColumns(table_row_data),
        initial_model_name = _.take(_.keys(nextProps.annotations)),
        initial_omegas = nextProps.annotations ? 
                         nextProps.annotations[initial_model_name]["omegas"] : 
                         null;

    var distro_settings = {
      dimensions : { width : 600, height : 400 },
      margins : { 'left': 50, 'right': 15, 'bottom': 35, 'top': 35 },
      legend: false,
      domain : [0.00001, 10],
      do_log_plot : true,
      k_p : null,
      plot : null,
      svg_id : "prop-chart"
    };

    if(nextProps.test_results && nextProps.annotations) {
      this.setState({ 
               tree : nextProps.tree,
               test_results : nextProps.test_results,
               annotations : nextProps.annotations,
               table_row_data : table_row_data, 
               table_columns : table_columns,
               current_model_name : initial_model_name,
               current_omegas : initial_omegas,
               distro_settings : distro_settings
             });
    }

  },

  componentDidUpdate : function() {

    var branch_columns = d3.select('#table-branch-header');
    branch_columns = branch_columns.selectAll("th").data(this.state.table_columns);
    branch_columns.enter().append("th");

    branch_columns.html(function(d) {
        return d;
    });

    var branch_rows = d3.select('#table-branch-table').selectAll("tr").data(this.state.table_row_data);

    branch_rows.enter().append('tr');
    branch_rows.exit().remove();
    branch_rows.style('font-weight', function(d) {
        return d[3] <= 0.05 ? 'bold' : 'normal';
    });

    branch_rows = branch_rows.selectAll("td").data(function(d) {
        return d;
    });
    branch_rows.enter().append("td");
    branch_rows.html(function(d) {
        return d;
    });

    this.createDistroChart();
    this.setEvents();

  },

  render: function() {

    var self = this;

    return (
        <div className="row">
          <div id="hyphy-branch-table" className="col-md-7">
              <table className="table table-hover table-condensed">
                  <thead id="table-branch-header"></thead>
                  <tbody id="table-branch-table"></tbody>
              </table>
          </div>

          <div id='primary-omega-tag' className="col-md-5">
            <PropChart name={self.state.current_model_name} omegas={self.state.current_omegas} 
             settings={self.state.distro_settings} />
          </div>
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

