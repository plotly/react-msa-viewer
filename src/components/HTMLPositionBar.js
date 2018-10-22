/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import msaConnect from '../store/connect'
import createRef from 'create-react-ref/lib/createRef';

import createShallowCompare from '../utils/createShallowCompare';

/**
 * Displays an individual sequence name.
 */
class Marker extends PureComponent {
  render() {
    const {width, name, markerSteps, ...otherProps} = this.props;
    otherProps.style = {
      ...this.props.style,
      width: width,
      display: "inline-block",
      textAlign: "center",
    }
    let markerName;
    if (name % markerSteps === 0) {
      markerName = name;
    } else {
      markerName = '.';
    }
    return (
      <div {...otherProps}>
        {markerName}
      </div>
    );
  }
}

/**
* Displays the sequence names with an arbitrary Marker component
*/
class HTMLPositionBarComponent extends Component {

  constructor(props) {
    super(props);
    this.el = createRef();

    /**
     * Updates the entire component if a property except for the position
     * has changed. Otherwise just adjusts the scroll position;
     */
    const shallowCompare = createShallowCompare([
      'xPosOffset',
      'currentViewSequencePosition'
    ]);
    this.shouldComponentUpdate = (nextProps, nextState) => {
      if (shallowCompare(this.props, nextProps)) {
        return true;
      }
      if (Math.abs(nextProps.currentViewSequencePosition - this.lastCurrentViewSequencePosition) >= this.props.cacheElements) {
        return true;
      }
      return this.updateScrollPosition();
    };
  }

  draw() {
    const MarkerComponent = this.props.markerComponent;
    const labels = [];
    let xPos = this.props.xPosOffset;
    const startTile = Math.max(0, this.props.currentViewSequencePosition - this.props.cacheElements);
    for (let i = startTile; i < (startTile + this.props.nrTiles + this.props.cacheElements * 2); i++) {
      labels.push(
        <MarkerComponent
          width={this.props.tileWidth}
          key={i}
          name={i}
          markerSteps={this.props.markerSteps}
          />
      );
      xPos += this.props.tileWidth;
      if (xPos > (this.props.width + this.props.cacheElements * 2 * this.props.tileWidth))
          break;
    }
    this.lastCurrentViewSequencePosition = this.props.currentViewSequencePosition;
    this.lastStartTile = startTile;
    return labels;
  }

  componentDidUpdate() {
    this.updateScrollPosition();
  }

  updateScrollPosition() {
    if (this.el.current) {
      let offset = -this.props.xPosOffset;
      offset += (this.lastCurrentViewSequencePosition - this.lastStartTile) * this.props.tileWidth;
      if (this.props.currentViewSequencePosition !== this.lastCurrentViewSequencePosition) {
        offset += (this.props.currentViewSequencePosition - this.lastCurrentViewSequencePosition) * this.props.tileWidth;
      }
      this.el.current.scrollLeft = offset;
    }
    return false;
  }

  render() {
    const style = {
      font: this.props.font,
      marginTop: 3,
      width: this.props.width,
      overflow: "hidden",
      position: "relative",
      whiteSpace: "nowrap",
    };
    return (
      <div style={this.props.style}>
        <div style={style} ref={this.el}>
          { this.draw() }
        </div>
      </div>
    );
  }
}

HTMLPositionBarComponent.defaultProps = {
  font: "12px Arial",
  height: 15,
  markerSteps: 2,
  startIndex: 1,
  markerComponent: Marker,
  cacheElements: 10,
};

HTMLPositionBarComponent.propTypes = {
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
}

const mapStateToProps = state => {
  return {
    tileWidth: state.props.tileWidth,
    tileHeight: state.props.tileHeight,
    nrSequences: state.sequences.raw.length,
    sequences: state.sequences.raw,
    msecsPerFps: state.props.msecsPerFps,
    viewpoint: state.viewpoint,
    width: state.props.width,
    currentViewSequencePosition : state.sequenceStats.currentViewSequencePosition,
    xPosOffset: state.sequenceStats.xPosOffset,
    nrTiles: state.sequenceStats.nrTiles,
  }
}

export default msaConnect(
  mapStateToProps,
)(HTMLPositionBarComponent);
