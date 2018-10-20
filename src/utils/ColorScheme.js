/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import schemes from '../colorschemes';
const schemesMgr = new schemes();

/**
 * Simple color scheme abstraction over msa-colorschemes. To be extended.
 */
class ColorScheme {

  constructor(colorScheme) {
    this.scheme = schemesMgr.getScheme(colorScheme);
  }

  getColor(element) {
    return this.scheme.getColor(element);
  }

}
export default ColorScheme;
export {ColorScheme};

/**
 * Checks whether the `obj` is a color scheme.
 * Everything that looks like a color scheme is very likely one.
 */
export function isColorScheme(obj) {
  return obj && typeof obj.getColor === "function";
}
