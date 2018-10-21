/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { Component, PureComponent } from 'react';

import PropTypes from 'prop-types';
import createRef from 'create-react-ref/lib/createRef';

import {
  flow,
  floor,
  clamp,
  isEqual,
} from 'lodash-es';

import { keyword, hex } from 'color-convert';

import msaConnect from '../store/connect'
import { updatePosition } from '../store/actions'

import DraggingComponent from './HTMLDraggingComponent';
// TODO: withModBar
//import ModBar from './ModBar';

import Mouse from '../utils/mouse';

/**
 * Render an individual residue.
 */
class Residue extends PureComponent {
  render() {
    const {height, width, color, name} = this.props;
    let colorRGB;
    if (color && color[0] === "#") {
      colorRGB = hex.rgb(color);
    } else {
      colorRGB = keyword.rgb(color);
    }
    const style = {
      height,
      width,
      backgroundColor: `rgba(${colorRGB[0]}, ${colorRGB[1]}, ${colorRGB[2]}, 0.7)`,
      display: "inline-block",
      textAlign: "center",
    }
    return (
      <div style={style}>
        {name}
      </div>
    );
  }
}

/**
 * Renders an individual sequence fragment.
 */
class Sequence extends PureComponent {
    render() {
      const {
        xPos,
        jPos,
        sequence,
        tileWidth,
        tileHeight,
        tileFont,
        colorScheme,
        width,
      } = this.props;
      const rawSequence = sequence.sequence;
      const residues = [];
      let xPosMoved = xPos;
      for (let j = jPos; j < rawSequence.length; j++) {
        const el = rawSequence[j];
        residues.push(<Residue
          width={tileWidth}
          height={tileHeight}
          color={colorScheme.getColor(el)}
          font={tileFont}
          name={el}
          key={j}
        />);
        xPosMoved += tileWidth;
        if (xPosMoved > width)
            break;
      }
      return (
        <div>
          {residues}
        </div>
      );
    }
}

class HTMLSequenceViewerComponent extends Component {

  constructor(props) {
    super(props);
    this.el = createRef();
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

  /**
   * Render the currently visible sequences.
   * Called on every sequence movement.
   */
  renderSequences() {
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
      />
      );
      yPos += this.props.tileHeight;
      if (yPos > this.props.height)
          break;
    }
    return htmlSequences;
  }

  // TODO
  //shouldComponentUpdate() {
  //}

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
    msecsPerFps: state.props.msecsPerFps,
    colorScheme: state.props.colorScheme,
    engine: state.props.engine,
    currentViewSequence: state.sequenceStats.currentViewSequencePosition,
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
