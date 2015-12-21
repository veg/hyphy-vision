// TODO: Write documentation
var ModelFits = React.createClass({

  getInitialState: function() {
    return { table_row_data: this.getModelRows() };
  },

  format_run_time : function(seconds) {
      var duration_string = "";
      seconds = parseFloat(seconds);
      var split_array = [Math.floor(seconds / (24 * 3600)), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60],
          quals = ["d.", "hrs.", "min.", "sec."];

      split_array.forEach(function(d, i) {
          if (d) {
              duration_string += " " + d + " " + quals[i];
          }
      });

      return duration_string;
  },

  getModelRows : function() {

    var json = this.props.json;
    var table_row_data = [];
    var omega_distributions = {};
    var fit_format = d3.format(".2f");
    var omega_format = d3.format(".3r");
    var prop_format = d3.format(".2p");
    var p_value_format = d3.format(".4f");

    for (var m in json["fits"]) {

        var this_model_row = [],
            this_model = json["fits"][m];

        this_model_row = [
            this_model['display-order'],
            "",
            m,
            fit_format(this_model['log-likelihood']),
            this_model['parameters'],
            fit_format(this_model['AIC-c']),
            this.format_run_time(this_model['runtime']),
            fit_format(d3.values(this_model["branch-lengths"]).reduce(function(p, c) {
                return p + c;
            }, 0))
        ];

        omega_distributions[m] = {};
        var distributions = [];

        for (var d in this_model["rate-distributions"]) {
            var this_distro = this_model["rate-distributions"][d];
            var this_distro_entry = [d, "", "", ""];

            omega_distributions[m][d] = this_distro.map(function(d) {
                return {
                    'omega': d[0],
                    'weight': d[1]
                };
            });

            for (var k = 0; k < this_distro.length; k++) {
                this_distro_entry[k + 1] = (omega_format(this_distro[k][0]) + " (" + prop_format(this_distro[k][1]) + ")");
            }

            distributions.push(this_distro_entry);
        }

        distributions.sort(function(a, b) {
            return a[0] < b[0] ? -1 : (a[0] == b[0] ? 0 : 1);
        });

        this_model_row = this_model_row.concat(distributions[0]);
        this_model_row[1] = distributions[0][0];
        table_row_data.push(this_model_row);

        for (var d = 1; d < distributions.length; d++) {
            var this_distro_entry = this_model_row.map(function(d, i) {
                if (i) return "";
                return d;
            });
            this_distro_entry[1] = distributions[d][0];
            for (var k = this_distro_entry.length - 4; k < this_distro_entry.length; k++) {
                this_distro_entry[k] = distributions[d][k - this_distro_entry.length + 4];
            }
            table_row_data.push(this_distro_entry);
        }

    }

    table_row_data.sort(function(a, b) {
        if (a[0] == b[0]) {
            return a[1] < b[1] ? -1 : (a[1] == b[1] ? 0 : 1);
        }
        return a[0] - b[0];
    });

    table_row_data = table_row_data.map(function(r) {
        return r.slice(2);
    });

    return table_row_data;

  },

  componentDidMount: function() {
    model_rows = d3.select('#summary-model-table').selectAll("tr").data(this.state.table_row_data);
    model_rows.enter().append('tr');
    model_rows.exit().remove();
    model_rows = model_rows.selectAll("td").data(function(d) {
        return d;
    });
    model_rows.enter().append("td");
    model_rows.html(function(d) {
        return d;
    });
  },

  render: function() {

    return (
        <div className="col-lg-12">
          <ul className="list-group">
            <li className="list-group-item">
              <h4 className="list-group-item-heading"><i className="fa fa-cubes" styleFormat = 'margin-right: 10px'></i>Model fits</h4>
               <table className="table table-hover table-condensed list-group-item-text" styleFormat ="margin-top:0.5em;">
                  <thead>
                      <tr id='summary-model-header1'>
                        <th>Model</th>
                        <th><em> log </em>L</th>
                        <th><abbr title="Number of estimated model parameters"># par.</abbr></th>
                        <th><abbr title="Small Sample AIC">AIC<sub>c</sub></abbr></th>
                        <th>Time to fit</th>
                        <th><abbr title="Total tree length, expected substitutions/site">L<sub>tree</sub></abbr></th>
                        <th>Branch set</th>
                        <th>&omega;<sub>1</sub></th>
                        <th>&omega;<sub>2</sub></th>
                        <th>&omega;<sub>3</sub></th>
                      </tr>
                  </thead>
                  <tbody id='summary-model-table'></tbody>
               </table>
            </li>
          </ul>
        </div>
      )
  }

});

// Will need to make a call to this
// omega distributions
function render_model_fits(json) {
  React.render(
    <ModelFits json={json} />,
    document.getElementById("hyphy-model-fits")
  );
}

// Will need to make a call to this
// omega distributions
function rerender_model_fits(json) {
  $("#hyphy-model-fits").empty();
  render_model_fits(json);

}

