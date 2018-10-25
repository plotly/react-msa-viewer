/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { PureComponent } from 'react';

import createRef from 'create-react-ref/lib/createRef';
import { updatePosition } from '../../store/positionReducers';
import positionStoreMixin from '../../store/positionStoreMixin';


/**
 * Perform updates in a browser-requested animation frame.
 * If this is called multiple times before a new animation frame was provided,
 * the subsequent calls will be dropped.
 * Thus, make sure to use the current data in the callback
 * (it might have been updated once the callback fired)
 *
 * @param {Object} Class instance to bind the callback too
 * @param {Function} callback Function to be called in the animation frame
 */
function requestAnimation(instance, callback) {
  if (instance.nextFrame === undefined) {
    instance.nextFrame = window.requestAnimationFrame(function(){
      callback();
      this.nextFrame = undefined;
    }.bind(instance));
  }
}

class FakeScroll extends PureComponent {

  componentWillMount() {
    this.el = createRef();
  }

  onScroll = (e) => {
    requestAnimation(this, () => {
      const movement = {
        xMovement: this.el.current.scrollLeft - this.position.xPos,
        yMovement: this.el.current.scrollTop - this.position.yPos,
      };
      this.dispatch(updatePosition(movement));
    });
  };

  updateScrollPosition = () => {
    if (!this.el || !this.el.current) return;
    this.el.current.scrollTop = this.position.yPos;
    this.el.current.scrollLeft = this.position.xPos;
  }

  render() {
    const {
      width, height,
      fullWidth, fullHeight
    } = this.props;
    const style = {
      position: "absolute",
      overflow: "scroll",
      width, height,
    };
    const childStyle = {
      width: fullWidth,
      height: fullHeight,
    };
    return <div style={style} onScroll={this.onScroll} ref={this.el}>
      <div style={childStyle} />
    </div>;
  }
}

positionStoreMixin(FakeScroll, {
  withPosition: true,
});

export default FakeScroll;
