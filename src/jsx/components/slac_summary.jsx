var SLACBanner = React.createClass({

  dm_countSites : function (json, cutoff) {

    var result = { all : 0,
                   positive: 0,
                   negative : 0};

    result.all       = datamonkey.helpers.countSitesFromPartitionsJSON (json);

    result.positive = datamonkey.helpers.sum (
                            json["MLE"]["content"],
                            function (partition) {
                                return _.reduce (partition["by-site"]["RESOLVED"], function (sum, row)
                                    {return sum + (row[8] <= cutoff ? 1 : 0);}, 0);
                            }
                       );

    result.negative = datamonkey.helpers.sum (
                            json["MLE"]["content"],
                            function (partition) {
                                return _.reduce (partition["by-site"]["RESOLVED"], function (sum, row)
                                    {return sum + (row[9] <= cutoff ? 1 : 0);}, 0);
                            }
                       );

    return result;
  },


  dm_computeState: function (state, pvalue) {
    return {
              sites: this.dm_countSites (state, pvalue),
           }
  },

  dm_formatP: d3.format (".3f"),

  getInitialState: function() {
    return this.dm_computeState (this.props.analysis_results, this.props.pValue);
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(this.dm_computeState (nextProps.analysis_results, nextProps.pValue));
  },

  render: function() {

        return (
              <div className="panel panel-primary">
                  <div className="panel-heading">
                      <h3 className="panel-title">
                        <abbr title = "Single Likelihood Ancestor Counting">SLAC</abbr> analysis summary
                      </h3>
                  </div>
                  <div className="panel-body">
                      <span className="lead">
                          Evidence<sup>&dagger;</sup> of pervasive <span className = 'hyphy-red'>diversifying</span> / <span className = 'hyphy-navy'>purifying</span> selection was found at
                          <strong className = 'hyphy-red'> {this.state.sites.positive}</strong> / <strong className = 'hyphy-navy'>{this.state.sites.negative}</strong> sites
                          among {this.state.sites.all} tested sites

                      </span>
                      <div style={{marginBottom: '0em'}}>
                        <small>
                          <sup>&dagger;</sup>Extended binomial test, p &le; {this.dm_formatP(this.props.pValue)}
                          <div className = "dropdown hidden-print" style={{display: 'inline', marginLeft: '0.25em'}}>
                            <button id = 'dm.pvalue.slider' type="button" className="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="caret"></span></button>
                            <ul className="dropdown-menu" aria-labelledby='dm.pvalue.slider'>
                              <li><a href="#"><input type="range" min="0" max="1" value={this.props.pValue} step="0.01" onChange = {this.props.pAdjuster}/></a></li>
                            </ul>
                           </div>
                          <emph> not</emph> corrected for multiple testing; ambiguous characters resolved to minimize substitution counts.<br/>
                          <i className="fa fa-exclamation-circle"></i> Please cite <a href="http://www.ncbi.nlm.nih.gov/pubmed/15703242" target="_blank">PMID 15703242</a> if you use this result in a publication, presentation, or other scientific work.
                        </small>
                      </div>
                  </div>
              </div>
            );

  }
});



