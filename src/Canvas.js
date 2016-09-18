import React, { Component } from 'react';

class Canvas extends Component {
  constructor() {
    super();
    this.state = {
      widgets: [],
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
      <div className="Canvas" style={{ width: this.props.width + 'px', height: this.props.height + 'px', backgroundColor: '#FCFBE3', position: 'relative' }}>
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
