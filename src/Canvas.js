import React, { Component } from 'react';

class Canvas extends Component {
  constructor(props) {
    super(props);

    var pixelToWidgetId = [];
    for (var r = 0; r < props.height; r++) {
      pixelToWidgetId[r] = [];
      for (var c = 0; c < props.width; c++) {
        pixelToWidgetId[r][c] = -1;
      }
    }

    this.state = {
      pixelToWidgetId: pixelToWidgetId,
      widgetPositions: [],
    }

    this.positionWidgets = this.positionWidgets.bind(this);

    // this.positionWidgets(this.props);
  }

  render() {
    var widgetsInContainers = this.props.widgets.map((widget, index) => {
      var containerStyle = {
        position: 'absolute',
        top: this.state.widgetPositions[index].row,
        left: this.state.widgetPositions[index].col,
        width: this.state.widgetPositions[index].width,
        height: this.state.widgetPositions[index].height,
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

    // TODO: try to refactor these 4 functions into 1
    function tryExpandUp(widgetPosition, widgetIdx) {
      var newR = widgetPosition.row - 1;
      if (newR < 0) {
        return false;
      }
      for (var c = widgetPosition.col; c < widgetPosition.col + widgetPosition.width; c++) {
        if (pixelToWidgetId[newR][c] >= 0) {
          return false;
        }
      }

      // we can expand, so do it
      for (var c = widgetPosition.col; c < widgetPosition.col + widgetPosition.width; c++) {
        pixelToWidgetId[newR][c] = widgetIdx;
      }
      widgetPosition.row = newR;
      widgetPosition.height++;
      return true;
    }

    function tryExpandDown(widgetPosition, widgetIdx) {
      var newR = widgetPosition.row + widgetPosition.height + 1;
      if (newR >= nextProps.height) {
        return false;
      }
      for (var c = widgetPosition.col; c < widgetPosition.col + widgetPosition.width; c++) {
        if (pixelToWidgetId[newR][c] >= 0) {
          return false;
        }
      }

      // we can expand, so do it
      for (var c = widgetPosition.col; c < widgetPosition.col + widgetPosition.width; c++) {
        pixelToWidgetId[newR][c] = widgetIdx;
      }
      widgetPosition.height++;
      return true;
    }

    function tryExpandLeft(widgetPosition, widgetIdx) {
      var newC = widgetPosition.col - 1;
      if (newC < 0) {
        return false;
      }
      for (var r = widgetPosition.row; r < widgetPosition.row + widgetPosition.height; r++) {
        if (pixelToWidgetId[r][newC] >= 0) {
          return false;
        }
      }

      // we can expand, so do it
      for (var r = widgetPosition.row; r < widgetPosition.row + widgetPosition.height; r++) {
        pixelToWidgetId[r][newC]= widgetIdx;
      }
      widgetPosition.col = newC;
      widgetPosition.width++;
      return true;
    }

    function tryExpandRight(widgetPosition, widgetIdx) {
      var newC = widgetPosition.col + widgetPosition.width + 1;
      if (newC >= nextProps.width) {
        return false;
      }
      for (var r = widgetPosition.row; r < widgetPosition.row + widgetPosition.height; r++) {
        if (pixelToWidgetId[r][newC] >= 0) {
          return false;
        }
      }

      // we can expand, so do it
      for (var r = widgetPosition.row; r < widgetPosition.row + widgetPosition.height; r++) {
        pixelToWidgetId[r][newC]= widgetIdx;
      }
      widgetPosition.width++;
      return true;
    }

    for (var widgetIdx = widgetPositions.length; widgetIdx < nextProps.widgets.length; widgetIdx++) {
      var newWidget = nextProps.widgets[widgetIdx];
      if (pixelToWidgetId[newWidget.row][newWidget.col] >= 0) {
        // cannot render widget, give it a width and height of 0
        widgetPositions.push({
          row: newWidget.row,
          col: newWidget.col,
          width: 0,
          height: 0,
        });
        continue;
      }

      var widgetPosition = {
          row: newWidget.row,
          col: newWidget.col,
          width: 1,
          height: 1,
      };

      // try expanding in all directions until we expand 100px or we cannot expand any more
      var expandCount = [0, 0, 0, 0];
      var tryExpandFuncs = [tryExpandUp, tryExpandDown, tryExpandLeft, tryExpandRight];
      while (expandCount.some(val => val <= 100)) {
        for (var i = 0; i < 4; i++) {
          if (expandCount[i] <= 100) {
            if (tryExpandFuncs[i](widgetPosition, widgetIdx)) {
              expandCount[i]++;
            } else {
              expandCount[i] = 101;
            }
          }
        }
      }

      widgetPositions.push(widgetPosition);
    }

    this.setState({
      widgetPositions: widgetPositions,
      pixelToWidgetId: pixelToWidgetId,
    });
  }
}

export default Canvas;
