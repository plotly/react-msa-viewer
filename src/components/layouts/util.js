/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import {
  forOwn,
} from 'lodash-es'

export const same = "FORWARD_SAME_PROP_NAME";

/**
 * Selects properties from a `props` object based on a
 * propsSelector object map.
 * @param {object} props The property object to select from
 * @param {object} propsSelector The map object with which
 *                               properties to forward
 * Example:
 * ```
 * forwardProps({a: 1, b: 2, c: 3}, {b: "myB", c: same})
 * // {forward: {myB: 2, c: 3}, other: {a: 1}}
 * ```
 */
export function forwardProps(props, propsSelector) {
  const forward = {};
  const other = {};
  forOwn(props, (v, k) => {
    if (k in propsSelector) {
      const forwardedName = propsSelector[k];
      const name = forwardedName === same ? k : forwardedName;
      forward[name] = v;
    } else {
      other[k] = v;
    }
  });
  return {forward, other};
}

/**
 * Uses a forward map to split a property object into pieces for
 * respective sub components as `forwarded` and
 * returns the remaining properties as `other`.
 *
 * @param {object} props The property object to split into pieces
 * @param {object} propsToForward The nested forward map object
 *
 * Example:
 * ```
 * forwardProps({a: 1, b: 2, c: 3},
 *              {myMapperA: {b: "myB"}, myMapperB: {c: same}})
 * // {forward: {myMapper: {myB: 2}, myMapperB: {c: 3}}, other: {a: 1}}
 * ```
 */
export function forwardPropsMapper(props, propsToForward) {
  const forward = {};
  let remainingProps = props;
  forOwn(propsToForward, (v, k) => {
    const result = forwardProps(remainingProps, v);
    forward[k] = result.forward;
    remainingProps = result.other;
  });
  return {forward, other: remainingProps};
}
