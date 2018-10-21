/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import {
  repeat,
  zipObject,
} from 'lodash-es';

/**
 * Creates a shallow comparison function for two input parameters: `firstObject`, `secondObject`
 *
 * This is different to normal shallow comparison as it:
 * - creates the shallow
 * - allows certain keys of both objects to be ignored
 *
 * @param: omittedKeys (array of the keys to be ignored in both objects)
 */
export default function shallowCompare(omittedKeys){
  const omittedMap = zipObject(omittedKeys, repeat(true, omittedKeys.length));
  return function compare(thisProps, nextProps){
    for (let key in nextProps) {
      if (!(key in omittedMap) &&
          nextProps[key] !== thisProps[key])
        return true;
    }
    return false;
  }
}
