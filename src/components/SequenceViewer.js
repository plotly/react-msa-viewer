/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import msaConnect from '../store/connect'
import { updatePosition } from '../store/actions'
import PropTypes from 'prop-types';

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
    const xInitPos = -(this.props.position.xPos % tileWidth);
    let yPos = -(this.props.position.yPos % tileHeight);
    let i = this.currentViewSequence();
    for (; i < sequences.length; i++) {
      const sequence = sequences[i].sequence;
      let xPos = xInitPos;
      let j = this.currentViewSequencePosition(sequence);
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

  onPositionUpdate(oldPos, newPos) {
    // TODO: move this into a redux action
    const pos = this.props.position;
    pos.xPos += oldPos[0] - newPos[0];
    pos.yPos += oldPos[1] - newPos[1];
    // TODO: need maximum of sequence lengths here
    const maximum = this.props.sequences.maxLength;
    const maxWidth = maximum * this.props.tileWidth - this.props.width;
    pos.xPos = clamp(pos.xPos, 0, maxWidth);
    const maxHeight = this.props.sequences.raw.length * this.props.tileHeight - this.props.height;
    pos.yPos = clamp(pos.yPos, 0, maxHeight);
    this.props.updatePosition(pos);
  }

  // TODO: move into the reducer
  /**
   * Returns the first visible sequence on the current viewpoint.
   * Might only be partially visible.
   */
  currentViewSequence() {
    return clamp(floor(this.props.position.yPos / this.props.tileHeight), 0, this.props.sequences.length - 1)
  }

  /**
   * Returns the first visible position on the current viewpoint.
   * Might only be partially visible.
   */
  currentViewSequencePosition(sequence) {
    return clamp(floor(this.props.position.xPos / this.props.tileWidth), 0, sequence.length - 1);
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

  componentDidUpdate() {
    // TODO: smarter updates
    this.draw();
  }

  // TODO: move into the redux store
  /**
   * Only fire an event if its value has changed.
   */
  fireEvent(eventName, e) {
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
    const eventData = this.currentPointerPosition(e);
    this.sendEvent('onResidueClick', eventData);
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

SequenceViewerComponent.defaultProps = {
  showModBar: true,
};

SequenceViewerComponent.PropTypes = {
  /**
   * Show the custom ModBar
   */
  showModBar: PropTypes.boolean,

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
    position: state.position,
    sequences: state.sequences,
    width,
    height,
    tileWidth: state.props.tileWidth,
    tileHeight: state.props.tileHeight,
    tileFont: state.props.tileFont,
    msecsPerFps: state.props.msecsPerFps,
    colorScheme: state.props.colorScheme,
    engine: state.props.engine,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updatePosition: flow(updatePosition, dispatch),
  }
}

export default msaConnect(
  mapStateToProps,
  mapDispatchToProps,
)(SequenceViewerComponent);
