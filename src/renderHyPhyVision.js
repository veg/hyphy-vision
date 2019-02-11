import { default as render_absrel } from "./jsx/absrel.jsx";
import { default as render_busted } from "./jsx/busted.jsx";
import { default as render_fel } from "./jsx/fel.jsx";
import { default as render_meme } from "./jsx/meme.jsx";
import { default as render_prime } from "./jsx/prime.jsx";
import { default as render_relax } from "./jsx/relax.jsx";
import { default as render_slac } from "./jsx/slac.jsx";
import { default as render_fubar } from "./jsx/fubar.jsx";
import { default as render_gard } from "./jsx/gard.jsx";
import { default as render_bgm } from "./jsx/bgm.jsx";
import { default as render_fade } from "./jsx/fade.jsx";
import { default as determineHyPhyMethod } from "./helpers/determineHyPhyMethod.js";
import { default as render_inputErrorPage } from "./jsx/components/inputErrorPage.jsx";

const methodDict = {
  absrel: render_absrel,
  busted: render_busted,
  fel: render_fel,
  meme: render_meme,
  prime: render_prime,
  relax: render_relax,
  slac: render_slac,
  fubar: render_fubar,
  gard: render_gard,
  bgm: render_bgm,
  fade: render_fade
};

function renderHyPhyVision(url, element, fasta, originalFile, analysisLog) {
  d3.json(url, (err, data) => {
    const method = determineHyPhyMethod(data);
    if (method != "unkownMethod" && method != "No json object was provided") {
      const renderSpecificMethod = methodDict[method];
      renderSpecificMethod(data, element, fasta, originalFile, analysisLog);
      return null;
    } else {
      render_inputErrorPage(element);
      return null;
    }
  });
}

module.exports = renderHyPhyVision;
