var React = require('react');

class Header extends React.Component {
  render(){
    return (<h4 className="dm-table-header">
      {this.props.title}
      <span
        className="glyphicon glyphicon-info-sign"
        style={{ verticalAlign: "middle", float: "right" }}
        aria-hidden="true"
        data-toggle="popover"
        data-trigger="hover"
        title="Actions"
        data-html="true"
        data-content={this.props.popover}
        data-placement="bottom"
      />
    </h4>);
  }
}

module.exports.Header = Header;

