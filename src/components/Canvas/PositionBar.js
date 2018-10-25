/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
import PropTypes from 'prop-types';

import msaConnect from '../store/connect'
import CanvasComponent from './CanvasComponent';

/**
TODO:
- buffer to animation frame
- make styling flexible
*/

/**
 * Creates a PositionBar of markers for every n-th sequence column.
 */
class PositionBarComponent extends CanvasComponent {

  draw() {
    this.ctx.font(this.props.font);

    const yPos = 0;
    const startTile = Math.floor(this.props.position.xPos / this.props.tileWidth) - 1 + this.props.startIndex;
    const tiles = Math.ceil(this.props.width / this.props.tileWidth) + 1;
    let xPos = -this.props.position.xPos % this.props.tileWidth;
    for (let i = startTile; i < (startTile + tiles); i++) {
      if (i % this.props.markerSteps === 0) {
        this.ctx.fillText(i, xPos, yPos, this.props.tileWidth, this.props.tileHeight);
      } else {
        this.ctx.fillText(".", xPos, yPos, this.props.tileWidth, this.props.tileHeight);
      }
      xPos += this.props.tileHeight;
    }
  }

  // to make react-docgen happy
  render() {
    return super.render();
  }
}

PositionBarComponent.defaultProps = {
  ...CanvasComponent.defaultProps,
  font: "12px Arial",
  height: 15,
  markerSteps: 2,
  startIndex: 1,
};

PositionBarComponent.propTypes = {
  ...CanvasComponent.propTypes,
  /**
   * Font of the sequence labels, e.g. `20px Arial`
   */
  font: PropTypes.string,

  /**
   * Height of the PositionBar (in pixels), e.g. `100`
   */
  height: PropTypes.number,

  /**
   * At which steps the position labels should appear, e.g. `2` for (1, 3, 5)
   */
  markerSteps: PropTypes.number,

  /**
   * At which number the PositionBar marker should start counting.
   * Typical values are: `1` (1-based indexing) and `0` (0-based indexing).
   */
  startIndex: PropTypes.number,
};

const mapStateToProps = state => {
  return {
    position: state.position,
    viewpoint: state.viewpoint,
    maxLength: state.sequences.maxLength,
    tileWidth: state.props.tileWidth,
    tileHeight: state.props.tileHeight,
    width: state.props.width,
  }
};

export default msaConnect(
  mapStateToProps,
)(PositionBarComponent);
