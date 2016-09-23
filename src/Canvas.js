import React, { Component } from 'react';

class Canvas extends Component {
  constructor(props) {
    super(props);

    var pixelToWidgetId = [];
    var width = props.width;
    var height = props.height;
    for (var rotIdx = 0; rotIdx < 4; rotIdx++) {
      pixelToWidgetId[rotIdx] = [];
      for (var r = 0; r < height; r++) {
        pixelToWidgetId[rotIdx][r] = [];
        for (var c = 0; c < width; c++) {
          pixelToWidgetId[rotIdx][r][c] = -1;
        }
      }
      [width, height] = [height, width];
    }

    this.state = {
      pixelToWidgetId: pixelToWidgetId,
      widgetPositions: [[], [], [], []],
    }

    this.propagatePixelToWidgetId = this.propagatePixelToWidgetId.bind(this);
    this.propagateWidgetPositions = this.propagateWidgetPositions.bind(this);
    this.positionWidgets = this.positionWidgets.bind(this);

    // this.positionWidgets(this.props);
  }

  propagatePixelToWidgetId(pixelToWidgetId, rotIdx, row, col) {
    var val = pixelToWidgetId[rotIdx][row][col];
    var width = rotIdx % 2 ? this.props.height : this.props.width;
    var height = rotIdx % 2 ? this.props.width : this.props.height;
    for (var i = (rotIdx + 1) % 4; i != rotIdx; i = (i + 1) % 4) {
      // console.log('i: ' + i + ' row: ' + row + ' col: ' + col);
      [row, col] = [width - col - 1, row];
      [width, height] = [height, width];
      pixelToWidgetId[i][row][col] = val;
    }
  }

  propagateWidgetPositions(widgetPositions, rotIdx, widgetIdx) {
    var row = widgetPositions[rotIdx][widgetIdx].row;
    var col = widgetPositions[rotIdx][widgetIdx].col;
    var width = widgetPositions[rotIdx][widgetIdx].width;
    var height = widgetPositions[rotIdx][widgetIdx].height;

    var canvasWidth = rotIdx % 2 ? this.props.height : this.props.width;
    var canvasHeight = rotIdx % 2 ? this.props.width : this.props.height;
    for (var i = (rotIdx + 1) % 4; i != rotIdx; i = (i + 1) % 4) {
      [row, col] = [canvasWidth - col - width, row];
      [width, height] = [height, width];
      [canvasWidth, canvasHeight] = [canvasHeight, canvasWidth];

      if (widgetPositions[i].length <= widgetIdx) {
        widgetPositions[i][widgetIdx] = {};
      }

      widgetPositions[i][widgetIdx].row = row;
      widgetPositions[i][widgetIdx].col = col;
      widgetPositions[i][widgetIdx].width = width;
      widgetPositions[i][widgetIdx].height = height;
    }
  }

  render() {
    var widgetsInContainers = this.props.widgets.map((widget, index) => {
      var containerStyle = {
        position: 'absolute',
        top: this.state.widgetPositions[0][index].row,
        left: this.state.widgetPositions[0][index].col,
        width: this.state.widgetPositions[0][index].width,
        height: this.state.widgetPositions[0][index].height,
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

  componentWillReceiveProps(nextProps) {
    this.positionWidgets(nextProps);
  }

  positionWidgets(nextProps) {
    var widgetPositions = JSON.parse(JSON.stringify(this.state.widgetPositions));  // inefficient; TODO: fix
    var pixelToWidgetId = JSON.parse(JSON.stringify(this.state.pixelToWidgetId));
    var propagatePixelToWidgetId = this.propagatePixelToWidgetId;

    function tryExpand(rotIdx, widgetPosition, widgetIdx) {
      // we try to expand downwards
      var canvasHeight = rotIdx % 2 ? nextProps.width : nextProps.height;
      var newR = widgetPosition.row + widgetPosition.height;
      if (newR >= canvasHeight) {
        return false;
      }
      for (var c = widgetPosition.col; c < widgetPosition.col + widgetPosition.width; c++) {
        if (pixelToWidgetId[rotIdx][newR][c] >= 0) {
          return false;
        }
      }

      // we can expand, so do it
      for (var c = widgetPosition.col; c < widgetPosition.col + widgetPosition.width; c++) {
        pixelToWidgetId[rotIdx][newR][c] = widgetIdx;
        propagatePixelToWidgetId(pixelToWidgetId, rotIdx, newR, c);
      }
      widgetPosition.height++;
      return true;
    }

    for (var widgetIdx = widgetPositions[0].length; widgetIdx < nextProps.widgets.length; widgetIdx++) {
      var newWidget = nextProps.widgets[widgetIdx];
      if (pixelToWidgetId[0][newWidget.row][newWidget.col] >= 0) {
        // cannot render widget, give it a width and height of 0
        widgetPositions[0].push({
          row: newWidget.row,
          col: newWidget.col,
          width: 0,
          height: 0,
        });
        this.propagateWidgetPositions(widgetPositions, 0, widgetIdx);
        continue;
      }

      widgetPositions[0].push({
          row: newWidget.row,
          col: newWidget.col,
          width: 1,
          height: 1,
      });
      this.propagateWidgetPositions(widgetPositions, 0, widgetIdx);
      pixelToWidgetId[0][newWidget.row][newWidget.col] = widgetIdx;
      this.propagatePixelToWidgetId(pixelToWidgetId, 0, newWidget.row, newWidget.col);

      // try expanding in all directions until we expand 100px or we cannot expand any more
      var expandCount = [0, 0, 0, 0];
      while (expandCount.some(val => val <= 100)) {
        console.log(expandCount);
        for (var i = 0; i < 4; i++) {
          if (expandCount[i] <= 100) {
            if (tryExpand(i, widgetPositions[i][widgetIdx], widgetIdx)) {
              expandCount[i]++;
              this.propagateWidgetPositions(widgetPositions, i, widgetIdx);
            } else {
              expandCount[i] = 101;
            }
          }
        }
      }
    }

    this.setState({
      widgetPositions: widgetPositions,
      pixelToWidgetId: pixelToWidgetId,
    });
  }
}

export default Canvas;
