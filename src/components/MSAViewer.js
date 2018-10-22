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

//import Labels from './Labels';
//import OverviewBar from './OverviewBar';
//import PositionBar from './PositionBar';
//import SequenceViewer from './SequenceViewer';

import Labels from './HTMLLabels';
import OverviewBar from './HTMLOverviewBar';
import PositionBar from './HTMLPositionBar';
import SequenceOverview from './SequenceOverview';
import SequenceViewer from './HTMLSequenceViewer';

import propsToRedux from '../store/propsToRedux';

const labelsAndSequenceDiv = {
  display: "flex",
};

/**
 * A general-purpose layout for the MSA components
 *
 * When children are passed it acts as a Context Provider for the msaStore,
 * otherwise it provides a default layout and forwards it props the respective
 * components.
 */
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
            </div>
          </div>
        </MSAProvider>
      );
      //<SequenceOverview />
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
