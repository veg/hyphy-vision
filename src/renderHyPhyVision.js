import { default as absrel } from "./jsx/absrel.jsx";
import { default as busted } from "./jsx/busted.jsx";
import { default as fel } from "./jsx/fel.jsx";
import { default as meme } from "./jsx/meme.jsx";
import { default as prime } from "./jsx/prime.jsx";
import { default as relax } from "./jsx/relax.jsx";
import { default as slac } from "./jsx/slac.jsx";
import { default as fubar } from "./jsx/fubar.jsx";
import { default as gard } from "./jsx/gard.jsx";
import { default as bgm } from "./jsx/bgm.jsx";
import { default as fade } from "./jsx/fade.jsx";
import { default as determineHyPhyMethod } from "./helpers/determineHyPhyMethod.js";
import { default as render_inputErrorPage } from "./jsx/components/inputErrorPage.jsx";

const methodDict = {
  absrel: absrel,
  busted: busted,
  fel: fel,
  meme: meme,
  prime: prime,
  relax: relax,
  slac: slac,
  fubar: fubar,
  gard: gard,
  bgm: bgm,
  fade: fade
};

function renderHyPhyVision(data, element, fasta, originalFile, analysisLog) {
  const method = determineHyPhyMethod(data);
  if (method != "unkownMethod" && method != "No json object was proviced") {
    const renderSpecificMethod = methodDict[method];
    console.log("renderSpecificMethod: ", renderSpecificMethod);
    renderSpecificMethod(data, element, fasta, originalFile, analysisLog);
    return null;
  } else {
    render_inputErrorPage(element);
    return null;
  }
}

module.exports = renderHyPhyVision;
