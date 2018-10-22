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
import createShallowCompare from '../utils/createShallowCompare';

/**
* Displays the sequence names with an arbitrary Marker component
*/
class XBarComponent extends Component {

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
    const TileComponent = this.props.tileComponent;
    const labels = [];
    let xPos = this.props.xPosOffset;
    const startTile = Math.max(0, this.props.currentViewSequencePosition - this.props.cacheElements);
    const endTile = Math.min(this.props.sequences.maxLength, startTile + this.props.nrTiles + this.props.cacheElements * 2);
    for (let i = startTile; i < endTile; i++) {
      labels.push(
        <TileComponent
          key={i}
          index={i}
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
    const {
      xPosOffset,
      tileWidth,
      currentViewSequencePosition,
      nrSequences,
      sequences,
      width,
      cacheElements,
      tileComponent,
      nrTiles,
      ...otherProps,
    } = this.props;
    const style = {
      width,
      overflow: "hidden",
      position: "relative",
      whiteSpace: "nowrap",
    };
    const containerStyle = {
      ...this.props.style,
      height: this.props.height,
    };
    return (
      <div style={containerStyle} {...otherProps}>
        <div style={style} ref={this.el}>
          { this.draw() }
        </div>
      </div>
    );
  }
}

XBarComponent.propTypes = {
  /**
   * Tile to render.
   */
  tileComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,

  cacheElements: PropTypes.number.isRequired,

  tileWidth: PropTypes.number.isRequired,
  currentViewSequencePosition: PropTypes.number.isRequired,
  nrTiles: PropTypes.number.isRequired,
  xPosOffset: PropTypes.number.isRequired,
  nrSequences: PropTypes.number.isRequired,
}

export default XBarComponent;
