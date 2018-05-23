var React = require("react");

var ModelFits = React.createClass({
  getInitialState: function() {
    var table_row_data = this.getModelRows(this.props.json),
      table_columns = this.getModelColumns(table_row_data);

    return {
      table_row_data: table_row_data,
      table_columns: table_columns
    };
  },

  formatRuntime: function(seconds) {
    var duration_string = "",
      seconds = parseFloat(seconds);

    var split_array = [
        Math.floor(seconds / (24 * 3600)),
        Math.floor(seconds / 3600) % 24,
        Math.floor(seconds / 60) % 60,
        seconds % 60
      ],
      quals = ["d.", "hrs.", "min.", "sec."];

    split_array.forEach(function(d, i) {
      if (d) {
        duration_string += " " + d + " " + quals[i];
      }
    });

    return duration_string;
  },

  getLogLikelihood: function(this_model) {
    return d3.format(".2f")(this_model["log-likelihood"]);
  },

  getAIC: function(this_model) {
    return d3.format(".2f")(this_model["AIC-c"]);
  },

  getNumParameters: function(this_model) {
    return this_model["parameters"];
  },

  getBranchLengths: function(this_model) {
    if (this_model["tree length"]) {
      return d3.format(".2f")(this_model["tree length"]);
    } else {
      return d3.format(".2f")(
        d3.values(this_model["branch-lengths"]).reduce(function(p, c) {
          return p + c;
        }, 0)
      );
    }
  },

  getRuntime: function(this_model) {
    //return this.formatRuntime(this_model['runtime']);
    return this.formatRuntime(this_model["runtime"]);
  },

  getDistributions: function(m, this_model) {
    var omega_distributions = {};
    omega_distributions[m] = {};

    var omega_format = d3.format(".3r"),
      prop_format = d3.format(".2p");

    var distributions = [];

    for (var d in this_model["rate-distributions"]) {
      var this_distro = this_model["rate-distributions"][d];
      var this_distro_entry = [d, "", "", ""];

      omega_distributions[m][d] = this_distro.map(function(d) {
        return {
          omega: d[0],
          weight: d[1]
        };
      });

      for (var k = 0; k < this_distro.length; k++) {
        this_distro_entry[k + 1] =
          omega_format(this_distro[k][0]) +
          " (" +
          prop_format(this_distro[k][1]) +
          ")";
      }

      distributions.push(this_distro_entry);
    }

    distributions.sort(function(a, b) {
      return a[0] < b[0] ? -1 : a[0] == b[0] ? 0 : 1;
    });

    return distributions;
  },

  getModelRows: function(json) {
    if (!json) {
      return [];
    }

    var table_row_data = [];

    for (var m in json["fits"]) {
      var this_model_row = [],
        this_model = json["fits"][m];

      this_model_row = [
        this_model["display-order"],
        "",
        m,
        this.getLogLikelihood(this_model),
        this.getNumParameters(this_model),
        this.getAIC(this_model),
        this.getRuntime(this_model),
        this.getBranchLengths(this_model)
      ];

      var distributions = this.getDistributions(m, this_model);

      if (distributions.length) {
        this_model_row = this_model_row.concat(distributions[0]);
        this_model_row[1] = distributions[0][0];

        table_row_data.push(this_model_row);

        for (var d = 1; d < distributions.length; d++) {
          var this_distro_entry = this_model_row.map(function(d, i) {
            if (i) return "";
            return d;
          });

          this_distro_entry[1] = distributions[d][0];

          for (
            var k = this_distro_entry.length - 4;
            k < this_distro_entry.length;
            k++
          ) {
            this_distro_entry[k] =
              distributions[d][k - this_distro_entry.length + 4];
          }

          table_row_data.push(this_distro_entry);
        }
      } else {
        table_row_data.push(this_model_row);
      }
    }

    table_row_data.sort(function(a, b) {
      if (a[0] == b[0]) {
        return a[1] < b[1] ? -1 : a[1] == b[1] ? 0 : 1;
      }
      return a[0] - b[0];
    });

    table_row_data = table_row_data.map(function(r) {
      return r.slice(2);
    });

    return table_row_data;
  },

  getModelColumns: function(table_row_data) {
    var model_header = "<th>Model</th>",
      logl_header = "<th><em> log </em>L</th>",
      num_params_header = "<th># par.</th>",
      aic_header = "<th>AIC<sub>c</sub></abbr></th>",
      runtime_header = "<th>Time to fit</th>",
      branch_lengths_header = "<th>L<sub>tree</sub></abbr></th>",
      branch_set_header = "<th>Branch set</th>",
      omega_1_header = "<th>&omega;<sub>1</sub></th>",
      omega_2_header = "<th>&omega;<sub>2</sub></th>",
      omega_3_header = "<th>&omega;<sub>3</sub></th>";

    // inspect table_row_data and return header
    var all_columns = [
      model_header,
      logl_header,
      num_params_header,
      aic_header,
      runtime_header,
      branch_lengths_header,
      branch_set_header,
      omega_1_header,
      omega_2_header,
      omega_3_header
    ];

    // validate each table row with its associated header
    if (table_row_data.length == 0) {
      return [];
    }

    // trim columns to length of table_row_data
    var column_headers = _.take(all_columns, table_row_data[0].length);

    return column_headers;
  },

  componentDidUpdate: function() {
    var model_columns = d3.select("#summary-model-header1");
    model_columns = model_columns
      .selectAll("th")
      .data(this.state.table_columns);
    model_columns.enter().append("th");
    model_columns.html(function(d) {
      return d;
    });

    var model_rows = d3
      .select("#summary-model-table")
      .selectAll("tr")
      .data(this.state.table_row_data);
    model_rows.enter().append("tr");
    model_rows.exit().remove();
    model_rows = model_rows.selectAll("td").data(function(d) {
      return d;
    });
    model_rows.enter().append("td");
    model_rows.html(function(d) {
      return d;
    });
  },

  componentWillReceiveProps: function(nextProps) {
    var table_row_data = this.getModelRows(nextProps.json),
      table_columns = this.getModelColumns(table_row_data);

    this.setState({
      table_row_data: table_row_data,
      table_columns: table_columns
    });
  },

  render: function() {
    return (
      <div>
        <h4 className="dm-table-header">
          Model fits
          <span
            className="glyphicon glyphicon-info-sign"
            style={{
              verticalAlign: "middle",
              float: "right",
              minHeight: "30px",
              minWidth: "30px"
            }}
            aria-hidden="true"
            data-toggle="popover"
            data-trigger="hover"
            title="Actions"
            data-html="true"
            data-content="<ul><li>Hover over a column header for a description of its content.</li></ul>"
            data-placement="bottom"
          />
        </h4>
        <table
          className="dm-table table table-hover table-smm list-group-item-text"
          style={{ marginTop: "0.5em" }}
        >
          <thead id="summary-model-header1" />
          <tbody id="summary-model-table" />
        </table>
      </div>
    );
  }
});

// Will need to make a call to this
// omega distributions
function render_model_fits(json, element) {
  React.render(<ModelFits json={json} />, $(element)[0]);
}

// Will need to make a call to this
// omega distributions
function rerender_model_fits(json, element) {
  $(element).empty();
  render_model_fits(json, element);
}

module.exports.ModelFits = ModelFits;
module.exports.render_model_fits = render_model_fits;
module.exports.rerender_model_fits = rerender_model_fits;
