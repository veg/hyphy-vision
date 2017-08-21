var React = require("react");

var ScrollSpy = React.createClass({
  render: function() {
    var list_items = this.props.info.map(function(item, index) {
      var is_active = index == 0 ? "active" : "",
        href = "#" + item.href;
      return (
        <li className={is_active} key={item.label}>
          <a href={href}>{item.label}</a>
        </li>
      );
    });
    return (
      <nav className="col-sm-2 bs-docs-sidebar">
        <ul className="nav nav-pills nav-stacked fixed">
          {list_items}
        </ul>
      </nav>
    );
  }
});

module.exports.ScrollSpy = ScrollSpy;
