var React = require("react");
import Scrollchor from "react-scrollchor";
import { HashLink as Link } from 'react-router-hash-link';

/* 
React-scrollchor doesn't work correctly on Windows Electron and 
react-router-hash-link doesn't allow for offsets to account for headers.
React-router-hash-link is therefore used for Windows-Electron and 
react-scrollchor is used for every other platform.
*/
const configFile = require('../../../config.json');
function scrollElement(href, item, configFile) {
  if (configFile["env"] == "windows electron") {
    return <Link to={href}>{item.label}</Link> 
  }else{
    return <Scrollchor animate={{duration: 20}} to={href}>{item.label}</Scrollchor>
  }
}; 

var ScrollSpy = React.createClass({
  render: function() {
    var list_items = this.props.info.map(function(item, index) {
      var is_active = index == 0 ? "active" : "",
        href = "#" + item.href;
      return (
        <li className={is_active} key={item.label}>
          {scrollElement(href, item, configFile)}          
        </li>
      );
    });
    return (
      <nav className="col-sm-2 bs-docs-sidebar list-group d-lg-none d-xl-block">
        <ul className="nav nav-pills nav-stacked fixed flex-column">
          {list_items}
        </ul>
      </nav>
    );
  }
});

module.exports.ScrollSpy = ScrollSpy;
