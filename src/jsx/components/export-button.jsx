const React = require("react"),
  _ = require("underscore");

const pd = require("pretty-data").pd;

import { saveAs } from "file-saver";
import ReactJson from "react-json-view";
import Alignment from "alignment.js";

class ExportButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      fasta: false
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

  render() {

    return (
      <div className="row" id="input-info">
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
              {this.props.originalFile ? (
                <li className="dropdown-item">
                  <a
                    href={
                      window.location.href + "/original_file/original.fasta"
                    }
                  >
                    Original file
                  </a>
                </li>
              ) : null}
              {this.props.analysisLog ? (
                <li className="dropdown-item">
                  <a href={window.location.href + "/log.txt/"}>Analysis log</a>
                </li>
              ) : null}
              {this.props.fasta ? (
                <li className="dropdown-item">
                  <a onClick={() => this.open("msa")}>View MSA</a>
                </li>
              ) : null}
              {this.props.partitionedData ? (
                <li className="dropdown-item">
                  <a href={window.location.href + "/screened_data/"}>
                    Partitioned data
                  </a>
                </li>
              ) : null}
              <li className="dropdown-item">
                <a onClick={() => this.saveTheJSON()}>Save JSON</a>
              </li>
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
            <div
              className="modal-content"
              style={{ width: "850px", height: "550px" }}
            >
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
                  <div style={{ overflowY: "scroll", height: "400px" }}>
                    <ReactJson
                      src={this.props.json}
                      collapsed={1}
                      displayDataTypes={false}
                      enableClipboard={false}
                    />
                  </div>
                ) : null}
                {this.state.showModal == "msa" ? (
                  <Alignment
                    fasta={this.props.fasta}
                    width={800}
                    height={500}
                  />
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

export { ExportButton };
