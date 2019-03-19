var tree_settings = {
  omegaPlot: {},
  "tree-options": {
    /* value arrays have the following meaning
                [0] - the value of the attribute
                [1] - does the change in attribute value trigger tree re-layout?
            */
    "hyphy-tree-model": ["Unconstrained model", true],
    "hyphy-tree-highlight": ["RELAX.test", false],
    "hyphy-tree-branch-lengths": [false, true],
    "hyphy-tree-hide-legend": [true, false],
    "hyphy-tree-fill-color": [true, false]
  },
  "hyphy-tree-legend-type": "discrete",
  "suppress-tree-render": false,
  "chart-append-html": true
};

module.exports = tree_settings;
