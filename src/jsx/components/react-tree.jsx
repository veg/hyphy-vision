import React, { Component } from "react";
import Phylotree from "react-phylotree";
var download = require("in-browser-download");
var d3_save_svg = require("d3-save-svg");

import { saveSvgAsPng } from "save-svg-as-png";

function SettingsItem(props) {
  return (
    <li
      style={{
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingTop: "10px",
        paddingBottom: "10px"
      }}
    >
      <a onClick={props.onClick}>{props.children}</a>
    </li>
  );
}

function ModelsPartitionsList(props) {
  return (
    <ul className="dropdown-menu" id="hyphy-tree-model-list">
      <li className="dropdown-header" key="partitions">
        Partitions
      </li>
      {Array(props.number_of_partitions)
        .fill()
        .map((d, i) => {
          return (
            <li
              style={{
                backgroundColor: i == props.partition ? "lightGrey" : "white"
              }}
              key={i}
            >
              <a href="javascript:;" onClick={() => props.setPartition(i)}>
                {i + 1}
              </a>
            </li>
          );
        })}
      <li role="separator" className="divider" key="divider" />
      <li className="dropdown-header" key="dropdown-header">
        Models
      </li>
      {["Global MG94xREV", "Nucleotide GTR"].map((d, i) => {
        return (
          <li
            style={{
              backgroundColor: d == props.model ? "lightGrey" : "white"
            }}
            key={i}
          >
            <a href="javascript:;" onClick={() => props.setModel(d)}>
              {d}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

class ReactTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pixelsPerNode: 20,
      alignTips: "left",
      showInternal: false,
      sort: null
    };
  }
  togglePixelsPerNode(direction) {
    const new_candidate =
        this.state.pixelsPerNode + (direction == "expand" ? 5 : -5),
      new_pixelsPerNode = Math.max(Math.min(new_candidate, 100), 10);
    this.setState({
      pixelsPerNode: new_pixelsPerNode
    });
  }
  alignTips(direction) {
    this.setState({ alignTips: direction });
  }
  handleSort(direction) {
    this.setState({ sort: direction });
  }
  exportNewick() {
    const { newick } = this.props;
    download(newick, "tree.new");
  }
  toggleInternal() {
    const new_internal = !this.state.showInternal;
    this.setState({
      showInternal: new_internal
    });
  }
  settingsMenu() {
    return (
      <ul className="dropdown-menu">
        <SettingsItem onClick={() => this.toggleInternal()}>
          {this.state.showInternal ? "Hide" : "Show"} internal node labels
        </SettingsItem>
        {this.props.settings}
      </ul>
    );
  }
  render() {
    const { number_of_sequences } = this.props,
      total_number_of_sequences = this.state.showInternal
        ? 2 * number_of_sequences - 2
        : number_of_sequences,
      { pixelsPerNode } = this.state,
      { paddingLeft, paddingRight, paddingBottom, paddingTop } = this.props,
      width = 900,
      height = pixelsPerNode * total_number_of_sequences;
    return (
      <div>
        <h4 className="dm-table-header border-primary">
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
            data-content={"<ul>" + this.props.popover + "<ul>"}
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
              {this.props.options}
            </div>

            <div className="input-group-btn">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-direction="vertical"
                data-amount="1"
                title="Expand vertical spacing"
                onClick={() => this.togglePixelsPerNode("expand")}
              >
                <i className="fa fa-arrows-v" />
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-direction="vertical"
                data-amount="-1"
                title="Compress vertical spacing"
                onClick={() => this.togglePixelsPerNode("compress")}
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
                onClick={() => this.handleSort("ascending")}
              >
                <i className="fa fa-sort-amount-asc" />
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                id="sort_descending"
                title="Sort deepsest clades to the top"
                onClick={() => this.handleSort("descending")}
              >
                <i className="fa fa-sort-amount-desc" />
              </button>
            </div>

            <div className="btn-group-toggle" data-toggle="buttons">
              <button
                className="btn btn-secondary active"
                title="Align tips labels to branches"
                onClick={() => this.alignTips("left")}
              >
                <input
                  type="radio"
                  className="phylotree-align-toggler"
                  data-align="left"
                  name="options-align"
                  autoComplete="off"
                />
                <i className="fa fa-align-left" />
              </button>
              <button
                className="btn btn-secondary btn-sm"
                title="Align tips labels to the edge of the plot"
                onClick={() => this.alignTips("right")}
              >
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
                    <a onClick={() => this.exportNewick()} href="javascript:;">
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
              <div id="tree_container" className="tree-widget">
                {this.props.between}
                <svg id="dm-phylotree" width={width} height={height}>
                  {this.props.svg}
                  <rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill="white"
                  />
                  <Phylotree
                    newick={this.props.newick}
                    transform={`translate(${paddingLeft}, ${paddingTop})`}
                    width={width - paddingLeft - paddingRight}
                    height={height - paddingTop - paddingBottom}
                    alignTips={this.state.alignTips}
                    internalNodeLabels={this.state.showInternal}
                    sort={this.state.sort}
                    maxLabelWidth={30}
                    accessor={this.props.accessor}
                    branchStyler={this.props.branchStyler}
                    labelStyler={this.props.labelStyler}
                    includeBLAxis={this.props.includeBLAxis}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactTree.defaultProps = {
  paddingLeft: 10,
  paddingRight: 10,
  paddingTop: 10,
  paddingBottom: 10
};

export default ReactTree;
export { ModelsPartitionsList, SettingsItem };
