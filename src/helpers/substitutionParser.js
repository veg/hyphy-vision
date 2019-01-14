function substitutionParser(substitutionString) {
  /* 
  Takes a string denoting the infered substitution history for a site:
   ex: "A->C(1), C->A(2)Y(5)" meaning the site went from "A" to "C" once, from "C" to "A twice" and from "C to "Y five times.
  Returns a 20 by 20 matrix of the substitution history with rows being AA from and columns being AA to.
  */
  const AALetters = [
    "A",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "K",
    "L",
    "M",
    "N",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "V",
    "W",
    "Y"
  ];
  const empty20x20 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  if (substitutionString == "" || null || undefined) {
    return "No substitutions were infered at this site";
  }

  // Split into each origin AA string.
  const splitSubstitutionString = substitutionString.split(", ");

  // Split into origin AA and destination string.
  var formatSubstitutionString = function(singleSubstring) {
    const splitToFrom = singleSubstring.split("->");
    const fromKey = splitToFrom[0];

    // Split destination string into a dictonary of {destinationAA: numberOfTimes}.
    const toStringArray = splitToFrom[1].split(")");
    var toDict = {};
    for (var i = 0; i < toStringArray.length - 1; i++) {
      const toKey = toStringArray[i].split("(")[0];
      const numberSubs = parseInt(toStringArray[i].split("(")[1]);
      toDict[toKey] = numberSubs;
    }
    return { [fromKey]: toDict };
  };
  const formattedSubstitutionString = splitSubstitutionString.map(
    formatSubstitutionString
  );

  // Populate the matrix.
  var matrix = empty20x20;
  for (var i = 0; i < formattedSubstitutionString.length; i++) {
    const origin = Object.keys(formattedSubstitutionString[i])[0];
    const originIndex = AALetters.indexOf(origin);
    const destinationsDict = Object.values(formattedSubstitutionString[i])[0];
    const destinations = Object.keys(destinationsDict);
    const substitutionNumbers = Object.values(destinationsDict);
    for (var j = 0; j < destinations.length; j++) {
      const destinationIndex = AALetters.indexOf(destinations[j]);
      matrix[originIndex][destinationIndex] = substitutionNumbers[j];
    }
  }

  return matrix;
}

module.exports = substitutionParser;
