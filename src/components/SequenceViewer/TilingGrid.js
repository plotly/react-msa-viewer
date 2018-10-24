/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * Allows rendering in tiles of grids.
 *
 * |---|---|---|
 * |-1-|-2-|-3-|
 * |---|---|---|
 * ―――――――――――――
 * |---|---|---|
 * |-4-|-5-|-6-|
 * |---|---|---|
 *
 * where 1..6 are TilingGrid component of xGridSize and yGridSize of 3.
 *
 * This split-up is required to avoid frequent repaints and keeps the React
 * Tree calculations slim.
 */
class TilingGridComponent extends PureComponent {

  render() {
    const TileComponent  = this.props.renderTile;
    const residues = [];
    for (let i = this.props.startYTile; i < this.props.endYTile; i++) {
      for (let j = this.props.startXTile; j < this.props.endXTile; j++) {
        const key = i + "-" + j;
        residues.push(<TileComponent key={key} row={i} column={j} />);
      }
    }
    const tileKey = this.props.startYTile + "-" + this.props.endYTile + ":" +
      this.props.startXTile + "-" + this.props.endXTile;
    return (
      <div style={this.props.style} key={tileKey}>
        {residues}
      </div>
    );
  }
}

TilingGridComponent.propTypes = {
  style: PropTypes.object,
  renderTile: PropTypes.func.isRequired,
  startXTile: PropTypes.number.isRequired,
  startYTile: PropTypes.number.isRequired,
  endXTile: PropTypes.number.isRequired,
  endYTile: PropTypes.number.isRequired,
};

export default TilingGridComponent;
