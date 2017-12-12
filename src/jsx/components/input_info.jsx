var React = require("react"),
  _ = require("underscore");
var pd = require('pretty-data').pd;
import { saveAs } from "file-saver";
import { Modal } from 'react-bootstrap';
import ReactJson from 'react-json-view';

class InputInfo extends React.Component {
  constructor(props){
    super(props);
    this.state = { showModal: false };
  }
  close() {
    this.setState({ showModal: false});
  }
  open() {
    this.setState({ showModal: true});
  }
  render(){
    var self = this;
    function saveTheJson() {
      var blob = new Blob([pd.json(this.props.json)], {
        type: "text/json:charset=utf-8;"
      });
      saveAs(blob, "result.json");
    }
    if (!this.props.input_data) return <div />;
    var is_full_path = this.props.input_data["file name"].indexOf("/") != -1,
      filename = is_full_path
        ? _.last(this.props.input_data["file name"].split("/"))
        : this.props.input_data["file name"];
    var original_button = (<li className="dropdown-item">
      <a href={window.location.href+"/original_file/original.fasta"}>Original file</a>
    </li>);
    return (
      <div className="row" id="input-info">
          <div className="col-md-8">
            <span className="hyphy-highlight">INPUT DATA</span>{" "}
            <span className="divider">|</span>
            <span className="hyphy-highlight">{filename}</span>
            <span className="divider">|</span>
            <span className="hyphy-highlight">
              {this.props.input_data["number of sequences"]}
            </span>{" "}
            sequences <span className="divider">|</span>
            <span className="hyphy-highlight">
              {this.props.input_data["number of sites"]}
            </span>{" "}
            sites
          </div>
          
          <div className="col-md-4" style={{height:0}}>
            <button
              id="dropdown-menu-button"
              className="btn btn-secondary dropdown-toggle"
              data-toggle="dropdown"
              type="button"
              style={{height:30}}
              onClick={()=>this.open()}
            >
              <i className="fa fa-list" aria-hidden="true" /> View JSON
            </button>
            <div className="dropdown hyphy-export-dropdown pull-right">
              <button
                id="dropdown-menu-button"
                className="btn btn-secondary dropdown-toggle"
                data-toggle="dropdown"
                type="button"
                style={{height:30}}
              >
                <i className="fa fa-download" aria-hidden="true" /> Export 
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdown-menu-button">
                {this.props.hyphy_vision ? '' : original_button}
                <li className="dropdown-item">
                  <a onClick={saveTheJson}>JSON</a>
                </li>
              </ul>
            </div>
          </div>

        <Modal show={this.state.showModal} onHide={()=>this.close()}>
          <Modal.Header closeButton>
            JSON viewer
          </Modal.Header>
          <Modal.Body>
            <ReactJson src={this.props.json} collapsed={1} displayDataTypes={false} />
          </Modal.Body>
          <Modal.Footer>
            <button
              id="dropdown-menu-button"
              className="btn btn-secondary dropdown-toggle"
              data-toggle="dropdown"
              type="button"
              style={{height:30}}
              onClick={()=>this.close()}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

module.exports.InputInfo = InputInfo;
