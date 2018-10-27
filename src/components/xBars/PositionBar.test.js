/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import renderer from 'react-test-renderer';

import {
  dummySequences,
  FakePositionStore,
} from '../../test';

import { PositionBar } from './PositionBar';

it('renders properly', () => {
  const component = renderer.create(
    <FakePositionStore currentViewSequencePosition={0}>
      <PositionBar nrXTiles={5} tileWidth={20} maxLength={20} />
    </FakePositionStore>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders properly with moved viewport', () => {
  const component = renderer.create(
    <FakePositionStore currentViewSequencePosition={70}>
      <PositionBar nrXTiles={5} tileWidth={20} maxLength={100} />
    </FakePositionStore>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
