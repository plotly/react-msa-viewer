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
  pick
} from 'lodash-es';

import msaConnect from '../../store/connect'

import XBar from './xBar';

function createMarker({markerSteps, startIndex, tileWidth, font, markerComponent}) {
  /**
   * Displays an individual sequence name.
   */
  class Marker extends PureComponent {
    render() {
      const {index, ...otherProps} = this.props;
      if (markerComponent) {
        const MarkerComponent = markerComponent;
        return <MarkerComponent index={index} />
      } else {
        otherProps.style = {
          width: tileWidth,
          display: "inline-block",
          textAlign: "center",
        }
        let name;
        if (index % markerSteps === 0) {
          name = index+ 0 + startIndex;
        } else {
          name = '.';
        }
        return (
          <div {...otherProps}>
            {name}
          </div>
        );
      }
    }
  }
  return Marker;
}

/**
* Displays the sequence names with an arbitrary Marker component
*/
class HTMLPositionBarComponent extends PureComponent {

  componentWillMount() {
    this.updateMarker();
  }

  componentWillUpdate() {
    this.updateMarker();
  }

  updateMarker() {
    this.marker = createMarker(pick(this.props, [
      "markerSteps", "startIndex", "tileWidth", "markerComponent"
    ]));
  }

  render() {
    const {cacheElements,
      markerSteps,
      startIndex,
      dispatch,
      markerComponent,
      ...otherProps} = this.props;
    return (
      <XBar
        tileComponent={this.marker}
        cacheElements={cacheElements}
        {...otherProps}
      />
    );
  }
}

HTMLPositionBarComponent.defaultProps = {
  style: {
    font: "12px Arial",
  },
  height: 15,
  markerSteps: 2,
  startIndex: 1,
  cacheElements: 10,
};

HTMLPositionBarComponent.propTypes = {
  /**
   * Font of the sequence labels, e.g. `20px Arial`
   */
  font: PropTypes.string,

  /**
   * Height of the PositionBar (in pixels), e.g. `100`
   */
  height: PropTypes.number,

  /**
   * At which steps the position labels should appear, e.g. `2` for (1, 3, 5)
   */
  markerSteps: PropTypes.number,

  /**
   * At which number the PositionBar marker should start counting.
   * Typical values are: `1` (1-based indexing) and `0` (0-based indexing).
   */
  startIndex: PropTypes.number,

  /**
   * Component to create markers from.
   */
  markerComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
}

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
)(HTMLPositionBarComponent);
