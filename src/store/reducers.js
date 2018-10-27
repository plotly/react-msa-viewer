/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import actions from './actions'

// reducer utilities
import handleActions from './reducers/handleActions'; // similar to handleActions from redux-actions
import combineReducers from './reducers/combineReducers';

// import reducers
import calculateSequencesState from './reducers/calculateSequencesState';

// other utilities
import {ColorScheme, isColorScheme} from '../utils/ColorScheme';

function checkColorScheme(state) {
  if (isColorScheme(state.colorScheme)) {
      // it's already a color scheme
    } else {
      state.colorScheme = new ColorScheme(state.colorScheme);
  }
}

/**
 * Makes sure that a colorScheme is only recreated if it changed.
 */
const props = (state = {}, {type, payload}) => {
  switch(type){
    case actions.updateProps.key:
      state = {
        ...state,
        ...payload,
      };
      // has the colorScheme been updated?
      if ("colorScheme" in payload) {
        checkColorScheme(state);
      }
      return state;
    case actions.updateProp.key:
      const {key, value} = payload;
      state = {
        ...state,
        [key]: value
      };
      // has the colorScheme been updated?
      if (key === "colorScheme") {
        checkColorScheme(state);
      }
      return state;
    default:
      if (state.colorScheme !== undefined) {
        checkColorScheme(state);
      }
      return state;
  }
}

const sequences = handleActions({
  [actions.updateSequences]: calculateSequencesState,
}, []);

/**
 * Aggregates the state with stats if the state changed.
 */
// TODO: maybe use reselect for this?
const sequenceStats = (prevState = {
  currentViewSequence: 0,
  currentViewSequencePosition: 0,
}, action, state) => {
  switch(action.type){
    case actions.updateProp.key:
    case actions.updateProps.key:
    case actions.updateSequences.key:
      if (state.props && state.props.tileHeight && state.props.tileWidth &&
          state.sequences) {
        const stats = {};
        stats.nrXTiles = Math.ceil(state.props.width / state.props.tileWidth) + 1;
        stats.nrYTiles = Math.ceil(state.props.height / state.props.tileHeight) + 1;
        stats.fullWidth = state.props.tileWidth * state.sequences.maxLength;
        stats.fullHeight = state.props.tileHeight * state.sequences.length;
        return stats;
      }
      break;
    default:
  }
  return prevState;
};

/**
 * Takes an reducer and an object of `statReducers`.
 * The `statReducers` have the following differences to normal reducers:
 *  - they are only called when the state has changed
 *  - they receive the full state as third parameter
 *
 *  These stat reducers are meant to efficiently compute derived statistics.
 */
const statCombineReduce = (reducer, statReducers) => {
  const keys = Object.keys(statReducers);
  return function(prevState = {}, action){
    const state = reducer(prevState, action);
    if (prevState !== state) {
      // state object already changed, no need to copy it again
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const nextStateForKey = statReducers[key](state[key], action, state);
        if (typeof nextStateForKey === 'undefined') {
          throw new Error("A reducer can't return 'undefined'");
        }
        state[key] = nextStateForKey;
      }
    }
    return state;
  }
};

export default statCombineReduce(combineReducers({
  props,
  sequences,
}), {
  sequenceStats,
});
