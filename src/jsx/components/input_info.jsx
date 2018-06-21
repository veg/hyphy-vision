var React = require("react"),
  _ = require("underscore");
var pd = require("pretty-data").pd;
import { saveAs } from "file-saver";
import ReactJson from "react-json-view";
import Alignment from "alignment.js";

const d3 = require("d3");

class InputInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      fasta: ""
    };
  }
  close() {
    this.setState({ showModal: false });
  }
  open(content) {
    this.setState({ showModal: content });
    $("#myModal").modal("show");
  }
  saveTheJSON() {
    var blob = new Blob([pd.json(this.props.json)], {
      type: "text/json:charset=utf-8;"
    });
    saveAs(blob, "result.json");
  }
  componentDidMount() {
    const self = this;
    if (this.props.json.fasta) {
      self.setState({ fasta: this.state.json.fasta });
    }
  }
  render() {
    if (!this.props.input_data) return <div />;
    var is_full_path = this.props.input_data["file name"].indexOf("/") != -1,
      filename = is_full_path
        ? _.last(this.props.input_data["file name"].split("/"))
        : this.props.input_data["file name"],
      on_datamonkey = !this.props.hyphy_vision,
      show_partition_button = on_datamonkey && this.props.gard,
      fasta = this.state.fasta;
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

        <div className="col-md-4" style={{ height: 0 }}>
          <div className="dropdown ml-auto">
            <button
              id="dropdown-menu-button"
              className="btn btn-secondary dropdown-toggle"
              data-toggle="dropdown"
              type="button"
              style={{ height: 30 }}
            >
              <i className="fa fa-download" aria-hidden="true" /> Export
            </button>
            <ul
              className="dropdown-menu"
              aria-labelledby="dropdown-menu-button"
            >
              {/* The options shown in the dropdown are highly platform dependent, hence the ternary sea below */}
              {this.props.platform == "dataMonkey"
                ? [
                    <li className="dropdown-item">
                      <a
                        href={
                          window.location.href + "/original_file/original.fasta"
                        }
                      >
                        Original file
                      </a>
                    </li>,
                    <li className="dropdown-item">
                      <a href={window.location.href + "/log.txt/"}>
                        Analysis log
                      </a>
                    </li>
                  ]
                : null}
              {this.props.platform == "dataMonkey" ||
              this.props.platform == "gui"
                ? [
                    <li className="dropdown-item">
                      <a onClick={() => this.open("msa")}>View MSA</a>
                    </li>
                  ]
                : null}
              {show_partition_button ? (
                <li className="dropdown-item">
                  <a href={window.location.href + "/screened_data/"}>
                    Partitioned data
                  </a>
                </li>
              ) : null}
              {this.props.platform != "gui"
                ? [
                    <li className="dropdown-item">
                      <a onClick={() => this.saveTheJSON()}>Save JSON</a>
                    </li>
                  ]
                : null}
              <li className="dropdown-item">
                <a onClick={() => this.open("json")}>View JSON</a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="modal fade"
          id="myModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content" style={{ width: "50rem" }}>
              <div className="modal-header">
                <h4 className="modal-title" id="myModalLabel">
                  {this.state.showModal == "json"
                    ? "JSON viewer"
                    : "Alignment viewer"}
                </h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" id="modal-body">
                {this.state.showModal == "json" ? (
                  <ReactJson
                    src={this.props.json}
                    collapsed={1}
                    displayDataTypes={false}
                    enableClipboard={false}
                  />
                ) : null}
                {this.state.showModal == "msa" ? (
                  <Alignment fasta={fasta} width={800} height={500} />
                ) : null}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn.btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports.InputInfo = InputInfo;
