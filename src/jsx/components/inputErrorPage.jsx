import React from "react";
const ReactDOM = require("react-dom");

function InputErrorPage(props) {
  return (
    <div className="row">
      <div className="clearance" id="summary-div" />
      <div className="col-md-12">
        <h3 className="list-group-item-heading">
          <span id="summary-method-name">
            ERROR: This JSON format is not compatible with HyPhy Vision
          </span>
        </h3>
      </div>
    </div>
  );
}

function render_inputErrorPage(element) {
  ReactDOM.render(<InputErrorPage />, document.getElementById(element));
}

module.exports = render_inputErrorPage;
