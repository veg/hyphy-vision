import React, { Component } from "react";
var d3 = require("d3");

const AALetters = [
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

class SubstitutionChordDiagram extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate(prevProps, prevState) {
    this.renderChart();
  }

  renderChart = () => {
    // Declare the constants.
    const width = this.props.width;
    const height = this.props.height;
    const text_offset = 20;
    const innerRadius = Math.min(width, height - text_offset) * 0.41;
    const outerRadius = innerRadius * 1.1;
    const font_size = 12;
    const colors = [
      "#a6cee3",
      "#1f78b4",
      "#b2df8a",
      "#33a02c",
      "#fb9a99",
      "#e31a1c",
      "#fdbf6f",
      "#ff7f00",
      "#cab2d6",
      "#6a3d9a",
      "#ffff99",
      "#b15928"
    ];
    const color = d3.scale.ordinal().range(colors);

    // Set up the svg.
    var container = d3.select("#chord-diagram-div");
    container.selectAll("svg").remove();
    var svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height - text_offset)
      .style("display", "block")
      .style("margin", "auto")
      .append("g")
      .attr(
        "transform",
        "translate(" + width / 2 + "," + (height - text_offset) / 2 + ")"
      );

    // Instantiate the chord diagram.
    const chord = d3.layout
      .chord()
      .padding(0.05)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending)
      .matrix(this.props.matrix);

    // Add the connecting paths.
    svg
      .append("g")
      .attr("class", "chord")
      .selectAll("path")
      .data(chord.chords)
      .enter()
      .append("path")
      .attr("d", d3.svg.chord().radius(innerRadius))
      .style("fill", "powderblue")
      .style("stroke", "midnightblue")
      .style("opacity", 1);

    // Add the outside "donut".
    svg
      .append("g")
      .selectAll("path")
      .data(chord.groups)
      .enter()
      .append("path")
      .style("fill", function(d) {
        return color(d.index);
      })
      .style("stroke", function(d) {
        return color(d.index);
      })
      .attr(
        "d",
        d3.svg
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
      );

    // TODO: Add the text labels.
  };

  render() {
    return (
      <div>
        <div id="chord-diagram-div" />
      </div>
    );
  }
}

module.exports.SubstitutionChordDiagram = SubstitutionChordDiagram;
