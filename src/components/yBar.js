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
import createShallowCompare from '../utils/createShallowCompare';

class ListComponent extends PureComponent {

  render() {
    const TileComponent = this.props.tileComponent;
    const elements = [];
    let yPos = 0;
    for (let i = this.props.startTile; i < this.props.endTile; i++) {
      elements.push(
        <TileComponent
          key={i}
          index={i}
          />
      );
      yPos += this.props.tileHeight;
      if (yPos > this.props.maxHeight)
          break;
    }
    return elements;
  }
}

/**
* Displays the sequence names with an arbitrary Marker component
*/
class YBarComponent extends Component {

  constructor(props) {
    super(props);
    this.el = createRef();

    /**
     * Updates the entire component if a property except for the position
     * has changed. Otherwise just adjusts the scroll position;
     */
    const shallowCompare = createShallowCompare([
      'yPosOffset',
      'currentViewSequence'
    ]);
    this.shouldComponentUpdate = (nextProps, nextState) => {
      if (shallowCompare(this.props, nextProps)) {
        return true;
      }
      if (Math.abs(nextProps.currentViewSequence - this.lastCurrentViewSequence) >= this.props.cacheElements) {
        return true;
      }
      return this.updateScrollPosition();
    };
  }

  componentDidUpdate() {
    this.updateScrollPosition();
  }

  updateScrollPosition() {
    if (this.el.current) {
      let offset = -this.props.yPosOffset;
      offset += (this.lastCurrentViewSequence - this.lastStartTile) * this.props.tileHeight;
      if (this.props.currentViewSequence !== this.lastCurrentViewSequence) {
        offset += (this.props.currentViewSequence - this.lastCurrentViewSequence) * this.props.tileHeight;
      }
      this.el.current.scrollTop = offset;
    }
    return false;
  }

  render() {
    const {
      yPosOffset,
      tileHeight,
      currentViewSequence,
      sequences,
      height,
      cacheElements,
      tileComponent,
      ...otherProps,
    } = this.props;
    const style = {
      height,
      overflow: "hidden",
      position: "relative",
      whiteSpace: "nowrap",
    };
    const startTile = Math.max(0, this.props.currentViewSequence - this.props.cacheElements);
    const endTile = this.props.sequences.length;
    const maxHeight = this.props.height + this.props.cacheElements * 2 * this.props.tileHeight;
    this.lastCurrentViewSequence = this.props.currentViewSequence;
    this.lastStartTile = startTile;
    return (
      <div {...otherProps}>
        <div style={style} ref={this.el}>
          <ListComponent
            startTile={startTile}
            endTile={endTile}
            maxHeight={maxHeight}
            tileComponent={this.props.tileComponent}
          />
        </div>
      </div>
    );
  }
}

YBarComponent.propTypes = {
  /**
   * Tile to render.
   */
  tileComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,

  cacheElements: PropTypes.number.isRequired,

  tileHeight: PropTypes.number.isRequired,
  currentViewSequence: PropTypes.number.isRequired,
  yPosOffset: PropTypes.number.isRequired,
}

export default YBarComponent;
