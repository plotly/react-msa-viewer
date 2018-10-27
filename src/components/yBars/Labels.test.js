/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import renderer from 'react-test-renderer';

import dummySequences from '../../test/dummySequences';
import { Labels } from './Labels';
import MSAViewer from '../MSAViewer';

it('renders properly', () => {
  const component = renderer.create(
    <MSAViewer sequences={[...dummySequences]}>
      <Labels nrYTiles={7} tileHeight={40} sequences={[...dummySequences]} />
    </MSAViewer>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
