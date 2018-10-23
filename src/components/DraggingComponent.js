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
import Canvas from '../drawing/canvas';
import WebGL from '../drawing/webgl';

import ModBar from './ModBar';

import createRef from 'create-react-ref/lib/createRef';

/**
Provides dragging support in a canvas for sub-classes.
Sub-classes are expected to implement:
- drawScene
- onPositionUpdate(oldPos, newPos)

Moreover, a component's viewpoint needs to be passed in via its properties:

  <MyDraggingComponent width="200" height="300" msecsPerFps="60" />
*/
// TODO: handle wheel events
// TODO: share requestAnimationFrame with multiple components
class DraggingComponent extends Component {

  /**
   * The internal state is kept in:
   *
   * this.mouseMovePosition = [x, y]; // relative to the canvas
   * this.touchMovePosition = [x, y]; // relative to the canvas
   *
   * If no movement is happening, these two variables are undefined.
   */

  static defaultProps = {
    width: 500,
    height: 500,
    msecsPerFps: 60,
    engine: "canvas",
    showModBar: true,
  }

  state = {
    mouse: {
      isMouseWithin: false,
      cursorState: "grab",
    }
  };

  constructor(props) {
    super(props);
    this.canvas = createRef();
    this.container = createRef();

    // bind events (can't use static properties due to inheritance)
    ["onMouseEnter", "onMouseLeave", "onMouseDown", "onMouseUp", "onMouseMove",
      "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel",
      "onClick", "onDoubleClick",
      "draw",
    ].forEach(prop => {
        this[prop] = this[prop].bind(this);
    });

    //this.onMouseMove = throttle(this.onMouseMove, msecsPerFps);
    //this.onTouchMove = throttle(this.onTouchMove, msecsPerFps);

    // just in case requestAnimationFrame is too greedy
    //this.draw = throttle(this.draw, this.props.msecsPerFps);

    this.onViewpointChange();
    // Define internal variables for explicitness
    this.dragFrame = undefined;
    this.mouseMovePosition = undefined;
    this.touchMovePosition = undefined;
  }

  /**
   * Called on every movement to rerender the canvas.
   */
  drawScene() {
    console.warn("drawScene is unimplemented.");
  }

  /**
   * Called on every position update.
   */
  onPositionUpdate() {
    console.warn("onPositionUpdate is unimplemented.");
  }

  /**
    * Called every time when the component's dimensions change.
    */
  onViewpointChange() {
    // no work is necessary anymore
  }

  componentDidMount() {
    // choose the best engine
    if (this.props.engine === "webgl" && WebGL.isSupported(this.canvas.current)) {
      this.ctx = new WebGL(this.canvas.current);
    } else {
      this.ctx = new Canvas(this.canvas.current);
    }
    this.draw();
    this.container.current.addEventListener('mouseenter', this.onMouseEnter);
    this.container.current.addEventListener('mouseleave', this.onMouseLeave);
    this.canvas.current.addEventListener('mousedown', this.onMouseDown);
    this.canvas.current.addEventListener('mouseup', this.onMouseUp);
    this.canvas.current.addEventListener('mousemove', this.onMouseMove);
    this.canvas.current.addEventListener('touchstart', this.onTouchStart);
    this.canvas.current.addEventListener('touchmove', this.onTouchMove);
    this.canvas.current.addEventListener('touchend', this.onTouchEnd);
    this.canvas.current.addEventListener('touchcancel', this.onTouchCancel);
    this.canvas.current.addEventListener('click', this.onClick);
    this.canvas.current.addEventListener('dblclick', this.onDoubleClick);
    // TODO: should we react do window resizes dynamically?
    //window.addEventListener('resize', this.onResize)
  }

  draw() {
    // TODO: only update this if required
    this.ctx.startDrawingFrame();
    this.ctx.save();
    this.onViewpointChange();
    this.drawScene();
    this.ctx.restore();
    this.ctx.endDrawingFrame();
  }

  dragLoop = () => {
    this.draw();
    //this.dragFrame = window.requestAnimationFrame(this.dragLoop)
  }

  /**
  // TODO: should we react do window resizes dynamically?
  onResize = (e) => {
  }
  */

  /**
   * To be implemented by its childs.
   */
  onClick(e) {

  }

  /**
   * To be implemented by its childs.
   */
  onDoubleClick(e) {

  }

  onMouseDown(e) {
    //console.log("mousedown", e);
    this.startDragPhase(e);
  }

  onMouseMove(e) {
    //console.log("mousemove", e);
    if (this.isInDragPhase === undefined) {
      return;
    }
    const pos = Mouse.abs(e);
    // TODO: use global window out and not this container's out for better dragging
    if (!this.isEventWithinComponent(e)) {
      this.stopDragPhase();
      return;
    }
    const oldPos = this.mouseMovePosition
    this.mouseMovePosition = pos;
    if (this.nextFrame === undefined) {
      this.nextFrame = window.requestAnimationFrame(() => {
        // already use the potentially updated mouse move position here
        this.onPositionUpdate(oldPos, this.mouseMovePosition);
        this.nextFrame = undefined;
      });
    }
  }

  onMouseUp() {
    this.stopDragPhase();
  }

  onMouseEnter() {
    this.setState(prevState => ({
      mouse: {
        ...prevState.mouse,
        isMouseWithin: true,
      }
    }));
  }

  onMouseLeave() {
    // TODO: use global window out and not this container's out for better dragging
    this.stopHoverPhase();
    this.stopDragPhase();
  }

  onTouchStart(e) {
    console.log("touchstart", e);
    this.startDragPhase(e);
  }

  onTouchMove(e) {
    if (typeof this.dragFrame === "undefined") {
      return;
    }

    console.log("touchmove", e);
    // TODO: can call mouse move with changedTouches[$-1], but it's reversed moving
    this.onMouseMove(e);
  }

  onTouchEnd() {
    this.stopDragPhase();
  }

  onTouchCancel() {
    this.stopDragPhase();
  }

  /**
   * Called at the start of a drag action.
   */
  startDragPhase(e) {
    this.mouseMovePosition = Mouse.abs(e);
    //if(!this.dragFrame) {
      //this.dragFrame = window.requestAnimationFrame(this.dragLoop);
    //}
    this.isInDragPhase = true;
    this.setState(prevState => ({
      mouse: {
        ...prevState.mouse,
        cursorState: "grabbing",
      }
    }));
  }

  /**
   * Called whenever the mouse leaves the canvas area.
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
    this.isInDragPhase = false;
    //window.cancelAnimationFrame(this.nextFrame);
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

  componentDidUpdate() {
    // TODO: smarter updates
    this.draw();
  }

  /**
   * Unregisters all event listeners and stops the animations.
   */
  componentWillUnmount() {
    // TODO: should we react to resize events dynamically?
    //window.removeEventListener('resize', this.onResize);
    this.container.current.removeEventListener('mouseenter', this.onMouseEnter);
    this.container.current.removeEventListener('mouseleave', this.onMouseLeave);
    this.canvas.current.removeEventListener('mouseup', this.onMouseUp);
    this.canvas.current.removeEventListener('mousedown', this.onMouseDown);
    this.canvas.current.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.current.removeEventListener('click', this.onClick);
    this.canvas.current.removeEventListener('dblclick', this.onDoubleClick);
    this.canvas.current.removeEventListener('touchstart', this.onTouchStart);
    this.canvas.current.removeEventListener('touchend', this.onTouchEnd);
    this.canvas.current.removeEventListener('touchcancel', this.onTouchCancel);
    this.canvas.current.removeEventListener('touchmove', this.onTouchMove);
    this.stopDragPhase();
  }

  render() {
    // TODO: adapt to parent height/width
    const style = {
      width: this.props.width,
      ...this.props.style,
      cursor: this.state.mouse.cursorState,
      position: "relative",
    };
    const modBar = {
      position: "absolute",
      right: 0,
      opacity: 0.8,
    };
    const showModBar = this.props.showModBar && this.state.mouse.isMouseWithin;
    return (
      <div
          style={style}
          ref={this.container}
      >
        { showModBar && (
            <ModBar style={modBar}> Plotly Modbar</ModBar>
        )}
        <canvas
          ref={this.canvas}
          width={this.props.width}
          height={this.props.height}
        >
        Your browser does not seem to support HTML5 canvas.
        </canvas>
      </div>
    );
  }
}

export default DraggingComponent;
