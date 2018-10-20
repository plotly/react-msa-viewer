/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';
import MSAProvider from '../store/provider';

import {
  msaDefaultProps,
  MSAPropTypes,
  PropTypes,
} from '../PropTypes';

//import PositionBar from './PositionBar';
//import OverviewBar from './OverviewBar';
//import Labels from './Labels';
import PositionBar from './HTMLPositionBar';
import SequenceViewer from './SequenceViewer';
import SequenceOverview from './SequenceOverview';
import OverviewBar from './HTMLOverviewBar';
import Labels from './HTMLLabels';

import propsToRedux from '../store/propsToRedux';

const labelsAndSequenceDiv = {
  display: "flex",
};

// TODO: support changing the store dynamically
// TODO: when props of children update -> update store
// TODO: support using the child components in stand-alone mode
class MSAViewerComponent extends Component {

  // List of props forwarded to the SequenceViewer component
  static sequenceViewerProps = [
    "showModBar",
    "onResidueMouseEnter",
    "onResidueMouseLeave",
    "onResidueClick",
    "onResidueDoubleClick",
  ];

  // List of props forwarded to the Labels component
  static labelsProps = [
    "labelComponent",
  ];

  // List of props forwarded to the PositionBar component
  static positionBarProps = [
    "markerComponent",
  ];

  // List of props forwarded to the OverviewBar component
  static overviewBarProps = [
    "barComponent",
  ];

  forwardProps(propsToBeForwarded) {
    const options = {}
    propsToBeForwarded.forEach(prop => {
      if (this.props[prop] !== undefined) {
        options[prop] = this.props[prop];
      }
    });
    return options;
  }

  render() {
    const {children, msaStore, ...otherProps} = this.props;
    if (children) {
      return (
        <MSAProvider store={msaStore}>
          <div {...otherProps}>
            {children}
          </div>
        </MSAProvider>
      );
    } else {
      // TODO: add more advanced layouts
      const currentState = msaStore.getState();
      const labelsPadding = currentState.props.tileHeight;
      const overviewBarHeight = 50;
      const labelsStyle = {
        paddingTop: labelsPadding + overviewBarHeight,
      }
      const separatorPadding = {
        height: 10,
      };

      return (
        <MSAProvider store={msaStore}>
          <div style={labelsAndSequenceDiv}>
            <Labels
              style={labelsStyle}
              {...this.forwardProps(MSAViewerComponent.labelsProps)}
            />
            <div>
              <OverviewBar height={overviewBarHeight}
                {...this.forwardProps(MSAViewerComponent.overviewBarProps)}
              />
              <PositionBar
                {...this.forwardProps(MSAViewerComponent.positionBarProps)}
              />
              <SequenceViewer
                {...this.forwardProps(MSAViewerComponent.sequenceViewerProps)}
              />
              <div style={separatorPadding} />
              <SequenceOverview />
            </div>
          </div>
        </MSAProvider>
      );
    }
  }
}

const MSAViewer = propsToRedux(MSAViewerComponent);

MSAViewer.defaultProps = msaDefaultProps;

MSAViewer.propTypes = {
  /**
   * A custom msaStore (created with `createMSAStore`).
   * Useful for custom interaction with other components
   */
  msaStore: PropTypes.object,

  ...MSAPropTypes
};

export default MSAViewer;
