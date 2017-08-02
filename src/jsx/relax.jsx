import { ModelFits } from "./components/model_fits.jsx";
import { NavBar } from "./components/navbar.jsx";
import { ScrollSpy } from "./components/scrollspy.jsx";
import { InputInfo } from "./components/input_info.jsx";
import { ErrorMessage } from "./components/error_message.jsx";
import { Tree } from "./components/relax_tree.jsx";
import { OmegaPlotGrid } from "./components/omega_plots.jsx";
import { Header } from "./components/header.jsx";


var React = require("react"),
  ReactDOM = require("react-dom"),
  _ = require("underscore");


class RELAX extends React.Component{
  constructor(props){
    super(props);
    this.p_value_format = d3.format(".4f");
    this.fit_format = d3.format(".2f")
    
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
      relaxation_K: "unknown"
    };

  }

  componentDidMount(){
    var self = this;
    d3.json(this.props.url, function(data){
      data["fits"]["Partitioned MG94xREV"][
        "branch-annotations"
      ] = self.formatBranchAnnotations(data, "Partitioned MG94xREV");
      data["fits"]["General Descriptive"][
        "branch-annotations"
      ] = self.formatBranchAnnotations(data, "General Descriptive");
      data["fits"]["Null"]["branch-annotations"] = self.formatBranchAnnotations(
        data,
        "Null"
      );
      data["fits"]["Alternative"][
        "branch-annotations"
      ] = self.formatBranchAnnotations(data, "Alternative");
      data["fits"]["Partitioned Exploratory"][
        "branch-annotations"
      ] = self.formatBranchAnnotations(data, "Partitioned Exploratory");

      var annotations =
        data["fits"]["Partitioned MG94xREV"]["branch-annotations"],
        json = data,
        pmid = data["PMID"],
        test_results = data["relaxation_test"];

      var p = data["relaxation-test"]["p"],
        direction = data["fits"]["Alternative"]["K"] > 1
          ? "intensification"
          : "relaxation",
        evidence = p <= self.props.alpha_level
          ? "significant"
          : "not significant",
        pvalue = self.p_value_format(p),
        lrt = self.fit_format(data["relaxation-test"]["LR"]),
        summary_k = self.fit_format(data["fits"]["Alternative"]["K"]),
        pmid_text = "PubMed ID " + pmid,
        pmid_href = "http://www.ncbi.nlm.nih.gov/pubmed/" + pmid;

      self.setState({
        annotations: annotations,
        json: json,
        pmid: pmid,
        test_results: test_results,
        p: p,
        direction: direction,
        evidence: evidence,
        pvalue: pvalue,
        lrt: lrt,
        summary_k: summary_k,
        pmid_text: pmid_text,
        pmid_href: pmid_href
      });
    });
  }

  componentWillMount() {
    //this.loadFromServer();
    //this.setEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    $("body").scrollspy({
      target: ".bs-docs-sidebar",
      offset: 50
    });
    $('[data-toggle="popover"]').popover();
  }

  formatBranchAnnotations(json, key) {
    var initial_branch_annotations = json["fits"][key]["branch-annotations"];

    if (!initial_branch_annotations) {
      initial_branch_annotations = json["fits"][key]["rate distributions"];
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

  getSummary(){
    if(!this.state.json) return <div></div>;
    return (
      <div className="row">
      <div className="clearance" id="summary-tab"></div>
      <div className="col-md-12">
        <h3 className="list-group-item-heading">
          <span className="summary-method-name">
            RELAX(ed selection test)
          </span>
          <br />
          <span className="results-summary">results summary</span>
        </h3>
      </div>
      <div className="col-md-12">
        <InputInfo input_data={this.state.json.input_data} />
      </div>
      <div className="col-md-12">
        <div className="main-result">
          <p>
            Test for selection{" "}
            <strong id="summary-direction">
              {this.state.direction}
            </strong>{" "}

            (K ={" "}
            <strong id="summary-K">{this.state.summary_k}</strong>) was{" "}
            <strong id="summary-evidence">
              {this.state.evidence}
            </strong>{" "}

            (p = <strong id="summary-pvalue">
              {this.state.p}
            </strong>,{" "}
            LR ={" "}
            <strong id="summary-LRT">{this.state.lrt}</strong>).
          </p>
          <hr />
          <p>
            <small>
              See{" "}
              <a href="http://hyphy.org/methods/selection-methods/#relax">
                here
              </a>{" "}
              for more information about this method.
              <br />Please cite{" "}
              <a
                href="http://www.ncbi.nlm.nih.gov/pubmed/25540451"
                id="summary-pmid"
                target="_blank"
              >
                PMID 123456789 
              </a>{" "}
              if you use this result in a publication, presentation, or other
              scientific work.
            </small>
          </p>
        </div>
      </div>

    </div>);
  }
  render(){
    var self = this,
      scrollspy_info = [
        { label: "summary", href: "summary-tab" },
        { label: "fits", href: "fits-tab" },
        { label: "ω plots", href: "omega-tab" },
        { label: "tree", href: "tree-tab" }
      ];
    return (<div>
      <NavBar onFileChange={this.onFileChange} />
      <div className="container">
        <div className="row">
          <ScrollSpy info={scrollspy_info} />
          <div className="col-sm-10" id="results">
            <ErrorMessage />
            {self.getSummary()}
            
            <div id="fits-tab" className="row">
              <div className="col-md-12">
                <ModelFits json={self.state.json} />
              </div>
            </div>
            
            <div id="omega-tab" className="row">
              <div className="col-md-12">
                <Header title="Omega plots" popover="<p>Needs content.</p>"/>
                <OmegaPlotGrid json={self.state.json} />
              </div>
            </div>
            <div className="row" id="tree-tab">
              <div className="col-md-12">
                <Header title="Phylogenetic Tree" popover="<p>Needs content.</p>"/>
                <Tree json={self.state.json} settings={self.state.settings} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

RELAX.defaultProps = {
  edgeColorizer: function(element, data) {
    var self = this,
      scaling_exponent = 0.33,
      omega_format = d3.format(".3r");

    var omega_color = d3.scale
      .pow()
      .exponent(scaling_exponent)
      .domain([0, 0.25, 1, 5, 10])
      .range(
        self.options()["color-fill"]
          ? ["#DDDDDD", "#AAAAAA", "#888888", "#444444", "#000000"]
          : ["#6e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"]
      )
      .clamp(true);

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

    var selected_partition = $("#hyphy-tree-highlight").attr("value");

    if (selected_partition && this.get_partitions()) {
      var partitions = this.get_partitions()[selected_partition];

      element
        .style(
          "stroke-width",
          partitions && partitions[data.target.name] ? "8" : "4"
        )
        .style("stroke-linejoin", "round")
        .style("stroke-linecap", "round");
    }
  },
  alpha_level: 0.05
};



// Will need to make a call to this
// omega distributions
function render_relax(url, element) {
  ReactDOM.render(<RELAX url={url} />, document.getElementById(element));
}

module.exports = render_relax;
