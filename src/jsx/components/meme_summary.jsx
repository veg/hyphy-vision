var React = require('react');

import { InputInfo } from "./input_info.jsx";

var MEMESummary = React.createClass({
  render: function(){
    var user_message,
        was_evidence = true;
    if (was_evidence) {
      user_message = (
        <p className="list-group-item-text label_and_input">
          MEME <strong className="hyphy-highlight">found evidence</strong> of
          positive selection in your phylogeny.
        </p>
      );
    } else {
      user_message = (
        <p className="list-group-item-text label_and_input">
          MEME <strong>found no evidence</strong> of positive
          selection in your phylogeny.
        </p>
      );
    }

    return (<div className="row" id="summary-tab">
      <div className="col-md-12">
        <h3 className="list-group-item-heading">
          <span className="summary-method-name">Mixed Effects Model of Evolution</span>
          <br />
          <span className="results-summary">results summary</span>
        </h3>
      </div>
      <div className="col-md-12">
        <InputInfo input_data={this.props.input_data}/>
      </div>
      <div className="col-md-12">
        <div className="main-result">
          {user_message}
          <hr />
          <p>
            <small>
              See{" "}
              <a href="http://www.hyphy.org/methods/selection-methods/#meme">
                here
              </a>{" "}
              for more information about the MEME method.
              <br />Please cite{" "}
              <a
                href="http://www.ncbi.nlm.nih.gov/pubmed/22807683"
                id="summary-pmid"
                target="_blank"
              >
                PMID 22807683 
              </a>{" "}
              if you use this result in a publication, presentation, or other
              scientific work.
            </small>
          </p>
        </div>
      </div>
    </div>);
  }
});

module.exports.MEMESummary = MEMESummary;
