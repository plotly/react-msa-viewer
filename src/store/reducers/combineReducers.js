/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * Own implementation of combineReducers which allows manipulating the state
 * afterwards
 * See:
 *  - https://github.com/reduxjs/redux/blob/master/docs/recipes/reducers/UsingCombineReducers.md
 *  - https://github.com/reduxjs/redux/blob/master/src/combineReducers.js
 *
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
export default function combineReducers(reducers) {
  const keys = Object.keys(reducers);
  return function(state = {}, action) {
    const nextState = {};
    let hasChanged = false;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const nextStateForKey = reducers[key](state[key], action);
      if (typeof nextStateForKey === 'undefined') {
        throw new Error("A reducer can't return 'undefined'");
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== state[key];
    }
    return hasChanged ? nextState : state;
  };
};
