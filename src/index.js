import React from 'react';
import ReactDOM from 'react-dom';
import Canvas from './Canvas';
import Widget from './Widget';
import './index.css';

function addWidgetOnClick() {
  var widget = <Widget />;
  var row = Math.floor(Math.random() * 400);
  var col = Math.floor(Math.random() * 600);
  this.addWidgetAt(widget, row, col);
}

var canvasRendered = ReactDOM.render(
  <Canvas width={ 640 } height={ 480 } onClick={ addWidgetOnClick }/>,
  document.getElementById('root')
);

var widget = <Widget />;
