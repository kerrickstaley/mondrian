import React, { Component } from 'react';

class Canvas extends Component {
  render() {
    var widgetsInContainers = this.props.widgets.map((widget, index) => {
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
          onClick={ this.props.onClick }>
        { widgetsInContainers }
      </div>
    );
  }
}

export default Canvas;
