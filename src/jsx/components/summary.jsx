var Summary = React.createClass({

  getDefaultProps : function() {
    return {
     alpha_level : 0.05
    };

  },

  getInitialState: function() {
    return {
      p : null,
      direction : 'unknown',
      evidence : 'unknown',
      pvalue : null,
      lrt : null,
      summary_k : 'unknown',
      pmid_text : "PubMed ID : Unknown",
      pmid_href : "#",
      relaxation_K : "unknown"
    };
  },

  p_value_format : d3.format(".4f"),
  fit_format : d3.format(".2f"),

  componentDidMount: function() {
    this.setState({
      p : this.props.json["relaxation-test"]["p"],
      direction : this.props.json["fits"]["Alternative"]["K"] > 1 ? 'intensification' : 'relaxation',
      evidence : this.state.p <= this.props.alpha_level ? 'significant' : 'not significant',
      pvalue : this.p_value_format(this.state.p),
      lrt : this.fit_format(this.props.json["relaxation-test"]["LR"]),
      summary_k : this.fit_format(this.props.json["fits"]["Alternative"]["K"]),
      pmid_text : "PubMed ID " + this.props.json['PMID'],
      pmid_href : "http://www.ncbi.nlm.nih.gov/pubmed/" + this.props.json['PMID']
    });
  },

  render: function() {

    return (
        <div className="col-md-12">
            <ul className="list-group">
                <li className="list-group-item list-group-item-info">
                    <h3 className="list-group-item-heading">
                      <i className="fa fa-list" styleFormat='margin-right: 10px'></i>
                      <span id='summary-method-name'>RELAX(ed selection test)</span> summary
                    </h3>
                    <p className="list-group-item-text lead" styleFormat="margin-top:0.5em; ">
                      Test for selection <strong id='summary-direction'>{this.state.direction}</strong> 
                      (<abbr title="Relaxation coefficient">K</abbr> = <strong id='summary-K'>{this.state.summary_k}</strong>) was <strong id='summary-evidence'>{this.state.evidence}</strong> 
                      (p = <strong id='summary-pvalue'>{this.state.p}</strong>, <abbr title="Likelihood ratio statistic">LR</abbr> = <strong id='summary-LRT'>{this.state.lrt}</strong>)
                    </p>
                    <p>
                      <small>Please cite <a href={this.state.pmid_href} id='summary-pmid'>{this.state.pmid_text}</a> if you use this result in a publication, presentation, or other scientific work.</small>
                    </p>
                </li>
            </ul>
          </div>
        )
  }

});

function render_summary(json) {
  React.render(
    <Summary json={json} />,
    document.getElementById("hyphy-relax-summary")
  );
}

function rerender_summary(json) {
  $("#hyphy-relax-summary").empty();
  render_summary(json);
}
