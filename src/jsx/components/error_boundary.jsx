var React = require("react");

const bomb = require("../../../images/bomb.svg");

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="row mt-5">
          <h1 className="col-12 text-center">
            <img src={bomb} width="500px" />
          </h1>
          <h2 className="col-12 text-center">Ouch!</h2>
          <p className="col-12 text-center">
            Something went wrong when rendering the results page. Please file a{" "}
            <a href="//github.com/veg/hyphy/issues">bug</a>.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export { ErrorBoundary };
