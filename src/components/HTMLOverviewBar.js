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

import msaConnect from '../store/connect'
import createShallowCompare from '../utils/createShallowCompare';

import MSAStats from '../utils/statSeqs';

class Bar extends PureComponent {
  render() {
    const {width, height, name, ...otherProps} = this.props;
    otherProps.style = {
      ...this.props.style,
      width: width,
      height: height,
      display: "inline-block",
      textAlign: "center",
      backgroundColor: "black",
    }
    return (
      <div {...otherProps}>
        {name}
      </div>
    );
  }
}

/**
 * Creates a small overview box of the sequences for a general overview.
 */
class HTMLOverviewBarComponent extends Component {

  constructor(props) {
    super(props);
    this.calculateStats();
    this.el = createRef();

    /**
     * Updates the entire component if a property except for the position
     * has changed. Otherwise just adjusts the scroll position;
     */
    const shallowCompare = createShallowCompare(['position']);
    this.shouldComponentUpdate = (nextProps, nextState) => {
      if (shallowCompare(this.props, nextProps)) {
        this.calculateStats();
        return true;
      }
      this.updateScrollPosition();
      return false;
    };
  }

  // TODO: do smarter caching here (reselect)
  calculateStats() {
    const stats = MSAStats(this.props.sequences.map(e => e.sequence));
    this.columnHeights = [];
    switch (this.props.method) {
      case "conservation":
        this.columnHeights = stats.scale(stats.conservation());
        break;
      case "information-content":
        this.columnHeights = stats.scale(stats.ic());
        break;
      default:
        console.error(this.props.method + "is an invalid aggregation method for <OverviewBar />");
    }
  }

  draw() {
    const BarComponent = this.props.barComponent;
    const labels = [];
    let xPos = this.props.stats.xPosOffset;
    const startTile = this.props.stats.currentViewSequencePosition;
    for (let i = startTile; i < (startTile + this.props.stats.nrTiles); i++) {
      let height = this.props.height * this.columnHeights[i];
      //const remainingHeight = this.props.height - height;
      labels.push(
        <BarComponent
          width={this.props.tileWidth}
          key={i}
          height={height}
          />
      );
      xPos += this.props.tileWidth;
      if (xPos > this.props.width)
          break;
    }
    return labels;
  }

  componentDidUpdate() {
    this.updateScrollPosition();
  }

  updateScrollPosition() {
    if (this.el.current) {
      this.el.current.scrollLeft = -this.props.stats.xPosOffset;
    }
  }

  render() {
    const style = {
      font: "14px Arial",
      marginTop: 3,
      width: this.props.width,
      overflow: "hidden",
      position: "relative",
      whiteSpace: "nowrap",
      height: this.props.height,
    };
    return (
      <div style={this.props.style}>
        <div style={style} ref={this.el}>
          { this.draw() }
        </div>
      </div>
    );
  }
}

HTMLOverviewBarComponent.defaultProps = {
  height: 50,
  fillColor: "#999999",
  method: "conservation",
  barComponent: Bar,
}

HTMLOverviewBarComponent.PropTypes = {
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
};

const mapStateToProps = state => {
  return {
    sequences: state.sequences.raw,
    position: state.position,
    width: state.props.width,
    tileHeight: state.props.tileHeight,
    tileWidth: state.props.tileWidth,
    msecsPerFps: state.props.msecsPerFps,
    stats: state.sequenceStats,
  }
}

export default msaConnect(
  mapStateToProps,
  //mapDispatchToProps
)(HTMLOverviewBarComponent);
