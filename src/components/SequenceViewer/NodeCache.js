/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * Allows to cache React component for reuse.
 * - use `get`/`set` for access
 * - call prepareReset before a full `rerender` and `reset` afterwards to avoid the cache growing without a limit.
 * This will lead to the cache being |O(2*n)| where n is the number of components of the caller.
 */
class ReactNodeCache {

  constructor() {
    this.cache = {};
    this.oldCache = {};
  }

  prepareReset() {
    this.oldCache = this.cache;
    this.cache = {};
    this.saved = 0;
  }

  reset() {
    console.log(`Removing ${Object.keys(this.oldCache).length} keys, saved: ${this.saved}`);
    this.oldCache = {};
  }

  get(key) {
    if (key in this.cache) {
      return this.cache[key];
    } else {
      this.saved++;
      const el = this.oldCache[key];
      delete this.oldCache[key];
      this.cache[key] = el;
      return el;
    }
  }

  set(key, value) {
    this.cache[key] = value;
  }
}

export default ReactNodeCache;
