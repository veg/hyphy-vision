import React from "react";
import { InputInfo } from "./input_info";

function MethodHeader(props) {
  return (
    <div className="row">
      <div className="clearance" id="summary-div" />
      <div className="col-md-12">
        <h3 className="list-group-item-heading">
          <span id="summary-method-name">{props.methodName}</span>
          <br />
          <span className="results-summary">results sumary</span>
        </h3>
      </div>
      <div className="col-md-12">
        <InputInfo
          input_data={props.input_data}
          json={props.json}
          fasta={props.fasta}
          platform={props.platform}
        />
      </div>
    </div>
  );
}

module.exports.MethodHeader = MethodHeader;
