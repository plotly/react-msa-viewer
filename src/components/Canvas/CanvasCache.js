/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import * as shallowEqual from 'shallowequal';

/**
 * A simple, in-memory cache for Canvas tiles.
 * Gets automatically invalidated when called with different widths.
 */
class CanvasCache {
  constructor() {
    this.cache = {};
  }

  // creates a canvas with a single letter
  // (for the fast font cache)
  createTile({key, tileWidth, tileHeight, create}) {
    // check if cache needs to be regenerated
    if (key in this.cache) {
      return this.cache[key];
    }
    const canvas = this.cache[key] = document.createElement("canvas");
    canvas.width = tileWidth;
    canvas.height = tileHeight;
    const ctx = canvas.getContext('2d');

    create({canvas: ctx});
    return canvas;
  }

  /**
   * Checks whether the tile specification has changed and the cache needs
   * to be refreshed.
   * Returns: `true` when the cache has been invalidated
   */
  updateTileSpecs(spec) {
    if (!shallowEqual(spec, this.spec)) {
      console.log("invalidate", spec, this.spec);
      this.invalidate();
      this.spec = spec;
      return true;
    }
    return false;
  }

  invalidate() {
    // TODO: destroy the old canvas elements
    this.cache = {};
    this.spec = {};
  }
}

export default CanvasCache;
