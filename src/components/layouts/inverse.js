/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';

import {
  Labels,
  OverviewBar,
  PositionBar,
  SequenceViewer,
} from '../index';

import PureBaseLayout from './PureBaseLayout';
import msaConnect from '../../store/connect';

class MSAInverseLayout extends PureBaseLayout {
  render() {
    const labelsPadding = this.props.tileHeight;
    const overviewBarHeight = 50;
    const labelsStyle = {
      paddingTop: labelsPadding + overviewBarHeight,
    }
    return (
      <div style={{display: "flex"}} >
          <div>
            <OverviewBar
              height={overviewBarHeight}
              {...this.props.overviewBarProps}
            />
            <PositionBar {...this.props.positionBarProps} />
            <SequenceViewer {...this.props.sequenceViewerProps} />
          </div>
          <Labels
            style={labelsStyle}
            {...this.props.labelsProps}
          />
        </div>
    );
    //<SequenceOverview />
  }
}
MSAInverseLayout.propTypes = {
  ...PureBaseLayout.propTypes,
};

const mapStateToProps = state => {
  return {
    tileHeight: state.props.tileHeight,
  }
}

export default msaConnect(
  mapStateToProps,
)(MSAInverseLayout);
