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

import PositionBar from './PositionBar';
import SequenceViewer from './SequenceViewer';
import SequenceOverview from './SequenceOverview';
import OverviewBar from './OverviewBar';
//import Labels from './Labels';
import HTMLLabels from './HTMLLabels';

import propsToRedux from '../store/propsToRedux';

const labelsAndSequenceDiv = {
  display: "flex",
};

// TODO: support changing the store dynamically
// TODO: when props of children update -> update store
// TODO: support using the child components in stand-alone mode
class MSAViewerComponent extends Component {

  static sequenceViewerPropsForwarded = [
    "showModBar",
    "onResidueMouseEnter",
    "onResidueMouseLeave",
    "onResidueClick",
    "onResidueDoubleClick",
  ];

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

      // forward props to SequenceViewer
      const sequenceViewerOptions = {};
      MSAViewerComponent.sequenceViewerPropsForwarded.forEach(prop => {
        if (this.props[prop] !== undefined) {
          sequenceViewerOptions[prop] = this.props[prop];
        }
      });
      return (
        <MSAProvider store={msaStore}>
          <div style={labelsAndSequenceDiv}>
            <HTMLLabels
              style={labelsStyle}
            />
            <div>
              <OverviewBar height={overviewBarHeight} />
              <PositionBar />
              <SequenceViewer {...sequenceViewerOptions} />
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
