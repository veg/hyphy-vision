var RELAX = React.createClass({

  float_format : d3.format(".2f"),

  loadFromServer : function() {

    var self = this;
    d3.json(this.props.url, function(data) {

      data["fits"]["Partitioned MG94xREV"]["branch-annotations"] = self.formatBranchAnnotations(data, "Partitioned MG94xREV");
      data["fits"]["General Descriptive"]["branch-annotations"] = self.formatBranchAnnotations(data, "General Descriptive");
      data["fits"]["Null"]["branch-annotations"] = self.formatBranchAnnotations(data, "Null");
      data["fits"]["Alternative"]["branch-annotations"] = self.formatBranchAnnotations(data, "Alternative");
      data["fits"]["Partitioned Exploratory"]["branch-annotations"] = self.formatBranchAnnotations(data, "Partitioned Exploratory");

      var annotations = data["fits"]["Partitioned MG94xREV"]["branch-annotations"],
          json = data,
          pmid = data["PMID"],
          test_results = data["relaxation_test"];

      self.setState({
                      annotations : annotations,
                      json : json,
                      pmid : pmid,
                      test_results : test_results
                    });

    });

  },

  getDefaultProps: function() {

    var edgeColorizer = function(element, data) {

      var self = this,
          scaling_exponent = 0.33,
          omega_format = d3.format(".3r");

      var omega_color = d3.scale.pow().exponent(scaling_exponent)
          .domain([0, 0.25, 1, 5, 10])
          .range(
            self.options()["color-fill"]
              ? ["#DDDDDD", "#AAAAAA", "#888888", "#444444", "#000000"]
              : ["#6e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"])
          .clamp(true);


      if (data.target.annotations) {
          element.style('stroke', omega_color(data.target.annotations.length) || null);
          $(element[0][0]).tooltip('destroy');
          $(element[0][0]).tooltip({
              'title': omega_format(data.target.annotations.length),
              'html': true,
              'trigger': 'hover',
              'container': 'body',
              'placement': 'auto'
          })
      } else {
          element.style('stroke', null);
          $(element[0][0]).tooltip('destroy');
      }

      var selected_partition = $("#hyphy-tree-highlight").attr("value");
      
      if(selected_partition && this.get_partitions()) {
        var partitions = this.get_partitions()[selected_partition];

        element.style('stroke-width', (partitions && partitions[data.target.name]) ? '8' : '4')
            .style('stroke-linejoin', 'round')
            .style('stroke-linecap', 'round');
      }

    }

    return {
      edgeColorizer : edgeColorizer
    };


  },

  getInitialState: function() {

        var model_fits_id = "#hyphy-model-fits",
            omega_plots_id = "#hyphy-omega-plots",
            summary_id = "#hyphy-relax-summary",
            tree_id = "#tree-tab";

        var tree_settings = {
            'omegaPlot': {},
            'tree-options': {
                /* value arrays have the following meaning
                    [0] - the value of the attribute
                    [1] - does the change in attribute value trigger tree re-layout?
                */
                'hyphy-tree-model': ["Partitioned MG94xREV", true],
                'hyphy-tree-highlight': ["RELAX.test", false],
                'hyphy-tree-branch-lengths': [true, true],
                'hyphy-tree-hide-legend': [true, false],
                'hyphy-tree-fill-color': [true, false]
            },
            'suppress-tree-render': false,
            'chart-append-html' : true,
            'edgeColorizer' : this.props.edgeColorizer
        };

    return { 
              annotations : null,
              json : null,
              pmid : null,
              settings : tree_settings,
              test_results : null,
              tree : null,
           };

  },

  componentWillMount: function() {
    this.loadFromServer();
    this.setEvents();
  },

  setEvents : function() {

    var self = this;

    $("#datamonkey-relax-load-json").on("change", function(e) {
        var files = e.target.files; // FileList object

        if (files.length == 1) {
            var f = files[0];
            var reader = new FileReader();

            reader.onload = (function(theFile) {
              return function(e) {
                var data = JSON.parse(this.result);
                data["fits"]["Partitioned MG94xREV"]["branch-annotations"] = self.formatBranchAnnotations(data, "Partitioned MG94xREV");
                data["fits"]["General Descriptive"]["branch-annotations"] = self.formatBranchAnnotations(data, "General Descriptive");
                data["fits"]["Null"]["branch-annotations"] = self.formatBranchAnnotations(data, "Null");
                data["fits"]["Alternative"]["branch-annotations"] = self.formatBranchAnnotations(data, "Alternative");
                data["fits"]["Partitioned Exploratory"]["branch-annotations"] = self.formatBranchAnnotations(data, "Partitioned Exploratory");

                var annotations = data["fits"]["Partitioned MG94xREV"]["branch-annotations"],
                    json = data,
                    pmid = data["PMID"],
                    test_results = data["relaxation_test"];

                self.setState({
                                annotations : annotations,
                                json : json,
                                pmid : pmid,
                                test_results : test_results
                              });
              }

            })(f);
            reader.readAsText(f);
        }

        $("#datamonkey-absrel-toggle-here").dropdown("toggle");
        e.preventDefault();
    });


  },

  formatBranchAnnotations : function(json, key) {

    var initial_branch_annotations = json["fits"][key]["branch-annotations"];

    if(!initial_branch_annotations) {
      initial_branch_annotations = json["fits"][key]["rate distributions"];
    }

    // Iterate over objects
    branch_annotations = _.mapObject(initial_branch_annotations, function(val, key) {
      return {"length" : val};
    });

    return branch_annotations;

  },

  initialize : function() {},

  render: function() {

    var self = this;

    return (
      <div className="tab-content">
         <div className="tab-pane active" id="datamonkey-relax-summary-tab">
             <div id="hyphy-relax-summary" className="row">
             </div>
             <div id="hyphy-model-fits" className="row">
               <ModelFits json={self.state.json} />
             </div>
             <div id="hyphy-omega-plots" className="row">
               <OmegaPlotGrid json={self.state.json} />
             </div>
         </div>
         <div className='tab-pane' id="tree-tab">
           <Tree json={self.state.json} 
                 settings={self.state.settings} />
         </div>
      </div>
    )
  }
});



// Will need to make a call to this
// omega distributions
function render_relax(url, element) {
  React.render(
    <RELAX url={url} />,
    document.getElementById(element)
  );
}

               //<RELAXSummary test_results={self.state.test_results} 
               //              pmid={self.state.pmid} />
           //<Tree json={self.state.json} 
           //      settings={self.state.settings} />

