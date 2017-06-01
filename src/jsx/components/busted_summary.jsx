var React = require('react');
import {InputInfo} from './input_info';

var BUSTEDSummary = React.createClass({
  render: function(){
    return (
      <div className="row" id="summary-div">
        <div className="col-md-8">
          <h3 className="list-group-item-heading">
            <span id="summary-method-name">BUSTED summary</span>
          </h3>
          <div className="main-result">
            <p>
              BUSTED <strong className="hyphy-highlight">found {this.props.test_result.statement}</strong><sup>†</sup> of episodic diversifying selection (LRT P-value={this.props.test_result.p}) in the selected foreground of your phylogeny. Therefore, there is evidence that at least one site on at least one foreground branch has experienced diversifying selection. 
            </p>
            <hr/>
            <p>
              <small>
                <sup>†</sup> LRT, p ≤ 0.05.
                <br/>
              See <a href="http://hyphy.org/methods/selection-methods/#busted">here</a> for more information about the BUSTED method.
              <br/>Please cite <a href="http://www.ncbi.nlm.nih.gov/pubmed/25701167" id="summary-pmid" target="_blank">PMID 25701167</a> if you use this result in a publication, presentation, or other scientific work.
            </small>
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <InputInfo input_data={this.props.input_data}/>
        </div>
      </div>
    )
  }
});

module.exports.BUSTEDSummary = BUSTEDSummary;
