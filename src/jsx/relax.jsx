import { Tree } from "./components/tree.jsx";
import { OmegaPlotGrid } from "./components/omega_plots.jsx";
import { Header } from "./components/header.jsx";
import {DatamonkeyTable} from "./components/tables.jsx"
import { MainResult } from "./components/mainresult.jsx";
import { ResultsPage } from "./components/results_page.jsx";

var React = require("react"),
  _ = require("underscore");

class RELAXModelTable extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      model: "MG94xREV with separate rates for branch sets",
    }
  }
  render() {
    if(!this.props.fits) return <div></div>;
    var self = this;
    function omegaFormatter(omegaDict){
      if (!omegaDict) return '';
      return omegaDict.omega.toFixed(2) + ' (' + (100*omegaDict.proportion).toFixed(2) + '%)';
    }
    function makeActive(model){
      return function(){
        this.setState({active: model});
      }
    }
    function makeInactive(){
      this.setState({active: null});
    }
    var rows = _.map(_.omit(this.props.fits, ['Nucleotide GTR', 'MG94xREV with separate rates for branch sets']), (val, key) => {
      var distributions = val['Rate Distributions'],
        onMouseEnter = makeActive(key).bind(self),
        onMouseLeave = makeInactive.bind(self),
        className = key == self.state.active ? 'active' : '',
        branch_set = distributions['Shared'] ? 'Shared' : 'Test',
        test_row = (<tr onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={className}>
        <td>{key}</td>
        <td>{val['Log Likelihood'] ? val['Log Likelihood'].toFixed(1) : null}</td>
        <td>{val['estimated parameters']}</td>
        <td>{val['AIC-c'].toFixed(1)}</td>
        <td>{branch_set}</td>
        <td>{omegaFormatter(distributions[branch_set]["0"])}</td>
        <td>{omegaFormatter(distributions[branch_set]["1"])}</td>
        <td>{omegaFormatter(distributions[branch_set]["2"])}</td>
      </tr>);
      if(distributions['Reference']){
        var background_row = (<tr onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={className}>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>Reference</td>
          <td>{omegaFormatter(distributions["Reference"]["0"])}</td>
          <td>{omegaFormatter(distributions["Reference"]["1"])}</td>
          <td>{omegaFormatter(distributions["Reference"]["2"])}</td>
        </tr>)
        return [test_row, background_row];
      }
      return test_row;
    });
    return (<div>
      <table
        className="dm-table table table-hover table-condensed list-group-item-text"
        style={{ marginTop: "0.5em" }}
      >
        <thead id="summary-model-header1">
          <tr>
            <th>Model</th>
            <th>
              <span data-toggle="tooltip" title="" data-original-title="Log likelihood of model fit">
                <em>log</em> L
              </span>
            </th>
            <th>
              <span data-toggle="tooltip" title="" data-original-title="Number of parameters">
                #. params
              </span>
            </th>
            <th>
              <span data-toggle="tooltip" title="" data-original-title="Small-sample correct Akaike information criterion">
                AIC<sub>c</sub>
              </span>
            </th>
            <th>
              <span data-toggle="tooltip" title="" data-original-title="Indicates which branch set each parameter belongs to">
                Branch set
              </span>
            </th>
            <th>
              <span data-toggle="tooltip" title="" data-original-title="First omega rate class">
                &omega;<sub>1</sub>
              </span>
            </th>
            <th>
              <span data-toggle="tooltip" title="" data-original-title="Second omega rate class">
                &omega;<sub>2</sub>
              </span>
            </th>
            <th>
              <span data-toggle="tooltip" title="" data-original-title="Third omega rate class">
                &omega;<sub>3</sub>
              </span>
            </th>
          </tr>
        </thead>
        <tbody id="summary-model-table">
          {_.flatten(rows)}
        </tbody>
      </table>
    </div>);
  }
}

class RELAXContents extends React.Component{

  constructor(props){
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
      fits: null
    };

  };
  
  componentDidMount() {
    this.processData(this.props.json);
  };

  componentWillReceiveProps(nextProps) {
    this.processData(nextProps.json);
  };

  processData = (data) => {
    var k = data["test results"]["relaxation or intensification parameter"],
      p = data["test results"]["p-value"],
      significant = p <= this.props.alpha_level;

    delete data['fits']['MG94xREV with separate rates for branch sets'];

    data["trees"] = {
      branchLengths: _.mapObject(data.fits, (model_val, model_key) => {
        return _.mapObject(data['branch attributes'][0], (branch_val, branch_key) => {
          return branch_val[model_key];
        });
      })
    }

    _.keys(data.fits).forEach(model=>{
      data["fits"][model]["branch-annotations"] = this.formatBranchAnnotations(data, model);
      data["fits"][model]["annotation-tag"] = model == "MG94xREV with separate rates for branch sets" ? "ω" : 'k';
    });
    
    // Data munge for the branch attribute table.
    // Get branch information from JSON sources.
    var branchAttributes = data["branch attributes"][0];
    var branchTestedStatuses = data["tested"][0];
    var branchLengthsGTR = data["trees"]["branchLengths"]["Nucleotide GTR"];
    var branchAttributesCombined = {};
    for (var key in branchAttributes){
      branchAttributesCombined[key] = {
        "Branch name": key, 
        "Branch partition": branchTestedStatuses[key], 
        "Branch length": branchLengthsGTR[key]
      };
    }
    // Add "k" if it exists (i.e. the analysis was run as "all" vs. "minimal").
    if( "k (general descriptive)" in branchAttributes[_.keys(branchAttributes)[0]]) {
      for (var key in branchAttributesCombined){
        branchAttributesCombined[key]["k"] = branchAttributes[key]["k (general descriptive)"]
      };
    }
    // Add formatting for the numeric values.
    var branch_attribute_format = d3.format(".3r");
    for (var key in branchAttributesCombined) {      
      branchAttributesCombined[key]["Branch length"] = {
        "value": branchAttributesCombined[key]["Branch length"], 
        "format": branch_attribute_format
      };
      if( "k (general descriptive)" in branchAttributes[_.keys(branchAttributes)[0]]) {
        branchAttributesCombined[key]["k"] = {
          "value": branchAttributesCombined[key]["k"], 
          "format": branch_attribute_format
        };
      }
    }
    // Create the two arrays (headers and rows).
    var branchAttributeHeaders = _.keys(branchAttributesCombined[_.keys(branchAttributesCombined)[0]]);
    var branchAttributeRows = [];
    for (var key in branchAttributesCombined) {
      branchAttributeRows.push(_.values(branchAttributesCombined[key]));
    }
    // Add "abbr" and "sortable" to headers.
    var headerDescriptions = {
      "Branch": "", 
      "k": "Branch specific relaxation parameter", 
      "Branch length": "Nucleotide GTR Branch Length", 
      "Branch partition": "Reference, Test or Not Tested"
    };
    for (var i = 0; i < branchAttributeHeaders.length; i++) {
      branchAttributeHeaders[i] = {
        "abbr": headerDescriptions[branchAttributeHeaders[i]], 
        "sortable": true, "value": branchAttributeHeaders[i]
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
      branchAttributeRows: branchAttributeRows      
    });
  }

  formatBranchAnnotations(json, model) {
    if(model == 'MG94xREV with separate rates for branch sets') {
      var initial_branch_annotations = _.mapObject(json.fits[model]['Rate Distributions'], (val, key) => {
        return _.values(val).map(d=>[d.omega, d.proportion]);
      });
    } else if(model == 'General descriptive') {
      var initial_branch_annotations = _.mapObject(json['branch attributes'][0], val=>val['k (general descriptive)']);
    } else if(model == 'RELAX alternative') {
      var initial_branch_annotations = _.mapObject(json['tested'][0], val => {
        return val == "Reference" ? 1 : json["test results"]["relaxation or intensification parameter"];
      });
    } else if(model == 'RELAX null') {
      var initial_branch_annotations = _.mapObject(json.tested[0], val=>1);
    } else if(model == 'RELAX partitioned descriptive') {
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
    return(
      <p>
        Test for selection{" "}
        <strong id="summary-direction">
          {this.state.direction}
        </strong>{" "}
        (K ={" "}
        <strong id="summary-K">{this.state.summary_k}</strong>) was{" "}
        <strong id="summary-evidence" className={this.state.significant ? 'hyphy-highlight' : ''}>
          {this.state.evidence}
        </strong>{" "}
        (p = <strong id="summary-pvalue">
          {this.state.p}
        </strong>,{" "}
        LR ={" "}
        <strong id="summary-LRT">{this.state.lrt}</strong>).
      </p>
    );
  };

  getSummaryForClipboard() {
    return(
      "test text for clipboard"
    );
  };

  render(){
    var self = this
    var models = {}
    var partition = {'Reference': {}, 'Test': {}, 'Unclassified': {}};
    if (!_.isNull(self.state.json)) {
      models = self.state.json.fits,
      _.each(self.state.json.tested[0], (val, key) => {
        partition[val][key] = 1;
      });
      if(_.size(partition['Unclassified']) == 0){
        delete partition['Unclassified'];
      }
    }

    return( 
      <div> 

        <MainResult
          summary_for_clipboard={this.getSummaryForClipboard()}
          summary_for_rendering={this.getSummaryForRendering()}                    
          method_ref="http://hyphy.org/methods/selection-methods/#relax"
          citation_ref="hhttp://www.ncbi.nlm.nih.gov/pubmed/25540451"
          citation_number="PMID 123456789"
        />

        <div id="fits-tab" className="row"> 
          <Header title="Model fits" popover="<p>Hover over a column header for a description of its content.</p>"/>
          <RELAXModelTable fits={self.state.fits} />
        </div>

        <div id="omega-tab" className="row"> 
          <Header title="Omega plots" popover="<p>Shows the different omega rate distributions under the null and alternative models.</p>"/>
          <OmegaPlotGrid json={self.state.json} />
        </div>

        <div id="tree-tab" className="row">
          <Tree
            json={self.state.json}
            settings={self.state.settings}
            models={models}
            partition={partition}
            color_gradient={["#000000", "#888888", "#DFDFDF", "#77CCC6", "#00a99d"]}
            grayscale_gradient={["#DDDDDD", "#AAAAAA", "#888888", "#444444", "#000000"]}
            method='relax'
          />
        </div>

        <div id="branch-attribute-table" className="row">
          <Header title="Branch attributes"></Header>
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
  };
}

RELAXContents.defaultProps = {
  edgeColorizer: function(element, data, omega_color, partition) {
    var omega_format = d3.format(".3r");

    if (data.target.annotations) {
      element.style(
        "stroke",
        omega_color(data.target.annotations.length) || null
      );
      $(element[0][0]).tooltip("destroy");
      $(element[0][0]).tooltip({
        title: omega_format(data.target.annotations.length),
        html: true,
        trigger: "hover",
        container: "body",
        placement: "auto"
      });
    } else {
      element.style("stroke", null);
      $(element[0][0]).tooltip("destroy");
    }

    var is_in_partition = partition.indexOf(data.target.name) > -1;
    element
      .style("stroke-width", is_in_partition ? "6" : "2")
      .style("stroke-linejoin", "round")
      .style("stroke-linecap", "round");
  },
  alpha_level: 0.05
};

function RELAX(props) {
  return (
    <ResultsPage 
      data={props.data}
      hyphy_vision={props.hyphy_vision}
      scrollSpyInfo={[
        { label: "summary", href: "summary-tab" },
        { label: "fits", href: "fits-tab" },
        { label: "tree", href: "tree-tab" }
      ]}
      methodName="RELAX(ed selection test)"
    >
      {RELAXContents}
    </ResultsPage>
  );
}

function render_relax(data, element) {
  ReactDOM.render(<RELAX data={data} />, document.getElementById(element));
}

function render_hv_relax(data, element) {
  ReactDOM.render(<RELAX data={data} hyphy_vision />, document.getElementById(element));
}

module.exports = render_relax;
module.exports.hv = render_hv_relax;
module.exports.RELAX = RELAX;
