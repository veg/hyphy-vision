var React = require("react");
import { Link } from "react-router-dom";

const hyphy_logo = require("../../../images/hyphy-logo.svg");

var Hamburger = React.createClass({
  render: function() {
    return (
      <button
        type="button"
        className="navbar-toggle"
        data-toggle="collapse"
        data-target="#navbar-collapse-1"
      >
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar" />
        <span className="icon-bar" />
        <span className="icon-bar" />
      </button>
    );
  }
});

var Methods = React.createClass({
  render: function() {
    return (
      <div className="dropdown toolbar-dropdown">
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          data-toggle="dropdown"
        >
          Tools
          <span className="caret" />
        </button>
        <ul className="dropdown-menu">
          <li>
            <Link to="../absrel">aBSREL</Link>
          </li>
          <li>
            <Link to="../relax">RELAX</Link>
          </li>
          <li>
            <Link to="../busted">BUSTED</Link>
          </li>
          <li>
            <Link to="../slac">SLAC</Link>
          </li>
          <li>
            <Link to="../fel">FEL</Link>
          </li>
          <li>
            <Link to="../meme">MEME</Link>
          </li>
          <li>
            <Link to="../fubar">FUBAR</Link>
          </li>
          <li>
            <Link to="../gard">GARD</Link>
          </li>
          <li role="separator" className="divider" />
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </div>
    );
  }
});

var NavBar = React.createClass({
  render: function() {
    var self = this,
      input_style = {
        position: "absolute",
        top: 0,
        right: 0,
        minWidth: "100%",
        minHeight: "100%",
        fontSize: "100px",
        textAlign: "right",
        filter: "alpha(opacity=0)",
        opacity: 0,
        outline: "none",
        background: "white",
        cursor: "inherit",
        display: "block"
      };
    return (
      <nav
        className="navbar navbar-default navbar-fixed-top main-nav"
        role="navigation"
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <Link to="/">
                <img id="hyphy-logo" src={hyphy_logo} />
              </Link>
              <div className="navbar-header">
                <Hamburger />
              </div>

              <div className="collapse navbar-collapse" id="navbar-collapse-1">
                <ul className="nav navbar-nav">
                  <a
                    className="nav-button"
                    role="button"
                    style={{ position: "relative", overflow: "hidden" }}
                  >
                    {this.props.onFileChange
                      ? <input
                          type="file"
                          style={input_style}
                          id="dm-file"
                          onChange={self.props.onFileChange}
                        />
                      : null}
                    Load
                  </a>
                  <a
                    href="#"
                    className="nav-button"
                    role="button"
                    style={{ display: "none" }}
                  >
                    Export
                  </a>
                </ul>
                <Methods />
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports.NavBar = NavBar;
