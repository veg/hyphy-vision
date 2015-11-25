// TODO : Write documentation
var Tree = React.createClass({

  getInitialState: function() {
    //return { table_row_data: this.getModelRows() };
    return null;
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

  initialize : function() {

    var tree = d3.layout.phylotree("body")
        .size([height, width])
        .separation(function(a, b) {
            return 0;
        });

    set_handlers      ();
    set_tree_handlers (tree);

    var svg = d3.select("#tree_container").append("svg")
        .attr("width", width)
        .attr("height", height);

    var scaling_exponent = 0.33;

    function set_handlers() {
    
        $("#datamonkey-relax-error-hide").on("click", function(e) {
            d3.select("#datamonkey-relax-error").style("display", "none");
            e.preventDefault();
        });

        $("#datamonkey-relax-load-json").on("change", function(e) {
            // FileList object
            var files = e.target.files; 

            if (files.length == 1) {
                var f = files[0];
                var reader = new FileReader();

                reader.onload = (function(theFile) {
                    return function(e) {
                        analysis_data = JSON.parse(e.target.result);
                        render(analysis_data);
                    };

                })(f);

                reader.readAsText(f);
            }

            e.preventDefault();
        });
        
        $(".datamonkey-relax-tree-trigger").on("click", function(e) {
            render_tree();
        });

        $(".tree-tab-btn").on('click', function(e) {
          tree.placenodes().update();
        });

    }


    function default_tree_settings() {
        tree.branch_name(null);
        tree.node_span('equal');
        tree.options({
            'draw-size-bubbles': false,
            'selectable': false,
            'left-right-spacing': 'fit-to-size'
        }, false);
        tree.font_size(18);
        tree.scale_bar_font_size(14);
        tree.node_circle_size(0);
        tree.branch_length(function(n) {
            if (branch_lengths) {
                return branch_lengths[n.name] || 0;
            }
            return undefined;
        });
        tree.style_edges(edge_colorizer);
        tree.style_nodes(node_colorizer);
        tree.spacing_x(30, true);
    }


    render_color_scheme = function(svg_container, attr_name, do_not_render) {
        var svg = d3.select("#" + svg_container).selectAll("svg").data([omega_color.domain()]);
        svg.enter().append("svg");
        svg.selectAll("*").remove();

        if (branch_annotations && !do_not_render) {
            var bar_width = 70,
                bar_height = 300,
                margins = {
                    'bottom': 30,
                    'top': 15,
                    'left': 40,
                    'right': 2
                };

            svg.attr("width", bar_width)
                .attr("height", bar_height);



            this_grad = svg.append("defs").append("linearGradient")
                .attr("id", "_omega_bar")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");

            var omega_scale = d3.scale.pow().exponent(scaling_exponent)
                .domain(d3.extent(omega_color.domain()))
                .range([0, 1]),
                axis_scale = d3.scale.pow().exponent(scaling_exponent)
                .domain(d3.extent(omega_color.domain()))
                .range([0, bar_height - margins['top'] - margins['bottom']]);


            omega_color.domain().forEach(function(d) {
                this_grad.append("stop")
                    .attr("offset", "" + omega_scale(d) * 100 + "%")
                    .style("stop-color", omega_color(d));
            });

            var g_container = svg.append("g").attr("transform", "translate(" + margins["left"] + "," + margins["top"] + ")");

            g_container.append("rect").attr("x", 0)
                .attr("width", bar_width - margins['left'] - margins['right'])
                .attr("y", 0)
                .attr("height", bar_height - margins['top'] - margins['bottom'])
                .style("fill", "url(#_omega_bar)");


            var draw_omega_bar = d3.svg.axis().scale(axis_scale)
                .orient("left")
                .tickFormat(d3.format(".1r"))
                .tickValues([0, 0.01, 0.1, 0.5, 1, 2, 5, 10]);

            var scale_bar = g_container.append("g");
            scale_bar.style("font-size", "14")
                .attr("class", "hyphy-omega-bar")
                .call(draw_omega_bar);

            scale_bar.selectAll("text")
                .style("text-anchor", "right");

            var x_label = _label = scale_bar.append("g").attr("class", "hyphy-omega-bar");
            x_label = x_label.selectAll("text").data([attr_name]);
            x_label.enter().append("text");
            x_label.text(function(d) {
                return $('<textarea />').html(d).text();
            })
                .attr("transform", "translate(" + (bar_width - margins['left'] - margins['right']) * 0.5 + "," + (bar_height - margins['bottom']) + ")")
                .style("text-anchor", "middle")
                .style("font-size", "18")
                .attr("dx", "0.0em")
                .attr("dy", "0.1em");
        }
    }


    render_tree = function(skip_render) {

        if (!settings['suppress-tree-render']) {

            var do_layout = false;

            for (var k in settings["tree-options"]) {
                var controller = d3.select("#" + k),
                    controller_value = (controller.attr("value") || controller.property("checked"));
                    
                if (controller_value != settings["tree-options"][k][0]) {
                    settings["tree-options"][k][0] = controller_value;
                    do_layout = do_layout || settings["tree-options"][k][1];
                }
            }
            

            var which_model = settings["tree-options"]["datamonkey-relax-tree-model"][0];
            
            branch_lengths     = settings["tree-options"]["datamonkey-relax-tree-branch-lengths"][0] ? analysis_data["fits"][which_model]["branch-lengths"] : null;
            branch_annotations = analysis_data["fits"][which_model]["branch-annotations"];
            
 
            partition = (settings["tree-options"]["datamonkey-relax-tree-highlight"] ? analysis_data["partition"][settings["tree-options"]["datamonkey-relax-tree-highlight"][0]] : null) || null;


            omega_color = d3.scale.pow().exponent(scaling_exponent)
                .domain([0, 0.25, 1, 5, 10])
                .range(settings["tree-options"]["datamonkey-relax-tree-fill-color"][0] ? ["#5e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"] : ["#DDDDDD", "#AAAAAA", "#888888", "#444444", "#000000"])
                .clamp(true);


            render_color_scheme("color_legend", analysis_data["fits"][which_model]["annotation-tag"], !(settings["tree-options"]["datamonkey-relax-tree-fill-legend"][0]));

            if (!skip_render) {
                if (do_layout) {
                    tree.update_layout();
                }
                d3_phylotree_trigger_refresh (tree);
            }

        }
    }

  },

  edgeColorizer : function(element, data) {

    if (branch_annotations) {
        element.style('stroke', omega_color(branch_annotations[data.target.name]) || null);
        $(element[0][0]).tooltip('destroy');
        $(element[0][0]).tooltip({
            'title': omega_format(branch_annotations[data.target.name]),
            'html': true,
            'trigger': 'hover',
            'container': 'body',
            'placement': 'auto'
        })
    } else {
        element.style('stroke', null);
        $(element[0][0]).tooltip('destroy');
    }


    element.style('stroke-width', (partition && partition[data.target.name]) ? '8' : '4')
        .style('stroke-linejoin', 'round')
        .style('stroke-linecap', 'round');

  },

  nodeColorizer : function(element, data) {
    if (partition) { 
        element.style('opacity', (partition && partition[data.name]) ? '1' : '0.25');
    } else {
        element.style('opacity', '1');        
    }
  },

  oldrender : function() {

    settings['suppress-tree-render'] = true;

    var def_displayed = false;

    var model_list = d3.select("#datamonkey-relax-tree-model-list").selectAll("li").data(d3.keys(json["fits"]).map(function(d) {
        return [d];
    }).sort());
    model_list.enter().append("li");
    model_list.exit().remove();
    model_list = model_list.selectAll("a").data(function(d) {
        return d;
    });
    model_list.enter().append("a");
    model_list.attr("href", "#").on("click", function(d, i) {
        d3.select("#datamonkey-relax-tree-model").attr("value", d);
        render_tree();
    });
    model_list.text(function(d) {
        if (d == "General Descriptive") {
            def_displayed = true;
            this.click();
        }
        if (!def_displayed && d == "Alternative") {
            def_displayed = true;
            this.click();
        }
        if (!def_displayed && d == "Partitioned MG94xREV") {
            def_displayed = true;
            this.click();
        }

        return d;
    });



    var partition_list = d3.select("#datamonkey-relax-tree-highlight-branches").selectAll("li").data([
        ['None']
    ].concat(d3.keys(json["partition"]).map(function(d) {
        return [d];
    }).sort()));
    partition_list.enter().append("li");
    partition_list.exit().remove();
    partition_list = partition_list.selectAll("a").data(function(d) {
        return d;
    });
    partition_list.enter().append("a");
    partition_list.attr("href", "#").on("click", function(d, i) {
        d3.select("#datamonkey-relax-tree-highlight").attr("value", d);
        render_tree();
    });
    partition_list.text(function(d) {
        if (d == "RELAX.test") {
            this.click();
        }
        return d;
    });

    settings['suppress-tree-render'] = false;
    render_tree(true);
    default_tree_settings();
    tree(analysis_data["tree"]).svg(svg);
    tree.layout();

  },

  componentDidMount: function() {
  },

  render: function() {
    return (
        <div>
          <div className='row'>
              <div className="cold-md-12">
                  <div className="input-group input-group-sm">
                      <div className="input-group-btn">
                          <button id="export-phylo-png" type="button" className="btn btn-default btn-sm" data-direction="vertical" data-amount="1" title="Expand vertical spacing">
                              <i className="fa fa-image"></i>
                          </button>
                          <button type="button" className="btn btn-default btn-sm" data-direction="vertical" data-amount="1" title="Expand vertical spacing">
                              <i className="fa fa-arrows-v"></i>
                          </button>
                          <button type="button" className="btn btn-default btn-sm" data-direction="vertical" data-amount="-1" title="Compress vertical spacing">
                              <i className="fa  fa-compress fa-rotate-135"></i>
                          </button>
                          <button type="button" className="btn btn-default btn-sm" data-direction="horizontal" data-amount="1" title="Expand horizonal spacing">
                              <i className="fa fa-arrows-h"></i>
                          </button>
                          <button type="button" className="btn btn-default btn-sm" data-direction="horizontal" data-amount="-1" title="Compress horizonal spacing">
                              <i className="fa  fa-compress fa-rotate-45"></i>
                          </button>
                          <button type="button" className="btn btn-default btn-sm" id="sort_ascending" title="Sort deepest clades to the bototm">
                              <i className="fa fa-sort-amount-asc"></i>
                          </button>
                          <button type="button" className="btn btn-default btn-sm" id="sort_descending" title="Sort deepsest clades to the top">
                              <i className="fa fa-sort-amount-desc"></i>
                          </button>
                          <button type="button" className="btn btn-default btn-sm" id="sort_original" title="Restore original order">
                              <i className="fa fa-sort"></i>
                          </button>
                      </div>
                      <div className="input-group-btn" data-toggle="buttons">
                          <label className="btn btn-default active btn-sm">
                              <input type="radio" name="options" className="phylotree-layout-mode" data-mode="linear" autocomplete="off" checked="" title="Layout left-to-right"></input>Linear
                          </label>
                          <label className="btn btn-default  btn-sm">
                              <input type="radio" name="options" className="phylotree-layout-mode" data-mode="radial" autocomplete="off" title="Layout radially"></input> Radial
                          </label>
                      </div>
                      <div className="input-group-btn" data-toggle="buttons">
                        <label className="btn btn-default active btn-sm">
                          <input type="radio" className="phylotree-align-toggler" data-align="left" name="options-align" autocomplete="off" checked="" title="Align tips labels to branches"></input> 
                              <i className="fa fa-align-left"></i>
                        </label>
                        <label className="btn btn-default btn-sm">
                         <input type="radio" className="phylotree-align-toggler" data-align="right" name="options-align" autocomplete="off" title="Align tips labels to the edge of the plot"></input> 
                              <i className="fa fa-align-right"></i>
                        </label>
                      </div>
      
                      <div className="input-group-btn">
                          <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">Model
                              <span className="caret"></span></button>
                          <ul className="dropdown-menu" id="datamonkey-relax-tree-model-list">
                          </ul>
                      </div>

                      <input type="text" className="form-control disabled" id="datamonkey-relax-tree-model" disabled></input>

                      <div className="input-group-btn">
                          <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">Highlight branch set
                              <span className="caret"></span></button>
                          <ul className="dropdown-menu" id="datamonkey-relax-tree-highlight-branches">
                          </ul>
                      </div>

                      <input type="text" className="form-control disabled" id="datamonkey-relax-tree-highlight" disabled></input>

                      <span className="input-group-addon">
                                  Use model branch lengths
                                  <input type="checkbox" id="datamonkey-relax-tree-branch-lengths" checked className = "datamonkey-relax-tree-trigger"></input>
                                </span>
                      <span className="input-group-addon">
                                  Show fill legend
                                  <input type="checkbox" id="datamonkey-relax-tree-fill-legend" checked className = "datamonkey-relax-tree-trigger"></input>
                                </span>
                      <span className="input-group-addon">
                                  Use color
                                  <input type="checkbox" id="datamonkey-relax-tree-fill-color" checked className = "datamonkey-relax-tree-trigger"></input>
                                </span>
                  </div>
              </div>
          </div>

          <div className="row">
              <div className="col-md-1">
                  <div className="row">
                      <div id="color_legend"></div>
                  </div>
              </div>
              <div className="col-md-11">
                  <div className="row">
                      <div id="tree_container" className="tree-widget"></div>
                  </div>
              </div>
          </div>
        </div>

      )
  }

});

// Will need to make a call to this
// omega distributions
function render_tree(json) {

  var settings = {
      'omegaPlot': {},
      'tree-options': {
          /* value arrays have the following meaning
              [0] - the value of the attribute
              [1] - does the change in attribute value trigger tree re-layout?
          */
          'datamonkey-relax-tree-model': [null, true],
          'datamonkey-relax-tree-highlight': [null, false],
          'datamonkey-relax-tree-branch-lengths': [true, true],
          'datamonkey-relax-tree-fill-legend': [true, false],
          'datamonkey-relax-tree-fill-color': [true, false]
      },
      'suppress-tree-render': false,
      'chart-append-html' : true
  };

  React.render(
    <Tree json={json} settings={settings} />,
    document.getElementById("tree-tab")
  );

}
