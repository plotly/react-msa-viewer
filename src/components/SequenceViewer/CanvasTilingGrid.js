/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CanvasComponent from '../Canvas/CanvasComponent';

/**
 * Allows rendering in tiles of grids.
 *
 * |---|---|---|
 * |-1-|-2-|-3-|
 * |---|---|---|
 * ―――――――――――――
 * |---|---|---|
 * |-4-|-5-|-6-|
 * |---|---|---|
 *
 * where 1..6 are TilingGrid component of xGridSize and yGridSize of 3.
 *
 * This split-up is required to avoid frequent repaints and keeps the React
 * Tree calculations slim.
 */
class CanvasTilingGridComponent extends CanvasComponent {

  drawTile({row, column}) {
    const tileWidth = this.props.tileWidth;
    const tileHeight = this.props.tileHeight;
    const yPos = tileHeight * (row - this.props.startYTile);
    const xPos = tileWidth * (column - this.props.startXTile);
    const el = this.props.sequences.raw[row].sequence[column];
    if (el !== undefined) {
      const colorScheme = this.props.colorScheme.getColor(el)
      const canvasTile = this.props.residueTileCache.createTile({
        colorScheme,
        text: el,
        tileWidth, tileHeight,
        tileFont: this.props.tileFont,
      });
      this.ctx.ctx.drawImage(
        canvasTile, xPos, yPos, tileWidth, tileHeight
      );
    }
  }

  draw() {
    this.drawCounter = 0;
    console.log(this.drawCounter);
    const residues = [];
    for (let i = this.props.startYTile; i < this.props.endYTile; i++) {
      for (let j = this.props.startXTile; j < this.props.endXTile; j++) {
        this.drawTile({row:i, column:j});
      }
    }
  }

  render() {
    const style = {
      position: "absolute",
      top: 20 * this.props.startYTile,
      left: 20 * this.props.startXTile,
    }
    const width = this.props.tileWidth * (this.props.endXTile - this.props.startXTile);
    const height = this.props.tileHeight * (this.props.endYTile - this.props.startYTile);
    return (
      <div style={style}>
        <canvas
          ref={this.canvas}
          width={width}
          height={height}
        >
        </canvas>
      </div>
    );
  }
}

CanvasTilingGridComponent.defaultProps = {
  width: 200,
  height: 200,
}

CanvasTilingGridComponent.propTypes = {
  style: PropTypes.object,
  renderTile: PropTypes.func.isRequired,
  startXTile: PropTypes.number.isRequired,
  startYTile: PropTypes.number.isRequired,
  endXTile: PropTypes.number.isRequired,
  endYTile: PropTypes.number.isRequired,
  residueTileCache: PropTypes.object.isRequired,
};

export default CanvasTilingGridComponent;
