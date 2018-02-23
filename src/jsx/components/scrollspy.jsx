var React = require("react");
import Scrollchor from "react-scrollchor";

var ScrollSpy = React.createClass({
  render: function() {
    var list_items = this.props.info.map(function(item, index) {
      var is_active = index == 0 ? "active" : "",
        href = "#" + item.href;
      return (
        <li className={is_active} key={item.label}>
          <Scrollchor animate={{duration: 20}} to={href}>{item.label}</Scrollchor>
        </li>
      );
    });
    return (
      <nav className="col-sm-2 bs-docs-sidebar hidden-xs hidden-sm hidden-md">
        <ul className="nav nav-pills nav-stacked fixed">
          {list_items}
        </ul>
      </nav>
    );
  }
});

module.exports.ScrollSpy = ScrollSpy;
