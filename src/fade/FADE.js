var datamonkey_fade = function(json) {
  var _use_BF = false;

  var fade_results = json["results"]["FADE"];

  var dict_to_array = function(dict) {
    ar = [];
    for (var k in dict) {
      ar.push(dict[k]);
    }
    return ar;
  };

  var keys_in_dict = function(dict) {
    ar = [];
    for (var k in dict) {
      ar.push(k);
    }
    return ar;
  };

  //For displaying table with Posteriors
  var display_column_map = function(row) {
    var result = [parseInt(row[0])];

    for (var k = 4; k < row.length; k += 5) {
      result.push(row[k]);
    }
    return result;
  };

  //For displaying table with BFs
  var display_column_map_bf = function(row) {
    //result = [parseInt(row[0]),row[3]];
    var result = [parseInt(row[0])];

    for (var k = 5; k < row.length; k += 5) {
      result.push(row[k]);
    }
    return result;
  };

  var row_display_filter = function(d) {
    //Any row, with at least one val > thres must get displayed. Any elements greater must be in red.
    // if (d.slice(2).reduce (function (a,b) {return a+b;}) == 0.0) {return false;}
    //console.log (d, this);
    for (var k = 1; k < 21; k++) {
      if (d[k] > this) return true;
    }
    return false;
  };

  var initial_display = function() {
    $("#filter_on_pvalue").trigger("submit");
    plot_property_graphs("property_plot_svg", fade_results); //Using a matrix from html
  };

  var set_handlers = function(file_id) {
    var fade_headers = [
      [
        "Site",
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
      ],
      [
        "Site",
        "Alanine",
        "Cysteine",
        "Aspartic acid",
        "Glutamic acid",
        "Phenylalanine",
        "Glycine",
        "Histidine",
        "Isoleucine",
        "Lysine",
        "Leucine",
        "Methionine",
        "Asparagine",
        "Proline",
        "Glutamine",
        "Arginine",
        "Serine",
        "Threonine",
        "Valine",
        "Tryptophan",
        "Tyrosin"
      ]
    ];

    var found = "";

    $("body").attr("data-job-id", file_id);
    $("#filter_on_pvalue").submit(function(e) {
      cutoff = parseFloat($("#pvalue")[0].value);
      if (_use_BF) {
        found = load_analysis_results(
          "prime_table",
          fade_headers,
          fade_results,
          display_column_map_bf,
          row_display_filter
        );
      } else {
        found = load_analysis_results(
          "prime_table",
          fade_headers,
          fade_results,
          display_column_map,
          row_display_filter
        );
      }
      d3
        .select("#total_sites_found")
        .selectAll("span")
        .data(found)
        .html(function(d) {
          return d;
        });
      return false;
    });

    $("#site_rate_display").on("show", function(e) {
      //alert ("Show");
      //console.log (this);
      return true;
    });

    $("body").on("click", '[data-toggle="modal"]', function(event) {
      display_site_properties($(this).attr("data-codon-id"));
    });

    $("#set-p-value").click(function(event) {
      d3.select("#pq_selector").html("Posterior <span class='caret'></span>");
      _use_BF = false;
      event.preventDefault();
    });

    $("#set-q-value").click(function(event) {
      d3.select("#pq_selector").html("BF <span class='caret'></span>");
      _use_BF = true;
      event.preventDefault();
    });

    $("body").on("click", "#property_selector .btn", function(event) {
      event.stopPropagation(); // prevent default bootstrap behavior
      if ($(this).attr("data-toggle") != "button") {
        // don't toggle if data-toggle="button"
        $(this).toggleClass("active");
      }
      toggle_view(
        "property_plot_svg",
        parseInt($(this).attr("data-property-id")),
        $(this).hasClass("active")
      ); // button state AFTER the click
    });
  };

  var property_plot_done = false;

  var display_site_properties = function(site_id) {
    job_id = $("body").attr("data-job-id");
    url =
      "/cgi-bin/datamonkey/wrapHyPhyBF.pl?file=fade_site&mode=1&arguments=" +
      job_id +
      "-" +
      site_id;
    d3.json(url, function(json) {
      site_info(json, site_id);
    });
  };

  var toggle_view = function(property_plot, group, show_hide) {
    if (show_hide) {
      prop = "visible";
    } else {
      prop = "hidden";
    }
    d3
      .select("#" + property_plot)
      .selectAll(".dot" + group)
      .style("visibility", prop);
  };

  var site_info = function(values, site_id) {
    d3
      .select("#site_rate_display_header")
      .html("Detailed information about site " + site_id);
    elements = dict_to_array(values);
    headers = keys_in_dict(elements[0]).sort();
    var header_element = d3.select("#site_info_table").select("thead");
    header_element.selectAll("th").remove();
    header_element
      .selectAll("th")
      .data(headers)
      .enter()
      .append("th")
      .html(function(
        d,
        i //Get header of table
      ) {
        return d;
      });
  };

  var plot_property_graphs = function(property_plot, property_info) {
    if (!property_plot_done) {
      property_info = property_info.map(display_column_map);
      property_plot_done = true;
      var site_count = property_info.length;

      //console.log (d3.extent (property_info.map(function (d){return d[0];})));

      var margin = { top: 20, right: 40, bottom: 30, left: 40 },
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var x = d3.scale.linear().range([0, width]);

      var y = d3.scale.linear().range([height, 0]);

      var color = d3.scale.category10();

      var xAxis = d3.svg
        .axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg
        .axis()
        .scale(y)
        .orient("left");

      var yAxis2 = d3.svg
        .axis()
        .scale(y)
        .orient("right");

      var make_x_axis = function() {
        return d3.svg
          .axis()
          .scale(x)
          .orient("bottom")
          .ticks(20);
      };

      var make_y_axis = function() {
        return d3.svg
          .axis()
          .scale(y)
          .orient("left")
          .ticks(20);
      };

      var svg = d3
        .select("#" + property_plot)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      x.domain([1, site_count]);
      y.domain([0, 1]);

      svg
        .append("g")
        .attr("class", "x hyphy-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        //.attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .style("text-anchor", "end")
        .text("Site index");

      svg
        .append("g")
        .attr("class", "grid")
        .call(
          make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        );

      svg
        .append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(
          make_x_axis()
            .tickSize(-height, 0, 0)
            .tickFormat("")
        );

      svg
        .append("g")
        .attr("class", "y hyphy-axis")
        .call(yAxis)
        .append("text")
        //.attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -37)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("P(Bias>1)");

      var y2 = svg
        .append("g")
        .attr("class", "y hyphy-axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis2.tickFormat(""));

      y2
        .append("text")
        //.attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("High Posteriors");

      y2
        .append("text")
        //.attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("x", -height)
        .attr("dy", ".71em")
        .style("text-anchor", "start")
        .text("Low Posteriors");

      svg
        .selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
          return "translate(0," + i * 20 + ")";
        });

      var h = {}; //Hash of numbers -> AA names for labels
      h[1] = "Alanine";
      h[2] = "Cysteine";
      h[3] = "Aspartic acid";
      h[4] = "Glutamic acid";
      h[5] = "Phenylalanine";
      h[6] = "Glycine";
      h[7] = "Histidine";
      h[8] = "Isoleucine";
      h[9] = "Lysine";
      h[10] = "Leucine";
      h[11] = "Methionine";
      h[12] = "Asparagine";
      h[13] = "Proline";
      h[14] = "Glutamine";
      h[15] = "Arginine";
      h[16] = "Serine";
      h[17] = "Threonine";
      h[18] = "Valine";
      h[19] = "Tryptophan";
      h[20] = "Tyrosine";

      var vis = "visible";
      for (var series = 1; series <= 20; series++) {
        if (series > 1) {
          vis = "hidden";
        }
        svg
          .selectAll(".dot" + series)
          .data(property_info)
          .enter()
          .append("circle")
          .attr("class", "dot" + series)
          .attr("r", function(d) {
            if (d[series] == 0) return 1;
            return 3.5;
          })
          .attr("cx", function(d) {
            return x(d[0]);
          })
          .attr("cy", function(d) {
            return y(d[series]);
          })
          .style("fill", function(d) {
            return color(series);
          })
          .style("opacity", 0.5)
          .style("visibility", vis)
          .append("title")
          .text(function(d) {
            return (
              "Site " + d[0] + ", " + h[series] + " P(Beta>1) =" + d[series]
            );
          });
        d3.select("#show_property" + series).style("color", function(d) {
          return color(series);
        }); //Colour buttons on HTML
      }
    }
  };

  var load_analysis_results = function(
    id,
    headers,
    matrix,
    column_selector,
    condition
  ) {
    var header_element = d3.select("#" + id).select("thead");
    header_element.selectAll("th").remove();
    header_element
      .selectAll("th")
      .data(headers[0])
      .enter()
      .append("th")
      .html(function(
        d,
        i //Get header of table
      ) {
        return (
          "<a href='#' data-toggle='tooltip' data-placement = 'right' data-html = true title data-original-title='" +
          headers[1][i] +
          "'>" +
          d +
          "</a>"
        );
      });

    var parent_element = d3.select("#" + id).select("tbody");
    parent_element.selectAll("tr").remove();
    var filtered_matrix = matrix.map(column_selector).filter(condition, cutoff); //Get the columns to display in table
    var rows = parent_element.selectAll("tr").data(function(d) {
      return filtered_matrix;
    });
    var conserved = 0;
    rows
      .enter()
      .append("tr")
      .selectAll("td")
      .data(function(d) {
        return d;
      })
      .enter()
      .append("td")
      .html(function(d, i) {
        d = parseFloat(d);
        if (i) {
          if (_use_BF == false) {
            if (d > 0.99) return "1.00";
            return d.toFixed(2);
          } else {
            if (d > 100) return "100+";
            return d.toFixed(1);
          }
        }
        return (
          "<b>" +
          d +
          "</b> <a href='#site_rate_display' data-toggle='modal' data-codon-id = '" +
          d +
          "' data-placement = 'bottom'><i class='icon-list'></i></a>"
        );
      })
      .classed("btn-danger", function(d, i, j) {
        if (d >= cutoff && i >= 1) {
          conserved++;
          return true;
        }
        return false;
      });

    d3.select("#" + id).classed("table-striped table-hover", true);
    $("a").tooltip();
    return [filtered_matrix.length, conserved];
  };

  set_handlers("test");
  initial_display();
};

module.exports = datamonkey_fade;
