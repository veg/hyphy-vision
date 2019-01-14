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
    // Make sure the matrix prop is actually renderable as a chord diagram.
    if (this.props.matrix.constructor != Array) {
      var container = d3.select("#chord-diagram-div");
      container.selectAll("svg").remove();
      return;
    }

    // Declare the constants.
    const self = this;
    const width = this.props.width;
    const height = this.props.height;
    const text_offset = 20;
    const innerRadius = Math.min(width, height - text_offset) * 0.41;
    const outerRadius = innerRadius * 1.1;
    const font_size = 12;
    const colors = [
      "#e6194B",
      "#3cb44b",
      "#ffe119",
      "#4363d8",
      "#f58231",
      "#911eb4",
      "#42d4f4",
      "#f032e6",
      "#bfef45",
      "#fabebe",
      "#469990",
      "#e6beff",
      "#9A6324",
      "#ccc9ad",
      "#800000",
      "#aaffc3",
      "#808000",
      "#ffd8b1",
      "#000075",
      "#a9a9a9",
      "#ffffff"
    ];
    const color = d3.scale.ordinal().range(colors);
    function colorPaths(d) {
      if (self.props.colorConnectionsBy == "target") {
        return color(d.target.index);
      } else if (self.props.colorConnectionsBy == "source") {
        return color(d.source.index);
      } else {
        return "powderblue";
      }
    }
    // Returns an event handler for fading a given chord group.
    function fade(opacity, t) {
      return function(g, i) {
        svg
          .selectAll(".chord path")
          .filter(function(d) {
            return d.source.index != i && d.target.index != i;
          })
          .transition()
          .style("opacity", opacity);
      };
    }

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

    // Add the outside "donut".
    const group = svg
      .append("g")
      .selectAll("g")
      .data(chord.groups)
      .enter()
      .append("g");

    group
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
      )
      .on("mouseover", fade(0.1, true))
      .on("mouseout", fade(1, false));

    // Add the text labels.
    const text_label = group
      .append("text")
      .each(d => {
        d.angle = (d.startAngle + d.endAngle) / 2;
      })
      .attr("dy", "0.35em")
      .attr(
        "transform",
        d => `
        rotate(${d.angle * 180 / Math.PI - 90})
        translate(${innerRadius + 26})
        ${d.angle > Math.PI ? "rotate(180)" : ""}
      `
      )
      .attr("text-anchor", d => (d.angle > Math.PI ? "end" : null))
      .style("fill", d => color(d.index))
      .text(d => AALetters[d.index]);

    // Add the connecting paths.
    svg
      .append("g")
      .attr("class", "chord")
      .selectAll("path")
      .data(chord.chords)
      .enter()
      .append("path")
      .attr("d", d3.svg.chord().radius(innerRadius))
      .style("fill", d => colorPaths(d))
      .style("stroke", "midnightblue")
      .style("opacity", 0.8);
  };

  render() {
    if (this.props.matrix.constructor === String) {
      return <div>{this.props.matrix}</div>;
    }
    return (
      <div>
        <div id="chord-diagram-div" />
      </div>
    );
  }
}

module.exports.SubstitutionChordDiagram = SubstitutionChordDiagram;
