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
 * It will inject the following functionality:
 *
 * - updateFromPositionStore (a method which updates this.position from the PositionStore)
 *     setState(position: positionState) is called when shouldRerender returns true
 *
 * - shouldRerender (called to determine if the current viewpoint still has enough nodes)
 *
 * Also, it will:
 * - overwrite componentWillMount and inject a subscription to the positionStore (though if a componentWillMount did exist, it will be called)
 * - overwrite componentWillUnmount and unsubscribe from the positionStore (though if a componentWillUnmount did exist, it will be called)
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
        position: this.position,
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
  }
}
export default positionStoreMixin;
