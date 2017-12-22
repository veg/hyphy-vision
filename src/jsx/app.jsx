import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';

import { BSREL } from './absrel.jsx';
import { BUSTED } from './busted.jsx';
import { RELAX } from './relax.jsx';
import { FEL } from './fel.jsx';
import { MEME } from './meme.jsx';
import { SLAC } from './slac.jsx';
import { FUBAR } from './fubar.jsx';
import { GARD } from './gard.jsx';
import { NavBar } from './components/navbar.jsx';


const href = window.location.href,
  is_electron = href.slice(0,4) == 'file',
  base_url = is_electron ? href.slice(0, href.indexOf('vision')+6) : '',
  thumbs = {
    aBSREL: require("../../images/aBSREL-thumb.png"),
    BUSTED: require("../../images/BUSTED-thumb.png"),
    RELAX: require("../../images/RELAX-thumb.png"),
    FEL: require("../../images/FEL-thumb.png"),
    MEME: require("../../images/MEME-thumb.png"),
    SLAC: require("../../images/SLAC-thumb.png"),
    FUBAR: require("../../images/FUBAR-thumb.png"),
    GARD: require("../../images/GARD-thumb.png"),
  };

function MethodBanner(props){
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
  return (<div className="row">
    <div className="col-md-12">
      <div style={{float: "left", padding: 20}}>
        <img
          style={{display: "block", borderStyle: "solid", borderWidth: 1}}
          src={thumbs[props.method]}
        />
      </div>
      <div style={{padding: 25}}>
        <a href="javascript:void(0);">
          <Link to={'/'+props.method}>
            <h3 style={headerStyle}>{props.method}</h3>
          </Link>
        </a>
        <p style={textStyle}>{props.text}</p>
      </div>
    </div>
  </div>);
}

function Home(props){
  return (<div>
    <NavBar />
    <div className="container" style={{marginTop: "75px"}}>
      <MethodBanner
        method='aBSREL'
        text='adaptive Branch-Site Random Effects Likelihood'
      />
      <MethodBanner
        method='BUSTED'
        text='Branch-Site Unrestricted Statistical Test for Episodic Diversification'
      />
      <MethodBanner
        method='RELAX'
        text='Hypothesis testing framework to detect relaxation of natural selection' 
      />
      <MethodBanner
        method='FEL'
        text='Fixed Effects Likelihood'
      />
      <MethodBanner
        method='MEME'
        text='Mixed Effects Model of Evolution'
      />
      <MethodBanner
        method='SLAC'
        text='Single-Likelihood Ancestor Counting'
      />
      <MethodBanner
        method='FUBAR'
        text='Fast, Unconstrained Bayesian AppRoximation'
      />
      <MethodBanner
        method='GARD'
        text='Genetic Algorithm Recombination Detection'
      />
    </div>
  </div>);
}

class HyPhyVision extends React.Component {
  constructor(props){
    super(props);
    this.state = {page: 'home'};
  }
  render() {
    return (<BrowserRouter>
      <div>
        { is_electron ? <Redirect to="/" /> : null }
        <Route exact path="/" component={Home} />
        <Route path="/aBSREL" component={()=><BSREL url={base_url+'/methods/absrel/data/ABSREL.json'} hyphy_vision />} />
        <Route path="/BUSTED" component={()=><BUSTED url={base_url+'/methods/busted/data/BUSTED.json'} hyphy_vision />} />
        <Route path="/RELAX" component={()=><RELAX url={base_url+'/methods/relax/data/RELAX.json'} hyphy_vision />} />
        <Route path="/FEL" component={()=><FEL url={base_url+'/methods/fel/data/FEL.json'} hyphy_vision />} />
        <Route path="/MEME" component={()=><MEME url={base_url+'/methods/meme/data/MEME.json'} hyphy_vision />} />
        <Route path="/SLAC" component={()=><SLAC url={base_url+'/methods/slac/data/SLAC.json'} hyphy_vision />} />
        <Route path="/FUBAR" component={()=><FUBAR url={base_url+'/methods/fubar/data/FUBAR.json'} hyphy_vision />} />
        <Route path="/GARD" component={()=><GARD url={base_url+'/methods/gard/data/GARD.json'} hyphy_vision />} />
      </div>
    </BrowserRouter>);
  }
}

function render_app(){
  ReactDOM.render(
    <HyPhyVision />,
    document.body.appendChild(document.createElement('div'))
  );
}

module.exports = render_app;
