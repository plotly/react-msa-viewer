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

const position = (state = {}, {type, data}) => {
  switch(type){
    case types.POSITION_UPDATE:
      return {xPos: data.xPos, yPos:data.yPos};
    default:
      return state;
  }
}

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

export const reducers = combineReducers({
  position,
  props,
  sequences,
});
export default reducers;
