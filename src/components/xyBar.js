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

import positionStoreMixin from '../store/positionStoreMixin';

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
      return this.shouldRerender();
    };
  }

  draw() {
    this.lastRenderTime = Date.now();
    const TileComponent = this.props.tileComponent;
    const elements = [];
    let yPos = this.yPosOffset;
    const startXTile = Math.max(0, this.currentViewSequencePosition - this.props.cacheElements);
    const startYTile = Math.max(0, this.currentViewSequence - this.props.cacheElements);
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
    this.lastCurrentViewSequencePosition = this.currentViewSequencePosition;
    this.lastCurrentViewSequence = this.currentViewSequence;
    this.lastStartXTile = startXTile;
    this.lastStartYTile = startYTile;
    return elements;
  }

  componentDidUpdate() {
    console.log("SV render time", Date.now() - this.lastRenderTime);
  }

  render() {
    const {
      tileWidth,
      tileHeight,
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
      height,
      overflow: "hidden",
      position: "relative",
      whiteSpace: "nowrap",
    };
    return (
      <div {...otherProps}>
        <div style={style} ref={this.el}>
          { this.draw() }
        </div>
      </div>
    );
  }
}

positionStoreMixin(XYBarComponent, {withX: true, withY: true});

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
