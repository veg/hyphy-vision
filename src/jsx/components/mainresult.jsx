import React, { Component} from 'react';
import CopyToClipboard from "react-copy-to-clipboard";
          
class MainResult extends Component{
  
  constructor(props) {
    super(props);
    this.state = {
      copy_transition: false
    }
    this.onCopy = this.onCopy.bind(this);
  }
   
  getClipboard() {
    if (this.state.copy_transition) {
      return <i>Copied!</i>;
    } else {
      return (
        <a>
          <i className="fa fa-clipboard" aria-hidden="true" />
        </a>
      );
    }
  }
  
  onCopy() {
    var self = this
    this.setState({ copy_transition: true });
    setTimeout(() => {
      this.setState({ copy_transition: false });
    }, 1000);
  }

  render() {
    var self = this
    return (
          <div className="main-result">            
            <p>
              <CopyToClipboard text={this.props.summary_for_clipboard} onCopy={this.onCopy}>
                <span id="copy-it" className="pull-right">
                  {this.getClipboard()}
                </span>
              </CopyToClipboard>
              <p>
                {this.props.user_message}
              </p>
            </p>
            <hr />
            <p>
              <small>
                  See{" "}
                <a href={this.props.method_ref}>
                  here
                </a>{" "}
                  for more information about this method.
                <br />Please cite{" "}
                <a
                  href={this.props.citation_ref}
                  id="summary-pmid"
                  target="_blank"
                >
                 {this.props.citation_number} 
                </a>{" "}
                if you use this result in a publication, presentation, or other
                scientific work.
              </small>
            </p>
          </div>
    )
  }
}

module.exports.MainResult = MainResult;
