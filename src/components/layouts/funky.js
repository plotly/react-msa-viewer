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

class MSAFunkyLayout extends PureBaseLayout {
  render() {
    const labelsStyle = {
      paddingTop: this.props.tileHeight,
    }
    return (
      <div style={{display: "flex"}} >
        <Labels
          style={labelsStyle}
        />
        <div>
          <PositionBar {...this.props.positionBarProps} />
          <SequenceViewer {...this.props.sequenceViewerProps} />
          <PositionBar {...this.props.positionBarProps} />
          <OverviewBar {...this.props.overviewBarProps} />
          <br/>
          <PositionBar {...this.props.positionBarProps} />
        </div>
        <Labels
          style={labelsStyle}
          {...this.props.labelsProps}
        />
      </div>
    );
  }
}
MSAFunkyLayout.propTypes = {
  ...PureBaseLayout.propTypes,
};

const mapStateToProps = state => {
  return {
    tileHeight: state.props.tileHeight,
  }
}

export default msaConnect(
  mapStateToProps,
)(MSAFunkyLayout);
