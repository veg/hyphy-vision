var BSREL = React.createClass({

  float_format : d3.format(".2f"),

  loadFromServer : function() {

    var self = this;
    d3.json(this.props.url, function(data) {

      data["fits"]["MG94"]["branch-annotations"] = self.formatBranchAnnotations(data, "MG94");
      data["fits"]["Full model"]["branch-annotations"] = self.formatBranchAnnotations(data, "Full model");

      var annotations = data["fits"]["Full model"]["branch-annotations"],
          json = data,
          pmid = data["PMID"],
          test_results = data["test results"];

      self.setState({
                      annotations : annotations,
                      json : json,
                      pmid : pmid,
                      test_results : test_results
                    });

    });

  },

  getDefaultProps: function() {

    var edgeColorizer = function (element, data) {

        var self = this;

        var svg = d3.select("#tree_container svg"),
            svg_defs = d3.select(".phylotree-definitions");

        if (svg_defs.empty()) {
          svg_defs = svg.append("defs")
                      .attr("class", "phylotree-definitions")
        }

        // clear existing linearGradients

        var scaling_exponent = 1./3,
            omega_format = d3.format(".3r"),
            prop_format = d3.format(".2p"),
            fit_format = d3.format(".2f"),
            p_value_format = d3.format(".4f");

        self.omega_color = d3.scale.pow().exponent(scaling_exponent)
            .domain([0, 0.25, 1, 5, 10])
            .range(
              self.options()["color-fill"]
                ? ["#DDDDDD", "#AAAAAA", "#888888", "#444444", "#000000"]
                : ["#6e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"])
            .clamp(true);


        var createBranchGradient = function(node) {

            function generateGradient(svg_defs, grad_id, annotations, already_cumulative) {

                var current_weight = 0;
                var this_grad = svg_defs.append("linearGradient")
                    .attr("id", grad_id);

                annotations.forEach(function(d, i) {

                    if (d.prop) {
                        var new_weight = current_weight + d.prop;
                        this_grad.append("stop")
                            .attr("offset", "" + current_weight * 100 + "%")
                            .style("stop-color", self.omega_color(d.omega));
                        this_grad.append("stop")
                            .attr("offset", "" + new_weight * 100 + "%")
                            .style("stop-color", self.omega_color(d.omega));
                        current_weight = new_weight;
                    }
                });
            }

            // Create svg definitions
            if(self.gradient_count == undefined) {
              self.gradient_count = 0;
            }

            if(node.annotations) {

              if (node.annotations.length == 1) {
                node['color'] = self.omega_color(node.annotations[0]["omega"]);
              } else {
                self.gradient_count++;
                var grad_id = "branch_gradient_" + self.gradient_count;
                generateGradient(svg_defs, grad_id, node.annotations.omegas);
                node['grad'] = grad_id;
              }

            }
        }

        var annotations = data.target.annotations,
            alpha_level = 0.05,
            tooltip = "<b>" + data.target.name + "</b>",
            reference_omega_weight =  prop_format(0),
            distro = '';

        if (annotations) {

            reference_omega_weight = annotations.omegas[0].prop;

            annotations.omegas.forEach(function(d, i) {

                var omega_value = d.omega > 1e20 ? "&infin;" : omega_format(d.omega),
                    omega_weight = prop_format(d.prop);

                tooltip += "<br/>&omega;<sub>" + (i + 1) + "</sub> = " + omega_value +
                    " (" + omega_weight + ")";

                if (i) {
                  distro += "<br/>";
                }

                distro += "&omega;<sub>" + (i + 1) + "</sub> = " + omega_value +
                    " (" + omega_weight + ")";


            });

            tooltip += "<br/><i>p = " + omega_format(annotations["p"]) + "</i>";

            $(element[0][0]).tooltip({
                'title': tooltip,
                'html': true,
                'trigger': 'hover',
                'container': 'body',
                'placement': 'auto'
            });

            createBranchGradient(data.target);

            if(data.target.grad) {
              element.style('stroke', 'url(#' + data.target.grad + ')');
            } else {
              element.style('stroke', data.target.color);
            }

            element.style('stroke-width', annotations["p"] <= alpha_level ? '12' : '5')
                .style('stroke-linejoin', 'round')
                .style('stroke-linecap', 'round');

      }

    };

    return {
      edgeColorizer : edgeColorizer
    };

  },

  getInitialState: function() {

    var tree_settings = {
        'omegaPlot': {},
        'tree-options': {
            /* value arrays have the following meaning
                [0] - the value of the attribute
                [1] - does the change in attribute value trigger tree re-layout?
            */
            'hyphy-tree-model': ['Full model', true],
            'hyphy-tree-highlight': [null, false],
            'hyphy-tree-branch-lengths': [true, true],
            'hyphy-tree-hide-legend': [false, true],
            'hyphy-tree-fill-color': [false, true]
        },
        'suppress-tree-render': false,
        'chart-append-html' : true,
        'edgeColorizer' : this.props.edgeColorizer
    };



    return {
              annotations : null,
              json : null,
              pmid : null,
              settings : tree_settings,
              test_results : null,
              tree : null,
           };

  },

  componentWillMount: function() {
    this.loadFromServer();
    this.setEvents();
  },

  setEvents : function() {

    var self = this;

    $("#datamonkey-absrel-json-file").on("change", function(e) {
        var files = e.target.files; // FileList object

        if (files.length == 1) {
            var f = files[0];
            var reader = new FileReader();

            reader.onload = (function(theFile) {
                return function(e) {
                  var data = JSON.parse(this.result);
                  data["fits"]["MG94"]["branch-annotations"] = self.formatBranchAnnotations(data, "MG94");
                  data["fits"]["Full model"]["branch-annotations"] = self.formatBranchAnnotations(data, "Full model");

                  var annotations = data["fits"]["Full model"]["branch-annotations"],
                      json = data,
                      pmid = data["PMID"],
                      test_results = data["test results"];

                  self.setState({
                                  annotations : annotations,
                                  json : json,
                                  pmid : pmid,
                                  test_results : test_results
                                });

                };
            })(f);
            reader.readAsText(f);
        }

        $("#datamonkey-absrel-toggle-here").dropdown("toggle");
        e.preventDefault();
    });


  },

  formatBranchAnnotations : function(json, key) {

    var initial_branch_annotations = json["fits"][key]["branch-annotations"];

    if(!initial_branch_annotations) {
      initial_branch_annotations = json["fits"][key]["rate distributions"];
    }

    // Iterate over objects
    branch_annotations = _.mapObject(initial_branch_annotations, function(val, key) {

      var vals = [];
        try {
          vals = JSON.parse(val);
        } catch (e) {
          vals = val;
        }

      var omegas = {"omegas" : _.map(vals, function(d) { return _.object(["omega","prop"], d)})};
      var test_results = _.clone(json["test results"][key]);
      _.extend(test_results, omegas);
      return test_results;

    });

    return branch_annotations;

  },

  initialize : function() {

    var model_fits_id = "#hyphy-model-fits",
        omega_plots_id = "#hyphy-omega-plots",
        summary_id = "#hyphy-relax-summary",
        tree_id = "#tree-tab";

  },

  render: function() {

    var self = this;

    return (
        <div className="tab-content">
            <div className="tab-pane active" id="summary-tab">

                <div className="row">
                  <div id="summary-div" className="col-md-12">
                    <BSRELSummary test_results={self.state.test_results}
                                  pmid={self.state.pmid} />
                  </div>
                </div>

                <div className="row">
                    <div id="hyphy-tree-summary" className="col-md-6">
                      <TreeSummary json={self.state.json} />
                    </div>
                    <div id="hyphy-model-fits" className="col-md-6">
                      <ModelFits json={self.state.json} />
                    </div>
                </div>
            </div>

            <div className='tab-pane' id="tree-tab">
              <Tree json={self.state.json}
                    settings={self.state.settings} />
            </div>

            <div className='tab-pane' id="table_tab">
              <BranchTable tree={self.state.tree}
                           test_results={self.state.test_results}
                           annotations={self.state.annotations} />
            </div>

        </div>
        )
  }

});



// Will need to make a call to this
// omega distributions
function render_absrel(url, element) {
  React.render(
    <BSREL url={url} />,
    document.getElementById(element)
  );
}
