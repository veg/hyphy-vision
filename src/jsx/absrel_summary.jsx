var BSRELSummary = React.createClass({

  float_format : d3.format(".2f"),

  countBranchesTested: function(branches_tested) {
    if(branches_tested) {
      return branches_tested.split(';').length;
    } else {
      return 0;
    }
  },

  getBranchesWithEvidence : function() {
    var self = this;
    return _.filter(self.props.test_results, function(d) { return d.p <= .05 }).length;
  },

  getTestBranches : function() {
    var self = this;
    return _.filter(self.props.test_results, function(d) { return d.tested > 0 }).length;
  },

  getTotalBranches : function() {
    var self = this;
    return _.keys(self.props.test_results).length;
  },

  getInitialState: function() {

    return { 
              branches_with_evidence : this.getBranchesWithEvidence(), 
              test_branches : this.getTestBranches(),
              total_branches : this.getTotalBranches()
           };
  },


  componentWillMount: function() {

  },

  render: function() {

    var self = this;

    return (
          <ul className="list-group">
              <li className="list-group-item list-group-item-info">
                  <h3 className="list-group-item-heading">
                    <i className="fa fa-list"></i>
                    <span id="summary-method-name">Adaptive branch site REL</span> summary
                  </h3>
                  <p className="list-group-item-text lead">
                    Evidence<sup>†</sup> of episodic diversifying selection was found on 
                      <strong> {self.state.branches_with_evidence}</strong> out of 
                      <span> {self.state.test_branches}</span> tested branches 
                      (<span>{self.state.total_branches}</span> total branches).
                  </p>
                  <p>
                    <small>
                      <sup>†</sup><abbr title="Likelihood Ratio Test">LRT</abbr> p ≤ 0.05, corrected for multiple testing.
                    </small>
                  </p>
                  <p>
                    <small>
                      Please cite <a href="#" id="summary-pmid">PMID {self.props.pmid}</a> if you use this result in a publication, presentation, or other scientific work.
                    </small>
                  </p>
              </li>
          </ul>
        )
  }

});

// Will need to make a call to this
// omega distributions
function render_absrel_summary(test_results, pmid, element) {
  console.log(pmid);
  React.render(
    <BSRELSummary test_results={test_results} pmid={pmid} />,
    document.getElementById(element)
  );
}

