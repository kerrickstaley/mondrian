import React, { Component } from 'react';

class Canvas extends Component {
  render() {
    return (
      <div className="Canvas" style={{width: this.props.width + 'px', height: this.props.height + 'px', backgroundColor: '#FCFBE3'}}>
      </div>
    );
  }
}

export default Canvas;
