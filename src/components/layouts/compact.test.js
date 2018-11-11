/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import MSAViewer from '../MSAViewer';
import dummySequences from '../../test/dummySequences';

import {
  mount
} from 'enzyme';

it('renders without crashing', () => {
  const msa = mount(<MSAViewer sequences={[...dummySequences]} layout="compact" />);
  expect(msa).toMatchSnapshot();
});

