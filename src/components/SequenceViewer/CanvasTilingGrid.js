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

class CanvasCache {
  constructor(g) {
    this.cache = {};
    this.cacheHeight = 0;
    this.cacheWidth = 0;
  }

  // returns a cached canvas
  getFontTile(letter, width, height, font) {
    // validate cache
    if (width !== this.cacheWidth || height !== this.cacheHeight || font !== this.font) {
      this.updateDimensions(width, height);
      this.font = font;
    }

    if (this.cache[letter] === undefined) {
      this.createTile(letter, width, height);
    }

    return this.cache[letter];
  }

  // creates a canvas with a single letter
  // (for the fast font cache)
  createTile({text, tileWidth, tileHeight, tileFont, colorScheme}) {
    const key = text + "-" + colorScheme;
    if (key in this.cache) {
      return this.cache[key];
    }
    const canvas = this.cache[key] = document.createElement("canvas");
    canvas.width = tileWidth;
    canvas.height = tileHeight;
    this.ctx = canvas.getContext('2d');

    this.ctx.font = tileFont;
    this.ctx.globalAlpha = 0.7;
    this.ctx.fillStyle = colorScheme;
    this.ctx.fillRect(0, 0, tileWidth, tileHeight);
    this.ctx.globalAlpha = 1.0;

    this.ctx.fillStyle = "#000000";
    this.ctx.font = tileFont + "px mono";
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, tileWidth / 2, tileHeight / 2, tileWidth, tileFont);
    return canvas;
  }

  updateDimensions(width, height) {
    this.invalidate();
    this.cacheWidth = width;
    this.cacheHeight = height;
  }

  invalidate() {
    // TODO: destroy the old canvas elements
    this.cache = {};
  }
}

const cache = new CanvasCache();

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
      const canvasTile = cache.createTile({
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
    return (
      <div style={style}>
        <canvas
          ref={this.canvas}
          width={this.props.width}
          height={this.props.height}
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
};

export default CanvasTilingGridComponent;
