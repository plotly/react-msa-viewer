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

import positionStoreMixin from '../store/positionStoreMixin';

class ListComponent extends PureComponent {

  //componentWillUpdate() {
    //console.log("CWU");
  //}

  render() {
    const TileComponent = this.props.tileComponent;
    const elements = [];
    let xPos = 0;
    for (let i = this.props.startTile; i < this.props.endTile; i++) {
      elements.push(
        <TileComponent
          key={i}
          index={i}
          />
      );
      xPos += this.props.tileWidth;
      if (xPos > this.props.maxWidth)
          break;
    }
    return elements;
  }
}

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
      return this.shouldRerender();
    };
  }

  render() {
    const {
      tileWidth,
      sequences,
      width,
      cacheElements,
      tileComponent,
      nrTiles,
      maxLength,
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
    const forwardedProps = {
      tileWidth,
      sequences,
      tileComponent,
    };
    this.lastCurrentViewSequencePosition = this.currentViewSequencePosition;
    const startTile = Math.max(0, this.currentViewSequencePosition - this.props.cacheElements);
    const endTile = Math.min(this.props.maxLength, startTile + this.props.nrTiles + this.props.cacheElements * 2);
    const maxWidth = this.props.width + this.props.cacheElements * 2 * this.props.tileWidth;
    this.lastStartXTile = startTile;
    return (
      <div style={containerStyle} {...otherProps}>
        <div style={style} ref={this.el}>
          <ListComponent {...forwardedProps}
            startTile={startTile}
            endTile={endTile}
            maxWidth={maxWidth}
          />
        </div>
      </div>
    );
  }
}

positionStoreMixin(XBarComponent, {withX: true});

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
  //currentViewSequencePosition: PropTypes.number.isRequired,
  nrTiles: PropTypes.number.isRequired,
  //xPosOffset: PropTypes.number.isRequired,
  maxLength: PropTypes.number.isRequired,
}

export default XBarComponent;
