var React = require('react');

var Hamburger = React.createClass({
  render: function(){
    return (
      <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse-1">
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
    )
  }
});

var Methods = React.createClass({
  render: function(){
    return (
      <ul className="nav nav-pills navbar-right" id='navigation_buttons'>
        <li className="active">
          <a href="#" role="tab">absrel</a>
        </li>
        <li>
          <a href="../relax" role="tab">relax</a>
        </li>
        <li>
          <a href="../busted" role="tab">busted</a>
        </li>
        <li>
          <a href="../fade" role="tab">fade</a>
        </li>
        <li>
          <a href="../slac" role="tab">slac</a>
        </li>
      </ul>
    )
  }
});

var NavBar = React.createClass({
  componentDidMount: function() {
    // Corrects navbar offset when clicking anchor hash
    var shiftWindow = function() { scrollBy(0, -50) };
    if (location.hash) shiftWindow();
    window.addEventListener("hashchange", shiftWindow);

  },
  render: function(){
    return (
      <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
        <div className="container-fluid">
          <div className="row">

            <div className="col-sm-1"></div>

            <div className="col-sm-10">
              <a href='#'><img id="hyphy-logo" src="../../images/hyphy-logo.svg" /></a>
              <div className="navbar-header">
                <Hamburger />
                <a className="navbar-brand logo" href="#">HYPHY VISION</a>
              </div>

              <div className="collapse navbar-collapse" id="navbar-collapse-1">

                <ul className="nav navbar-nav">
                  <li className="dropdown">
                    <a href="#" className="dropdown-toggle" id="datamonkey-absrel-toggle-here" data-toggle="dropdown">Load file<b className="caret"></b></a>
                    <ul className="dropdown-menu">
                      <li>
                        <input type="file" id="datamonkey-absrel-json-file" />
                      </li>
                    </ul>
                  </li>
                </ul>

              <Methods />
                
              </div>
            </div>

            <div className="col-sm-1"></div>

          </div>
        </div>
      </nav>
    )
  }
});

module.exports.NavBar = NavBar;

