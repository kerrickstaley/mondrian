import React, { Component } from 'react';
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
    var widgetInfo = {
      row: event.clientY - 5,
      col: event.clientX - 5,
      widget: <Widget />,
    };
    this.setState({
      widgets: this.state.widgets.concat([widgetInfo]),
    });
  }
}

export default App;
