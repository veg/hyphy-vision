import React from "react";
import ReactDOM from "react-dom";
import { Tree } from "./components/tree.jsx";
import { OmegaPlotGrid } from "./components/omega_plots.jsx";
import { Header } from "./components/header.jsx";
import { DatamonkeyTable } from "./components/tables.jsx";
import { MainResult } from "./components/mainresult.jsx";
import { ResultsPage } from "./components/results_page.jsx";
var _ = require("underscore");

class RELAXModelTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: "MG94xREV with separate rates for branch sets"
    };
  }
  render() {
    if (!this.props.fits) return <div />;
    var self = this;
    function omegaFormatter(omegaDict) {
      if (!omegaDict) return "";
      return (
        omegaDict.omega.toFixed(2) +
        " (" +
        (100 * omegaDict.proportion).toFixed(2) +
        "%)"
      );
    }
    function makeActive(model) {
      return function() {
        this.setState({ active: model });
      };
    }
    function makeInactive() {
      this.setState({ active: null });
    }
    var rows = _.map(
      _.omit(this.props.fits, [
        "Nucleotide GTR",
        "MG94xREV with separate rates for branch sets"
      ]),
      (val, key) => {
        var distributions = val["Rate Distributions"],
          onMouseEnter = makeActive(key).bind(self),
          onMouseLeave = makeInactive.bind(self),
          className = key == self.state.active ? "active" : "";

        const distributionTypes = Object.keys(distributions);

        var rows = [];
        for (var i = 0; i < distributionTypes.length; i++) {
          const branch_set = distributionTypes[i];

          if (i === 0) {
            var first_row = (
              <tr
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={className}
                key={key + i}
              >
                <td>{key}</td>
                <td>
                  {val["Log Likelihood"]
                    ? val["Log Likelihood"].toFixed(1)
                    : null}
                </td>
                <td>{val["estimated parameters"]}</td>
                <td>{val["AIC-c"].toFixed(1)}</td>
                <td>{branch_set}</td>
                <td>{omegaFormatter(distributions[branch_set]["0"])}</td>
                <td>{omegaFormatter(distributions[branch_set]["1"])}</td>
                <td>{omegaFormatter(distributions[branch_set]["2"])}</td>
              </tr>
            );

            rows.push(first_row);
          } else {
            var other_row = (
              <tr
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={className}
                key={key + i}
              >
                <td />
                <td />
                <td />
                <td />
                <td>{branch_set}</td>
                <td>{omegaFormatter(distributions[branch_set]["0"])}</td>
                <td>{omegaFormatter(distributions[branch_set]["1"])}</td>
                <td>{omegaFormatter(distributions[branch_set]["2"])}</td>
              </tr>
            );

            rows.push(other_row);
          }
        }

        return rows;
      }
    );

    return (
      <div>
        <table className="dm-table table table-hover table-smm list-group-item-text table-striped">
          <thead id="summary-model-header1">
            <tr>
              <th>Model</th>
              <th>
                <span
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Log likelihood of model fit"
                >
                  <em>log</em> L
                </span>
              </th>
              <th>
                <span
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Number of parameters"
                >
                  #. params
                </span>
              </th>
              <th>
                <span
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Small-sample correct Akaike information criterion"
                >
                  AIC<sub>c</sub>
                </span>
              </th>
              <th>
                <span
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Indicates which branch set each parameter belongs to"
                >
                  Branch set
                </span>
              </th>
              <th>
                <span
                  data-toggle="tooltip"
                  title=""
                  data-original-title="First omega rate class"
                >
                  &omega;<sub>1</sub>
                </span>
              </th>
              <th>
                <span
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Second omega rate class"
                >
                  &omega;<sub>2</sub>
                </span>
              </th>
              <th>
                <span
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Third omega rate class"
                >
                  &omega;<sub>3</sub>
                </span>
              </th>
            </tr>
          </thead>
          <tbody id="summary-model-table">{_.flatten(rows)}</tbody>
        </table>
      </div>
    );
  }
}

class RELAXContents extends React.Component {
  constructor(props) {
    super(props);
    var tree_settings = {
      omegaPlot: {},
      "tree-options": {
        /* value arrays have the following meaning
                [0] - the value of the attribute
                [1] - does the change in attribute value trigger tree re-layout?
            */
        "hyphy-tree-model": ["Partitioned MG94xREV", true],
        "hyphy-tree-highlight": ["RELAX.test", false],
        "hyphy-tree-branch-lengths": [true, true],
        "hyphy-tree-hide-legend": [true, false],
        "hyphy-tree-fill-color": [true, false]
      },
      "suppress-tree-render": false,
      "chart-append-html": true,
      edgeColorizer: this.props.edgeColorizer
    };

    this.state = {
      annotations: null,
      json: null,
      pmid: null,
      settings: tree_settings,
      test_results: null,
      tree: null,
      p: null,
      direction: "unknown",
      evidence: "unknown",
      pvalue: null,
      lrt: null,
      summary_k: "unknown",
      pmid_text: "PubMed ID : Unknown",
      pmid_href: "#",
      relaxation_K: "unknown",
      fits: null,
      groupInView: null
    };
  }

  componentDidMount() {
    this.processData(this.props.json);
  }

  componentWillReceiveProps(nextProps) {
    this.processData(nextProps.json);
  }

  processData = data => {
    var groupInView = "Test";
    var referenceGroup = "Reference";
    if (
      isNaN(data["test results"]["relaxation or intensification parameter"])
    ) {
      groupInView = Object.keys(
        data["fits"]["RELAX alternative"]["Rate Distributions"]
      )[1];
      referenceGroup = Object.keys(
        data["fits"]["RELAX null"]["Rate Distributions"]
      )[0];
      var k =
        data["test results"]["relaxation or intensification parameter"][
          groupInView
        ];
    } else {
      var k = data["test results"]["relaxation or intensification parameter"];
    }

    var p = data["test results"]["p-value"],
      significant = p <= this.props.alpha_level;

    delete data["fits"]["MG94xREV with separate rates for branch sets"];

    data["trees"] = {
      branchLengths: _.mapObject(data.fits, (model_val, model_key) => {
        return _.mapObject(
          data["branch attributes"][0],
          (branch_val, branch_key) => {
            return branch_val[model_key];
          }
        );
      })
    };

    _.keys(data.fits).forEach(model => {
      data["fits"][model]["branch-annotations"] = this.formatBranchAnnotations(
        data,
        model
      );
      data["fits"][model]["annotation-tag"] =
        model == "MG94xREV with separate rates for branch sets" ? "ω" : "k";
    });

    // Data munge for the branch attribute table.
    // Get branch information from JSON sources.
    var branchAttributes = data["branch attributes"][0];
    var branchTestedStatuses = data["tested"][0];
    var branchLengthsGTR = data["trees"]["branchLengths"]["Nucleotide GTR"];
    var branchAttributesCombined = {};
    for (var key in branchAttributes) {
      branchAttributesCombined[key] = {
        "Branch name": key,
        "Branch partition": branchTestedStatuses[key],
        "Branch length": branchLengthsGTR[key]
      };
    }
    // Add "k" if it exists (i.e. the analysis was run as "all" vs. "minimal").
    if (
      "k (general descriptive)" in branchAttributes[_.keys(branchAttributes)[0]]
    ) {
      for (var key in branchAttributesCombined) {
        branchAttributesCombined[key]["k"] =
          branchAttributes[key]["k (general descriptive)"];
      }
    }
    // Add formatting for the numeric values.
    var branch_attribute_format = d3.format(".3r");
    for (var key in branchAttributesCombined) {
      branchAttributesCombined[key]["Branch length"] = {
        value: branchAttributesCombined[key]["Branch length"],
        format: branch_attribute_format
      };
      if (
        "k (general descriptive)" in
        branchAttributes[_.keys(branchAttributes)[0]]
      ) {
        branchAttributesCombined[key]["k"] = {
          value: branchAttributesCombined[key]["k"],
          format: branch_attribute_format
        };
      }
    }
    // Create the two arrays (headers and rows).
    var branchAttributeHeaders = _.keys(
      branchAttributesCombined[_.keys(branchAttributesCombined)[0]]
    );
    var branchAttributeRows = [];
    for (var key in branchAttributesCombined) {
      branchAttributeRows.push(_.values(branchAttributesCombined[key]));
    }
    // Add "abbr" and "sortable" to headers.
    var headerDescriptions = {
      Branch: "",
      k: "Branch specific relaxation parameter",
      "Branch length": "Nucleotide GTR Branch Length",
      "Branch partition": "Reference, Test or Not Tested"
    };
    for (var i = 0; i < branchAttributeHeaders.length; i++) {
      branchAttributeHeaders[i] = {
        abbr: headerDescriptions[branchAttributeHeaders[i]],
        sortable: true,
        value: branchAttributeHeaders[i]
      };
    }

    this.setState({
      json: data,
      direction: k > 1 ? "intensification" : "relaxation",
      lrt: data["test results"]["LRT"].toFixed(2),
      summary_k: k.toFixed(2),
      evidence: significant ? "significant" : "not significant",
      p: p.toFixed(3),
      fits: data["fits"],
      significant: significant,
      branchAttributeHeaders: branchAttributeHeaders,
      branchAttributeRows: branchAttributeRows,
      groupInView: groupInView,
      referenceGroup: referenceGroup
    });
  };

  formatBranchAnnotations(json, model) {
    if (model == "MG94xREV with separate rates for branch sets") {
      var initial_branch_annotations = _.mapObject(
        json.fits[model]["Rate Distributions"],
        (val, key) => {
          return _.values(val).map(d => [d.omega, d.proportion]);
        }
      );
    } else if (model == "General descriptive") {
      var initial_branch_annotations = _.mapObject(
        json["branch attributes"][0],
        val => val["k (general descriptive)"]
      );
    } else if (model == "RELAX alternative") {
      var initial_branch_annotations = _.mapObject(json["tested"][0], val => {
        return val == "Reference"
          ? 1
          : json["test results"]["relaxation or intensification parameter"];
      });
    } else if (model == "RELAX null") {
      var initial_branch_annotations = _.mapObject(json.tested[0], val => 1);
    } else if (model == "RELAX partitioned descriptive") {
      return null;
    } else {
      return null;
    }

    // Iterate over objects
    var branch_annotations = _.mapObject(initial_branch_annotations, function(
      val,
      key
    ) {
      return { length: val };
    });

    return branch_annotations;
  }

  getSummaryForRendering = () => {
    return (
      <p>
        Test for selection{" "}
        <strong id="summary-direction">{this.state.direction}</strong> (K ={" "}
        <strong id="summary-K">{this.state.summary_k}</strong>) was{" "}
        <strong
          id="summary-evidence"
          className={this.state.significant ? "hyphy-highlight" : ""}
        >
          {this.state.evidence}
        </strong>{" "}
        (p = <strong id="summary-pvalue">{this.state.p}</strong>, LR ={" "}
        <strong id="summary-LRT">{this.state.lrt}</strong>).
        {this.renderGroupSelector(this.state.json)}
      </p>
    );
  };

  updateGroupInView = event => {
    const groupInView = event.target.value;
    const k = this.state.json["test results"][
      "relaxation or intensification parameter"
    ][groupInView];

    this.setState({
      groupInView: groupInView,
      summary_k: k.toFixed(2),
      direction: k > 1 ? "intensification" : "relaxation"
    });
  };

  renderGroupSelector = data => {
    if (data == null) {
      return null;
    }

    if (
      isNaN(data["test results"]["relaxation or intensification parameter"])
    ) {
      const allGroups = Object.keys(
        this.state.json["fits"]["RELAX alternative"]["Rate Distributions"]
      );
      const referenceGroup = Object.keys(
        this.state.json["fits"]["RELAX null"]["Rate Distributions"]
      );
      const testGroups = allGroups.filter(item => item !== referenceGroup[0]);
      var listItems = [];
      for (var i = 0; i < testGroups.length; i++) {
        listItems.push(
          <option key={i} className="dropdown-item" value={testGroups[i]}>
            {testGroups[i]}
          </option>
        );
      }

      return (
        <div id="group-selector">
          <p>
            Comparing test branch partition:
            <select onChange={this.updateGroupInView}>{listItems}</select>
            against reference branch partition:
            <strong> {referenceGroup}</strong>
          </p>
        </div>
      );
    } else {
      return null;
    }
  };

  render() {
    var self = this;
    var models = {};

    var partitions = {};
    if (!_.isNull(self.state.json)) {
      const nodeNames = Object.keys(self.state.json.tested[0]);
      for (var i = 0; i < nodeNames.length; i++) {
        const nodeName = nodeNames[i];
        const partition = self.state.json.tested[0][nodeName];
        if (partition in partitions) {
          partitions[partition][nodeName] = 1;
        } else {
          partitions[partition] = {};
          partitions[partition][nodeName] = 1;
        }
      }
    }

    /*

    */
    return (
      <div>
        <MainResult
          summary_for_rendering={this.getSummaryForRendering()}
          method_ref="http://hyphy.org/methods/selection-methods/#relax"
          citation_ref="http://www.ncbi.nlm.nih.gov/pubmed/25540451"
          citation_number="PMID 123456789"
        />

        <div id="fits-tab">
          <Header
            title="Model fits"
            popover="<p>Hover over a column header for a description of its content.</p>"
          />
          <RELAXModelTable fits={self.state.fits} />
        </div>

        <div id="omega-tab">
          <Header
            title="Omega plots"
            popover="<p>Shows the different omega rate distributions under the null and alternative models.</p>"
          />
          <OmegaPlotGrid
            json={self.state.json}
            referenceGroup={self.state.referenceGroup}
            testGroup={self.state.groupInView}
          />
        </div>

        <div id="tree-tab">
          <Tree
            json={self.state.json}
            settings={self.state.settings}
            models={models}
            partition={partitions}
            color_gradient={[
              "#000000",
              "#888888",
              "#DFDFDF",
              "#77CCC6",
              "#00a99d"
            ]}
            grayscale_gradient={[
              "#DDDDDD",
              "#AAAAAA",
              "#888888",
              "#444444",
              "#000000"
            ]}
            method="relax"
          />
        </div>

        <div id="branch-attribute-table">
          <Header title="Branch attributes" />
          <DatamonkeyTable
            headerData={self.state.branchAttributeHeaders}
            bodyData={self.state.branchAttributeRows}
            initialSort={1}
            paginate={10}
            export_csv
          />
        </div>
      </div>
    );
  }
}

RELAXContents.defaultProps = {
  edgeColorizer: function(element, data, omega_color, partition) {
    var omega_format = d3.format(".3r");

    if (data.target.annotations) {
      element.style(
        "stroke",
        omega_color(data.target.annotations.length) || null
      );
      $(element[0][0]).tooltip("dispose");
      $(element[0][0]).tooltip({
        title: omega_format(data.target.annotations.length),
        html: true,
        trigger: "hover",
        container: "body",
        placement: "auto"
      });
    } else {
      element.style("stroke", null);
      $(element[0][0]).tooltip("dispose");
    }

    var is_in_partition = partition.indexOf(data.target.name) > -1;
    element
      .style("stroke-width", is_in_partition ? "6" : "2")
      .style("stroke-linejoin", "round")
      .style("stroke-linecap", "round");
  },
  alpha_level: 0.05
};

export function RELAX(props) {
  return (
    <ResultsPage
      data={props.data}
      scrollSpyInfo={[
        { label: "summary", href: "summary-tab" },
        { label: "fits", href: "fits-tab" },
        { label: "tree", href: "tree-tab" }
      ]}
      methodName="RELAX(ed selection test)"
      fasta={props.fasta}
      originalFile={props.originalFile}
      analysisLog={props.analysisLog}
    >
      {RELAXContents}
    </ResultsPage>
  );
}

export default function render_relax(
  data,
  element,
  fasta,
  originalFile,
  analysisLog
) {
  ReactDOM.render(
    <RELAX
      data={data}
      fasta={fasta}
      originalFile={originalFile}
      analysisLog={analysisLog}
    />,
    document.getElementById(element)
  );
}
