import React, { Component} from 'react';
import { InputInfo } from "./input_info";

          
class MethodHeader extends Component{
  render() {
    return (
      <div className="row">
        <div className="clearance" id="summary-div"></div>
        <div className="col-md-12">
         <h3 className="list-group-item-heading">
           <span id="summary-method-name">{this.props.methodName}</span>
            <br />
            <span className="results-summary">results sumary</span>
         </h3>
        </div>
        <div className="col-md-12">
          <InputInfo input_data={this.props.input_data} json={this.props.json} hyphy_vision={this.props.hyphy_vision}/>
       </div>
       </div>
     )
  }
}

module.exports.MethodHeader = MethodHeader;
