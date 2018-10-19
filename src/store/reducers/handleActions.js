/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * Creates a reducer based on a handler object.
 * Example:
 * ```
 *  const sequences = handleActions({
 *    [types.SEQUENCES_UPDATE]: calculateSequencesState,
 *  }, []);
 * ```
 *
 * Similar to handleActions from redux-actions or createReduce from redux-act
 */
export default function handleActions(handlers, initialState) {
  return function reducer(state = initialState, {type, payload}) {
    if (handlers.hasOwnProperty(type)) {
      return handlers[type](state, payload);
    } else {
      return state;
    }
  };
}
