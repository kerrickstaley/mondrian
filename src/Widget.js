import React, { Component } from 'react';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: this.getRandomColor(),
    };
  }

  render() {
    return <div style={{ width: '10px', height: '10px', backgroundColor: this.state.color, }} />;
  }

  getRandomColor() {
    var rv = '#';
    for (var i = 0; i < 6; i++) {
      rv += Math.floor(Math.random() * 16).toString(16);
    }
    return rv;
  }
}

export default Widget;
