/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * A simple, in-memory cache for Canvas tiles.
 * Gets automatically invalidated when called with different widths.
 */
class CanvasCache {
  constructor() {
    this.cache = {};
    this.tileHeight = 0;
    this.tileWidth = 0;
    this.tileFont = "";
  }

  // creates a canvas with a single letter
  // (for the fast font cache)
  createTile({text, tileWidth, tileHeight, tileFont, colorScheme}) {
    if (tileWidth !== this.tileWidth || tileHeight !== this.tileFont) {
      // check if cache needs to be regenerated
      this.updateTileSpecs({tileWidth, tileHeight, tileFont});
    }
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

  updateTileSpecs({tileWidth, tileHeight, tileFont}) {
    this.invalidate();
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tileFont = tileFont;
  }

  invalidate() {
    // TODO: destroy the old canvas elements
    this.cache = {};
  }
}

export default CanvasCache;
