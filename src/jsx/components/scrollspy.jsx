var React = require("react");
import Scrollchor from "react-scrollchor";
import { HashLink as Link } from "react-router-hash-link";

/* 
React-scrollchor doesn't work correctly on Windows Electron and 
react-router-hash-link doesn't allow for offsets to account for headers.
React-router-hash-link is therefore used for Windows-Electron and 
react-scrollchor is used for every other platform.
*/

const configFile = require("../../../config.json");

function ScrollSpy(props) {
  var list_items = props.info.map(function(item, index) {
    var is_active = index == 0 ? "active" : "";
    var href = "#" + item.href;
    return (
      <li className="nav-item" key={item.label}>
        {configFile["env"] == "windows electron" ? (
          <Link className={is_active + " nav-link"} to={href}>
            {item.label}
          </Link>
        ) : (
          <Scrollchor
            className={is_active + " nav-link"}
            animate={{ duration: 20 }}
            to={href}
          >
            {item.label}
          </Scrollchor>
        )}
      </li>
    );
  });
  return (
    <nav className="col-sm-2 bs-docs-sidebar list-group d-none d-xs-none d-sm-none d-md-none d-lg-none d-xl-block">
      <ul className="nav nav-tabs nav-pills nav-stacked fixed flex-column">
        {list_items}
      </ul>
    </nav>
  );
}

export { ScrollSpy };
