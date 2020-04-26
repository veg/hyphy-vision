var React = require("react");

function Header(props) {
  var popover;
  if (props.popover) {
    popover = (
      <span
        className="fas fa-info-circle"
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
  $('[data-toggle="popover"]').popover();
  return (
    <h4 className="dm-table-header mb-3">
      {props.title}
      {popover}
    </h4>
  );
}

export { Header };
