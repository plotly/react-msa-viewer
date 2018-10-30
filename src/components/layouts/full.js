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

class MSAFullLayout extends PureBaseLayout {
  render() {
    return (
      <div style={{display: "flex"}}>
        <Labels {...this.props.labelsProps} />
        <div>
          <SequenceViewer/>
          <PositionBar {...this.props.positionBarProps} />
          <br/>
          <OverviewBar {...this.props.overviewBarProps} />
          <br/>
          <PositionBar {...this.props.positionBarProps} />
          <OverviewBar
          />
          <OverviewBar
            {...this.props.overviewBarProps}
            method="information-content"
          />
        </div>
      </div>
    );
  }
}

export default MSAFullLayout;
