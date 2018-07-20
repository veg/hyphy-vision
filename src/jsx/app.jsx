import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import { Home } from "./home.jsx";
import { BSREL } from "./absrel.jsx";
import { BUSTED } from "./busted.jsx";
import { RELAX } from "./relax.jsx";
import { FEL } from "./fel.jsx";
import { MEME } from "./meme.jsx";
import { SLAC } from "./slac.jsx";
import { FUBAR } from "./fubar.jsx";
import { GARD } from "./gard.jsx";
import { NavBar } from "./components/navbar.jsx";

const path = require("path");

const href = window.location.href;
const is_electron = href.slice(0, 4) == "file";
const base_url = is_electron ? path.dirname(path.dirname(href)) : "";

/**
 * HyPhyVision is the main component of the stand-alone HyPhy-Vision application (both web and electron).
 * This component is primarily responsible for:
 *    1. Rendering the appliction (render_app is called from index.js).
 *    2. Routing between pages.
 */
class HyPhyVision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: false
    };
  }

  componentDidMount() {
    // Corrects navbar offset when clicking anchor hash
    var shiftWindow = function() {
      scrollBy(0, -40);
    };
    if (location.hash) shiftWindow();
    window.addEventListener("hashchange", shiftWindow);
  }

  onFileChange = e => {
    var self = this;
    var files = e.target.files; // FileList object

    if (files.length == 1) {
      var f = files[0];
      var reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
          var data = JSON.parse(this.result);
          self.setDataToState(data);
        };
      })(f);
      reader.readAsText(f);
    }
    e.preventDefault();
  };

  changeMethod = () => {
    // Change state.data to false when the method is changed so that the default results file is loaded.
    var self = this;
    self.setState({ data: false });
  };

  setDataToState = data => {
    var self = this;
    self.setState({
      data: data
    });
  };

  render() {
    return (
      <BrowserRouter>
        <div>
          <NavBar
            onFileChange={this.onFileChange}
            changeMethod={this.changeMethod}
          />
          {is_electron ? <Redirect to="/" /> : null}
          <div style={{ paddingTop: "70px" }}>
            <Route exact path="/" component={() => <Home />} />
            <Route
              path="/absrel"
              component={() => (
                <BSREL
                  data={
                    this.state.data ||
                    base_url +
                      "/data/json_files/absrel/hiv1_transmission.fna.ABSREL.json"
                  }
                />
              )}
            />
            <Route
              path="/busted"
              component={() => (
                <BUSTED
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/busted/ksr2.fna.BUSTED.json"
                  }
                />
              )}
            />
            <Route
              path="/relax"
              component={() => (
                <RELAX
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/relax/pb2.fna.RELAX.json"
                  }
                />
              )}
            />
            <Route
              path="/fel"
              component={() => (
                <FEL
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/fel/CD2.fna.FEL.json"
                  }
                />
              )}
            />
            <Route
              path="/meme"
              component={() => (
                <MEME
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/meme/h3_trunk.fna.MEME.json"
                  }
                />
              )}
            />
            <Route
              path="/slac"
              component={() => (
                <SLAC
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/slac/h3_trunk.fna.SLAC.json"
                  }
                />
              )}
            />
            <Route
              path="/fubar"
              component={() => (
                <FUBAR
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/fubar/h3_trunk.fna.FUBAR.json"
                  }
                />
              )}
            />
            <Route
              path="/gard"
              component={() => (
                <GARD
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/gard/GARD.json"
                  }
                />
              )}
            />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

function render_app() {
  ReactDOM.render(
    <HyPhyVision />,
    document.body.appendChild(document.createElement("div"))
  );
}

module.exports = render_app;
