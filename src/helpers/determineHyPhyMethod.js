function determineHyPhyMethod(json) {
  // Take a HyPhy JSON result and return a lowercase string of which HyPhy method produced the result.

  if (json == "" || json == undefined || json == null) {
    return "No json object was provided";
  }

  var method;

  if (json["analysis"] != undefined) {
    const analysisString = json["analysis"]["info"];

    if (analysisString.includes("aBSREL")) {
      method = "absrel";
    } else if (analysisString.includes("BGM")) {
      method = "bgm";
    } else if (analysisString.includes("BUSTED")) {
      method = "busted";
    } else if (analysisString.includes("FADE")) {
      method = "fade";
    } else if (analysisString.includes("FEL")) {
      method = "fel";
    } else if (analysisString.includes("FADE")) {
      method = "fade";
    } else if (analysisString.includes("FUBAR")) {
      method = "fubar";
    } else if (analysisString.includes("RELAX")) {
      method = "relax";
    } else if (analysisString.includes("SLAC")) {
      method = "slac";
    } else if (analysisString.includes("MEME")) {
      method = "meme";
    } else {
      method = "unknownMethod";
    }
  } else if (json["breakpointData"] != undefined) {
    method = "gard";
  } else if (json["compartments"] != undefined) {
    method = "slatkin";
  } else {
    method = "unknownMethod";
  }

  return method;
}

module.exports = determineHyPhyMethod;
