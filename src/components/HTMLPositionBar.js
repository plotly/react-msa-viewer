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

/**
 * Displays an individual sequence name.
 */
class Marker extends PureComponent {
  render() {
    const {width, name, ...otherProps} = this.props;
    otherProps.style = {
      ...this.props.style,
      width: width,
      display: "inline-block",
      textAlign: "center",
    }
    return (
      <div {...otherProps}>
        {name}
      </div>
    );
  }
}

/**
 * Displays the sequence names.
 */
class HTMLPositionBarComponent extends Component {

  constructor(props) {
    super(props);
    this.el = createRef();
  }

  draw() {
    const labels = [];
    let xPos = -(this.props.position.xPos % this.props.tileWidth);
    const startTile = this.props.stats.currentViewSequencePosition;
    const tiles = Math.ceil(this.props.width / this.props.tileWidth) + 1;
    for (let i = startTile; i < (startTile + tiles); i++) {
      let name;
      if (i % this.props.markerSteps === 0) {
        name = i;
      } else {
        name = '.';
      }
      labels.push(
        <Marker
          width={this.props.tileWidth}
          key={i}
          name={name}
          />
      );
      xPos += this.props.tileWidth;
      if (xPos > this.props.width)
          break;
    }
    return labels;
  }

  componentDidUpdate() {
    this.updateScrollPosition();
  }

  updateScrollPosition() {
    let xPos = (this.props.position.xPos % this.props.tileWidth);
    if (this.el.current) {
      this.el.current.scrollLeft = xPos + 2;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // TODO: check if currentViewSequence has changed
    if (this.props.currentViewSequencePosition !==
        nextProps.currentViewSequencePosition) {
      return true;
    }
    this.updateScrollPosition();
    return true;
  }

  render() {
    const style = {
      font: "14px Arial",
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
    position: state.position,
    tileWidth: state.props.tileWidth,
    tileHeight: state.props.tileHeight,
    nrSequences: state.sequences.raw.length,
    sequences: state.sequences.raw,
    msecsPerFps: state.props.msecsPerFps,
    viewpoint: state.viewpoint,
    width: state.props.width,
    stats: state.sequenceStats,
  }
}

export default msaConnect(
  mapStateToProps,
)(HTMLPositionBarComponent);
