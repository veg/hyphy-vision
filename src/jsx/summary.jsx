// TODO: Write documentation
var Summary = React.createClass({

  getInitialState: function() {
    return { summary : this.summary() };
  },

  setStates : function() {

    this.direction = this.props.relaxation_K > 1 ? 'intensification' : 'relaxation';
    this.evidence = this.props.p <= alpha_level ? 'significant' : 'not significant';
    this.pvalue = p_value_format(p);
    this.lrt = fit_format(json["relaxation-test"]["LR"]);

  },
  
  componentDidMount: function() {

    d3.select('#summary-pmid').text("PubMed ID " + json['PMID'])
        .attr("href", "http://www.ncbi.nlm.nih.gov/pubmed/" + json['PMID']);

    var relaxation_K = json["fits"]["Alternative"]["K"];
    var p = json["relaxation-test"]["p"];

    //d3.select('#summary-direction').text(relaxation_K > 1 ? 'intensification' : 'relaxation');
    d3.select('#summary-evidence').text();
    d3.select('#summary-pvalue').text(p_value_format(p));
    d3.select('#summary-LRT').text(fit_format(json["relaxation-test"]["LR"]));
    d3.select('#summary-K').text(fit_format(relaxation_K));

  },

  render: function() {

    return (
            <div className="col-md-12">
                <ul className="list-group">
                    <li className="list-group-item list-group-item-info">
                        <h3 className="list-group-item-heading">
                          <i className="fa fa-list" style = 'margin-right: 10px'></i>
                          <span id='summary-method-name'>RELAX(ed selection test)</span> summary
                        </h3>
                        <p className="list-group-item-text lead" style="margin-top:0.5em; ">
                          Test for selection <strong id='summary-direction'>{this.direction}</strong> 
                          (<abbr title="Relaxation coefficient">K</abbr> = <strong id='summary-K'>{this.props.relaxation_K}</strong>) was <strong id='summary-evidence'>{this.evidence}</strong> 
                          (p = <strong id='summary-pvalue'>{this.pvalue}</strong>, <abbr title="Likelihood ratio statistic">LR</abbr> = <strong id='summary-LRT'>{this.lrt}</strong>)
                        </p>
                        <p>
                          <small>Please cite <a href='#' id='summary-pmid'>PMID XXX</a> if you use this result in a publication, presentation, or other scientific work.</small>
                        </p>
                    </li>
                </ul>
              </div>
        )
  }

});

// Will need to make a call to this
// omega distributions
function render_summary(json) {
  React.render(
    <Summary json={json} />,
    document.getElementById("hyphy-relax-summary")
  );
}
