import React, { Component } from 'react';
import Widget from './Widget';

class Canvas extends Component {
  constructor(props) {
    super(props);

    var onClick;
    if (this.props.onClick) {
      onClick = this.props.onClick.bind(this);
    }

    this.state = {
      widgets: [],
      onClick: onClick,
    };
    this.addWidgetAt = this.addWidgetAt.bind(this);
  }

  render() {
    var widgetsInContainers = this.state.widgets.map((widget, index) => {
      var containerStyle = {
        position: 'absolute',
        top: widget.row,
        left: widget.col,
      }
      return <div style={ containerStyle } key={ index }>{ widget.widget }</div>;
    });
    return (
      <div
          className="Canvas"
          style={{ width: this.props.width + 'px', height: this.props.height + 'px', backgroundColor: '#FCFBE3', position: 'relative' }}
          onClick={ this.state.onClick }>
        { widgetsInContainers }
      </div>
    );
  }

  addWidgetAt(widget, row, col) {
    this.setState({
      widgets: this.state.widgets.concat([{
        row: row,
        col: col,
        widget: widget,
      }]),
    });
  }
}

export default Canvas;
