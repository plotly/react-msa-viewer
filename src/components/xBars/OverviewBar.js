/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';

import {
  pick
} from 'lodash-es';

import XBar from './xBar';
import msaConnect from '../../store/connect'
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
class HTMLOverviewBarComponent extends Component {

  componentWillMount() {
    this.calculateStats();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (["height", "sequences", "tileWidth"].some(key=> {
      return nextProps[key] !== this.props[key];
    }, true)){
      if (nextProps["sequences"] !== this.props.sequences) {
        this.calculateStats();
      }
      return true;
    }
    return shallowCompare(this, nextProps, nextState);
  }

  // TODO: do smarter caching here (reselect)
  calculateStats() {
    const stats = MSAStats(this.props.sequences.map(e => e.sequence));
    let columnHeights;
    switch (this.props.method) {
      case "conservation":
        columnHeights = stats.scale(stats.conservation());
        break;
      case "information-content":
        columnHeights = stats.scale(stats.ic());
        break;
      default:
        console.error(this.props.method + "is an invalid aggregation method for <OverviewBar />");
    }

    this.statsBar = createBar({
      columnHeights: columnHeights,
      ...pick(this.props, [
        "tileWidth", "height", "fillColor",
        "barStyle", "barAttributes",
      ])
    });
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
        tileComponent={this.statsBar}
        cacheElements={cacheElements}
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
