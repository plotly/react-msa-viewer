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

class MSACompactLayout extends PureBaseLayout {
  render() {
    return (
      <div>
        <PositionBar {...this.props.positionBarProps} />
        <SequenceViewer {...this.props.sequenceViewerProps} />
      </div>
    );
  }
}

MSACompactLayout.propTypes = {
  ...PureBaseLayout.propTypes,
};

export default MSACompactLayout;
