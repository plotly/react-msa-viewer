/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import createRef from 'create-react-ref/lib/createRef';

import {
  flow,
  floor,
  clamp,
  isEqual,
} from 'lodash-es';

import msaConnect from '../store/connect'
import { updatePosition } from '../store/actions'

import DraggingComponent from './HTMLDraggingComponent';
import ResidueComponent from './Residue';
import SequenceComponent from './Sequence';
// TODO: withModBar
//import ModBar from './ModBar';

import Mouse from '../utils/mouse';
import createShallowCompare from '../utils/createShallowCompare';

class HTMLSequenceViewerComponent extends Component {

  constructor(props) {
    super(props);
    this.el = createRef();

    /**
     * Updates the entire component if a property except for the position
     * has changed. Otherwise just adjusts the scroll position;
     */
    const shallowCompare = createShallowCompare([
      'xPosOffset',
      'yPosOffset',
      'position',
    ]);
    this.shouldComponentUpdate = (nextProps, nextState) => {
      return shallowCompare(this.props, nextProps) ||
        this.updateScrollPosition();
    };

  }

  onPositionUpdate = (oldPos, newPos) => {
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
  }

  onMouseLeave = (e) => {
    this.sendEvent('onResidueMouseLeave', this.currentMouseSequencePosition);
    this.currentMouseSequencePosition = undefined;
  }

  onClick = (e) => {
    const eventData = this.currentPointerPosition(e);
    this.sendEvent('onResidueClick', eventData);
  }

  onDoubleClick = (e) => {
    const eventData = this.currentPointerPosition(e);
    this.sendEvent('onResidueDoubleClick', eventData);
  }

  /**
   * Render the currently visible sequences.
   * Called on every sequence movement.
   */
  renderSequences() {
    const Sequence = this.props.sequenceComponent;
    const sequences = this.props.sequences.raw;
    let yPos = this.props.yPosOffset;
    const htmlSequences = [];
    for (let i = this.props.currentViewSequence; i < sequences.length; i++) {
      const sequence = sequences[i];
      let j = Math.min(
        sequence.sequence.length,
        this.props.currentViewSequencePosition
      );
      htmlSequences.push(<Sequence
        key={i}
        xPos={this.props.xPosOffset}
        jPos={j}
        tileWidth={this.props.tileWidth}
        tileHeight={this.props.tileHeight}
        colorScheme={this.props.colorScheme}
        sequence={sequence}
        font={this.props.tileFont}
        width={this.props.width}
        residueComponent={this.props.residueComponent}
      />
      );
      yPos += this.props.tileHeight;
      if (yPos > this.props.height)
          break;
    }
    return htmlSequences;
  }

  componentDidUpdate() {
    this.updateScrollPosition();
  }

  updateScrollPosition() {
    if (this.el.current) {
      this.el.current.el.current.scrollLeft = -this.props.xPosOffset;
      this.el.current.el.current.scrollTop = -this.props.yPosOffset;
    }
    return false;
  }

  render() {
    const style = {
      width: this.props.width,
      height: this.props.height,
    };
    return (
      <DraggingComponent
        ref={this.el}
        style={style}
        onPositionUpdate={this.onPositionUpdate}>
           {this.renderSequences()}
      </DraggingComponent>
    );
  }
}

HTMLSequenceViewerComponent.defaultProps = {
  showModBar: true,
  residueComponent: ResidueComponent,
  sequenceComponent: SequenceComponent,
};

HTMLSequenceViewerComponent.PropTypes = {
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
    colorScheme: state.props.colorScheme,
    currentViewSequence: state.sequenceStats.currentViewSequence,
    currentViewSequencePosition: state.sequenceStats.currentViewSequencePosition,
    yPosOffset: state.sequenceStats.yPosOffset,
    xPosOffset: state.sequenceStats.xPosOffset,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updatePosition: flow(updatePosition, dispatch),
  }
}

// TODO: with ModBar

export default msaConnect(
  mapStateToProps,
  mapDispatchToProps,
)(HTMLSequenceViewerComponent);
