import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import { Home } from './home.jsx';
import { BSREL } from './absrel.jsx';
import { BUSTED } from './busted.jsx';
import { RELAX } from './relax.jsx';
import { FEL } from './fel.jsx';
import { MEME } from './meme.jsx';
import { SLAC } from './slac.jsx';
import { FUBAR } from './fubar.jsx';
import { GARD } from './gard.jsx';
import { ResultsPage } from "./components/results_page.jsx"

const path = require('path');


const href = window.location.href;
const is_electron = href.slice(0,4) == 'file';
const base_url = is_electron ? path.dirname(path.dirname(href)) : '';

/**
 * HyPhyVision is the main component of the stand-alone HyPhy-Vision application (both web and electron).
 * This component is primarily responsible for:
 *    1. Rendering the appliction (render_app is called from index.js).
 *    2. Routing between pages.
 */
function HyPhyVision(props) {

  // Corrects navbar offset when clicking anchor hash
  var shiftWindow = function() {
    scrollBy(0, -40);
  };
  if (location.hash) shiftWindow();
  window.addEventListener("hashchange", shiftWindow);

  return (
    <BrowserRouter>
      <div>
        { is_electron ? <Redirect to="/" /> : null }
        <Route exact path="/" component={()=><Home />} />  
        <Route path="/aBSREL" component={()=>
          <ResultsPage
            data={base_url+'/methods/absrel/data/ABSREL.json'}  
            hyphy_vision
            scrollspy_info={[
              { label: "summary", href: "summary-tab" },
              { label: "tree", href: "hyphy-tree-summary" },
              { label: "table", href: "table-tab" },
              { label: "model fits", href: "hyphy-model-fits" }
            ]}
            methodName={"adaptive Branch Site REL"}
          >
            {BSREL}
          </ResultsPage>
          } />
        <Route path="/BUSTED" component={()=><BUSTED url={base_url+'/methods/busted/data/BUSTED.json'} hyphy_vision />} />
        <Route path="/RELAX" component={()=>
          <ResultsPage
            data={base_url+'/methods/relax/data/RELAX.json'} 
            hyphy_vision
            scrollspy_info={[
              { label: "summary", href: "summary-tab" },
              { label: "fits", href: "fits-tab" },
              { label: "tree", href: "tree-tab" }
            ]}
            methodName={"RELAX(ed selection test)"}
          >
            {RELAX}
          </ResultsPage>
          } />
        <Route path="/FEL" component={()=><FEL url={base_url+'/methods/fel/data/FEL.json'} hyphy_vision />} />
        <Route path="/MEME" component={()=><MEME url={base_url+'/methods/meme/data/MEME.json'} hyphy_vision />} />
        <Route path="/SLAC" component={()=><SLAC url={base_url+'/methods/slac/data/SLAC.json'} hyphy_vision />} />
        <Route path="/FUBAR" component={()=><FUBAR url={base_url+'/methods/fubar/data/FUBAR.json'} hyphy_vision />} />
        <Route path="/GARD" component={()=><GARD url={base_url+'/methods/gard/data/GARD.json'} hyphy_vision />} />
      </div>
    </BrowserRouter>
  );
}

function render_app(){
  ReactDOM.render(
    <HyPhyVision />,
    document.body.appendChild(document.createElement('div'))
  );
}

module.exports = render_app;
