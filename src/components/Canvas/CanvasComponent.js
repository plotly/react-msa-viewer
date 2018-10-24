/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { throttle } from 'lodash-es';

import Canvas from '../../drawing/canvas';
import WebGL from '../../drawing/webgl';

import createRef from 'create-react-ref/lib/createRef';

/**
 * Constructs a drawable canvas (e.g. HTML Canvas or WebGL) and provides it as
 * a reference.
 *
 * On every redraw, this.draw() gets called.
 */
class CanvasComponent extends Component {

  static defaultProps = {
    width: 100,
    height: 100,
    msecsPerFps: 60,
    engine: "canvas",
  }

  constructor(props) {
    super(props);
    this.canvas = createRef();
    this._draw = throttle(this._draw, this.props.msecsPerFps);
  }

  componentDidMount() {
    // choose the best engine
    if (this.props.engine === "webgl" && WebGL.isSupported(this.canvas.current)) {
      this.ctx = new WebGL(this.canvas.current);
    } else {
      this.ctx = new Canvas(this.canvas.current);
    }
    this.draw();
  }

  componentDidUpdate() {
    this._draw();
  }

  _draw() {
    if (!this.ctx) return;
    this.ctx.startDrawingFrame();
    this.ctx.save();
    this.draw();
    this.ctx.restore();
    this.ctx.endDrawingFrame();
  }

  draw() {
    console.error("Implement me.");
  }

  render() {
    return (
      <div style={this.props.style}>
        <canvas
          ref={this.canvas}
          width={this.props.width}
          height={this.props.height}
        >
        </canvas>
      </div>
    );
  }
}

CanvasComponent.propTypes = {
  /**
   * Width of the component (in pixels), e.g. `100`
   */
  width: PropTypes.number,

  /**
   * Width of the component (in pixels), e.g. `100`
   */
  height: PropTypes.number,

  /**
   * Custom style configuration.
   */
  style: PropTypes.object,

  /**
   * Rendering engine: `canvas` or `webgl` (experimental).
   */
  engine: PropTypes.oneOf(['canvas', 'webgl']),

  /**
   * Maximum number of frames per second, e.g. `1000 / 60`
   */
  msecsPerSecs: PropTypes.number,
}

export default CanvasComponent;
