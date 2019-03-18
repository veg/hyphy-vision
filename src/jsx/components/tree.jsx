var React = require("react");
var download = require("in-browser-download");
var d3_save_svg = require("d3-save-svg");

import { saveSvgAsPng } from "save-svg-as-png";

require("phylotree");
require("phylotree.css");

var Tree = React.createClass({
  getDefaultProps: function() {
    return {
      color_gradient: ["#5e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"],
      grayscale_gradient: [
        "#DDDDDD",
        "#AAAAAA",
        "#888888",
        "#444444",
        "#000000"
      ],
      fill_color: true,
      scaling_exponent: 0.33,
      bar_width: 70,
      bar_height: 300,
      margins: {
        bottom: 30,
        top: 15,
        left: 40,
        right: 2
      }
    };
  },

  toggleLegend: function(e) {
    var show_legend = !e.target.checked;

    this.setState({
      show_legend: show_legend
    });
  },

  changeColorScale: function(e) {
    var self = this;
    var fill_color = !e.target.checked;

    var omega_color = d3.scale
      .pow()
      .exponent(self.props.scaling_exponent)
      .domain([0, 0.25, 1, 5, 10])
      .range(
        fill_color ? self.props.color_gradient : self.props.grayscale_gradient
      )
      .clamp(true);

    var omega_scale = d3.scale
      .pow()
      .exponent(self.props.scaling_exponent)
      .domain(d3.extent(omega_color.domain()))
      .range([0, 1]);

    this.setState({
      omega_color: omega_color,
      omega_scale: omega_scale,
      fill_color: fill_color
    });
  },

  getInitialState: function() {
    var self = this;

    var omega_color = d3.scale
      .pow()
      .exponent(self.props.scaling_exponent)
      .domain([0, 0.25, 1, 5, 10])
      .range(
        self.props.fill_color
          ? self.props.color_gradient
          : self.props.grayscale_gradient
      )
      .clamp(true);

    var omega_scale = d3.scale
        .pow()
        .exponent(self.props.scaling_exponent)
        .domain(d3.extent(omega_color.domain()))
        .range([0, 1]),
      axis_scale = d3.scale
        .pow()
        .exponent(self.props.scaling_exponent)
        .domain(d3.extent(omega_color.domain()))
        .range([
          0,
          self.props.bar_height -
            self.props.margins["top"] -
            self.props.margins["bottom"]
        ]);

    this.selected_models = {
      absrel: "Full adaptive model",
      busted: "Unconstrained model",
      relax: "RELAX alternative",
      fel: "Global MG94xREV",
      meme: "Global MG94xREV",
      slac: "Global MG94xREV",
      fubar: "Nucleotide GTR"
    };
    var show_legend =
      ["meme", "fubar", "gard", "bgm"].indexOf(self.props.method) < 0;

    return {
      json: this.props.json,
      settings: this.props.settings,
      fill_color: this.props.fill_color,
      omega_color: omega_color,
      omega_scale: omega_scale,
      show_legend: show_legend,
      axis_scale: axis_scale,
      selected_model: this.selected_models[this.props.method],
      partition: "None",
      current: 0
    };
  },

  sortNodes: function(asc) {
    var self = this;

    self.tree.traverse_and_compute(function(n) {
      var d = 1;
      if (n.children && n.children.length) {
        d += d3.max(n.children, function(d) {
          return d["count_depth"];
        });
      }
      n["count_depth"] = d;
    });

    self.tree.resort_children(function(a, b) {
      return (a["count_depth"] - b["count_depth"]) * (asc ? 1 : -1);
    });
  },

  getBranchLengths: function() {
    var self = this;

    if (!this.state.json) {
      return [];
    }

    var branch_lengths;
    if (self.props.method == "absrel" || self.props.method == "relax") {
      branch_lengths =
        self.props.json.trees.branchLengths[self.state.selected_model];
    } else if (
      ["busted", "meme", "fel", "slac", "fubar"].indexOf(self.props.method) > -1
    ) {
      branch_lengths =
        self.props.json.trees[self.state.current].branchLengths[
          self.state.selected_model
        ];
    }
    return branch_lengths;
  },

  assignBranchAnnotations: function() {
    if (
      this.props.models[this.state.selected_model] &&
      this.props.models[this.state.selected_model]["branch-annotations"]
    ) {
      var attributes = this.props.multitree
        ? this.props.models[this.state.selected_model]["branch-annotations"][
            this.state.current
          ]
        : this.props.models[this.state.selected_model]["branch-annotations"];
      this.tree.assign_attributes(attributes);
    }
  },

  renderDiscreteLegendColorScheme: function(svg_container) {
    var self = this,
      svg = self.svg;

    if (!self.state.omega_color || !self.state.omega_scale) {
      return;
    }

    var color_fill = self.state.omega_color(0);

    var margins = {
      bottom: 30,
      top: 15,
      left: 0,
      right: 0
    };

    d3.selectAll("#color-legend").remove();

    var dc_legend = svg
      .append("g")
      .attr("id", "color-legend")
      .attr("class", "dc-legend")
      .attr(
        "transform",
        "translate(" + margins["left"] + "," + margins["top"] + ")"
      );

    var fg_item = dc_legend
      .append("g")
      .attr("class", "dc-legend-item")
      .attr("transform", "translate(0,0)");

    fg_item
      .append("rect")
      .attr("width", "13")
      .attr("height", "13")
      .attr("fill", color_fill);

    fg_item
      .append("text")
      .attr("x", "15")
      .attr("y", "11")
      .text("Test");

    var bg_item = dc_legend
      .append("g")
      .attr("class", "dc-legend-item")
      .attr("transform", "translate(0,18)");

    bg_item
      .append("rect")
      .attr("width", "13")
      .attr("height", "13")
      .attr("fill", "black");

    bg_item
      .append("text")
      .attr("x", "15")
      .attr("y", "11")
      .text("Background");
  },

  renderLegendColorScheme: function(svg_container, attr_name, do_not_render) {
    var self = this;
    var branch_annotations =
      self.props.models[self.state.selected_model]["branch-annotations"];
    var svg = self.svg;

    if (!self.state.omega_color || !self.state.omega_scale) {
      return;
    }

    // clear existing linearGradients
    d3
      .selectAll(".legend-definitions")
      .selectAll("linearGradient")
      .remove();
    d3.selectAll("#color-legend").remove();

    if (branch_annotations && !do_not_render) {
      var this_grad = svg
        .append("defs")
        .attr("class", "legend-definitions")
        .append("linearGradient")
        .attr("id", "_omega_bar")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

      self.state.omega_color.domain().forEach(function(d) {
        this_grad
          .append("stop")
          .attr("offset", "" + self.state.omega_scale(d) * 100 + "%")
          .style("stop-color", self.state.omega_color(d));
      });

      var g_container = svg
        .append("g")
        .attr("id", "color-legend")
        .attr(
          "transform",
          "translate(" +
            self.props.margins["left"] +
            "," +
            self.props.margins["top"] +
            ")"
        );

      g_container
        .append("rect")
        .attr("x", 0)
        .attr(
          "width",
          self.props.bar_width -
            self.props.margins["left"] -
            self.props.margins["right"]
        )
        .attr("y", 0)
        .attr(
          "height",
          self.props.bar_height -
            self.props.margins["top"] -
            self.props.margins["bottom"]
        )
        .style("fill", "url(#_omega_bar)");

      var draw_omega_bar = d3.svg
        .axis()
        .scale(self.state.axis_scale)
        .orient("left")
        .tickFormat(d3.format(".1r"))
        .tickValues([0, 0.01, 0.1, 0.5, 1, 2, 5, 10]);

      var scale_bar = g_container.append("g");

      scale_bar
        .style("font-size", "14")
        .attr("class", "hyphy-omega-bar")
        .call(draw_omega_bar);

      scale_bar.selectAll("text").style("text-anchor", "right");

      var x_label = scale_bar.append("g").attr("class", "hyphy-omega-bar");

      x_label = x_label.selectAll("text").data([attr_name]);
      x_label.enter().append("text");
      x_label
        .text(function(d) {
          return $("<textarea />")
            .html(d)
            .text();
        })
        .attr(
          "transform",
          "translate(" +
            (self.props.bar_width -
              self.props.margins["left"] -
              self.props.margins["right"]) *
              0.5 +
            "," +
            (self.props.bar_height - self.props.margins["bottom"]) +
            ")"
        )
        .style("text-anchor", "middle")
        .style("font-size", "18")
        .attr("dx", "0.0em")
        .attr("dy", "0.1em");
    }
  },

  setHandlers: function() {
    var self = this;

    $("#hyphy-error-hide").on("click", function(e) {
      d3.select("#hyphy-error").style("display", "none");
      e.preventDefault();
    });

    $(".hyphy-tree-trigger").on("click", function(e) {});

    $(".tree-tab-btn").on("click", function(e) {
      self.tree.placenodes().update();
    });
  },

  setTreeHandlers: function() {
    var self = this;
    var tree_object = self.tree;

    $("[data-direction]").on("click", function(e) {
      var which_function =
        $(this).data("direction") == "vertical"
          ? tree_object.spacing_x
          : tree_object.spacing_y;
      which_function(which_function() + +$(this).data("amount")).update();
    });

    $(".phylotree-layout-mode").on("change", function(e) {
      if ($(this).is(":checked")) {
        if (tree_object.radial() != ($(this).data("mode") == "radial")) {
          tree_object
            .radial(!tree_object.radial())
            .placenodes()
            .update();
        }
      }
    });

    $(".phylotree-align-toggler").on("change", function(e) {
      if ($(this).is(":checked")) {
        tree_object.align_tips($(this).data("align") == "right");
        tree_object.placenodes().update();
        d3.selectAll(".branch-tracer").style("opacity", 1);
      }
    });

    $("#sort_original").on("click", function(e) {
      tree_object.resort_children(function(a, b) {
        return a["original_child_order"] - b["original_child_order"];
      });

      e.preventDefault();
    });

    $("#sort_ascending").on("click", function(e) {
      self.sortNodes(true);
      e.preventDefault();
    });

    $("#sort_descending").on("click", function(e) {
      self.sortNodes(false);
      e.preventDefault();
    });
  },

  changeModelSelection(e) {
    var selected_model = e.target.dataset.type;

    this.setState({
      selected_model: selected_model
    });
  },

  getMainList: function() {
    var self = this,
      menu = [];

    // Enable display of multiple trees
    if (self.props.multitree && self.props.json) {
      menu = menu.concat(
        <li className="dropdown-header" key="partitions">
          Partitions
        </li>
      );
      var partition_list = _.range(self.props.json.trees.length).map((d, i) => (
        <li
          style={{
            backgroundColor: d == self.state.current ? "lightGrey" : "white"
          }}
          key={i}
        >
          <a href="javascript:;" onClick={() => this.setState({ current: i })}>
            {i + 1}
          </a>
        </li>
      ));
      menu = menu.concat(partition_list);
    }

    // Multiple models
    if (_.keys(self.props.models).length > 0) {
      if (self.props.multitree && self.props.json) {
        menu = menu.concat(
          <li role="separator" className="divider" key="divider" />
        );
      }
      menu = menu.concat(
        <li className="dropdown-header" key="dropdown-header">
          Models
        </li>
      );

      var model_list = _.map(this.props.models, (d, model_type) => (
        <li
          style={{
            backgroundColor:
              model_type == self.state.selected_model ? "lightGrey" : "white"
          }}
          key={model_type}
        >
          <a
            href="javascript:;"
            data-type={model_type}
            onClick={self.changeModelSelection}
          >
            {model_type}
          </a>
        </li>
      ));
      menu = menu.concat(model_list);
    }

    // Branch partitions
    if (!_.isEmpty(this.props.partition)) {
      var partitionList = [
        <li role="separator" className="divider" />,
        <li className="dropdown-header">Branch partition</li>,
        <li
          style={{
            backgroundColor:
              self.state.partition == "None" ? "lightGrey" : "white"
          }}
        >
          <a
            href="javascript:;"
            onClick={() => this.setState({ partition: "None" })}
          >
            None
          </a>
        </li>
      ].concat(
        _.keys(this.props.partition).map(key => (
          <li
            style={{
              backgroundColor:
                self.state.partition == key ? "lightGrey" : "white"
            }}
            key={key}
          >
            <a
              href="javascript:;"
              onClick={() => this.setState({ partition: key })}
            >
              {key}
            </a>
          </li>
        ))
      );
      menu = menu.concat(partitionList);
    }

    return menu;
  },

  settingsMenu: function() {
    var dropdownListStyle = {
      paddingLeft: "20px",
      paddingRight: "20px",
      paddingTop: "10px",
      paddingBottom: "10px"
    };

    return (
      <ul className="dropdown-menu">
        <li style={dropdownListStyle}>
          <input
            type="checkbox"
            id="hyphy-tree-hide-legend"
            className="hyphy-tree-trigger"
            defaultChecked={false}
            onChange={this.toggleLegend}
          />{" "}
          Hide Legend
        </li>
        <li style={dropdownListStyle}>
          <input
            type="checkbox"
            id="hyphy-tree-fill-color"
            className="hyphy-tree-trigger"
            defaultChecked={!this.props.fill_color}
            onChange={this.changeColorScale}
          />{" "}
          GrayScale
        </li>
      </ul>
    );
  },

  initialize: function() {
    this.settings = this.state.settings;

    if (!this.settings) {
      return null;
    }

    if (!this.state.json) {
      return null;
    }

    $("#hyphy-tree-branch-lengths").click();

    this.scaling_exponent = 0.33;
    this.omega_format = d3.format(".3r");
    this.prop_format = d3.format(".2p");
    this.fit_format = d3.format(".2f");
    this.p_value_format = d3.format(".4f");

    this.width = 800;
    this.height = 600;

    this.legend_type = this.settings["hyphy-tree-legend-type"];

    this.setHandlers();
    this.initializeTree();
  },

  initializeTree: function() {
    var self = this;

    var width = this.width,
      height = this.height;

    if (!this.tree) {
      this.tree = d3.layout
        .phylotree("body")
        .size([height, width])
        .separation(function(a, b) {
          return 0;
        });
    }

    this.setTreeHandlers();

    // clear any existing svg
    d3.select("#tree_container").html("");

    this.svg = d3
      .select("#tree_container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "dm-phylotree");

    this.tree.branch_name(null);
    this.tree.node_span("equal");
    this.tree.options(
      {
        "draw-size-bubbles": false,
        selectable: false,
        "left-right-spacing": "fit-to-size",
        "left-offset": 100,
        "color-fill": this.settings["tree-options"]["hyphy-tree-fill-color"][0]
      },
      false
    );

    this.assignBranchAnnotations();

    var tree_string;
    if (self.props.method == "absrel" || self.props.method == "relax") {
      tree_string = self.props.json.input.trees[0];
    } else if (
      ["busted", "meme", "fel", "slac", "gard", "fubar"].indexOf(
        self.props.method
      ) > -1
    ) {
      tree_string = self.props.json.trees[self.state.current]["newickString"];
    } else if (self.props.tree_string) {
      tree_string = self.props.tree_string;
    }
    self.tree(tree_string).svg(self.svg);

    self.branch_lengths = this.getBranchLengths();
    self.tree.font_size(18);
    self.tree.scale_bar_font_size(14);
    self.tree.node_circle_size(0);

    self.tree.branch_length(function(n) {
      if (self.branch_lengths) {
        return self.branch_lengths[n.name] || 0;
      }
      return undefined;
    });

    this.assignBranchAnnotations();
    d3
      .select("#dm-phylotree")
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white");

    if (self.state.show_legend && _.keys(self.props.models).length > 0) {
      if (self.legend_type == "discrete") {
        self.renderDiscreteLegendColorScheme("tree_container");
      } else {
        self.renderLegendColorScheme(
          "tree_container",
          self.props.models[self.state.selected_model]["annotation-tag"]
        );
      }
    }

    if (!_.isEmpty(this.props.partition) && this.settings.edgeColorizer) {
      this.edgeColorizer = _.partial(
        this.settings.edgeColorizer,
        _,
        _,
        self.state.omega_color,
        _.keys(self.props.partition[self.state.partition])
      );
    } else if (this.settings.edgeColorizer) {
      this.edgeColorizer = _.partial(
        this.settings.edgeColorizer,
        _,
        _,
        self.state.omega_color
      );
    }

    this.tree.style_edges(this.edgeColorizer);
    this.tree.style_nodes(this.nodeColorizer);

    this.tree.spacing_x(30, true);
    this.tree.layout();
    this.tree.placenodes().update();
    this.tree.layout();
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    const props_changed =
        JSON.stringify(nextProps) != JSON.stringify(this.props),
      state_changed = JSON.stringify(nextState) != JSON.stringify(this.state);
    return props_changed || state_changed;
  },

  componentDidMount: function() {
    this.initialize();
  },

  componentWillReceiveProps: function(nextProps) {
    var selected_model = this.selected_models[this.props.method];

    this.setState({
      json: nextProps.json,
      settings: nextProps.settings,
      selected_model: selected_model
    });
  },

  componentDidUpdate: function() {
    this.initialize();
  },

  exportNewick: function() {
    download(this.tree.get_newick(function() {}), "tree.new");
  },

  render: function() {
    var popovers = {
      absrel:
        "<li>Hover over a branch to see its inferred rates and significance for selection.</li>",
      busted:
        "<li>Shows different branch partitions.</li><li>Toggle site partition/model in the options menu.</li>",
      relax:
        "<li>Use the options menu to toggle the different branch partitions.</li>",
      fel:
        "<li>Use the options menu to toggle the different site partitions.</li>",
      meme:
        "<li>Use the options menu to toggle the different site partitions.</li>",
      slac:
        "<li>Use the options menu to toggle the different site partitions.</li>",
      fubar:
        "<li>Use the options menu to toggle the different site partitions.</li>",
      gard:
        "<li>Use the options menu to toggle the different site partitions.</li>"
    };
    return (
      <div>
        <h4 className="dm-table-header">
          Fitted tree
          <span
            className="fas fa-info-circle"
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
            data-content={"<ul>" + popovers[this.props.method] + "<ul>"}
            data-placement="bottom"
          />
        </h4>

        <div className="row">
          <div
            className="col-12"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div className="input-group-btn">
              <button
                type="button"
                className="btn btn-secondary dropdown-toggle"
                data-toggle="dropdown"
              >
                Options
                <span className="caret" />
              </button>
              <ul className="dropdown-menu" id="hyphy-tree-model-list">
                {this.getMainList()}
              </ul>
            </div>

            <div className="input-group-btn">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-direction="vertical"
                data-amount="1"
                title="Expand vertical spacing"
              >
                <i className="fa fa-arrows-v" />
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-direction="vertical"
                data-amount="-1"
                title="Compress vertical spacing"
              >
                <i className="fa  fa-compress fa-rotate-135" />
              </button>
            </div>
            <div className="input-group-btn">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                id="sort_ascending"
                title="Sort deepest clades to the bototm"
              >
                <i className="fa fa-sort-amount-asc" />
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                id="sort_descending"
                title="Sort deepsest clades to the top"
              >
                <i className="fa fa-sort-amount-desc" />
              </button>
            </div>

            {this.props.settings.allowRadial ? (
              <div className="btn-group-toggle" data-toggle="buttons">
                <button className="btn btn-secondary active">
                  <input
                    type="radio"
                    name="options"
                    className="phylotree-layout-mode"
                    data-mode="linear"
                    autoComplete="off"
                    checked=""
                    title="Layout left-to-right"
                  />Linear
                </button>
                <button className="btn btn-secondary">
                  <input
                    type="radio"
                    name="options"
                    className="phylotree-layout-mode"
                    data-mode="radial"
                    autoComplete="off"
                    title="Layout radially"
                  />{" "}
                  Radial
                </button>
              </div>
            ) : null}

            <div className="btn-group-toggle" data-toggle="buttons">
              <button className="btn btn-secondary active">
                <input
                  type="radio"
                  className="phylotree-align-toggler"
                  data-align="left"
                  name="options-align"
                  autoComplete="off"
                  checked=""
                  title="Align tips labels to branches"
                />
                <i className="fa fa-align-left" />
              </button>
              <button className="btn btn-secondary btn-sm">
                <input
                  type="radio"
                  className="phylotree-align-toggler"
                  data-align="right"
                  name="options-align"
                  autoComplete="off"
                  title="Align tips labels to the edge of the plot"
                />
                <i className="fa fa-align-right" />
              </button>
            </div>

            <div className="input-group-btn">
              <button
                type="button"
                className="btn btn-secondary btn-sm dropdown-toggle"
                data-toggle="dropdown"
                style={{ paddingLeft: "30px" }}
              >
                <i className="fas fa-cog" /> <span className="caret" />
              </button>

              {this.settingsMenu()}

              <div className="input-group-btn float-right">
                <button
                  type="button"
                  className="btn btn-secondary dropdown-toggle"
                  data-toggle="dropdown"
                >
                  Export <span className="caret" />
                </button>
                <ul className="dropdown-menu">
                  <li id="export-phylo-png">
                    <a
                      onClick={() =>
                        saveSvgAsPng(
                          document.getElementById("dm-phylotree"),
                          "tree.png"
                        )
                      }
                      href="javascript:;"
                    >
                      <i className="fa fa-image" /> PNG
                    </a>
                  </li>
                  <li id="export-phylo-png">
                    <a
                      onClick={() =>
                        d3_save_svg.save(d3.select("#dm-phylotree").node(), {
                          filename: "tree"
                        })
                      }
                      href="javascript:;"
                    >
                      <i className="fa fa-image" /> SVG
                    </a>
                  </li>
                  <li id="export-phylo-nwk">
                    <a onClick={this.exportNewick} href="javascript:;">
                      <i className="fa fa-file-o" /> Newick File
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div id="tree_container" className="tree-widget" />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

function render_tree(json, element, settings) {
  return React.render(<Tree json={json} settings={settings} />, $(element)[0]);
}

function rerender_tree(json, element, settings) {
  $(element).empty();
  return render_tree(json, settings);
}

module.exports.Tree = Tree;
module.exports.render_tree = render_tree;
module.exports.rerender_tree = rerender_tree;
