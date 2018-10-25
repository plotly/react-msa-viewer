/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * Creates a redux action of the following payload:
 * {
 *  type,
 *  payload: ...forwardedArgNames,
 * }
 * i.e. its payload is the given `type` and the forwarded argument names from the actions payload.
 * If no arguments are provided, the payload is forwarded as `payload` in accordance to FSA (Flux Standard Action).
 *
 * Similar to createAction from redux-actions
 */
export function createAction(type, ...argNames) {
  const actionCreator = function (...args) {
    let payload;
    if (argNames.length === 0) {
      payload = args[0];
    } else {
      payload = {};
      argNames.forEach((arg, index) => {
        payload[argNames[index]] = args[index];
      });
    }
    return {
      type,
      payload,
    }
  }
  actionCreator.toString = () => type.toString();
  actionCreator.key = actionCreator.toString();
  return actionCreator;
}

// TODO: maybe use createActions from redux-actions here
export const updateProps = createAction('PROPS_UPDATE');
export const updateProp = createAction('PROP_UPDATE', 'key', 'value');
export const updateSequences = createAction('SEQUENCES_UPDATE');
export const actions = {
  updateProp,
  updateProps,
  updateSequences,
};
export default actions;
