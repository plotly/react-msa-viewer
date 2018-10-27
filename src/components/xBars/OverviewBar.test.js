/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import {
  dummySequences,
  FakePositionStore,
} from '../../test';

import { OverviewBar } from './OverviewBar';

it('renders properly', () => {
  const component = renderer.create(
    <FakePositionStore currentViewSequencePosition={0}>
      <OverviewBar nrXTiles={5} tileWidth={20} width={200} maxLength={100} sequences={[...dummySequences]} />
    </FakePositionStore>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders properly with a moved viewport', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FakePositionStore currentViewSequencePosition={40}>
      <OverviewBar nrXTiles={5} tileWidth={20} width={200} maxLength={100} sequences={[...dummySequences]} />
    </FakePositionStore>, div);
  ReactDOM.unmountComponentAtNode(div);
});
