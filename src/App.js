import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Canvas from './Canvas.js';
import Widget from './Widget.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widgets: [],
    };

    this.addWidgetOnClick = this.addWidgetOnClick.bind(this);
  }

  render() {
    return <Canvas width={ 640 } height={ 480 } widgets={ this.state.widgets } onClick={ this.addWidgetOnClick } />;
  }

  addWidgetOnClick(event) {
    event.preventDefault();
    var canvasBounds = ReactDOM.findDOMNode(this).getBoundingClientRect();
    var widgetInfo = {
      row: event.clientY - Math.floor(canvasBounds.top),
      col: event.clientX - Math.floor(canvasBounds.left),
      widget: <Widget />,
    };
    this.setState({
      widgets: this.state.widgets.concat([widgetInfo]),
    });
  }
}

export default App;
