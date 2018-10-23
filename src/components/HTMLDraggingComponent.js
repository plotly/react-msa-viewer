/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';

//import {
  //throttle,
//} from 'lodash-es';
import Mouse from '../utils/mouse';

import createRef from 'create-react-ref/lib/createRef';

/**
Provides dragging support and related callbacks:

- onPositionUpdate(oldPos, newPos)

Moreover, a component's viewpoint needs to be passed in via its properties:

  <MyDraggingComponent width="200" height="300" />
*/
// TODO: handle wheel events
// TODO: share requestAnimationFrame with multiple components
class HTMLDraggingComponent extends Component {

  /**
   * The internal state is kept in:
   *
   * this.mouseMovePosition = [x, y]; // relative to the canvas
   * this.touchMovePosition = [x, y]; // relative to the canvas
   *
   * If no movement is happening, these two variables are undefined.
   */

  static defaultProps = {
    onPositionUpdate: () => null,
  }

  state = {
    mouse: {
      isMouseWithin: false,
      cursorState: "grab",
    }
  };

  constructor(props) {
    super(props);
    this.el = createRef();

    this.onMouseMove = this.onMouseMove;
    //this.onTouchMove = throttle(this.onTouchMove, 1 / 30);
  }

  componentWillMount() {
    this.stopDragPhase();
  }

  // TODO
  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    console.log("umount");
    this.el.current.addEventListener('mouseenter', this.onMouseEnter);
    this.el.current.addEventListener('mouseleave', this.onMouseLeave);
    this.el.current.addEventListener('mousedown', this.onMouseDown);
    this.el.current.addEventListener('mouseup', this.onMouseUp);
    this.el.current.addEventListener('mousemove', this.onMouseMove);
    this.el.current.addEventListener('touchstart', this.onTouchStart);
    this.el.current.addEventListener('touchmove', this.onTouchMove);
    this.el.current.addEventListener('touchend', this.onTouchEnd);
    this.el.current.addEventListener('touchcancel', this.onTouchCancel);
  }

  onMouseDown = (e) => {
    this.startDragPhase(e);
  }

  onMouseMove = (e) => {
    if (this.isInDragPhase === undefined) {
      return;
    }
    const pos = Mouse.abs(e);
    // TODO: use global window out and not this container's out for better dragging
    //if (!this.isEventWithinComponent(e)) {
      //this.stopDragPhase();
      //return;
    //}
    const oldPos = this.mouseMovePosition
    console.log("mousemove");
    if (this.nextFrame === undefined) {
      this.nextFrame = window.requestAnimationFrame(() => {
        this.mouseMovePosition = pos;
        // already use the potentially updated mouse move position here
        this.props.onPositionUpdate(oldPos, this.mouseMovePosition);
        this.nextFrame = undefined;
      });
    }
  }

  onMouseUp = () => {
    console.log("mouseUp");
    this.stopDragPhase();
  }

  onMouseEnter = () => {
    this.setState(prevState => ({
      mouse: {
        ...prevState.mouse,
        isMouseWithin: true,
      }
    }));
  }

  onMouseLeave = () => {
    // TODO: use global window out and not this container's out for better dragging
    console.log("mouseleave");
    this.stopHoverPhase();
    this.stopDragPhase();
  }

  onTouchStart = (e) => {
    console.log("touchstart", e);
    this.startDragPhase(e);
  }

  onTouchMove = (e) => {
    if (this.isInDragPhase === undefined) {
      return;
    }

    console.log("touchmove", e);
    // TODO: can call mouse move with changedTouches[$-1], but it's reversed moving
    this.onMouseMove(e);
  }

  onTouchEnd = () => {
    this.stopDragPhase();
  }

  onTouchCancel = () => {
    this.stopDragPhase();
  }

  /**
   * Called at the start of a drag action.
   */
  startDragPhase(e) {
    this.mouseMovePosition = Mouse.abs(e);
    this.isInDragPhase = true;
    this.setState(prevState => ({
      mouse: {
        ...prevState.mouse,
        cursorState: "grabbing",
      }
    }));
  }

  /**
   * Called whenever the mouse leaves the container.
   */
  stopHoverPhase() {
    this.setState(prevState => ({
      mouse: {
        ...prevState.mouse,
        isMouseWithin: false,
      },
    }));
  }

  /**
   * Called at the end of a drag action.
   */
  stopDragPhase() {
    //this.mouseMovePosition = undefined;
    //this.touchMovePosition = undefined;
    this.isInDragPhase = undefined;
    this.setState(prevState => ({
      mouse: {
        ...prevState.mouse,
        cursorState: "grab",
      },
    }));
  }

  isEventWithinComponent(e) {
    // TODO: cache width + height for the rel call
    const relPos = Mouse.rel(e);
    return 0 <= relPos[0] && relPos[0] <= this.props.width &&
           0 <= relPos[1] && relPos[1] <= this.props.height;
  }

  /**
   * Unregisters all event listeners and stops the animations.
   */
  componentWillUnmount() {
    this.el.current.removeEventListener('mouseenter', this.onMouseEnter);
    this.el.current.removeEventListener('mouseleave', this.onMouseLeave);
    this.el.current.removeEventListener('mouseup', this.onMouseUp);
    this.el.current.removeEventListener('mousedown', this.onMouseDown);
    this.el.current.removeEventListener('mousemove', this.onMouseMove);
    this.el.current.removeEventListener('touchstart', this.onTouchStart);
    this.el.current.removeEventListener('touchend', this.onTouchEnd);
    this.el.current.removeEventListener('touchcancel', this.onTouchCancel);
    this.el.current.removeEventListener('touchmove', this.onTouchMove);
    this.stopDragPhase();
  }

  render() {
    // TODO: adapt to parent height/width
    const style = {
      ...this.props.style,
      cursor: this.state.mouse.cursorState,
      position: "relative",
      overflow: "hidden",
      whiteSpace: "nowrap",
      userSelect: "none",
      MozUserSelect: "none",
      msUserSelect: "none",
    };
    return (
      <div
        style={style}
        ref={this.el}
      >
        {this.props.children}
      </div>
    );
  }
}

export default HTMLDraggingComponent;
