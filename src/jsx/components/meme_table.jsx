var React = require("react"),
  d3 = require("d3");

import { DatamonkeyTable } from "./shared_summary.jsx";


class MEMETable extends React.Component {
  render(){
    if (this.props.header){
      var headerData = this.props.header.map(pair=>{ return {value:pair[0], abbr:pair[1]}; }),
        formatter = d3.format('.2f'),
        bodyData = this.props.rows.map(row=>row.map(entry=>formatter(entry)));
    }
    return (<div className="row">
      <div className="col-md-12" id="table-tab">
        <h4 className="dm-table-header">
          MEME data
          <span className="glyphicon glyphicon-info-sign" style={{"verticalAlign": "middle", "float":"right"}} aria-hidden="true" data-toggle="popover" data-trigger="hover" title="Actions" data-html="true" data-content="<ul><li>Hover over a column header for a description of its content.</li></ul>" data-placement="bottom"></span>
        </h4>
          <DatamonkeyTable 
            headerData={headerData}
            bodyData={bodyData}
            paginate={20}
          />
      </div>
    </div>);
  }
}

module.exports.MEMETable = MEMETable; 
