import React, { Component } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

class MainResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copy_transition: false
    };
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

  onCopy = () => {
    this.setState({ copy_transition: true });
    setTimeout(() => {
      this.setState({ copy_transition: false });
    }, 1000);
  };

  render() {
    return (
      <div className="col-12">
        <div className="main-result">
          {this.props.summary_for_clipboard != null ? (
            <p>
              <CopyToClipboard
                text={this.props.summary_for_clipboard}
                onCopy={this.onCopy}
              >
                <span id="copy-it" className="float-right">
                  {this.getClipboard()}
                </span>
              </CopyToClipboard>
            </p>
          ) : null}
          {this.props.summary_for_rendering}
          <hr />
          <p>
            <small>
              See <a href={this.props.method_ref}>here</a> for more information
              about this method.
              <br />
              Please cite{" "}
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
      </div>
    );
  }
}

export { MainResult };
