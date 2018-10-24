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

class ReactNodeCache {

  constructor() {
    this.cache = {};
    this.oldCache = {};
  }

  prepareReset() {
    this.oldCache = this.cache;
    this.cache = {};
  }

  reset() {
    this.oldCache = {};
  }

  get(key) {
    if (key in this.cache) {
      return this.cache[key];
    } else {
      const el = this.oldCache[key];
      this.oldCache[key] = undefined;
      this.cache[key] = el;
      return el;
    }
  }

  set(key, value) {
    this.cache[key] = value;
  }
}

/**
* Displays the sequence names with an arbitrary Marker component
*/
class XYBarComponent extends Component {

  constructor(props) {
    super(props);
    this.el = createRef();
    this.cache = new ReactNodeCache();
  }

  renderTile = (i, j) => {
    const TileComponent = this.props.tileComponent;
    const key = i + "-" + j;
    const el = this.cache.get(key);
    if (el === undefined) {
      const node = TileComponent({
        key: key,
        i: i,
        j:j,
      });
      this.cache.set(key, node);
      return node;
    } else {
      return el;
    }
  }

  renderRow(i, startXTile, endXTile) {
    const rawSequence = this.props.sequences.raw[i].sequence;
    endXTile = Math.min(rawSequence.length, endXTile);
    const residues = [];
    for (let j = startXTile; j < endXTile; j++) {
      residues.push(this.renderTile(i, j));
    }
    return residues;
  }

  draw() {
    this.lastRenderTime = Date.now();
    const elements = [];
    const startXTile = Math.max(0, this.position.currentViewSequencePosition - this.props.cacheElements);
    const startYTile = Math.max(0, this.position.currentViewSequence - this.props.cacheElements);
    const endYTile = Math.min(this.props.sequences.length,
      startYTile + this.props.nrYTiles,
    );
    const endXTile = Math.min(this.props.sequences.maxLength,
      startXTile + this.props.nrXTiles,
    );
    for (let i = startYTile; i < endYTile; i++) {
      elements.push(this.renderRow(i, startXTile, endXTile));
    }
    this.position.lastCurrentViewSequencePosition = this.position.currentViewSequencePosition;
    this.position.lastCurrentViewSequence = this.position.currentViewSequence;
    this.position.lastStartXTile = startXTile;
    this.position.lastStartYTile = startYTile;
    return elements;
  }

  componentDidUpdate() {
    console.log("SV render time", Date.now() - this.lastRenderTime);
  }

  updateScrollPosition() {
    if (this.el && this.el.current) {
      const scrollTop = this.position.currentViewSequence * this.props.tileHeight - this.position.yPosOffset
      this.el.current.scrollTop = scrollTop;
      const scrollLeft = this.position.currentViewSequencePosition * this.props.tileWidth - this.position.xPosOffset;
      this.el.current.scrollLeft = scrollLeft;
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
      ...otherProps,
    } = this.props;
    const style = {
      //width: this.props.tileWidth * this.props.sequences.maxLength,
      //height: this.props.tileHeight * this.props.sequences.length,
      width, height,
      overflow: "hidden",
      position: "relative",
      whiteSpace: "nowrap",
    };
    this.cache.prepareReset();
    const elements = this.draw();
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
}

export default XYBarComponent;
