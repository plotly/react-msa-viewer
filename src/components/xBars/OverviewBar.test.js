/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';

import {
  dummySequences,
  FakePositionStore,
} from '../../test';

import { OverviewBar } from './OverviewBar';

import { mount } from 'enzyme';

it('renders properly', () => {
  const component = mount(
    <FakePositionStore currentViewSequencePosition={0}>
      <OverviewBar nrXTiles={5} tileWidth={20} width={200} maxLength={100} sequences={[...dummySequences]} />
    </FakePositionStore>
  );
  expect(component).toMatchSnapshot();
});

it('renders properly with a moved viewport', () => {
  let subscribee;
  const subscribeHandler = s => subscribee = s;
  mount(<FakePositionStore currentViewSequencePosition={40} subscribe={subscribeHandler}>
      <OverviewBar nrXTiles={5} tileWidth={20} width={200} maxLength={100} sequences={[...dummySequences]} />
    </FakePositionStore>);
});
