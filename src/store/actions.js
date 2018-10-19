/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

export const types = {
  POSITION_UPDATE: 'POSITION_UPDATE',
  PROPS_UPDATE: 'PROPS_UPDATE',
  SEQUENCES_UPDATE: 'SEQUENCES_UPDATE',
};

/**
 * Creates a redux action of the following payload:
 * {
 *  type,
 *  ...forwardedArgNames,
 * }
 * i.e. its payload is the given `type` and the forwarded argument names from the actions payload.
 * If no arguments are provided, the payload is forwarded as `data`.
 */
function makeActionCreator(type, ...argNames) {
  return function (...args) {
    const action = { type };
    if (argNames.length === 0) {
      action.data = args[0];
      return action;
    }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  }
}

export const updatePosition = makeActionCreator(types.POSITION_UPDATE);
export const updateProps = makeActionCreator(types.PROPS_UPDATE, 'key', 'value');
export const updateSequences = makeActionCreator(types.SEQUENCES_UPDATE);
