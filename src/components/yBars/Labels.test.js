/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mount, shallow } from 'enzyme';

import { mountWithContext } from '../../test/withContext';
import dummySequences from '../../test/dummySequences';
import FakePositionStore from '../../test/FakePositionStore';
import { Labels } from './Labels';
import { yBar } from './yBar';
import MSAViewer from '../MSAViewer';

it('renders properly', () => {
  const component = mount(
    <FakePositionStore currentViewSequence={0} >
      <Labels nrYTiles={10} tileHeight={40} height={400} sequences={[...dummySequences]} />
    </FakePositionStore>
  );
  expect(component).toMatchSnapshot();
});

it('renders properly with a moved viewport', () => {
  const component = mount(
    <FakePositionStore currentViewSequence={3} >
      <Labels nrYTiles={10} tileHeight={40} height={400} sequences={[...dummySequences]} />
    </FakePositionStore>
  );
  expect(component).toMatchSnapshot();
});

it('renders properly when only 3 1/2 labels should be visible', () => {
  const component = mount(
    <FakePositionStore currentViewSequence={0} yPosOffset={-50} >
      <Labels nrYTiles={10} tileHeight={100} height={400} sequences={[...dummySequences]} />
    </FakePositionStore>
  );
  expect(component).toMatchSnapshot();
});

it('renders properly with a moved viewport', () => {
  const state = {
    currentViewSequence: 5,
    yPosOffset: 0,
  };
  const positionMSAStore = {
    getState: () => state,
    subscribe: s => {},
  };
  const msa = shallow(<Labels nrYTiles={7} tileHeight={50} height={100}
    sequences={[...dummySequences]} cacheElements={1} />);
  const labels = msa.dive({context: {positionMSAStore}});
  expect(labels).toMatchSnapshot();
});

it('renders properly with a moved viewport', () => {
  let subscribee;
  const state = {
    currentViewSequence: 2,
    yPosOffset: 0,
  };
  const positionMSAStore = {
    getState: () => state,
    subscribe: s => subscribee = s,
  };
  const msa = shallow(<Labels nrYTiles={7} tileHeight={50} height={100}
    sequences={[...dummySequences]} cacheElements={1} />);
  const bar = mount(msa.getElement(), {context: {positionMSAStore}});
  expect(bar).toMatchSnapshot();
  const yBarDiv = bar.childAt(0).instance().el.current;
  expect(yBarDiv.scrollTop).toBe(50); // fresh render (with scroll offset set)
  state.currentViewSequence = 5;
  state.yPosOffset = -20;
  subscribee();
  expect(yBarDiv.scrollTop).toBe(70);
  bar.update();
  expect(bar).toMatchSnapshot();
});

it('renders properly with a moved viewport (provider version)', () => {
  let msa = mount(<FakePositionStore
    currentViewSequence={3} yPosOffset={0}>
    <Labels nrYTiles={7} tileHeight={50} height={100}
      sequences={[...dummySequences]} cacheElements={2} />
    </FakePositionStore>);
  expect(msa).toMatchSnapshot();
  expect(msa.find(yBar).instance().el.current.scrollTop).toBe(100); // fresh render (with scroll offset set)
  msa.setProps({currentViewSequence: 6, yPosOffset: -20});
  expect(msa.find('withPosition(YBarComponent)').state()).toMatchSnapshot();
  msa = msa.update(); // tell enzyme to update its state to reality
  expect(msa).toMatchSnapshot();
  expect(msa.find(yBar).instance().el.current.scrollTop).toBe(120);
});

describe('renders differently after changed properties', () => {
  let spy, wrapper, component;
  beforeEach(() => {
    spy = jest.spyOn(Labels.prototype, "createLabel");
    component = shallow(
      <FakePositionStore currentViewSequencePosition={10}>
        <Labels nrYTiles={7} tileHeight={100} height={200} cacheElements={2} sequences={[...dummySequences]} />
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
      labelStyle: {color: "red"},
    });
    expect(wrapper).toMatchSnapshot();
    expect(spy.mock.calls.length).toBe(2);
  });

  it("shouldn't refresh on unrelated property changes", () => {
    wrapper.setProps({
      font: "No-Font",
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
