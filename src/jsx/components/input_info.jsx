var React = require("react"),
  _ = require('underscore');
import { saveAs } from 'file-saver';


function InputInfo(props){
  function saveTheJson(){
    var blob = new Blob([JSON.stringify(props.json)], {
      type: "text/plain:charset=utf-8;"
    });
    saveAs(blob, "result.json");
  };
  if(!props.input_data) return <div></div>;
  var is_full_path = props.input_data['file name'].indexOf('/') != -1,
    filename = is_full_path ? _.last(props.input_data['file name'].split('/')) : props.input_data['file name'];
  return (
    <div id="input-info">
    <div className="row">
    <span className="hyphy-highlight">INPUT DATA</span> <span className="divider">|</span>
    <span className="hyphy-highlight">{filename}</span>
    <span className="divider">|</span>
    <span className="hyphy-highlight">{props.input_data['number of sequences']}</span> sequences <span className="divider">|</span>
    <span className="hyphy-highlight">{props.input_data['number of sites']}</span> sites <span className="divider">
    </div>

    <div className="row">
    <div className="dropdown hyphy-export-dropdown">
	    <button id="dropdown-menu-button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" type="button"><i className="fa fa-download" aria-hidden="true"></i> Export Results</button>
	    <ul className="dropdown-menu" aria-labelledby="dropdown-menu-button">
	    	<li className="dropdown-item"><a onClick={saveTheJson}>JSON</a></li>
	    </ul>
    </div>
    </div>

  </div>);
}

module.exports.InputInfo = InputInfo;

