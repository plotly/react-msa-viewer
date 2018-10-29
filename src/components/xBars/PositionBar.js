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
  partialRight,
  pick,
} from 'lodash-es';

import msaConnect from '../../store/connect'
import shallowSelect from '../../utils/shallowSelect';
import autobind from '../../utils/autobind';

import XBar from './xBar';

function createMarker({markerSteps, startIndex, tileWidth,
  font, markerComponent, markerStyle, markerAttributes}) {
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
          ...markerStyle
        }
        let name;
        if (index % markerSteps === 0) {
          name = index+ 0 + startIndex;
        } else {
          name = '.';
        }
        const attributes = {...otherProps, ...markerAttributes};
        return (
          <div {...attributes} >
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

  static markerAttributes = [
    "markerSteps", "startIndex", "tileWidth",
    "markerComponent", "markerStyle", "markerAttributes",
  ];

  constructor(props) {
    super(props);
    this.cache = function(){};
    autobind(this, 'createMarker');
    this.marker = shallowSelect(
      partialRight(pick, this.constructor.markerAttributes),
      this.createMarker
    );
  }

  createMarker(props) {
    this.cache = function(){};
    return createMarker(props);
  }

  render() {
    const {cacheElements,
      markerSteps,
      startIndex,
      dispatch,
      markerComponent,
      markerStyle,
      ...otherProps} = this.props;
    return (
      <XBar
        tileComponent={this.marker(this.props)}
        cacheElements={cacheElements}
        componentCache={this.cache}
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
  markerStyle: {},
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

  /**
   * Inline styles to apply to the PositionBar component
   */
  style: PropTypes.object,

  /**
   * Inline styles to apply to each marker.
   */
  markerStyle: PropTypes.object,

  /**
   * Attributes to apply to each marker.
   */
  markerAttributes: PropTypes.object,
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

export {
  HTMLPositionBarComponent as PositionBar,
}
