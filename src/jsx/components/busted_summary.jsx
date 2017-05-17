var React = require('react');
import {InputInfo} from './input_info';

var BUSTEDSummary = React.createClass({
  render: function(){
    return (
      <div className="col-md-12">
        <ul className="list-group">
        <li className="list-group-item list-group-item-info">
          <h3 className="list-group-item-heading">
            <i className="fa fa-list" styleName='margin-right: 10px'></i>
            <span id="summary-method-name">BUSTED</span> summary</h3>
            There is <strong>{this.props.test_result.statement}</strong> of episodic diversifying selection, with LRT p-value of {this.props.test_result.p}.
            <p>
              <small>Please cite <a href={this.props.pmid.href} id='summary-pmid'>{this.props.pmid.text}</a> if you use this result in a publication, presentation, or other scientific work.</small>
            </p>
         </li>
        </ul>
      </div>
    )
  }
});

module.exports.BUSTEDSummary = BUSTEDSummary;
