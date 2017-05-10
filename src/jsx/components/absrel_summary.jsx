var React = require('react');
import {InputInfo} from './input_info.jsx';
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
    return _.filter(test_results, function(d) { return d.p <= 0.05 }).length;

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

    var self = this,
        user_message,
        was_evidence = self.state.branches_with_evidence > 0;

    if(was_evidence){
      user_message = (
        <p className="list-group-item-text label_and_input">
          aBSREL <strong className="hyphy-highlight">found evidence</strong><sup>†</sup> of episodic diversifying selection on <span className="hyphy-highlight"><strong>{self.state.branches_with_evidence}</strong></span> out 
          of <span className="hyphy-highlight"><strong>{self.state.test_branches}</strong></span> branches in your phylogeny.
        </p>
      );
    }else{
      user_message = (
        <p className="list-group-item-text label_and_input">
          aBSREL <strong>found no evidence</strong><sup>†</sup> of episodic diversifying selection in your phylogeny.
        </p>
      )
    }

    return (
      <div className="row" id="summary-div" >
        <div className="col-md-8">
          <h3 className="list-group-item-heading">
            <span id="summary-method-name">adaptive Branch Site REL - Results summary</span>
          </h3>
          <div className="main-result">
            {user_message}
            <p>
              A total of <strong className="hyphy-highlight">X</strong> branches were formally tested for diversifying selection.
              Significance and number of rate categories inferred at each branch are provided in the <a href="#table-tab">detailed results</a> table.
              For more information about the aBSREL method, see <a href="http://hyphy.org/methods/selection-methods/#absrel">this link</a>.
            </p>
            <hr/>
            <p>
              <small>
                <sup>†</sup><abbr title="Likelihood Ratio Test">LRT</abbr> p ≤ 0.05, corrected for multiple testing.
              </small>
            </p>
          </div>
          <p>
            <small>
              Please cite <a href="http://www.ncbi.nlm.nih.gov/pubmed/25697341" id="summary-pmid" target="_blank">PMID 25697341</a> if you use this result in a publication, presentation, or other scientific work.
            </small>
          </p>
        </div>

        <div className="col-md-4">
          <InputInfo input_data={this.props.input_data}/>
        </div>
      </div>
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

module.exports.BSRELSummary = BSRELSummary;
module.exports.render_absrel_summary = render_absrel_summary;
