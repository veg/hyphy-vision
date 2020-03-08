import React from "react";
import { NavBar } from "./components/navbar.jsx";
import { Link } from "react-router-dom";

import aBSREL_thumb from "../../images/aBSREL-thumb.png";
import BUSTED_thumb from "../../images/BUSTED-thumb.png";
import RELAX_thumb from "../../images/RELAX-thumb.png";
import FEL_thumb from "../../images/FEL-thumb.png";
import Contrast_FEL_thumb from "../../images/Contrast-FEL-thumb.png";
import MEME_thumb from "../../images/MEME-thumb.png";
import MULTIHIT from "../../images/MEME-thumb.png";
import SLAC_thumb from "../../images/SLAC-thumb.png";
import FUBAR_thumb from "../../images/FUBAR-thumb.png";
import GARD_thumb from "../../images/GARD-thumb.png";
import BGM_thumb from "../../images/BGM-thumb.png";
import FADE_thumb from "../../images/FADE-thumb.png";
import Slatkin_thumb from "../../images/SM-thumb.png";

const thumbs = {
  aBSREL: aBSREL_thumb,
  BUSTED: BUSTED_thumb,
  RELAX: RELAX_thumb,
  FEL: FEL_thumb,
  "Contrast-FEL": Contrast_FEL_thumb,
  MEME: MEME_thumb,
  MULTIHIT: MULTIHIT_thumb,
  SLAC: SLAC_thumb,
  FUBAR: FUBAR_thumb,
  GARD: GARD_thumb,
  BGM: BGM_thumb,
  FADE: FADE_thumb,
  Slatkin: Slatkin_thumb
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

        <MethodBanner
          method="Contrast-FEL"
          text="A test for differences in selective pressures at individual sites among clades and groups of branches"
        />

        <MethodBanner method="MEME" text="Mixed Effects Model of Evolution" />

        <MethodBanner
          method="MULTIHIT"
          text="Accounting for multiple simultaneousnucleotide substitutions"
        />

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
        <MethodBanner
          method="BGM"
          text="SpiderMonkey - Baysian Graphical Models"
        />
        <MethodBanner
          method="FADE"
          text="FUBAR Approach to Directional Evolution"
        />
        <MethodBanner method="Slatkin" text="Compartmentalization" />
      </div>
    </div>
  );
}

export { Home };
