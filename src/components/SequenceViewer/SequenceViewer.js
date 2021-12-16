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

import msaConnect from '../../store/connect'
import { movePosition } from '../../store/positionReducers';

import DraggingComponent from './DraggingComponent';
import ResidueComponent from './Residue';
// TODO: withModBar
//import ModBar from './ModBar';

import Mouse from '../../utils/mouse';
import XYBar from './xyBar';

import shallowCompare from 'react-addons-shallow-compare';

/**
 * Component to draw the main sequence alignment.
 */
class HTMLSequenceViewerComponent extends Component {

  constructor(props) {
    super(props);
    this.el = createRef();
    this.residueComponent = this.residueComponent.bind(this);
  }

  residueComponent({row, column}){
    const sequences = this.props.sequences.raw;
    if (sequences.length <= row) {
      return undefined;
    }
    const rawSequence = sequences[row].sequence;
    if (rawSequence.length <= column) {
      return undefined;
    }
    const el = rawSequence[column];
    const key = row + "-" + column;
    const style = {
      position: "absolute",
      top: this.props.tileHeight * row,
      left: this.props.tileWidth * column,
    };
    return <ResidueComponent
      width={this.props.tileWidth}
      height={this.props.tileHeight}
      color={this.props.colorScheme.getColor(el)}
      font={this.props.textFont}
      style={style}
      name={el}
      key={key}
    />;
  }

  onPositionUpdate = (oldPos, newPos) => {
    const relativeMovement = {
      xMovement: oldPos[0] - newPos[0],
      yMovement: oldPos[1] - newPos[1],
    };
    this.dispatch(movePosition(relativeMovement));
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

  shouldComponentUpdate(nextProps, nextState) {
    if (["sequences", "tileHeight", "tileWidth", "width", "textFont",
         "colorScheme", "cacheElements"].some(key=> {
      return nextProps[key] !== this.props[key];
    }, true)){
      // TODO: clear cache
      return true;
    }
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUpdate() {
    console.log("CWU");
  }

  render() {
    const style = {
      width: this.props.width,
      height: this.props.height,
    };
    const {
      showModBar,
      residueComponent,
      sequenceComponent,
      onResidueMouseEnter,
      onResidueMouseLeave,
      onResidueClick,
      onResidueDoubleClick,
      //colorScheme,
      updatePosition,
      //textFont,
      ...otherProps
    } = this.props;
    return (
      <DraggingComponent
        ref={this.el}
        style={style}
        width={this.props.width}
        height={this.props.height}
        onPositionUpdate={this.onPositionUpdate}>
        <XYBar {...otherProps}
          tileComponent={this.residueComponent}
          xGridSize={10}
          yGridSize={10}
        />
      </DraggingComponent>
    );
  }
}

HTMLSequenceViewerComponent.contextTypes = {
  positionMSAStore: PropTypes.object,
}

HTMLSequenceViewerComponent.defaultProps = {
  showModBar: true,
  residueComponent: ResidueComponent,
  cacheElements: 10,
  textFont: "18px Arial",
};

HTMLSequenceViewerComponent.propTypes = {
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
   * Font to use when drawing the individual residues.
   */
  textFont: PropTypes.string,
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
    maxLength: state.sequences.maxLength,
    width,
    height,
    tileWidth: state.props.tileWidth,
    tileHeight: state.props.tileHeight,
    colorScheme: state.props.colorScheme,
    nrXTiles: state.sequenceStats.nrXTiles,
    nrYTiles: state.sequenceStats.nrYTiles,
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
