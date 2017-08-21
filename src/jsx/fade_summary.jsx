var React = require("react"),
  d3 = require("d3");

var FadeSummary = React.createClass({
  float_format: d3.format(".2f"),

  countBranchesTested: function(branches_tested) {
    if (branches_tested) {
      return branches_tested.split(";").length;
    } else {
      return 0;
    }
  },

  getDefaultProps: function() {
    return {
      subs: []
    };
  },

  componentDidMount: function() {
    this.setProps({
      alpha_level: 0.05,
      sequences: this.props.msa.sequences,
      subs: this.props.fade_results["TREE_LENGTHS"][0],
      sites: this.props.msa.sites,
      model: this.props.fade_results["MODEL_INFO"],
      grid_desc: this.props.fade_results["GRID_DESCRIPTION"],
      branches_tested: this.props.fade_results["BRANCHES_TESTED"]
    });
  },

  render: function() {
    var self = this;

    return (
      <dl className="dl-horizontal">
        <dt>Data summary</dt>
        <dd>
          {this.props.sequences} sequences with {this.props.partitions}{" "}
          partitions.
        </dd>
        <dd>
          <div className="alert">
            These sequences have not been screened for recombination. Selection
            analyses of alignments with recombinants in them using a single tree
            may generate <u>misleading</u> results.
          </div>
        </dd>
        {this.props.msa.partition_info.map(function(partition, index) {
          return (
            <div>
              <dt>
                Partition {partition["partition"]}
              </dt>
              <dd>
                {" "}{self.float_format(self.props.subs[index])} subs/ aminoacid
                site
              </dd>
              <dd>
                {partition["endcodon"] - partition["startcodon"]} aminoacids
              </dd>
            </div>
          );
        })}
        <dt>Settings</dt>
        <dd>
          {this.props.model}
        </dd>
        <dd>
          {this.props.grid_desc}
        </dd>
        <dd>
          Directional model applied to{" "}
          {self.countBranchesTested(this.props.branches_tested)} branches
        </dd>
      </dl>
    );
  }
});

// Will need to make a call to this
// omega distributions
function render_fade_summary(json, msa) {
  React.render(
    <FadeSummary fade_results={json} msa={msa} />,
    document.getElementById("summary-div")
  );
}

module.exports = render_fade_summary;
