/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  pick,
} from 'lodash-es';

import { createSelector } from 'reselect';

import XBar from './xBar';
import msaConnect from '../../store/connect'
import shallowSelect from '../../utils/shallowSelect';
import autobind from '../../utils/autobind';
import MSAStats from '../../utils/statSeqs';

function createBar({columnHeights, tileWidth, height, fillColor,
  barStyle, barAttributes}) {
  class Bar extends PureComponent {
    render() {
      const { index, ...otherProps} = this.props;
      otherProps.style = {
        height: Math.round(columnHeights[index] * height),
        width: tileWidth,
        display: "inline-block",
        textAlign: "center",
        backgroundColor: fillColor,
      }
      return (
        <div {...otherProps}>
        </div>
      );
    }
  }
  return Bar;
}

/**
 * Creates a small overview box of the sequences for a general overview.
 */
class HTMLOverviewBarComponent extends PureComponent {

  static barAttributes = [
    "tileWidth", "height", "fillColor", "barStyle", "barAttributes"
  ];

  constructor(props) {
    super(props);
    this.cache = function(){};
    this.initializeColumnHeights();
    autobind(this, 'createBar');
    this.bar = shallowSelect(
      s => pick(s, this.constructor.barAttributes),
      this.columnHeights,
      this.createBar,
    );
  }

  createBar(props, columnHeights) {
    this.cache = function(){};
    return createBar({...props, columnHeights});
  }

  /**
   * Reduces the `props` object to column height by a `props.method`
   */
  initializeColumnHeights() {
    this.columnHeights = createSelector(
      p => p.sequences,
      p => p.method,
      (sequences, method) => {
      const stats = MSAStats(sequences.map(e => e.sequence));
      let result;
      switch (method) {
        case "conservation":
          result = stats.scale(stats.conservation());
          break;
        case "information-content":
          result = stats.scale(stats.ic());
          break;
        default:
          console.error(method + "is an invalid aggregation method for <OverviewBar />");
      }
      return result;
    }).bind(this);
  }

  render() {
    const {cacheElements,
      height,
      method,
      fillColor,
      dispatch,
      barStyle,
      barAttributes,
      ...otherProps} = this.props;
    return (
      <XBar
        tileComponent={this.bar(this.props)}
        cacheElements={cacheElements}
        componentCache={this.cache}
        {...otherProps}
      />
    );
  }
}

HTMLOverviewBarComponent.defaultProps = {
  height: 50,
  fillColor: "#999999",
  method: "conservation",
  cacheElements: 10,
}

HTMLOverviewBarComponent.propTypes = {
  /**
   * Method to use for the OverviewBar:
   *  - `information-content`: Information entropy after Shannon of a column (scaled)
   *  - `conservation`: Conservation of a column (scaled)
   */
  method: PropTypes.oneOf(['information-content', 'conservation']),

  /**
   * Height of the OverviewBar (in pixels), e.g. `100`
   */
  height: PropTypes.number,

  /**
   * Fill color of the OverviewBar, e.g. `#999999`
   */
  fillColor: PropTypes.string,

  /**
   * Inline styles to apply to the OverviewBar component
   */
  style: PropTypes.object,

  /**
   * Inline styles to apply to each bar.
   */
  barStyle: PropTypes.object,

  /**
   * Attributes to apply to each bar.
   */
  barAttributes: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    sequences: state.sequences.raw,
    maxLength: state.sequences.maxLength,
    width: state.props.width,
    tileWidth: state.props.tileWidth,
    nrXTiles: state.sequenceStats.nrXTiles,
  }
}

export default msaConnect(
  mapStateToProps,
)(HTMLOverviewBarComponent);
// for testing
export {
  HTMLOverviewBarComponent as OverviewBar,
}
