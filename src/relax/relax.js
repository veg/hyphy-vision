if (!datamonkey) {
    var datamonkey = {};
}

datamonkey.relax = function() {

    //// Summary
    //analysis_data = json;
    //d3.select('#summary-pmid').text("PubMed ID " + json['PMID'])
    //    .attr("href", "http://www.ncbi.nlm.nih.gov/pubmed/" + json['PMID']);

    //var relaxation_K = json["fits"]["Alternative"]["K"];
    //var p = json["relaxation-test"]["p"];

    //d3.select('#summary-direction').text(relaxation_K > 1 ? 'intensification' : 'relaxation');
    //d3.select('#summary-evidence').text(p <= alpha_level ? 'significant' : 'not significant');
    //d3.select('#summary-pvalue').text(p_value_format(p));
    //d3.select('#summary-LRT').text(fit_format(json["relaxation-test"]["LR"]));
    //d3.select('#summary-K').text(fit_format(relaxation_K));
    //d3.select("#datamonkey-relax-error").style('display', 'none');

};

function getDistributions(json) {

  var omega_distributions = {};
  for (var m in json["fits"]) {
      var this_model = json["fits"][m];
      omega_distributions[m] = {};
      var distributions = [];
      for (var d in this_model["rate-distributions"]) {
          var this_distro = this_model["rate-distributions"][d];
          var this_distro_entry = [d, "", "", ""];
          omega_distributions[m][d] = this_distro.map(function(d) {
              return {
                  'omega': d[0],
                  'weight': d[1]
              };
          });
      }
  }

  _.each(omega_distributions, function(item,key) { 
    item.key   = key.toLowerCase().replace(/ /g, '-'); 
    item.label = key; 
  });

  var omega_distributions = _.filter(omega_distributions, function(item) {
    return _.isObject(item["Reference"]);
  });

  return omega_distributions;

}

//{ this.model.props.key }
//{ this.props.model.label }
//"export-{{this.props.model.key}}-svg"

