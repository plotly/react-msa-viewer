/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * A special Redux store that DOES NOT trigger automatically React Tree calculations.
 * This is only used to dispatch very frequent events like `POS_UPDATE`.
 */

import { createStore } from 'redux';

import { createAction } from './actions';

import {
  floor,
  clamp,
} from 'lodash-es';

export const updateMainStore = createAction("MAINSTORE_UPDATE");
export const updatePosition = createAction("POSITION_UPDATE");

const relativePositionReducer = (prevState = {position: {xPos: 0, yPos: 0}}, action) => {
  switch (action.type) {
    case "POSITION_UPDATE":
      const pos = prevState.position;
      pos.xPos += action.payload.xMovement;
      pos.yPos += action.payload.yMovement;
      const maximum = prevState.sequences.maxLength;
      const maxWidth = maximum * prevState.tileWidth - prevState.props.width;
      pos.xPos = clamp(pos.xPos, 0, maxWidth);
      const maxHeight = prevState.sequences.raw.length * prevState.props.tileHeight - prevState.props.height;
      pos.yPos = clamp(pos.yPos, 0, maxHeight);
      return {
        ...prevState,
        position: pos,
      };
    default:
      return prevState;
  }
}


/**
 * Aggregates the state with stats if the state changed.
 */
// TODO: maybe use reselect for this?
const sequenceStats = (prevState = {
  currentViewSequence: 0,
  currentViewSequencePosition: 0,
}, action, state) => {
  switch(action.type){
    //case actions.updateProps.key:
    //case actions.updatePosition.key:
    //case actions.updateSequences.key:
    case updatePosition.key:
    case updateMainStore.key:
      if (state.props && state.props.tileHeight && state.props.tileWidth &&
          state.position && state.sequences) {
        const stats = {};
        stats.currentViewSequence = clamp(
          floor(state.position.yPos / state.props.tileHeight),
          0,
          state.sequences.length - 1
        );
        stats.currentViewSequencePosition = clamp(
          floor(state.position.xPos / state.props.tileWidth),
          0,
          state.sequences.maxLength,
        );
        stats.yPosOffset = -(state.position.yPos % state.props.tileHeight);
        stats.xPosOffset = -(state.position.xPos % state.props.tileWidth);
        stats.nrTiles = Math.ceil(state.props.width / state.props.tileWidth) + 1;
        return stats;
      }
      break;
    default:
  }
  return prevState;
};


export function positionReducer(state = {position: {xPos: 0, yPos: 0}}, action){
  switch(action.type) {
    case updatePosition.key:
      const position = relativePositionReducer(state, action).position;
      const payload = {
        xPosOffset: -(position.xPos % state.props.tileWidth),
        yPosOffset: -(position.yPos % state.props.tileWidth),
        currentViewSequencePosition: clamp(
          floor(position.xPos / state.props.tileWidth),
          0,
          state.sequences.maxLength,
        )
      };
      return {
        ...state,
        ...payload,
      };
    // merge updates of the main store with this store for now
    case updateMainStore.key:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

// for future flexibility
export {
  createStore as createPositionStore,
};
