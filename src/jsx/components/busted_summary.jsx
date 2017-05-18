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
              BUSTED found <strong>{this.props.test_result.statement}</strong> of episodic diversifying selection, with LRT p-value of {this.props.test_result.p}.
            </p>
            <p>
              <small>Please cite <a href={this.props.pmid.href} id='summary-pmid'>{this.props.pmid.text}</a> if you use this result in a publication, presentation, or other scientific work.</small>
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
