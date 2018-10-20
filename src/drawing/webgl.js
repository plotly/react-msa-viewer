/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import DrawingBase from './base';

import {hex, keyword} from 'color-convert';

class WebGL extends DrawingBase {

  constructor(el) {
    super(el);
    this.gl = el.getContext('webgl') || el.getContext('experimental-webgl');
    this.init();
    this.initEl();
  }

  initEl() {
    this.gl.viewportWidth = this.el.width;
    this.gl.viewportHeight = this.el.height;
    //this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    this.gl.viewport(0, 0, this.el.width, this.el.height);
  }

  init() {
    this.initBuffers();
    this.initProgram();
    this.bindVariables();
  }

  initShaders() {
    const vertexShaderSource = `
      attribute vec2 a_position;

      uniform vec2 u_resolution;

      void main() {
        // convert the rectangle from pixels to 0.0 to 1.0
        vec2 zeroToOne = a_position / u_resolution;

        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;

        // convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      }
    `;
    this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        gl_FragColor = vec4(
          u_color[0] / 255.,
          u_color[1] / 255.,
          u_color[2] / 255.,
          u_color[3]
        );
      }
    `;
    this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
  }

  createShader(shaderType, shaderSource) {
    const shader = this.gl.createShader(shaderType);
    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.log(this.gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  initBuffers() {
    this.squareBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareBuffer);
  }

  initProgram() {
    this.initShaders();
    // setup a GLSL program
    this.program = this.gl.createProgram(this.gl);
    this.gl.attachShader(this.program, this.vertexShader);
    this.gl.attachShader(this.program, this.fragmentShader);
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.log("Could not initialize shaders");
    }
    this.gl.useProgram(this.program);
  }

  bindVariables() {
    this.resolutionUniformLocation = this.gl.getUniformLocation(this.program, "u_resolution");
    this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);

    // TODO: difference between uniform and attrib location
    this.colorUniformLocation = this.gl.getUniformLocation(this.program, "u_color");
    this.positionLocation = this.gl.getAttribLocation(this.program, "a_position");
  }

  static isSupported(el) {
    try {
      return el.getContext("webgl") || el.getContext("experimental-webgl");
    } catch (e) {
      return false;
    }
  }

  clear() {
    this.gl.clearColor(1, 1, 1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  startDrawingFrame() {
    super.startDrawingFrame();
    this.bufferTile();
  }

  fillStyle(fillStyle) {
    if (!fillStyle)
      return;
    if (fillStyle[0] === "#") {
      this.state.fillStyle = hex.rgb(fillStyle.slice(1));
    } else {
      this.state.fillStyle = keyword.rgb(fillStyle);
    }
  }

  bufferTile(x, y, width, height) {
    //const x = 0, y = 0;
    //const width = 20, height = 20;
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
       x1, y1,
       x2, y1,
       x1, y2,
       x1, y2,
       x2, y1,
       x2, y2,
    ]), this.gl.STATIC_DRAW);
  }

  fillRect(x, y, width, height) {

    // set a color
    this.gl.uniform4f(this.colorUniformLocation,
      this.state.fillStyle[0],
      this.state.fillStyle[1],
      this.state.fillStyle[2],
      1);
      //this.state.globalAlpha);

    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    this.bufferTile(x, y, width, height);
    const offset = 0;
    const count = 6; // number of vertices
    this.gl.drawArrays(this.gl.TRIANGLES, offset, count);
  }

  fillText(text, x, y) {
    // TODO
    //this.ctx.fillText(text, x, y);
  }

  // TODO: destroy canvas
  // TODO: resize events
}

export {WebGL};
export default WebGL;
