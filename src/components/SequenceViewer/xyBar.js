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

import positionStoreMixin from '../../store/positionStoreMixin';

import TilingGrid from './TilingGrid';
import NodeCache from './NodeCache'

/**
* Displays the sequence names with an arbitrary Marker component
*/
class XYBarComponent extends Component {

  constructor(props) {
    super(props);
    this.el = createRef();
    this.cache = new NodeCache();
  }

  renderTile = ({row, column}) => {
    const key = row + "-" + column;
    const el = this.cache.get(key);
    if (el === undefined) {
      const node = <TilingGrid
          renderTile={this.props.tileComponent}
          startYTile={row}
          startXTile={column}
          key={key}
          endYTile={row + this.props.yGridSize}
          endXTile={column + this.props.xGridSize}
      />;
      this.cache.set(key, node);
      return node;
    } else {
      return el;
    }
  }

  getTilePositions() {
    const startXTile = Math.max(0, this.position.currentViewSequencePosition - this.props.cacheElements);
    const startYTile = Math.max(0, this.position.currentViewSequence - this.props.cacheElements);
    const endYTile = Math.min(this.props.sequences.length,
      startYTile + this.props.nrYTiles + 2 * this.props.cacheElements,
    );
    const endXTile = Math.min(this.props.sequences.maxLength,
      startXTile + this.props.nrXTiles + 2 * this.props.cacheElements,
    );
    return {startXTile, startYTile, endXTile, endYTile};
  }

  draw({startXTile, startYTile, endXTile, endYTile}) {
    const elements = [];
    const xGridSize = this.props.xGridSize;
    const yGridSize = this.props.yGridSize;
    // TODO: cut-off end tiles
    for (let i = startYTile; i < endYTile; i = i + yGridSize) {
      for (let j = startXTile; j < endXTile; j = j + xGridSize) {
        elements.push(this.renderTile({row: i, column: j}));
      }
    }
    return elements;
  }

  updatePositionStats({startXTile, startYTile}) {
    this.lastRenderTime = Date.now();
    this.position.lastCurrentViewSequencePosition = this.position.currentViewSequencePosition;
    this.position.lastCurrentViewSequence = this.position.currentViewSequence;
    this.position.lastStartXTile = startXTile;
    this.position.lastStartYTile = startYTile;
  }

  componentDidUpdate() {
    console.log("SV render time", Date.now() - this.lastRenderTime);
  }

  scrollCounter = 0;

  updateScrollPosition() {
    if (this.el && this.el.current) {
      const scrollTop = this.position.currentViewSequence * this.props.tileHeight - this.position.yPosOffset
      this.el.current.scrollTop = scrollTop;
      const scrollLeft = this.position.currentViewSequencePosition * this.props.tileWidth - this.position.xPosOffset;
      this.el.current.scrollLeft = scrollLeft;

      // recompute our component cache every now and then for faster React updates
      //if (this.scrollCounter % 3) {
        //this.draw(this.getTilePositions());
      //}
      this.scrollCounter++;
    }
    return false;
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
      nrXTiles,
      nrYTiles,
      xGridSize,
      yGridSize,
      ...otherProps
    } = this.props;
    const style = {
      width, height,
      overflow: "hidden",
      position: "relative",
      whiteSpace: "nowrap",
    };
    this.cache.prepareReset();
    const positions = this.getTilePositions();
    const elements = this.draw(positions);
    this.updatePositionStats(positions);
    this.cache.reset();
    return (
      <div {...otherProps}>
        <div style={style} ref={this.el}>
          {elements}
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
  maxLength: PropTypes.number.isRequired,

  nrXTiles: PropTypes.number.isRequired,
  nrYTiles: PropTypes.number.isRequired,

  xGridSize: PropTypes.number.isRequired,
  yGridSize: PropTypes.number.isRequired,
}

export default XYBarComponent;
