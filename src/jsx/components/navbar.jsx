var React = require("react");

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
            <a href="../absrel">aBSREL</a>
          </li>
          <li>
            <a href="../relax">RELAX</a>
          </li>
          <li>
            <a href="../busted">BUSTED</a>
          </li>
          <li>
            <a href="../slac">SLAC</a>
          </li>
          <li>
            <a href="../fel">FEL</a>
          </li>
          <li>
            <a href="../meme">MEME</a>
          </li>
          <li>
            <a href="../fubar">FUBAR</a>
          </li>
          <li>
            <a href="../gard">GARD</a>
          </li>
          <li role="separator" className="divider"></li>
          <li>
            <a href="/">Home</a>
          </li>
        </ul>
      </div>
    );
  }
});

var NavBar = React.createClass({
  componentDidMount: function() {
    // Corrects navbar offset when clicking anchor hash
    var shiftWindow = function() {
      scrollBy(0, -50);
    };
    if (location.hash) shiftWindow();
    window.addEventListener("hashchange", shiftWindow);
  },
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
      <nav className="navbar navbar-default navbar-fixed-top main-nav" role="navigation">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <a href="/">
                <img id="hyphy-logo" src={hyphy_logo} />
              </a>
              <div className="navbar-header">
                <Hamburger />
              </div>

              <div className="collapse navbar-collapse" id="navbar-collapse-1">
                <ul className="nav navbar-nav">
                  <a
                    href="#"
                    className="nav-button"
                    role="button"
                    style={{ position: "relative", overflow: "hidden" }}
                  >
                    { this.props.onFileChange ? (<input 
                      type="file"
                      style={input_style}
                      id="dm-file"
                      onChange={self.props.onFileChange}
                    />) : null }
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
