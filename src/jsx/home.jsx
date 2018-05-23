import React from "react";
import { NavBar } from "./components/navbar.jsx";
import { Link } from "react-router-dom";

const thumbs = {
  aBSREL: require("../../images/aBSREL-thumb.png"),
  BUSTED: require("../../images/BUSTED-thumb.png"),
  RELAX: require("../../images/RELAX-thumb.png"),
  FEL: require("../../images/FEL-thumb.png"),
  MEME: require("../../images/MEME-thumb.png"),
  SLAC: require("../../images/SLAC-thumb.png"),
  FUBAR: require("../../images/FUBAR-thumb.png"),
  GARD: require("../../images/GARD-thumb.png")
};

function MethodBanner(props) {
  const headerStyle = {
      fontFamily: "Montserrat",
      fontSize: "24px",
      color: "#00a99d",
      fontWeight: 600,
      lineHeight: 1
    },
    textStyle = {
      fontFamily: "Noto Sans",
      color: "#545454",
      fontSize: "18px"
    };
  return (
    <div className="row">
      <div className="col-md-12">
        <div style={{ float: "left", padding: 20 }}>
          <img
            style={{ display: "block", borderStyle: "solid", borderWidth: 1 }}
            src={thumbs[props.method]}
          />
        </div>
        <div style={{ padding: 25 }}>
          <a href="javascript:void(0);">
            <Link to={"/" + props.method}>
              <h3 style={headerStyle}>{props.method}</h3>
            </Link>
          </a>
          <p style={textStyle}>{props.text}</p>
        </div>
      </div>
    </div>
  );
}

function Home(props) {
  return (
    <div>
      <NavBar />
      <div className="container">
        <MethodBanner
          method="aBSREL"
          text="adaptive Branch-Site Random Effects Likelihood"
        />
        <MethodBanner
          method="BUSTED"
          text="Branch-Site Unrestricted Statistical Test for Episodic Diversification"
        />
        <MethodBanner
          method="RELAX"
          text="Hypothesis testing framework to detect relaxation of natural selection"
        />
        <MethodBanner method="FEL" text="Fixed Effects Likelihood" />
        <MethodBanner method="MEME" text="Mixed Effects Model of Evolution" />
        <MethodBanner
          method="SLAC"
          text="Single-Likelihood Ancestor Counting"
        />
        <MethodBanner
          method="FUBAR"
          text="Fast, Unconstrained Bayesian AppRoximation"
        />
        <MethodBanner
          method="GARD"
          text="Genetic Algorithm Recombination Detection"
        />
      </div>
    </div>
  );
}

module.exports.Home = Home;
