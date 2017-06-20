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
    
      <div className="dropdown">
        <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Tools
        <span className="caret"></span></button>
        <ul className="dropdown-menu">
          <li><a href="#">aBSREL</a></li>
          <li><a href="../relax">RELAX</a></li>
          <li><a href="../busted">BUSTED</a></li>
          <li><a href="../fade">FADE</a></li>
          <li><a href="../slac">SLAC</a></li>
        </ul>
      </div>
      
    )
  }
});


<div className="dropdown">
  <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Dropdown Example
  <span className="caret"></span></button>
  <ul className="dropdown-menu">
    <li><a href="#">HTML</a></li>
    <li><a href="#">CSS</a></li>
    <li><a href="#">JavaScript</a></li>
  </ul>
</div>




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
        <div className="container">
          <div className="row">
          
            <div className="col-sm-12">
              <a href='#'><img id="hyphy-logo" src="../../images/hyphy-logo.svg" /></a>
              <div className="navbar-header">
                <Hamburger />
              </div>

              <div className="collapse navbar-collapse" id="navbar-collapse-1">


                <ul className="nav navbar-nav">
                  <a href="#" className="nav-button" role="button">Load</a>
                  <a href="#" className="nav-button" role="button">Export</a>
                </ul>


              <Methods />
                
              </div>
            </div>


          </div>
        </div>
      </nav>
    )
  }
});

module.exports.NavBar = NavBar;

