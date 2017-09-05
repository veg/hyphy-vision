var React = require('react');

class ErrorMessage extends React.Component {
  render() {
    return(<div
      id="datamonkey-absrel-error"
      className="alert alert-danger alert-dismissible"
      role="alert"
      style={{ display: "none" }}
    >
      <button
        type="button"
        className="close"
        id="datamonkey-absrel-error-hide"
      >
        <span aria-hidden="true">&times;</span>
        <span className="sr-only">Close</span>
      </button>
      <strong>Error!</strong>{" "}
      <span id="datamonkey-absrel-error-text" />
    </div>);
  }
}

module.exports.ErrorMessage = ErrorMessage;
