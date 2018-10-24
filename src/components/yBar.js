/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import createRef from 'create-react-ref/lib/createRef';
import createShallowCompare from '../utils/createShallowCompare';

import positionStoreMixin from '../store/positionStoreMixin';

import ListComponent from './ListComponent';

/**
* Displays the sequence names with an arbitrary Marker component
*/
class YBarComponent extends PureComponent {

  constructor(props) {
    super(props);
    this.el = createRef();
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
      nrYTiles,
      ...otherProps,
    } = this.props;
    const style = {
      height,
      overflow: "hidden",
      position: "relative",
      whiteSpace: "nowrap",
    };
    const startTile = Math.max(0, this.position.currentViewSequence - this.props.cacheElements);
    const endTile = Math.min(this.props.sequences.length,
      startTile + Math.ceil(height/ this.props.tileHeight) + this.props.cacheElements * 2);
    this.position.lastCurrentViewSequence = this.position.currentViewSequence;
    this.position.lastStartYTile = startTile;
    console.log(startTile, endTile);
    return (
      <div {...otherProps}>
        <div style={style} ref={this.el}>
          <ListComponent
            startTile={startTile}
            endTile={endTile}
            tileComponent={this.props.tileComponent}
          />
        </div>
      </div>
    );
  }
}

positionStoreMixin(YBarComponent, {withY: true});

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
  //currentViewSequence: PropTypes.number.isRequired,
  //yPosOffset: PropTypes.number.isRequired,
  nrYTiles: PropTypes.number.isRequired,
}

export default YBarComponent;
