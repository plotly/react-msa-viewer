/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import PropTypes from 'prop-types';

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

  const oldComponentDidUpdate = Component.prototype.componentDidUpdate;
  Component.prototype.componentDidUpdate = function() {
    if (oldComponentDidUpdate) {
      oldComponentDidUpdate.call(this);
    }
    this.updateScrollPosition();
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
export default positionStoreMixin;
