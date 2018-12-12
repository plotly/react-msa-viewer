/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import { storiesOf } from '@storybook/react';
import { MSAViewer } from '../lib';

import {
  createMSAStore,
  Labels,
  OverviewBar,
  PositionBar,
  SequenceOverview,
  SequenceViewer,
} from '../lib';

import fer1 from './data/fer1.clustal';
import clustal from '../parser/clustal';

storiesOf('Examples', module)
  .add('Fer1', function(){
    const overviewBarHeight = 50;
    const labelsStyle = {
      paddingTop: 20 + overviewBarHeight,
    }
    // parse the fer1 clustal file
    const sequences = clustal(fer1);
    return (
      <MSAViewer sequences={sequences}>
        <SequenceOverview
        />
        <div style={{display: "flex"}} >
          <div>
            <OverviewBar
              height={overviewBarHeight}
            />
            <PositionBar/>
            <SequenceViewer/>
          </div>
          <Labels
            style={labelsStyle}
          />
        </div>
      </MSAViewer>
    )
  })
 ;
