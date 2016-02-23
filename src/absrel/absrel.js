//if (!datamonkey) {
//    var datamonkey = new Object;
//}

//datamonkey.absrel = function() {

//    //var width = 800, //$(container_id).width(),
//    //    height = 600, //$(container_id).height()
//    //    color_scheme = d3.scale.category10(),
//    //    branch_omegas = {},
//    //    branch_p_values = {},
//    //    alpha_level = 0.05,
//    //    omega_format = d3.format(".3r"),
//    //    prop_format = d3.format(".2p"),
//    //    fit_format = d3.format(".2f"),
//    //    branch_table_format = d3.format(".4f"),
//    //    render_color_bar = true,
//    //    which_model = "Full model",
//    //    color_legend_id = 'color_legend',
//    //    self = this,
//    //    container_id = 'tree_container';


//    self.tree = d3.layout.phylotree("body")
//        .size([height, width])
//        .separation(function(a, b) {
//            return 0;
//        });

//    tree = self.tree;

//    self.analysis_data = null;

//    self.svg = d3.select("#" + container_id).append("svg").attr("width", width)
//        .attr("height", height);

//    var scaling_exponent = 0.33;

//    var omega_color = d3.scale.pow().exponent(scaling_exponent)
//        .domain([0, 0.25, 1, 5, 10])
//        .range(["#5e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"])
//        .clamp(true);


//    // *** PHYLOTREE HANDLERS ***

//    set_tree_handlers(self.tree);


//    $("#datamonkey-absrel-color-or-grey").on("click", function(e) {
//        if ($(self).data('color-mode') == 'gray') {
//            $(self).data('color-mode', 'color');
//            omega_color.range(["#5e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"]);
//        } else {
//            $(self).data('color-mode', 'gray');
//            omega_color.range(["#EEE", "#BBB", "#999", "#333", "#000"]);
//        }
//        branch_omegas = render_bs_rel_tree(self.analysis_data, which_model)[1];
//        self.tree.update();
//        render_color_scheme(color_legend_id);
//    });

//    $(".tree-tab-btn").on('click', function(e) {
//      //self.tree.placenodes().update();
//    });

//    $("#datamonkey-absrel-show-color-bar").on("click", function(e) {
//        render_color_bar = !render_color_bar;
//        if ($(self).data('color-bar') == 'on') {
//            $(self).data('color-mode', 'off');
//        } else {
//            $(self).data('color-mode', 'on');
//        }
//        render_color_scheme(color_legend_id);
//    });



//    // *** MODEL HANDLERS ***
//    $("#datamonkey-absrel-show-model").on("click", function(e) {
//        if ($(self).data('model') == 'MG94') {
//            $(self).data('model', 'Full model');
//        } else {
//            $(self).data('model', 'MG94');
//        }
//        which_model = $(self).data('model');
//        branch_omegas = render_bs_rel_tree(self.analysis_data, which_model)[1];
//        self.tree.layout();
//    });

//    function default_tree_settings() {
//        self.tree.branch_length(null);
//        self.tree.branch_name(null);
//        self.tree.node_span('equal');
//        self.tree.options({
//            'draw-size-bubbles': false,
//            'selectable': false,
//            'transitions': false,
//            'left-right-spacing': 'fit-to-size'
//        }, true);
//        self.tree.font_size(18);
//        self.tree.scale_bar_font_size(14);
//        self.tree.node_circle_size(0);
//        self.tree.spacing_x(35, true);

//        //self.tree.style_nodes (node_colorizer);
//        self.tree.style_edges(edge_colorizer);
//        //self.tree.selection_label (current_selection_name);
//    }


//    function create_gradient(svg_defs, grad_id, rateD, already_cumulative) {
//        var this_grad = svg_defs.append("linearGradient")
//            .attr("id", grad_id);
//        var current_weight = 0;
//        rateD.forEach(function(d, i) {
//            if (d[1]) {
//                var new_weight = current_weight + d[1];
//                this_grad.append("stop")
//                    .attr("offset", "" + current_weight * 100 + "%")
//                    .style("stop-color", omega_color(d[0]));
//                this_grad.append("stop")
//                    .attr("offset", "" + new_weight * 100 + "%")
//                    .style("stop-color", omega_color(d[0]));
//                current_weight = new_weight;
//            }
//        });
//    }

//    function render_bs_rel_tree (json, model_id) {

//        gradID = 0;
//        var local_branch_omegas = {};

//        var fitted_distributions = json["fits"][model_id]["rate distributions"];

//        for (var b in fitted_distributions) {
//            // Quick inf and nan quick fix 
//            fitted_distributions[b] = fitted_distributions[b].replace(/inf/g, '1e+9999');
//            fitted_distributions[b] = fitted_distributions[b].replace(/-nan/g, 'null');
//            fitted_distributions[b] = fitted_distributions[b].replace(/nan/g, 'null');

//            var rateD = JSON.parse(fitted_distributions[b]);
//            if (rateD.length == 1) {
//                local_branch_omegas[b] = {
//                    'color': omega_color(rateD[0][0])
//                };
//            } else {
//                gradID++;
//                var grad_id = "branch_gradient_" + gradID;
//                create_gradient(svg_defs, grad_id, rateD);
//                local_branch_omegas[b] = {
//                    'grad': grad_id
//                };
//            }
//            local_branch_omegas[b]['omegas'] = rateD;
//            local_branch_omegas[b]['tooltip'] = "<b>" + b + "</b>";
//            local_branch_omegas[b]['distro'] = "";
//            rateD.forEach(function(d, i) {
//                var omega_value = d[0] > 1e20 ? "&infin;" : omega_format(d[0]),
//                    omega_weight = prop_format(d[1]);

//                local_branch_omegas[b]['tooltip'] += "<br/>&omega;<sub>" + (i + 1) + "</sub> = " + omega_value +
//                    " (" + omega_weight + ")";
//                if (i) {
//                    local_branch_omegas[b]['distro'] += "<br/>";
//                }
//                local_branch_omegas[b]['distro'] += "&omega;<sub>" + (i + 1) + "</sub> = " + omega_value +
//                    " (" + omega_weight + ")";
//            });
//            local_branch_omegas[b]['tooltip'] += "<br/><i>p = " + omega_format(json["test results"][b]["p"]) + "</i>";
//        }

//        self.tree.style_edges(function(element, data) {
//            edge_colorizer(element, data);
//        });

//        branch_lengths = {};
//        self.tree.get_nodes().forEach(function(d) {
//            if (d.parent) {
//                branch_lengths[d.name] = self.tree.branch_length()(d);
//            }
//        });

//        return [branch_lengths, local_branch_omegas];
//    }

//    var render_bs_rel = function(json) {

//        try {
//            d3.select("#datamonkey-absrel-error").style('display', 'none');

//            self.analysis_data = json;

//            function make_distro_plot(d) {
//                if (Object.keys(rate_distro_by_branch).indexOf(d[0]) != -1) {
//                    drawDistribution(d[0],
//                        rate_distro_by_branch[d[0]].map(function(r) {
//                            return r[0];
//                        }),
//                        rate_distro_by_branch[d[0]].map(function(r) {
//                            return r[1];
//                        }), {
//                            'log': true,
//                            'legend': false,
//                            'domain': [0.00001, 10],
//                            'dimensions': {
//                                'width': 400,
//                                'height': 400
//                            }
//                        });
//                }
//            }

//            default_tree_settings();

//            branch_p_values = {};

//            var rate_distro_by_branch = {},
//                branch_count = 0,
//                selected_count = 0,
//                tested_count = 0;

//            var for_branch_table = [];

//            var tree_info = render_bs_rel_tree(json, "Full model");

//            var branch_lengths = tree_info[0],
//                tested_branches = {};

//            branch_omegas = tree_info[1];

//            for (var p in json["test results"]) {
//                branch_p_values[p] = json["test results"][p]["p"];
//                if (branch_p_values[p] <= 0.05) {
//                    selected_count++;
//                }
//                if (json["test results"][p]["tested"] > 0) {
//                    tested_branches[p] = true;
//                    tested_count += 1;
//                }
//            }

//            var fitted_distributions = json["fits"]["Full model"]["rate distributions"];

//            for (var b in fitted_distributions) {
//                for_branch_table.push([b + (tested_branches[b] ? "" : " (not tested)"), branch_lengths[b], 0, 0, 0]);
//                try {
//                    for_branch_table[branch_count][2] = json["test results"][b]["LRT"];
//                    for_branch_table[branch_count][3] = json["test results"][b]["p"];
//                    for_branch_table[branch_count][4] = json["test results"][b]["uncorrected p"];
//                } catch (e) {}

//                var rateD = (JSON.parse(fitted_distributions[b]));
//                rate_distro_by_branch[b] = rateD;
//                for_branch_table[branch_count].push(branch_omegas[b]['distro']);
//                branch_count += 1;
//            }



//            render_color_scheme(color_legend_id);

//            // render summary data

//            var total_tree_length = json["fits"]["Full model"]["tree length"];

//            for_branch_table = for_branch_table.sort(function(a, b) {
//                return a[4] - b[4];
//            });
//            make_distro_plot(for_branch_table[0]);

//            for_branch_table = d3.select('#table-branch-table').selectAll("tr").data(for_branch_table);
//            for_branch_table.enter().append('tr');
//            for_branch_table.exit().remove();
//            for_branch_table.style('font-weight', function(d) {
//                return d[3] <= 0.05 ? 'bold' : 'normal';
//            });
//            for_branch_table.on("click", function(d) {
//                make_distro_plot(d);
//            });
//            for_branch_table = for_branch_table.selectAll("td").data(function(d) {
//                return d;
//            });
//            for_branch_table.enter().append("td");
//            for_branch_table.html(function(d) {
//                if (typeof d == "number") {
//                    return branch_table_format(d);
//                }
//                return d;
//            });


//            d3.select('#summary-method-name').text(json['version']);
//            d3.select('#summary-pmid').text("PubMed ID " + json['PMID'])
//                .attr("href", "http://www.ncbi.nlm.nih.gov/pubmed/" + json['PMID']);
//            d3.select('#summary-total-runtime').text(format_run_time(json['timers']['overall']));
//            d3.select('#summary-complexity-runtime').text(format_run_time(json['timers']['overall']));
//            d3.select('#summary-complexity-runtime').text(format_run_time(json['timers']['Complexity analysis']));
//            d3.select('#summary-testing-runtime').text(format_run_time(json['timers']['Testing']));
//            d3.select('#summary-total-branches').text(branch_count);
//            d3.select('#summary-tested-branches').text(tested_count);
//            d3.select('#summary-selected-branches').text(selected_count);

//            var model_rows = [
//                [],
//                []
//            ];

//            for (k = 0; k < 2; k++) {
//                var access_key;
//                if (k == 0) {
//                    access_key = 'MG94';
//                    model_rows[k].push('Branch-wise &omega; variation (MG94)');
//                } else {
//                    access_key = 'Full model';
//                    model_rows[k].push('Branch-site &omega; variation');
//                }
//                model_rows[k].push(fit_format(json['fits'][access_key]['log-likelihood']));
//                model_rows[k].push(json['fits'][access_key]['parameters']);
//                model_rows[k].push(fit_format(json['fits'][access_key]['AIC-c']));
//                model_rows[k].push(format_run_time(json['fits'][access_key]['runtime']));
//            }

//            model_rows = d3.select('#summary-model-table').selectAll("tr").data(model_rows);
//            model_rows.enter().append('tr');
//            model_rows.exit().remove();
//            model_rows = model_rows.selectAll("td").data(function(d) {
//                return d;
//            });
//            model_rows.enter().append("td");
//            model_rows.html(function(d) {
//                return d;
//            });

//            d3.select('#summary-tree-length').text(fit_format(json["fits"]["Full model"]["tree length"]));
//            d3.select('#summary-tree-length-mg94').text(fit_format(json["fits"]["MG94"]["tree length"]));


//            var by_rate_class_count = {};
//            self.tree.get_nodes().forEach(function(d) {
//                if (d.parent) {
//                    var rc = rate_distro_by_branch[d.name].length;
//                    if (!(rc in by_rate_class_count)) {
//                        by_rate_class_count[rc] = [rc, 0, 0, 0];
//                    }
//                    by_rate_class_count[rc][1]++;
//                    by_rate_class_count[rc][2] += self.tree.branch_length()(d);
//                    if (json["test results"][d.name]["p"] <= 0.05) {
//                        by_rate_class_count[rc][3]++;
//                    }
//                }
//            });
//            var by_rate_class_count_array = [];
//            for (k in by_rate_class_count) {
//                d = by_rate_class_count[k];
//                by_rate_class_count_array.push([d[0], d[1], prop_format(d[1] / branch_count), prop_format(d[2] / total_tree_length), d[3]]);
//            };

//            by_rate_class_count_array = by_rate_class_count_array.sort(function(a, b) {
//                return a[0] - b[0];
//            });
//            by_rate_class_count_array = d3.select('#summary-tree-table').selectAll("tr").data(by_rate_class_count_array);
//            by_rate_class_count_array.enter().append('tr');
//            by_rate_class_count_array.exit().remove();
//            by_rate_class_count_array = by_rate_class_count_array.selectAll("td").data(function(d) {
//                return d;
//            });
//            by_rate_class_count_array.enter().append("td");
//            by_rate_class_count_array.html(function(d) {
//                return d;
//            });

//            self.tree.layout();

//        } catch (e) {
//            render_error(e.message);
//        }

//    }

//    function format_run_time(seconds) {
//        var duration_string = "";
//        seconds = parseFloat(seconds);
//        var split_array = [Math.floor(seconds / (24 * 3600)), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60],
//            quals = ["d.", "hrs.", "min.", "sec."];

//        split_array.forEach(function(d, i) {
//            if (d) {
//                duration_string += " " + d + " " + quals[i];
//            }
//        });

//        return duration_string;
//    }



//    return render_bs_rel;

//}
