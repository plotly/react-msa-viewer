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

import { mount, shallow } from 'enzyme';

it('renders properly (full render)', () => {
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
  const msa = mount(<FakePositionStore
    currentViewSequencePosition={40} subscribe={subscribeHandler}
    xPosOffset={0}>
    <OverviewBar nrXTiles={5} tileWidth={20} width={100}
      maxLength={100} sequences={[...dummySequences]} cacheElements={5} />
    </FakePositionStore>);
  expect(msa).toMatchSnapshot();
  const bar = msa.find(OverviewBar);
  const xBarDiv = bar.children().first().instance().el.current;
  expect(xBarDiv.scrollLeft).toBe(0); // fresh render
  // call store subscribees
  msa.setProps({currentViewSequencePosition: 10});
  subscribee();
  // view should have moved
  expect(msa).toMatchSnapshot();
  expect(xBarDiv.scrollLeft).toBe(100);
});

it('renders properly with a moved viewport', () => {
  const msa = shallow(<OverviewBar
      nrXTiles={5} tileWidth={20} width={100}
      maxLength={100} sequences={[...dummySequences]} cacheElements={5} />);
  const positionMSAStore = {
    getState: () => ({
      currentViewSequencePosition: 40,
      xPosOffset: 0,
    }),
    subscribe: () => {},
  };
  const wrapper = msa.dive({context: {positionMSAStore}});
  expect(wrapper).toMatchSnapshot();
});
