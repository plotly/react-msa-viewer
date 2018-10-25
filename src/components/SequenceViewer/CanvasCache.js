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
  }

  // creates a canvas with a single letter
  // (for the fast font cache)
  createTile({key, tileWidth, tileHeight, createCanvas}) {
    if (tileWidth !== this.tileWidth || tileHeight !== this.tileHeight) {
      // check if cache needs to be regenerated
      this.updateTileSpecs({tileWidth, tileHeight});
    }
    if (key in this.cache) {
      return this.cache[key];
    }
    const canvas = this.cache[key] = document.createElement("canvas");
    canvas.width = tileWidth;
    canvas.height = tileHeight;
    this.ctx = canvas.getContext('2d');

    createCanvas({canvas: this.ctx});
    return canvas;
  }

  updateTileSpecs({tileWidth, tileHeight}) {
    this.invalidate();
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }

  invalidate() {
    // TODO: destroy the old canvas elements
    this.cache = {};
  }
}

export default CanvasCache;
