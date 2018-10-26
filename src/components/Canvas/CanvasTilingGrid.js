/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import CanvasComponent from '../Canvas/CanvasComponent';

/**
 * Allows rendering in tiles of grids.
 *
 * |---|---|---|
 * |-1-|-2-|-3-|
 * |---|---|---|
 * ―――――――――――――
 * |---|---|---|
 * |-4-|-5-|-6-|
 * |---|---|---|
 *
 * where 1..6 are TilingGrid component of xGridSize and yGridSize of 3.
 *
 * This split-up is required to avoid frequent repaints and keeps the React
 * Tree calculations slim.
 */
class CanvasTilingGridComponent extends CanvasComponent {

  drawTile({row, column}) {
    const tileWidth = this.props.tileWidth;
    const tileHeight = this.props.tileHeight;
    const yPos = tileHeight * (row - this.props.startYTile);
    const xPos = tileWidth * (column - this.props.startXTile);
    if (row >= this.props.sequences.raw.length) return undefined;
    const sequence = this.props.sequences.raw[row].sequence;
    if (column >= sequence.length) return undefined;
    const text = sequence[column];
    if (text !== undefined) {
      const colorScheme = this.props.colorScheme.getColor(text);
      const key = `${text}-${colorScheme}`;
      const canvasTile = this.props.residueTileCache.createTile({
        key, tileWidth, tileHeight,
        create: ({canvas}) => {
          return this.drawResidue({text, canvas, row, column, colorScheme});
        }
      });
      this.props.ctx.drawImage(
        canvasTile, 0, 0, tileWidth, tileHeight,
        xPos, yPos, tileWidth, tileHeight,
      );
    }
  }

  drawResidue({row, column, canvas, colorScheme, text}) {
    canvas.globalAlpha = 0.7;
    canvas.fillStyle = colorScheme;
    canvas.fillRect(0, 0, this.props.tileWidth, this.props.tileHeight);

    if (this.props.border) {
      canvas.globalAlpha = 1;
      canvas.lineWidth = this.props.borderWidth;
      canvas.strokeStyle = this.props.borderStyle;
      canvas.strokeRect(0, 0, this.props.tileWidth, this.props.tileHeight);
    }

    canvas.globalAlpha = 1.0;
    canvas.fillStyle = this.props.textColor;
    canvas.font = this.props.textFont + "px mono";
    canvas.textBaseline = 'middle';
    canvas.textAlign = 'center';
    canvas.fillText(text,
      this.props.tileWidth / 2,
      (this.props.tileHeight / 2) + 1,
      this.props.tileWidth);
  }

  draw(props) {
    this.props = props;
    for (let i = this.props.startYTile; i < this.props.endYTile; i++) {
      for (let j = this.props.startXTile; j < this.props.endXTile; j++) {
        this.drawTile({row:i, column:j});
      }
    }
  }
}

export default CanvasTilingGridComponent;
