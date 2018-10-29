/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { PureComponent } from 'react';
import createRef from 'create-react-ref/lib/createRef';

import {
  omit
} from 'lodash-es';

import Mouse from '../../utils/mouse';

import ModBar from '../ModBar';
import FakeScroll from './FakeScroll';
import requestAnimation from '../../utils/requestAnimation';
import autobind from '../../utils/autobind';

/**
Provides dragging support in a canvas for sub-classes.
Sub-classes are expected to implement:
- drawScene
- onPositionUpdate(oldPos, newPos)

Moreover, a component's viewpoint needs to be passed in via its properties:

  <MyDraggingComponent width="200" height="300" />
*/
// TODO: handle wheel events
class DraggingComponent extends PureComponent {

  /**
   * The internal state is kept in:
   *
   * this.mouseMovePosition = [x, y]; // relative to the canvas
   * this.touchMovePosition = [x, y]; // relative to the canvas
   *
   * If no movement is happening, inInDragPhase is undefined
   */

  static defaultProps = {
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
    this.canvasBuffers = [createRef(), createRef()];
    this.container = createRef();

    // bind events (can't use static properties due to inheritance)
    autobind(this,
      "onMouseEnter", "onMouseLeave", "onMouseDown", "onMouseUp", "onMouseMove",
      "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel",
      "onClick", "onDoubleClick",
      "draw"
    );

    this.onViewpointChange();
    // Define internal variables for explicitness
    this.mouseMovePosition = undefined;
    this.touchMovePosition = undefined;
    this.isInDragPhase = undefined;

    /**
     * Set by mouseMouse, reset after the drag phase
     * Used to check whether an `onClick` event comes from a drag phase.
     */
    this.mouseHasMoved = undefined;
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
    this.ctxBuffers = [
      this.canvasBuffers[0].current.getContext('2d', {alpha: 'false'}),
      this.canvasBuffers[1].current.getContext('2d', {alpha: 'false'}),
    ];
    // init
    this.swapContexts();
    this.container.current.addEventListener('mouseenter', this.onMouseEnter);
    this.container.current.addEventListener('mouseleave', this.onMouseLeave);
    this.container.current.addEventListener('mousedown', this.onMouseDown);
    this.container.current.addEventListener('mouseup', this.onMouseUp);
    this.container.current.addEventListener('mousemove', this.onMouseMove);
    this.container.current.addEventListener('touchstart', this.onTouchStart);
    this.container.current.addEventListener('touchmove', this.onTouchMove);
    this.container.current.addEventListener('touchend', this.onTouchEnd);
    this.container.current.addEventListener('touchcancel', this.onTouchCancel);
    this.container.current.addEventListener('click', this.onClick);
    this.container.current.addEventListener('dblclick', this.onDoubleClick);
    // TODO: should we react do window resizes dynamically?
    //window.addEventListener('resize', this.onResize)
  }

  /**
   * We buffer the canvas to display and allow to be redrawn while not being visible.
   * Only after it has been drawn, the canvas element will be flipped to a visible state.
   * In other words, we have two canvas elements (1 visible, 1 hidden) and
   * a new `draw` happens on the hidden one. After a `draw` operation these canvas
   * elements are "swapped" by this method.
   *
   * This method swaps the visibility of the DOM nodes and sets `this.ctx`
   * to the hidden canvas.
   */
  currentContext = 1;
  swapContexts() {
    const current = this.currentContext;
    // show the pre-rendered buffer
    this.canvasBuffers[current].current.style.visibility = "visible";

    // and prepare the next one
    const next = (this.currentContext + 1) % 2;
    this.canvasBuffers[next].current.style.visibility = "hidden";
    this.currentContext = next;
    this.ctx = this.ctxBuffers[next];
  }

  /**
   * Starts a draw operation by essentially:
   * - clearing the current context (the hidden canvas)
   * - calling `drawScene` to render the current canvas
   * - swapping canvas contexts with `swapContexts`
   */
  draw() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.onViewpointChange();
    this.drawScene();
    this.swapContexts();
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
    if (this.isInDragPhase === undefined) {
      return;
    }
    this.mouseHasMoved = true;
    const pos = Mouse.abs(e);
    // TODO: use global window out and not this container's out for better dragging
    //if (!this.isEventWithinComponent(e)) {
      //this.stopDragPhase();
      //return;
    //}
    const oldPos = this.mouseMovePosition
    requestAnimation(this, () => {
      // already use the potentially updated mouse move position here
      this.mouseMovePosition = pos;
      this.onPositionUpdate(oldPos, this.mouseMovePosition);
    });
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
    if (this.isInDragPhase === undefined) {
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
    this.mouseHasMoved = undefined;
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
    // TODO: should we react to resize events dynamically?
    //window.removeEventListener('resize', this.onResize);
    this.container.current.removeEventListener('mouseenter', this.onMouseEnter);
    this.container.current.removeEventListener('mouseleave', this.onMouseLeave);
    this.container.current.removeEventListener('mouseup', this.onMouseUp);
    this.container.current.removeEventListener('mousedown', this.onMouseDown);
    this.container.current.removeEventListener('mousemove', this.onMouseMove);
    this.container.current.removeEventListener('click', this.onClick);
    this.container.current.removeEventListener('dblclick', this.onDoubleClick);
    this.container.current.removeEventListener('touchstart', this.onTouchStart);
    this.container.current.removeEventListener('touchend', this.onTouchEnd);
    this.container.current.removeEventListener('touchcancel', this.onTouchCancel);
    this.container.current.removeEventListener('touchmove', this.onTouchMove);
    this.stopDragPhase();
  }

  render() {
    // TODO: adapt to parent height/width
    const style = {
      width: this.props.width,
      height: this.props.height,
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
    const canvasStyle = {
      position: "absolute",
      left: 0,
      top: 0,
    };
    const otherProps = omit(this.props, [
      ...this.constructor.propKeys,
      "tileWidth", "tileHeight", "colorScheme",
      "nrXTiles", "nrYTiles",
      "dispatch", "sequences",
      "fullWidth", "fullHeight",
      "position", "positionDispatch",
    ]);
    return (
      <div
          style={style}
          ref={this.container}
          {...otherProps}
      >
        { showModBar && (
            <ModBar style={modBar}> Plotly Modbar</ModBar>
        )}
        <canvas
          style={canvasStyle}
          ref={this.canvasBuffers[0]}
          width={this.props.width}
          height={this.props.height}
        >
        Your browser does not seem to support HTML5 canvas.
        </canvas>
        <canvas
          style={canvasStyle}
          ref={this.canvasBuffers[1]}
          width={this.props.width}
          height={this.props.height}
        >
        Your browser does not seem to support HTML5 canvas.
        </canvas>
        <FakeScroll
          overflow={this.props.overflow}
          overflowX={this.props.overflowX}
          overflowY={this.props.overflowY}
          positionX={this.props.scrollBarPositionX}
          positionY={this.props.scrollBarPositionY}
          width={this.props.width}
          height={this.props.height}
          fullWidth={this.props.fullWidth}
          fullHeight={this.props.fullHeight}
        />
      </div>
    );
  }
}

export default DraggingComponent;
