var React = require("react"),
  d3 = require("d3");

import { DatamonkeyTable } from "./tables.jsx";

class MEMETable extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.state = {
      bodyData: null,
      value: 10,
      filter: 0.1
    };
  }
  componentWillReceiveProps(nextProps) {
    var formatter = d3.format(".2f"),
      new_rows = nextProps.rows.map(row => row.map(entry => formatter(entry)));
    this.setState({
      bodyData: new_rows
    });
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  handleMouseUp(event) {
    this.setState({ filter: event.target.value / 100 });
  }
  render() {
    if (this.props.header) {
      var headerData = this.props.header.map(pair => {
          return { value: pair[0], abbr: pair[1] };
        }),
        bodyData = this.state.bodyData.filter(
          row => row[6] < this.state.filter
        );
    }
    var self = this;
    return (
      <div className="row">
        <div className="col-md-12" id="table-tab">
          <h4 className="dm-table-header">
            MEME data
            <span
              className="glyphicon glyphicon-info-sign"
              style={{ verticalAlign: "middle", float: "right" }}
              aria-hidden="true"
              data-toggle="popover"
              data-trigger="hover"
              title="Actions"
              data-html="true"
              data-content="<ul><li>Hover over a column header for a description of its content.</li></ul>"
              data-placement="bottom"
            />
          </h4>
          <div style={{ width: "500px" }}>
            <span
              style={{
                width: "35%",
                display: "inline-block",
                verticalAlign: "middle"
              }}
            >
              p-value threshold: {self.state.value / 100}
            </span>
            <input
              type="range"
              id="myRange"
              value={self.state.value}
              style={{
                width: "65%",
                display: "inline-block",
                verticalAlign: "middle"
              }}
              onChange={this.handleChange}
              onMouseUp={this.handleMouseUp}
            />
          </div>
          <DatamonkeyTable
            headerData={headerData}
            bodyData={bodyData}
            paginate={20}
          />
        </div>
      </div>
    );
  }
}

module.exports.MEMETable = MEMETable;
