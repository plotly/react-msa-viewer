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
class XYBarComponent extends Component {

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
      'currentViewSequence',
      'currentViewSequencePosition',
    ]);
    this.shouldComponentUpdate = (nextProps, nextState) => {
      if (shallowCompare(this.props, nextProps)) {
        return true;
      }
      if (Math.abs(nextProps.currentViewSequencePosition - this.lastCurrentViewSequencePosition) >= this.props.cacheElements) {
        return true;
      }
      if (Math.abs(nextProps.currentViewSequence - this.lastCurrentViewSequence) >= this.props.cacheElements) {
        return true;
      }
      return this.updateScrollPosition();
    };
  }

  draw() {
    this.lastRenderTime = Date.now();
    const TileComponent = this.props.tileComponent;
    const elements = [];
    let yPos = this.props.yPosOffset;
    const startXTile = Math.max(0, this.props.currentViewSequencePosition - this.props.cacheElements);
    const startYTile = Math.max(0, this.props.currentViewSequence - this.props.cacheElements);
    for (let i = startYTile; i < this.props.sequences.length; i++) {
      elements.push(
        <TileComponent
          key={i}
          i={i}
          j={startXTile}
          />
      );
      yPos += this.props.tileHeight;
      if (yPos > (this.props.height + this.props.cacheElements * 2 * this.props.tileHeight))
          break;
    }
    this.lastCurrentViewSequencePosition = this.props.currentViewSequencePosition;
    this.lastCurrentViewSequence = this.props.currentViewSequence;
    this.lastXStartTile = startXTile;
    this.lastYStartTile = startYTile;
    return elements;
  }

  componentDidUpdate() {
    console.log("render time", Date.now() - this.lastRenderTime);
    this.updateScrollPosition();
  }

  updateScrollPosition() {
    if (this.el.current) {
      let xOffset = -this.props.xPosOffset;
      xOffset += (this.lastCurrentViewSequencePosition - this.lastXStartTile) * this.props.tileWidth;
      if (this.props.currentViewSequencePosition !== this.lastCurrentViewSequencePosition) {
        xOffset += (this.props.currentViewSequencePosition - this.lastCurrentViewSequencePosition) * this.props.tileWidth;
      }
      this.el.current.scrollLeft = xOffset;

      let yOffset = -this.props.yPosOffset;
      yOffset += (this.lastCurrentViewSequence - this.lastYStartTile) * this.props.tileHeight;
      if (this.props.currentViewSequence !== this.lastCurrentViewSequence) {
        yOffset += (this.props.currentViewSequence - this.lastCurrentViewSequence) * this.props.tileHeight;
      }
      this.el.current.scrollTop = yOffset;
    }
    return false;
  }

  componentWillUpdate() {
    console.log("CWU");
  }

  render() {
    const {
      xPosOffset,
      yPosOffset,
      tileWidth,
      tileHeight,
      currentViewSequence,
      currentViewSequencePosition,
      sequences,
      width,
      height,
      cacheElements,
      tileComponent,
      maxLength,
      ...otherProps,
    } = this.props;
    const style = {
      width,
      overflow: "hidden",
      position: "relative",
      whiteSpace: "nowrap",
    };
          //{ this.draw() }
    return (
      <div {...otherProps}>
        <div style={style} ref={this.el}>
          <div style={{width, height, backgroundColor: "red"}} />
        </div>
      </div>
    );
  }
}

XYBarComponent.propTypes = {
  /**
   * Tile to render.
   */
  tileComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,

  cacheElements: PropTypes.number.isRequired,

  tileWidth: PropTypes.number.isRequired,
  tileHeight: PropTypes.number.isRequired,
  //currentViewSequence: PropTypes.number.isRequired,
  //currentViewSequencePosition: PropTypes.number.isRequired,
  //xPosOffset: PropTypes.number.isRequired,
  //yPosOffset: PropTypes.number.isRequired,
  maxLength: PropTypes.number.isRequired,
}

export default XYBarComponent;
