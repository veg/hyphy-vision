var React = require("react");

function Header(props) {
  var popover;
  if (props.popover) {
    popover = (
      <span
        className="glyphicon glyphicon-info-sign"
        style={{
          verticalAlign: "middle",
          float: "right",
          minHeight: "30px",
          minWidth: "30px"
        }}
        aria-hidden="true"
        data-toggle="popover"
        data-trigger="hover"
        title="Actions"
        data-html="true"
        data-content={props.popover}
        data-placement="bottom"
      />
    );
  }
  return (
    <h4 className="dm-table-header">
      {props.title}
      {popover}
    </h4>
  );
}

module.exports.Header = Header;
