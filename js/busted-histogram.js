function siteList(div, test_set) {

  //var dimension_group = dimension.group().reduceCount();
  //var top_ten_values = dimension_group.top(10);
  //var total = dimension.groupAll().reduceCount().value();
  //console.log("lol");

  // Do not remove headers
  var trs = d3.select(div).selectAll("tr");
  trs[0].shift();
  trs.remove();

  var trs = d3.select(div).selectAll("tr");
  trs[0].shift();

  var tr = trs
      .attr("class", "name")
      .data(test_set)
      .enter().append("tr");

  var td = tr.append("td")
        .text(function(d) { return d.name; });

  var td = tr.append("td")
        .text(function(d) { return d.constrained; });


}

function render_busted_histogram(c, json) {

  //var constrained_chart = dc.lineChart(c);
  //var optimized_null = dc.lineChart("#on-chart-id");

  // Massage data for use with crossfilter
  var erc = json["evidence ratios"]["constrained"][0];
  erc = erc.map(function(d) { return Math.log10(d)})

  var test_set = json["test set"].split(",");
  var model_results = [];

  test_set.forEach(function(elem, i) { 

    model_results.push({
      "name"                : elem,
      "site_index"          : i,
      "unconstrained"       : json["profiles"]["unconstrained"][0][i],
      "constrained"         : json["profiles"]["constrained"][0][i],
      "optimized_null"      : json["profiles"]["optimized null"][0][i],
      "er_constrained"      : Math.log10(json["evidence ratios"]["constrained"][0][i]),
      "er_optimized_null"   : Math.log10(json["evidence ratios"]["optimized null"][0][i])
    })

  });

  var data = crossfilter(model_results);
  var site_index = data.dimension(function(d) { return d["site_index"]; });
  var site_index_o = data.dimension(function(d) { return d["site_index"]; });

  var sitesByConstrained = site_index.group().reduce(
    function (p, v) {
      p.constrained_evidence += +v["er_constrained"];
      p.optimized_null_evidence += +v["er_optimized_null"];
      return p;
    },
    function (p, v) {
      p.constrained_evidence -= +v["er_constrained"];
      p.optimized_null_evidence -= +v["er_optimized_null"];
      return p;
    },
    function () {
      return { constrained_evidence : 0, optimized_null_evidence : 0 };
    }
  );

  var sitesByOptimizedNull = site_index_o.group().reduce(
    function (p, v) {
      p.constrained_evidence += +v["er_constrained"];
      p.optimized_null_evidence += +v["er_optimized_null"];
      return p;
    },
    function (p, v) {
      p.constrained_evidence -= +v["er_constrained"];
      p.optimized_null_evidence -= +v["er_optimized_null"];
      return p;
    },
    function () {
      return { constrained_evidence : 0, optimized_null_evidence : 0 };
    }
  );


  var composite = dc.compositeChart(c);

  composite
      .width($(window).width())
      .height(480)
      .dimension(site_index)
      .x(d3.scale.linear().domain([site_index.bottom(1)[0].site_index, site_index.top(1)[0].site_index]))
      .yAxisLabel("The Y Axis")
      .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
      .renderHorizontalGridLines(true)
      .compose([
        dc.lineChart(composite)
          //.dimension(site_index)
          //.colors('red')
          .group(sitesByConstrained)
          .valueAccessor(function(d) {
              return d.value.constrained_evidence;
          })
          .keyAccessor(function(d) {
              return d.key;
          }), 
        dc.lineChart(composite)
          //.dimension(site_index_o)
          .group(sitesByConstrained)
          .valueAccessor(function(d) {
              return d.value.optimized_null_evidence;
          })
          .keyAccessor(function(d) {
              return d.key;
          })
          .colors(d3.scale.ordinal().range(['red']))
      ]);
      //.brushOn(true);

  //var constrained_chart = dc.lineChart(c);


  //constrained_chart 
  //  .width($(window).width()/2)
  //  .height(300)
  //  .margins({top: 10, right: 50, bottom: 30, left: 60})
  //  .dimension(site_index)
  //  .group(sitesByConstrained)
  //  .valueAccessor(function(d) {
  //      return d.value.constrained_evidence;
  //  })
  //  //.x(d3.scale.linear().domain([site_index.bottom(1)[0].site_index, site_index.top(1)[0].site_index]))
  //  .x(d3.scale.linear())
  //  .elasticX(true)
  //  .keyAccessor(function(d) {
  //      return d.key;
  //  })
  //  .renderHorizontalGridLines(true)
  //  .elasticY(true)
  //  .brushOn(true)
  //  .title("Constrained Evidence Ratio")
  //  .xAxis().ticks(5).tickFormat(d3.format("d"));

  //optimized_null 
  //  .width($(window).width()/2)
  //  .height(300)
  //  .margins({top: 10, right: 50, bottom: 30, left: 60})
  //  .dimension(site_index_o)
  //  .group(sitesByOptimizedNull)
  //  .valueAccessor(function(d) {
  //      return d.value.optimized_null_evidence;
  //  })
  //  //.x(d3.scale.linear().domain([site_index_o.bottom(1)[0].site_index, site_index_o.top(1)[0].site_index]))
  //  .x(d3.scale.linear())
  //  .elasticX(true)
  //  .keyAccessor(function(d) {
  //      return d.key;
  //  })
  //  .renderHorizontalGridLines(true)
  //  .elasticY(true)
  //  .brushOn(true)
  //  .title("Constrained Evidence Ratio")
  //  .xAxis().ticks(5).tickFormat(d3.format("d"));

  // Render the table
  dc.dataTable(".dc-data-table")
      .dimension(site_index)
      // data table does not use crossfilter group but rather a closure
      // as a grouping function
      .group(function (d) {
        return site_index.bottom(1)[0].site_index + " - " + site_index.top(1)[0].site_index;
      })
      .size(site_index.groupAll().reduceCount().value()) // (optional) max number of records to be shown, :default = 25
      // dynamic columns creation using an array of closures
      .columns([
          function (d) {
              return d.site_index;
          },
          function (d) {
              return d["unconstrained"];
          },
          function (d) {
              return d["constrained"];
          },
          function (d) {
              return d["optimized_null"];
          },
          function (d) {
              return d["er_constrained"];
          },
          function (d) {
              return d["er_optimized_null"];
          },

      ])
      // (optional) sort using the given field, :default = function(d){return d;}
      .sortBy(function (d) {
          return d.site_index;
      })
      // (optional) sort order, :default ascending
      .order(d3.ascending)
      // (optional) custom renderlet to post-process chart using D3
      .renderlet(function (table) {
          table.selectAll(".dc-table-group").classed("info", true);
      });

  dc.renderAll();

}
