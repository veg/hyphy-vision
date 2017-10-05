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
  console.log(props.json);
  return (<div id="input-info">
    <span className="hyphy-highlight">INPUT DATA</span> <span className="divider">|</span>
    <a onClick={saveTheJson}>{filename}</a>
    <span className="divider">|</span>
    <span className="hyphy-highlight">{props.input_data['number of sequences']}</span> sequences <span className="divider">|</span>
    <span className="hyphy-highlight">{props.input_data['number of sites']}</span> sites
  </div>);
}

module.exports.InputInfo = InputInfo;

