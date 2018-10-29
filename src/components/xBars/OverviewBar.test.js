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
import { xBar } from './xBar';

import { mount, shallow } from 'enzyme';
import { mountWithContext } from '../../test/withContext';

it('renders properly (full render)', () => {
  const component = mount(
    <FakePositionStore currentViewSequencePosition={0}>
      <OverviewBar nrXTiles={5} tileWidth={20} width={200} maxLength={100} sequences={[...dummySequences]} />
    </FakePositionStore>
  );
  expect(component).toMatchSnapshot();
});

it('renders properly with a moved viewport', () => {
  let msa = mount(<FakePositionStore
    currentViewSequencePosition={40} xPosOffset={0}>
    <OverviewBar nrXTiles={5} tileWidth={20} width={100}
      maxLength={100} sequences={[...dummySequences]} cacheElements={5} />
    </FakePositionStore>);
  expect(msa).toMatchSnapshot();
  const bar = msa.find(xBar);
  const xBarDiv = bar.instance().el.current;
  expect(xBarDiv.scrollLeft).toBe(100); // fresh render (with scroll offset set)
  // call store subscribees
  msa.setProps({currentViewSequencePosition: 10});
  msa = msa.update(); // tell enzyme to update itself
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

describe('renders differently after changed properties', () => {
  let component, spy, wrapper;
  beforeEach(() => {
    spy = jest.spyOn(OverviewBar.prototype, "createBar");
    component = shallow(
      <FakePositionStore currentViewSequencePosition={10}>
        <OverviewBar nrXTiles={20} tileWidth={20} maxLength={20}
                     sequences={[...dummySequences]}
        />
      </FakePositionStore>
    );
    expect(component).toMatchSnapshot();
    expect(spy.mock.calls.length).toBe(0);
    wrapper = mountWithContext(component);
    expect(wrapper).toMatchSnapshot();
  });
  afterEach(() => {
    spy.mockRestore();
  });

  it('should have been called in the beginning', () => {
    expect(spy.mock.calls.length).toBe(1);
  });

  it('should refresh on property changes', () => {
    wrapper.setProps({
      fillColor: "blue",
      height: 100,
    });
    expect(wrapper).toMatchSnapshot();
    expect(spy.mock.calls.length).toBe(2);
  });

  it('should refresh on unrelated property changes', () => {
    wrapper.setProps({
      style: {width: 200},
    });
    expect(spy.mock.calls.length).toBe(1);
  });

  it('should rerender if sequences have changed', () => {
    wrapper.setProps({
      sequences: [{
          name: "seq.1",
          sequence: "AAAAAAAAAAAAAAAAAAAA",
        },{
          name: "seq.1",
          sequence: "AAAAAAAAAAAAAAAAAAAA",
        },{
          name: "seq.3",
          sequence: "AAAAAAAAAAAAAAAAAAAA",
      }]
    });
    expect(wrapper).toMatchSnapshot();
    expect(spy.mock.calls.length).toBe(2);
  });
});
