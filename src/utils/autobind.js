/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import assert from '../assert';

/**
 * Automatically bind all given methods to the class instance.
 *
 * @param {object} object - instance to bind the method to
 * @param {string} arguments - methods of the instance to bind
 *
 * Note that class properties with arrows aren't a good solution
 * to the binding problem.
 * See e.g. https://medium.com/@charpeni/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think-3b3551c440b1
 */
export default function autoBind(instance) {
  assert(arguments.length > 1, "Must provide methods for binding");
  for (let i = 1; i < arguments.length; i++) {
    const k = arguments[i];
    instance[k] = instance[k].bind(instance);
  }
}
