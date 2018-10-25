/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import PropTypes from 'prop-types';

import {
  floor,
  clamp,
} from 'lodash-es';

import DraggingComponent from './DraggingComponent';
import TilingGrid from './CanvasTilingGrid';
import CanvasCache from './CanvasCache';

import { updatePosition } from '../../store/positionReducers';
import positionStoreMixin from '../../store/positionStoreMixin';
import msaConnect from '../../store/connect'

import Mouse from '../../utils/mouse';
import { roundMod } from '../../utils/math';

// TODO: maybe move into the store
class SequenceViewerComponent extends DraggingComponent {

  constructor(props) {
    super(props);
    this.tileCache = new CanvasCache();
    this.residueTileCache = new CanvasCache();
    this.tilingGridManager = new TilingGrid();
  }

  drawScene() {
    const positions = this.getTilePositions();
    const elements = this.drawTiles(positions);
  }

  getTilePositions() {
    const startXTile = Math.max(0, this.position.currentViewSequencePosition - this.props.cacheElements);
    const startYTile = Math.max(0, this.position.currentViewSequence - this.props.cacheElements);
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
        this.tilingGridManager.draw({
          ctx: canvas,
          sequences:this.props.sequences,
          colorScheme:this.props.colorScheme,
          tileFont:this.props.tileFont,
          tileHeight:this.props.tileHeight,
          tileWidth:this.props.tileWidth,
          startYTile:row,
          startXTile:column,
          residueTileCache:this.residueTileCache,
          endYTile:row + this.props.yGridSize,
          endXTile:column + this.props.xGridSize,
        });
      },
    });
  }


  drawTiles({startXTile, startYTile, endXTile, endYTile}) {
    const elements = [];
    const xGridSize = this.props.xGridSize;
    const yGridSize = this.props.yGridSize;
    startYTile = roundMod(startYTile, yGridSize);
    startXTile = roundMod(startXTile, xGridSize);

    const yOffset = (this.position.currentViewSequence - startYTile) * this.props.tileHeight - this.position.yPosOffset
    const xOffset = (this.position.currentViewSequencePosition - startXTile) * this.props.tileWidth - this.position.xPosOffset;

    // TODO: cut-off end tiles
    for (let i = startYTile; i < endYTile; i = i + yGridSize) {
      for (let j = startXTile; j < endXTile; j = j + xGridSize) {
        const canvas = this.renderTile({row: i, column: j, canvas: this.ctx});
        const width = xGridSize * this.props.tileWidth;
        const height = yGridSize * this.props.tileHeight;
        const yPos = i * this.props.tileHeight - yOffset;
        const xPos = j * this.props.tileWidth - xOffset;
        this.ctx.ctx.drawImage(canvas, xPos, yPos, width, height);
      }
    }
  }

  onPositionUpdate = (oldPos, newPos) => {
    const relativeMovement = {
      xMovement: oldPos[0] - newPos[0],
      yMovement: oldPos[1] - newPos[1],
    };
    this.context.positionMSAStore.dispatch(updatePosition(relativeMovement));
  }

  positionToSequence(pos) {
    const sequences = this.props.sequences.raw;
    const seqNr = clamp(floor((this.position.yPos + pos.yPos) / this.props.tileHeight), 0, sequences.length - 1);
    const sequence = sequences[seqNr];

    const position = clamp(floor((this.position.xPos + pos.xPos) / this.props.tileWidth), 0, sequence.sequence.length - 1);
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

  componentDidUpdate() {
    // TODO: smarter updates
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
    if (typeof this.dragFrame === "undefined") {
      //if (this.props.onResidueMouseEnter !== undefined ||
          //this.props.onResidueMouseLeave !== undefined) {
        //const eventData = this.currentPointerPosition(e);
        //const lastValue = this.currentMouseSequencePosition;
        //if (!isEqual(lastValue, eventData)) {
          //if (lastValue !== undefined) {
            //this.sendEvent('onResidueMouseLeave', lastValue);
          //}
          //this.currentMouseSequencePosition = eventData;
          //this.sendEvent('onResidueMouseEnter', eventData);
        //}
      //}
    }
    super.onMouseMove(e);
  }

  onMouseLeave = (e) => {
    //this.sendEvent('onResidueMouseLeave', this.currentMouseSequencePosition);
    this.currentMouseSequencePosition = undefined;
    super.onMouseLeave(e);
  }

  onClick = (e) => {
    //const eventData = this.currentPointerPosition(e);
    //this.sendEvent('onResidueClick', eventData);
    super.onClick(e);
  }

  onDoubleClick = (e) => {
    const eventData = this.currentPointerPosition(e);
    this.sendEvent('onResidueDoubleClick', eventData);
    super.onDoubleClick(e);
  }

  //shouldComponentUpdate(newProps) {
    //// TODO: check recursively
    ////return this.props.target !== newProps.target;
    //return true;
  //}

  // to make react-docgen happy
  render() {
    return super.render();
  }
}

positionStoreMixin(SequenceViewerComponent, {withX: true, withY: true});

SequenceViewerComponent.defaultProps = {
  showModBar: false,
  xGridSize: 10,
  yGridSize: 10,
  cacheElements: 10,
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

  xGridSize: PropTypes.number.isRequired,
  yGridSize: PropTypes.number.isRequired,
};

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
    tileFont: state.props.tileFont,
    msecsPerFps: state.props.msecsPerFps,
    colorScheme: state.props.colorScheme,
    engine: state.props.engine,
    nrXTiles: state.sequenceStats.nrXTiles,
    nrYTiles: state.sequenceStats.nrYTiles,
  }
}

//const mapDispatchToProps = dispatch => {
  //return {
    //updatePosition: flow(updatePosition, dispatch),
  //}
//}

export default msaConnect(
  mapStateToProps,
  //mapDispatchToProps,
)(SequenceViewerComponent);
