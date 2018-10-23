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

import PropTypes from 'prop-types';

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
      const maxWidth = maximum * prevState.props.tileWidth - prevState.props.width;
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
 * Mixes in position store functionality in the requiring components.
 * Can't use HoC components as React Tree calculations need to be prevented at the utmost cost.
 */
export function positionStoreMixin(Component, {
  withX = false,
  withY = false,
}) {
  Component.prototype.shouldRerender = function() {
      if (withY) {
        if (Math.abs(this.currentViewSequence - this.lastCurrentViewSequence) >= this.props.cacheElements) {
          return true;
        }
      }
      if (withX) {
        if (Math.abs(this.currentViewSequencePosition - this.lastCurrentViewSequencePosition) >= this.props.cacheElements) {
          return true;
        }
      }
      return this.updateScrollPosition();
  }

  Component.prototype.updateFromPositionStore = function() {
    const state = this.context.positionMSAStore.getState();
    let stateX = {}, stateY = {};
    if (withX) {
      this.xPosOffset = state.xPosOffset;
      this.currentViewSequencePosition = state.currentViewSequencePosition;
      stateX = {
        xPosOffset: this.xPosOffset,
        currentViewSequencePosition: this.currentViewSequencePosition,
      }
    }
    if (withY) {
      this.yPosOffset = state.yPosOffset;
      this.currentViewSequence = state.currentViewSequence;
      stateY = {
        xPosOffset: this.yPosOffset,
        currentViewSequence: this.currentViewSequence,
      }
    }
    if (this.shouldRerender()) {
      this.setState({
        ...stateX,
        ...stateY,
      });
    }
  }

  const oldComponentWillMount = Component.prototype.componentWillMount;
  Component.prototype.componentWillMount = function() {
    if (oldComponentWillMount) {
      oldComponentWillMount.call(this);
    }
    this.updateFromPositionStore = this.updateFromPositionStore.bind(this);
    this.updateFromPositionStore();
    this.context.positionMSAStore.subscribe(this.updateFromPositionStore);
  }

  Component.prototype.updateScrollPosition = function(){
    if (this.el.current) {
      if (withX) {
        let offsetX = -this.xPosOffset;
        offsetX += (this.lastCurrentViewSequencePosition - this.lastStartXTile) * this.props.tileWidth;
        if (this.currentViewSequencePosition !== this.lastCurrentViewSequencePosition) {
          offsetX += (this.currentViewSequencePosition - this.lastCurrentViewSequencePosition) * this.props.tileWidth;
        }
        this.el.current.scrollLeft = offsetX;
      }
      if (withY) {
        let offsetY = -this.yPosOffset;
        offsetY += (this.lastCurrentViewSequence - this.lastStartYTile) * this.props.tileHeight;
        if (this.currentViewSequence !== this.lastCurrentViewSequence) {
          offsetY += (this.currentViewSequence - this.lastCurrentViewSequence) * this.props.tileHeight;
        }
        this.el.current.scrollTop = offsetY;
      }
    }
    return false;
  }

  // inject the store via contexts
  Component.contextTypes = {
    positionMSAStore: PropTypes.object,
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
        currentViewSequence: clamp(
          floor(state.position.yPos / state.props.tileHeight),
          0,
          state.sequences.length - 1
        ),
        currentViewSequencePosition: clamp(
          floor(position.xPos / state.props.tileWidth),
          0,
          state.sequences.maxLength,
        ),
        position,
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
