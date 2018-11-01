var React = require("react");
import { Link } from "react-router-dom";

const hyphy_logo = require("../../../images/hyphy-logo.svg");

// eslint-disable-next-line
var Hamburger = React.createClass({
  render: function() {
    return (
      <button
        type="button"
        className="navbar-toggler"
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
    var self = this;
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
            <Link onClick={() => self.props.changeMethod()} to="../absrel">
              aBSREL
            </Link>
          </li>
          <li>
            <Link onClick={() => self.props.changeMethod()} to="../relax">
              RELAX
            </Link>
          </li>
          <li>
            <Link onClick={() => self.props.changeMethod()} to="../busted">
              BUSTED
            </Link>
          </li>
          <li>
            <Link onClick={() => self.props.changeMethod()} to="../slac">
              SLAC
            </Link>
          </li>
          <li>
            <Link onClick={() => self.props.changeMethod()} to="../fel">
              FEL
            </Link>
          </li>
          <li>
            <Link onClick={() => self.props.changeMethod()} to="../meme">
              MEME
            </Link>
          </li>
          <li>
            <Link onClick={() => self.props.changeMethod()} to="../fubar">
              FUBAR
            </Link>
          </li>
          <li>
            <Link onClick={() => self.props.changeMethod()} to="../gard">
              GARD
            </Link>
          </li>
          <li>
            <Link onClick={() => self.props.changeMethod()} to="../bgm">
              BGM
            </Link>
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
        className="navbar navbar-expand-lg navbar-light bg-light fixed-top"
        role="navigation"
      >
        <div className="container">
          <a className="navbar-brand" href="/">
            <img id="hyphy-logo" src={hyphy_logo} />
          </a>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              <Methods changeMethod={self.props.changeMethod} />
              {this.props.onFileChange ? (
                <a
                  className="nav-button"
                  role="button"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    width: "106px",
                    textAlign: "center"
                  }}
                >
                  <input
                    type="file"
                    style={input_style}
                    id="dm-file"
                    onChange={self.props.onFileChange}
                  />
                  Load
                </a>
              ) : null}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports.NavBar = NavBar;
