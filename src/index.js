import React from 'react';
import ReactDOM from 'react-dom';
import Canvas from './Canvas';
import Widget from './Widget';
import './index.css';

var canvasRendered = ReactDOM.render(
  <Canvas width={640} height={480} />,
  document.getElementById('root')
);

var widget = <Widget />;
canvasRendered.addWidgetAt(widget, 50, 60);
