/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import DrawingBase from './base';
import CanvasCharCache from './cache';

class Canvas extends DrawingBase {
  constructor(el) {
    super(el);
    this.ctx = el.getContext('2d');
    this.cache = new CanvasCharCache();
  }

  clear() {
    // fastest way to clear the canvas
    // http://jsperf.com/canvas-clear-speed
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  fillRect(x, y, width, height) {
    this.ctx.fillRect(x, y, width, height);
  }

  // TODO: rename as its effectively only one letter
  fillText(text, x, y, width, height) {
    //this.ctx.fillText(text, x, y);
    return this.ctx.drawImage(
      this.cache.getFontTile(text, width, height, this.ctx.font),
      x, y, width, height,
    );
  }

  // props
  font(fontName) {
    this.ctx.font = fontName;
  }

  fillStyle(fillStyle) {
    this.ctx.fillStyle = fillStyle;
  }

  globalAlpha(globalAlpha) {
    this.ctx.globalAlpha = globalAlpha;
  }

  save() {
    this.ctx.save();
  }

  restore() {
    this.ctx.restore();
  }
}

export {Canvas};
export default Canvas;
