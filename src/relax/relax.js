if (!datamonkey) {
    var datamonkey = {};
}

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

