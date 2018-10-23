/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import msaConnect from '../store/connect'
import PropTypes from 'prop-types';

import { updatePosition } from '../store/positionReducers';
import positionStoreMixin from '../store/positionStoreMixin';

import {
  flow,
  floor,
  clamp,
  isEqual,
} from 'lodash-es';

import DraggingComponent from './DraggingComponent';

import Mouse from '../utils/mouse';

// TODO: maybe move into the store
class SequenceViewerComponent extends DraggingComponent {

  /**
   * Draws the currently visible sequences.
   * Called on every sequence movement.
   */
  drawScene() {
    const sequences = this.props.sequences.raw;
    const tileWidth = this.props.tileWidth;
    const tileHeight = this.props.tileHeight;
    const xInitPos = this.xPosOffset;
    let yPos = this.yPosOffset
    let i = this.currentViewSequence;
    for (; i < sequences.length; i++) {
      const sequence = sequences[i].sequence;
      let xPos = xInitPos;
      let j = Math.min(sequence.length, this.currentViewSequencePosition);
      for (; j < sequence.length; j++) {
        const el = sequence[j];
        this.ctx.font(this.props.tileFont);
        this.ctx.fillStyle(this.props.colorScheme.getColor(el));
        this.ctx.globalAlpha(0.7);
        this.ctx.fillRect(xPos, yPos, tileWidth, tileHeight);
        this.ctx.fillStyle("#000000");
        this.ctx.globalAlpha(1.0);
        // TODO: center the font tile
        this.ctx.fillText(el, xPos, yPos, tileWidth, tileHeight);
        xPos += tileWidth;
        if (xPos > this.props.width)
            break;
      }
      yPos += tileHeight;
      if (yPos > this.props.height)
          break;
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
    //super.onClick(e);
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
  showModBar: true,
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
    //position: state.position,
    sequences: state.sequences,
    width,
    height,
    tileWidth: state.props.tileWidth,
    tileHeight: state.props.tileHeight,
    tileFont: state.props.tileFont,
    msecsPerFps: state.props.msecsPerFps,
    colorScheme: state.props.colorScheme,
    engine: state.props.engine,
    //stats: state.sequenceStats,
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
