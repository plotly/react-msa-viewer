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
 *
 * @param {Object} Component - class to inject the position store into
 * @param {Object} Configuration - which parts of the position store to inject
 *
 * Select from:
 * - `withY` (`yPosOffset`, `currentViewSequence`)
 * - `withX` (`xPosOffset`, `currentViewSequencePosition`)
 * - `withPosition` (`xPos`, yPos`)
 *
 * Multiple selections are allowed.
 *
 * It will inject the following functionality:
 *
 * (1) `updateFromPositionStore`
 *   - a method which updates this.position from the PositionStore)
 *   - `setState({position: positionState})` is called when `shouldRerender` returns true
 * (2) `shouldRerender`
 *  - only if not defined
 *  - called to determine if the current viewpoint still has enough nodes)
 *  - checks the respective viewports when `withX` or `withY` have been set
 *  - calls `updateScrollPosition`
 *
 * (3) `updateScrollPosition`
 *  - only if not defined
 *  - the default implementation sets `this.el.current.scroll{Left,Top}`
 *
 * (4) `dispatch` (to access the PositionStore for event dispatching)
 *
 * Additionally, it will:
 * (5) enhance `componentWillMount` to inject a subscription to the positionStore
 * (6) enhance `componentWillUnmount` to unsubscribe from the positionStore
 *
 * However, if a `componentWillMount` or `componentWillUnmount` method did exist,
 * this will be called first.
 */
export function positionStoreMixin(Component, {
  withX = false,
  withY = false,
  withPosition = false,
}) {
  Component.prototype.updateFromPositionStore = function() {
    const state = this.context.positionMSAStore.getState();
    this.position = this.position || {};
    if (withPosition) {
      this.position.xPos = state.position.xPos;
      this.position.yPos = state.position.yPos;
    }
    if (withX) {
      this.position.xPosOffset = state.xPosOffset;
      this.position.currentViewSequencePosition = state.currentViewSequencePosition;
    }
    if (withY) {
      this.position.yPosOffset = state.yPosOffset;
      this.position.currentViewSequence = state.currentViewSequence;
    }
    if (this.shouldRerender()) {
      // this will always force a rerender as position is a new object
      this.setState({
        position: {
          ...this.position,
        }
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

  // inject the store via contexts
  Component.contextTypes = {
    positionMSAStore: PropTypes.object,
  }

  Component.prototype.dispatch = function(payload) {
    this.context.positionMSAStore.dispatch(payload);
  };

  defaultRerender(Component, {withX, withY});
}

/**
 * Injects a default shouldRerender and updateScrollPosition implementations.
 * updateScrollPosition is called when the shouldRerender yields false
 */
function defaultRerender(Component, {withX = false, withY = false}) {
  if (Component.prototype.shouldRerender === undefined) {
    Component.prototype.shouldRerender = function() {
        if (withY) {
          if (Math.abs(this.position.currentViewSequence - this.position.lastCurrentViewSequence) >= this.props.cacheElements) {
            return true;
          }
        }
        if (withX) {
          if (Math.abs(this.position.currentViewSequencePosition - this.position.lastCurrentViewSequencePosition) >= this.props.cacheElements) {
            return true;
          }
        }
        return this.updateScrollPosition() || false;
    }
    if (Component.prototype.updateScrollPosition === undefined) {
      Component.prototype.updateScrollPosition = function(){
        if (this.el && this.el.current) {
          if (withX) {
            let offsetX = -this.position.xPosOffset;
            offsetX += (this.position.lastCurrentViewSequencePosition - this.position.lastStartXTile) * this.props.tileWidth;
            if (this.position.currentViewSequencePosition !== this.position.lastCurrentViewSequencePosition) {
              offsetX += (this.position.currentViewSequencePosition - this.position.lastCurrentViewSequencePosition) * this.props.tileWidth;
            }
            this.el.current.scrollLeft = offsetX;
          }
          if (withY) {
            let offsetY = -this.position.yPosOffset;
            offsetY += (this.position.lastCurrentViewSequence - this.position.lastStartYTile) * this.props.tileHeight;
            if (this.position.currentViewSequence !== this.position.lastCurrentViewSequence) {
              offsetY += (this.position.currentViewSequence - this.position.lastCurrentViewSequence) * this.props.tileHeight;
            }
            this.el.current.scrollTop = offsetY;
          }
        }
        return false;
      }
    }
  } else {
    // provide dummy updateScrollPosition
    if (Component.prototype.updateScrollPosition === undefined) {
      Component.prototype.updateScrollPosition = function(){
      };
    }
  }
}
export default positionStoreMixin;
