/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import PropTypes from 'prop-types';

import {
  clamp,
  floor,
  isEqual,
  pick,
} from 'lodash-es';

import DraggingComponent from './DraggingComponent';
import TilingGrid from './CanvasTilingGrid';
import CanvasCache from './CanvasCache';

import { movePosition } from '../../store/positionReducers';
import msaConnect from '../../store/connect';
import withPositionStore from '../../store/withPositionStore';

import Mouse from '../../utils/mouse';
import { roundMod } from '../../utils/math';

import debug from '../../debug';

/**
 * Component to draw the main sequence alignment.
 */
class SequenceViewerComponent extends DraggingComponent {

  constructor(props) {
    super(props);
    // cache fully drawn tiles
    this.tileCache = new CanvasCache();
    // cache individual residue cells
    this.residueTileCache = new CanvasCache();
    // the manager which is in charge of drawing residues
    this.tilingGridManager = new TilingGrid();
  }

  // starts the drawing process
  drawScene() {
    const positions = this.getTilePositions();
    this.updateTileSpecs();
    if (debug) {
      this.redrawStarted = Date.now();
      this.redrawnTiles = 0;
    }
    this.drawTiles(positions);
    if (debug) {
      const elapsed = Date.now() - this.redrawStarted;
      if (elapsed > 5) {
        console.log(`Took ${elapsed} msecs to redraw for ${positions.startXTile} ${positions.startYTile} (redrawnTiles: ${this.redrawnTiles})`);
      }
    }
  }

  // figures out from where to start drawing
  getTilePositions() {
    const startXTile = Math.max(0, this.props.position.currentViewSequencePosition - this.props.cacheElements);
    const startYTile = Math.max(0, this.props.position.currentViewSequence - this.props.cacheElements);
    const endYTile = Math.min(this.props.sequences.length,
      startYTile + this.props.nrYTiles + 2 * this.props.cacheElements,
    );
    const endXTile = Math.min(this.props.sequences.maxLength,
      startXTile + this.props.nrXTiles + 2 * this.props.cacheElements,
    );
    return {startXTile, startYTile, endXTile, endYTile};
  }

  renderTile = ({row, column}) => {
    const key = row + "-" + column;
    return this.tileCache.createTile({
      key: key,
      tileWidth: this.props.tileWidth * this.props.xGridSize,
      tileHeight: this.props.tileHeight * this.props.yGridSize,
      create: ({canvas}) => {
        if (debug) {
          this.redrawnTiles++;
        }
        this.tilingGridManager.draw({
          ctx: canvas,
          startYTile:row,
          startXTile:column,
          residueTileCache: this.residueTileCache,
          endYTile:row + this.props.yGridSize,
          endXTile:column + this.props.xGridSize,
          ...pick(this.props, [
            "sequences", "colorScheme", "textFont", "textColor",
            "tileHeight", "tileWidth", "border", "borderWidth", "borderColor",
          ])
        });
      },
    });
  }

  drawTiles({startXTile, startYTile, endXTile, endYTile}) {
    const xGridSize = this.props.xGridSize;
    const yGridSize = this.props.yGridSize;
    const startY = roundMod(startYTile, yGridSize);
    const startX = roundMod(startXTile, xGridSize);

    for (let i = startY; i < endYTile; i = i + yGridSize) {
      for (let j = startX; j < endXTile; j = j + xGridSize) {
        const canvas = this.renderTile({row: i, column: j, canvas: this.ctx});
        const width = xGridSize * this.props.tileWidth;
        const height = yGridSize * this.props.tileHeight;
        const yPos = (i - this.props.position.currentViewSequence) * this.props.tileHeight + this.props.position.yPosOffset;
        const xPos = (j - this.props.position.currentViewSequencePosition) * this.props.tileWidth + this.props.position.xPosOffset;
        this.ctx.drawImage(canvas, 0, 0, width, height,
          xPos, yPos, width, height);
      }
    }
  }

  onPositionUpdate = (oldPos, newPos) => {
    const relativeMovement = {
      xMovement: oldPos[0] - newPos[0],
      yMovement: oldPos[1] - newPos[1],
    };
    this.props.positionDispatch(movePosition(relativeMovement));
  }

  positionToSequence(pos) {
    const sequences = this.props.sequences.raw;
    const seqNr = clamp(floor((this.props.position.yPos + pos.yPos) / this.props.tileHeight), 0, sequences.length - 1);
    const sequence = sequences[seqNr];

    const position = clamp(floor((this.props.position.xPos + pos.xPos) / this.props.tileWidth), 0, sequence.sequence.length - 1);
    return {
      i: seqNr,
      sequence,
      position,
      residue: sequence.sequence[position],
    }
  }

  updateScrollPosition = () => {
    this.draw();
  }

  /**
   * Returns the position of the mouse position relative to the sequences
   */
  currentPointerPosition(e) {
    const [x, y] = Mouse.rel(e);
    return this.positionToSequence({
      xPos: x,
      yPos: y,
    });
  }

  /**
   * Only sends an event if the actual function is set.
   */
  sendEvent(name, data) {
    if (this.props[name] !== undefined) {
      this.props[name](data);
    }
  }

  onMouseMove = (e) => {
    if (typeof this.isInDragPhase === "undefined") {
      if (this.props.onResidueMouseEnter !== undefined ||
          this.props.onResidueMouseLeave !== undefined) {
        const eventData = this.currentPointerPosition(e);
        const lastValue = this.currentMouseSequencePosition;
        if (!isEqual(lastValue, eventData)) {
          if (lastValue !== undefined) {
            this.sendEvent('onResidueMouseLeave', lastValue);
          }
          this.currentMouseSequencePosition = eventData;
          this.sendEvent('onResidueMouseEnter', eventData);
        }
      }
    }
    super.onMouseMove(e);
  }

  onMouseLeave = (e) => {
    this.sendEvent('onResidueMouseLeave', this.currentMouseSequencePosition);
    this.currentMouseSequencePosition = undefined;
    super.onMouseLeave(e);
  }

  onClick = (e) => {
    if (!this.mouseHasMoved) {
      const eventData = this.currentPointerPosition(e);
      this.sendEvent('onResidueClick', eventData);
    }
    super.onClick(e);
  }

  onDoubleClick = (e) => {
    const eventData = this.currentPointerPosition(e);
    this.sendEvent('onResidueDoubleClick', eventData);
    super.onDoubleClick(e);
  }

  componentWillUnmount() {
    this.tileCache.invalidate();
    this.residueTileCache.invalidate();
  }

  updateTileSpecs() {
    const tileAttributes = [
      'tileWidth', 'tileHeight', 'colorScheme', 'textFont',
      'borderColor'
    ];
    this.tileCache.updateTileSpecs(pick(this.props, [
      ...tileAttributes,
      'xGridSize', 'yGridSize', 'sequences',
    ]));
    this.residueTileCache.updateTileSpecs(
      pick(this.props,tileAttributes)
    );
  }

  render() {
    return super.render();
  }
}

SequenceViewerComponent.defaultProps = {
  showModBar: false,
  xGridSize: 10,
  yGridSize: 10,
  border: false,
  borderColor: "black",
  borderWidth: 1,
  cacheElements: 20,
  textColor: "black",
  textFont: "18px Arial",
  overflow: "hidden",
  overflowX: "auto",
  overflowY: "auto",
  scrollBarPositionX: "bottom",
  scrollBarPositionY: "right",
};

SequenceViewerComponent.propTypes = {
  /**
   * Show the custom ModBar
   */
  showModBar: PropTypes.bool,

  /**
   * Callback fired when the mouse pointer is entering a residue.
   */
  onResidueMouseEnter: PropTypes.func,

  /**
   * Callback fired when the mouse pointer is leaving a residue.
   */
  onResidueMouseLeave: PropTypes.func,

  /**
   * Callback fired when the mouse pointer clicked a residue.
   */
  onResidueClick: PropTypes.func,

  /**
   * Callback fired when the mouse pointer clicked a residue.
   */
  onResidueDoubleClick: PropTypes.func,

  /**
   * Number of residues to cluster in one tile (x-axis) (default: 10)
   */
  xGridSize: PropTypes.number.isRequired,

  /**
   * Number of residues to cluster in one tile (y-axis) (default: 10)
   */
  yGridSize: PropTypes.number.isRequired,

  /**
   * Number of residues to prerender outside of the visible viewbox.
   */
  cacheElements: PropTypes.number.isRequired,

  /**
   * Whether to draw a border.
   */
  border: PropTypes.bool,

  /**
   * Color of the border. Name, hex or RGB value.
   */
  borderColor: PropTypes.string,

  /**
   * Width of the border.
   */
  borderWidth: PropTypes.number,

  /**
   * Color of the text residue letters (name, hex or RGB value)
   */
  textColor: PropTypes.string,

  /**
   * Font to use when drawing the individual residues.
   */
  textFont: PropTypes.string,

  /**
   * What should happen if content overflows.
   */
  overflow: PropTypes.oneOf(["hidden", "auto", "scroll"]),

  /**
   * What should happen if x-axis content overflows (overwrites "overflow")
   */
  overflowX: PropTypes.oneOf(["hidden", "auto", "scroll", "initial"]),

  /**
   * What should happen if y-axis content overflows (overwrites "overflow")
   */
  overflowY: PropTypes.oneOf(["hidden", "auto", "scroll", "initial"]),

  /**
   * X Position of the scroll bar ("top or "bottom")
   */
  scrollBarPositionX: PropTypes.oneOf(["top", "bottom"]),

  /**
   * Y Position of the scroll bar ("left" or "right")
   */
  scrollBarPositionY: PropTypes.oneOf(["left", "right"]),
};

// hoist the list of accepted properties to the parent
// eslint-disable-next-line react/forbid-foreign-prop-types
SequenceViewerComponent.propKeys = Object.keys(SequenceViewerComponent.propTypes);

const mapStateToProps = state => {
  // Fallback to a smaller size if the given area is too large
  const width = Math.min(
    state.props.width,
    state.sequences.maxLength * state.props.tileWidth
  );
  const height = Math.min(
    state.props.height,
    state.sequences.length * state.props.tileHeight
  );
  return {
    sequences: state.sequences,
    width,
    height,
    tileWidth: state.props.tileWidth,
    tileHeight: state.props.tileHeight,
    colorScheme: state.props.colorScheme,
    nrXTiles: state.sequenceStats.nrXTiles,
    nrYTiles: state.sequenceStats.nrYTiles,
    fullWidth: state.sequenceStats.fullWidth,
    fullHeight: state.sequenceStats.fullHeight,
  }
}

const SV = withPositionStore(SequenceViewerComponent, {withX: true, withY: true});

export default msaConnect(
  mapStateToProps,
)(SV);

export {
  SequenceViewerComponent as SequenceViewer,
  SV as SequenceViewerWithPosition,
}
