var React = require("react"),
  _ = require("underscore");
var pd = require('pretty-data').pd;
import { saveAs } from "file-saver";

function InputInfo(props) {
  function saveTheJson() {
    var blob = new Blob([pd.json(props.json)], {
    //var blob = new Blob([JSON.stringify(props.json)], {
      type: "text/json:charset=utf-8;"
    });
    saveAs(blob, "result.json");
  }
  if (!props.input_data) return <div />;
  var is_full_path = props.input_data["file name"].indexOf("/") != -1,
    filename = is_full_path
      ? _.last(props.input_data["file name"].split("/"))
      : props.input_data["file name"];
  return (
    <div className="row" id="input-info">

        <div className="col-md-8">
          <span className="hyphy-highlight">INPUT DATA</span>{" "}
          <span className="divider">|</span>
          <span className="hyphy-highlight">{filename}</span>
          <span className="divider">|</span>
          <span className="hyphy-highlight">
            {props.input_data["number of sequences"]}
          </span>{" "}
          sequences <span className="divider">|</span>
          <span className="hyphy-highlight">
            {props.input_data["number of sites"]}
          </span>{" "}
          sites
        </div>
        
        <div className="col-md-4" style={{height:0}}>
          <div className="dropdown hyphy-export-dropdown pull-right">
            <button
              id="dropdown-menu-button"
              className="btn btn-secondary dropdown-toggle"
              data-toggle="dropdown"
              type="button"
              style={{height:30}}
            >
              <i className="fa fa-download" aria-hidden="true" /> Export Results
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdown-menu-button">
              <li className="dropdown-item">
                <a onClick={saveTheJson}>JSON</a>
              </li>
            </ul>
          </div>
        </div>

    </div>
  );
}

module.exports.InputInfo = InputInfo;
