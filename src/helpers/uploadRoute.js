const determineHyPhyMethod = require("./determineHyPhyMethod.js");

// Methods that have a results page route of the same name in app.jsx.
const ROUTED_METHODS = [
  "absrel",
  "busted",
  "relax",
  "fel",
  "meme",
  "slac",
  "fubar",
  "gard",
  "bgm",
  "fade",
  "slatkin"
];

function uploadRoute(json) {
  // Take an uploaded HyPhy JSON result and return the route that can display
  // it (e.g. "/gard"), or null if the method could not be determined.
  const method = determineHyPhyMethod(json);
  return ROUTED_METHODS.includes(method) ? "/" + method : null;
}

module.exports = uploadRoute;
