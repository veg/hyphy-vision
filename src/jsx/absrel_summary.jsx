var BSRELSummary = React.createClass({

  float_format : d3.format(".2f"),

  countBranchesTested: function(branches_tested) {

    if(branches_tested) {
      return branches_tested.split(';').length;
    } else {
      return 0;
    }

  },

  getBranchesWithEvidence : function(test_results) {

    var self = this;
    return _.filter(test_results, function(d) { return d.p <= .05 }).length;

  },

  getTestBranches : function(test_results) {

    var self = this;
    return _.filter(test_results, function(d) { return d.tested > 0 }).length;

  },

  getTotalBranches : function(test_results) {

    var self = this;
    return _.keys(test_results).length;

  },

  getInitialState: function() {

    var self = this;

    return { 
              branches_with_evidence : this.getBranchesWithEvidence(self.props.test_results), 
              test_branches : this.getTestBranches(self.props.test_results),
              total_branches : this.getTotalBranches(self.props.test_results)
           };
  },

  componentWillReceiveProps: function(nextProps) {

    this.setState({
                    branches_with_evidence : this.getBranchesWithEvidence(nextProps.test_results), 
                    test_branches : this.getTestBranches(nextProps.test_results),
                    total_branches : this.getTotalBranches(nextProps.test_results)
                  });

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
  React.render(
    <BSRELSummary test_results={test_results} pmid={pmid} />,
    document.getElementById(element)
  );
}

