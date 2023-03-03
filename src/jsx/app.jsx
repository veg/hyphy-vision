import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import { Home } from "./home.jsx";
import { BSREL } from "./absrel.jsx";
import { BUSTED } from "./busted.jsx";
import { RELAX } from "./relax.jsx";
import { FEL } from "./fel.jsx";
import { ContrastFEL } from "./contrast-fel.jsx";
import { MEME } from "./meme.jsx";
import { MultiHit } from "./multihit.jsx";
import { NRM } from "./nrm.jsx";
import { SLAC } from "./slac.jsx";
import { FUBAR } from "./fubar.jsx";
import { GARD } from "./gard.jsx";
import { BGM } from "./bgm.jsx";
import { FADE } from "./fade.jsx";
import { Slatkin } from "./slatkin.jsx";
import { NavBar } from "./components/navbar.jsx";

const path = require("path");
const href = window.location.href;
const is_electron = href.slice(0, 4) == "file";
const base_url = is_electron ? path.dirname(path.dirname(href)) : "";
const fasta = require("../../data/fasta.json");

/**
 * HyPhyVision is the main component of the stand-alone HyPhy-Vision application (both web and electron).
 * This component is primarily responsible for:
 *    1. Rendering the application (render_app is called from index.js).
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
              path="/absrel-fasta"
              component={() => (
                <BSREL
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/absrel/CD2.fna.ABSREL.json"
                  }
                  fasta={fasta.CD2}
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
              path="/busted-fasta"
              component={() => (
                <BUSTED
                  data={
                    base_url + "/data/json_files/busted/CD2.fna.BUSTED.json"
                  }
                  fasta={
                    base_url + "/data/fasta/CD2.fasta"
                  }
                />
              )}
            />
            <Route
              path="/busted-srv"
              component={() => (
                <BUSTED
                  data={
                    this.state.data ||
                    base_url +
                      "/data/json_files/busted/CD2.fasta.BUSTED-SRV.json"
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
              path="/relax-fasta"
              component={() => (
                <RELAX
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/relax/CD2.fna.RELAX.json"
                  }
                  fasta={fasta.CD2}
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
              path="/fel-fasta"
              component={() => (
                <FEL
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/fel/CD2.fna.FEL.json"
                  }
                  fasta={fasta.CD2}
                />
              )}
            />
            <Route
              path="/contrast-fel"
              component={() => (
                <ContrastFEL
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/contrast-fel/multi.json"
                  }
                />
              )}
            />
            <Route
              path="/contrast-fel-fasta"
              component={() => (
                <FEL
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/contrast-fel/CD2.fna.FEL.json"
                  }
                  fasta={fasta.CD2}
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
              path="/meme-fasta"
              component={() => (
                <MEME
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/meme/CD2.fna.MEME.json"
                  }
                  fasta={fasta.CD2}
                />
              )}
            />
            <Route
              path="/multihit"
              component={() => (
                <MultiHit
                  data={
                    this.state.data ||
                    base_url +
                      "/data/json_files/multihit/yokoyama.rh1.cds.mod.1-990.nex.FITTER.json"
                  }
                />
              )}
            />
            <Route
              path="/nrm"
              component={() => (
                <NRM
                  data={
                    this.state.data ||
                    base_url +
                      "/data/json_files/nrm/test.fas.NRM.json"
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
                    base_url + "/data/json_files/slac/Flu-recombination.nex.SLAC.json"
                  }
                />
              )}
            />
            <Route
              path="/slac-fasta"
              component={() => (
                <SLAC
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/slac/CD2.fna.SLAC.json"
                  }
                  fasta={fasta.CD2}
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
              path="/fubar-fasta"
              component={() => (
                <FUBAR
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/fubar/CD2.fna.FUBAR.json"
                  }
                  fasta={fasta.CD2}
                />
              )}
            />
            <Route
              path="/gard"
              component={() => (
                <GARD
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/gard/Flu.fna.GARD.json"
                  }
                />
              )}
            />
            <Route
              path="/gard-fasta"
              component={() => (
                <GARD
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/gard/Flu.fna.GARD.json"
                  }
                  fasta={fasta.Flu}
                />
              )}
            />
            <Route
              path="/bgm"
              component={() => (
                <BGM
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/bgm/BGM.json"
                  }
                />
              )}
            />
            <Route
              path="/bgm-fasta"
              component={() => (
                <BGM
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/bgm/Flu.fna.BGM.json"
                  }
                  fasta={fasta.Flu}
                />
              )}
            />
            <Route
              path="/fade"
              component={() => (
                <FADE
                  data={
                    this.state.data ||
                    base_url +
                      "/data/json_files/fade/simulated_toward_H.FADE.json"
                  }
                />
              )}
            />
            <Route
              path="/fade-fasta"
              component={() => (
                <FADE
                  data={
                    this.state.data ||
                    base_url + "/data/json_files/fade/CD2_AA.fasta.FADE.json"
                  }
                  fasta={fasta.CD2}
                />
              )}
            />
            <Route
              path="/slatkin"
              component={() => (
                <Slatkin
                  data={
                    this.state.data ||
                    base_url +
                      "/data/json_files/slatkin/C012_Time1_collapse.tre.json"
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

export default function render_app() {
  ReactDOM.render(
    <HyPhyVision />,
    document.body.appendChild(document.createElement("div"))
  );
}
