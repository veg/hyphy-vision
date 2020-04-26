import React from "react";
import { saveSvgAsPng } from "save-svg-as-png";

var d3_save_svg = require("d3-save-svg");

export class ImageToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.pngClick = this.pngClick.bind(this);
    this.svgClick = this.svgClick.bind(this);
  }

  pngClick() {
    saveSvgAsPng(
      d3.select(document.getElementById(this.props.svgID)).select("svg")[0][0],
      this.props.name + ".png"
    );
  }

  svgClick() {
    d3_save_svg.save(
      d3
        .select("#" + this.props.svgID)
        .select("svg")
        .node(),
      {
        filename: this.props.name
      }
    );
  }

  render() {
    return (
      <div className="navbar-right">
        <div className="input-group">
          <button
            id="export-chart-png"
            type="button"
            className="btn.btn-secondary btn-sm btn-export"
            onClick={this.pngClick}
          >
            <span className="far fa-save" /> Export to PNG
          </button>
          <button
            id="export-chart-png"
            type="button"
            className="btn.btn-secondary btn-sm btn-export"
            onClick={this.svgClick}
          >
            <span className="far fa-save" /> Export to SVG
          </button>
        </div>
      </div>
    );
  }
}
