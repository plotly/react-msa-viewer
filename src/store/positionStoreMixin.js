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
        if (Math.abs(this.position.currentViewSequencePosition - this.position.lastCurrentViewSequencePosition) >= this.props.cacheElements) {
          return true;
        }
      }
      return this.updateScrollPosition();
  }

  Component.prototype.updateFromPositionStore = function() {
    const state = this.context.positionMSAStore.getState();
    let stateX = {}, stateY = {};
    this.position = this.position || {};
    if (withX) {
      this.position.xPosOffset = state.xPosOffset;
      this.position.currentViewSequencePosition = state.currentViewSequencePosition;
      stateX = {
        xPosOffset: this.position.xPosOffset,
        currentViewSequencePosition: this.position.currentViewSequencePosition,
      }
    }
    if (withY) {
      this.position.yPosOffset = state.position.yPosOffset;
      this.position.currentViewSequence = state.position.currentViewSequence;
      stateY = {
        xPosOffset: this.position.yPosOffset,
        currentViewSequence: this.position.currentViewSequence,
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

  if (Component.prototype.updateScrollPosition === undefined) {
    Component.prototype.updateScrollPosition = function(){
      if (this.el && this.el.current) {
        if (withX) {
          let offsetX = -this.position.xPosOffset;
          offsetX += (this.position.lastCurrentViewSequencePosition - this.position.lastStartXTile) * this.position.props.tileWidth;
          if (this.position.currentViewSequencePosition !== this.position.lastCurrentViewSequencePosition) {
            offsetX += (this.position.currentViewSequencePosition - this.position.lastCurrentViewSequencePosition) * this.position.props.tileWidth;
          }
          this.el.current.scrollLeft = offsetX;
        }
        if (withY) {
          let offsetY = -this.position.yPosOffset;
          offsetY += (this.position.lastCurrentViewSequence - this.position.lastStartYTile) * this.position.props.tileHeight;
          if (this.position.currentViewSequence !== this.position.lastCurrentViewSequence) {
            offsetY += (this.position.currentViewSequence - this.position.lastCurrentViewSequence) * this.position.props.tileHeight;
          }
          this.el.current.scrollTop = offsetY;
        }
      }
      return false;
    }
  }

  // inject the store via contexts
  Component.contextTypes = {
    positionMSAStore: PropTypes.object,
  }
}
export default positionStoreMixin;
