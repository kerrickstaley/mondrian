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

  addWidgetOnClick() {
    var widgetInfo = {
      row: Math.floor(Math.random() * 400),
      col: Math.floor(Math.random() * 600),
      widget: <Widget />,
    };
    this.setState({
      widgets: this.state.widgets.concat([widgetInfo]),
    });
  }
}

export default App;
