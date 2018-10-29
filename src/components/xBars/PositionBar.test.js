/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import { mount, shallow } from 'enzyme';

import { mountWithContext } from '../../test/withContext';

import {
  FakePositionStore,
} from '../../test';

import { PositionBar } from './PositionBar';

it('renders properly (full render)', () => {
  const component = mount(
    <FakePositionStore currentViewSequencePosition={0}>
      <PositionBar nrXTiles={5} tileWidth={20} maxLength={20} />
    </FakePositionStore>
  );
  expect(component).toMatchSnapshot();
});

it('renders properly with moved viewport', () => {
  const component = mount(
    <FakePositionStore currentViewSequencePosition={70}>
      <PositionBar nrXTiles={5} tileWidth={20} maxLength={100} />
    </FakePositionStore>
  );
  expect(component).toMatchSnapshot();
});

it('renders differently after changed properties', () => {
  const spy = jest.spyOn(PositionBar.prototype, "createMarker");
  const component = shallow(
    <FakePositionStore currentViewSequencePosition={10}>
      <PositionBar nrXTiles={20} tileWidth={20} maxLength={20} />
    </FakePositionStore>
  );
  expect(component).toMatchSnapshot();
  let wrapper = mountWithContext(component);
  expect(wrapper).toMatchSnapshot();
  expect(spy.mock.calls.length).toBe(1);

  wrapper.setProps({
    startIndex: 100,
    markerStyle: {fontColor: "red"},
  });
  expect(wrapper).toMatchSnapshot();
  expect(spy.mock.calls.length).toBe(2);
  spy.mockRestore();
});
