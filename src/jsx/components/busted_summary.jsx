var React = require('react');
import {InputInfo} from './input_info';

var BUSTEDSummary = React.createClass({
  render: function(){
    var significant = this.props.test_result.p < .05,
        message;
    if(significant){
      message = (<p>
        BUSTED <strong className="hyphy-highlight">found evidence</strong> (LRT, p-value &le; .05) of gene-wide episodic diversifying selection in the selected foreground of your phylogeny. Therefore, there is evidence that at least one site on at least one foreground branch has experienced diversifying selection. 
      </p>);
    }else{
      message = (<p>
        BUSTED <strong className="hyphy-highlight">found no evidence</strong> (LRT, p-value &le; .05) of gene-wide episodic diversifying selection in the selected foreground of your phylogeny. Therefore, there is no evidence that any sites have experienced diversifying selection along the foreground branch(es). 
      </p>);
    }
    return (
      <div className="row" id="summary-div">
        <div className="col-md-8">
          <h3 className="list-group-item-heading">
            <span id="summary-method-name">BUSTED summary</span>
          </h3>
          <div className="main-result">
            {message}
            <hr/>
            <p>
              <small>
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
