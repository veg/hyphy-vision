var React = require("react"),
  d3 = require("d3"),
  _ = require("underscore"),
  d3_save_svg = require("d3-save-svg");

import { Header } from "./header.jsx";
import { saveSvgAsPng } from "save-svg-as-png";

class RateMatrix extends React.Component {
  componentDidUpdate(prevProps) {
    d3.select("#dm-rate-matrix").html("");
    var rate_matrix = this.props.rate_matrix,
      number_of_characters = rate_matrix.length,
      nucleotides = ["A", "C", "G", "T"],
      amino_acids = [
        "A",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "K",
        "L",
        "M",
        "N",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "V",
        "W",
        "Y"
      ];

    var margin = { top: 50, right: 50, bottom: 50, left: 50 },
      colorbar_width = 20,
      colorbar_padding = 10,
      heatmap_dimension = 500,
      q_max = d3.max(_.flatten(rate_matrix)),
      color_min = "#F8F8F8",
      color_max = "#00A99D",
      width =
        heatmap_dimension +
        colorbar_padding +
        colorbar_width +
        margin.left +
        margin.right,
      height = heatmap_dimension + margin.top + margin.bottom;

    var svg = d3
      .select("#dm-rate-matrix")
      .attr("width", width)
      .attr("height", height);

    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .style("fill", "white");

    var matrix = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
      matrix_scale = d3.scale
        .linear()
        .domain([0, number_of_characters])
        .range([0, heatmap_dimension]),
      colorbar_scale = d3.scale
        .linear()
        .domain([0, q_max])
        .range([color_min, color_max]),
      colorbar_axis_scale = d3.scale
        .linear()
        .domain([q_max, 0])
        .range([0, heatmap_dimension]);

    var linearGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "colorbar-gradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    linearGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color_max);

    linearGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color_min);

    var colorbar = svg
      .append("g")
      .attr(
        "transform",
        "translate(" +
          (margin.left + heatmap_dimension + colorbar_padding) +
          "," +
          margin.top +
          ")"
      );

    colorbar
      .append("rect")
      .attr("fill", "url(#colorbar-gradient)")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", colorbar_width)
      .attr("height", heatmap_dimension);

    var i, j;
    for (i = 0; i < number_of_characters; i++) {
      for (j = 0; j < number_of_characters; j++) {
        var color = i == j ? "#FFFFFF" : colorbar_scale(rate_matrix[j][i]);
        var g = matrix
          .append("g")
          .attr(
            "transform",
            "translate(" + matrix_scale(i) + "," + matrix_scale(j) + ")"
          );
        g
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", matrix_scale(1))
          .attr("height", matrix_scale(1))
          .attr("fill", color);
        if (i != j) {
          g
            .append("text")
            .attr(
              "transform",
              "translate(" + matrix_scale(0.5) + "," + matrix_scale(0.5) + ")"
            )
            .attr("text-anchor", "middle")
            .attr("dy", ".5em")
            .attr("font-size", number_of_characters == 4 ? 14 : 10)
            .attr("font-weight", "normal")
            .text(rate_matrix[j][i].toFixed(2));
        }
      }
    }

    var characterScale = d3.scale
      .ordinal()
      .domain(number_of_characters == 4 ? nucleotides : amino_acids)
      .range(d3.range(0.5, number_of_characters, 1).map(matrix_scale));

    var xAxis = d3.svg
      .axis()
      .scale(characterScale)
      .orient("top");

    var yAxis = d3.svg
      .axis()
      .scale(characterScale)
      .orient("left");

    var colorBarAxis = d3.svg
      .axis()
      .scale(colorbar_axis_scale)
      .orient("right");

    colorbar
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + colorbar_width + ",0)")
      .call(colorBarAxis);

    matrix
      .append("g")
      .attr("class", "axis")
      .call(xAxis);

    matrix
      .append("g")
      .attr("class", "axis")
      .call(yAxis);
  }
  render() {
    return (
      <div className="row" id="matrix-tab">
        <div className="col-md-12">
          <Header title="Substitution Model" />
        </div>
        <div className="col-lg-6" />
        <div className="col-lg-6">
          <button
            id="export-chart-svg"
            type="button"
            className="btn.btn-secondary btn-sm float-right btn-export"
            onClick={() => {
              d3_save_svg.save(d3.select("#dm-rate-matrix").node(), {
                filename: "rate-matrix"
              });
            }}
          >
            <span className="far fa-save" /> Export Chart to SVG
          </button>
          <button
            id="export-chart-png"
            type="button"
            className="btn.btn-secondary btn-sm float-right btn-export"
            onClick={() => {
              saveSvgAsPng(
                document.getElementById("dm-rate-matrix"),
                "rate-matrix.png"
              );
            }}
          >
            <span className="far fa-save" /> Export Chart to PNG
          </button>
        </div>
        <div className="col-lg-12">
          <center>
            <svg id="dm-rate-matrix" />
          </center>
        </div>
      </div>
    );
  }
}

module.exports.RateMatrix = RateMatrix;
