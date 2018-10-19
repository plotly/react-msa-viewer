/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import { types } from './actions'

import { combineReducers } from 'redux'

import calculateSequencesState from './calculateSequencesState';
import {ColorScheme, isColorScheme} from '../utils/ColorScheme';

import {
  floor,
  clamp,
} from 'lodash-es';

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, {type, data}) {
    if (handlers.hasOwnProperty(type)) {
      return handlers[type](state, data);
    } else {
      return state;
    }
  };
}

const position = createReducer({
  xPos: 0,
  yPos: 0,
}, {
  [types.POSITION_UPDATE]: ({xPos, yPos}) => {
    return {xPos, yPos};
  }
});

function checkColorScheme(state) {
  if (isColorScheme(state.colorScheme)) {
      // it's already a color scheme
    } else {
      state.colorScheme = new ColorScheme(state.colorScheme);
  }
}

const props = (state = {}, {type, key, value}) => {
  switch(type){
    case types.PROPS_UPDATE:
      state = {
        ...state,
        [key]: value
      };
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

const sequences = (state = {}, {type, data}) => {
  switch(type){
    case types.SEQUENCES_UPDATE:
      return calculateSequencesState(data);
    default:
      return state;
  }
}

const sequenceStats = (state = {
    yPos: 0, xPos: 0,
    sequenceLength: 0,
  }, {type, data, key, value}) => {
  switch(type){
    case types.PROPS_UPDATE:
      if (!(key === "tileHeight" || key === "tileWidth")) {
        return state;
      }
      state = {
          ...state,
        [key]: value,
      }
      break;
    case types.POSITION_UPDATE:
      state = {
        ...state,
        ...data, // add {xPos, yPos}
      };
      break;
    case types.SEQUENCES_UPDATE:
      state = {
        ...state,
        sequenceLength: data.length,
        maxLength: data.reduce((m, e) => Math.max(m, e.sequence.length), 0),
      };
      break;
    default:
      return state;
  }
  state.currentViewSequence = clamp(
    floor(state.yPos / state.tileHeight),
    0,
    state.sequenceLength - 1
  );
  state.currentViewSequencePosition = clamp(
    floor(state.xPos / state.tileWidth),
    0,
    state.maxLength,
  );
  return state;
}

export const reducers = combineReducers({
  position,
  props,
  sequences,
  sequenceStats,
});
export default reducers;
