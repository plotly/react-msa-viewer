/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import ShallowRenderer from 'react-test-renderer/shallow';

import MSAViewer from './MSAViewer';
import dummySequences from '../test/dummySequences';

import {
  mount
} from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MSAViewer sequences={[...dummySequences]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
  const renderer = new ShallowRenderer();
  renderer.render(
    <MSAViewer sequences={[...dummySequences]} />
  );
  let tree = renderer.getRenderOutput();
  expect(tree).toMatchSnapshot();
});

it('renders without crashing in enzyme', () => {
  const msa = mount(<MSAViewer sequences={[...dummySequences]} />);
  expect(msa).toMatchSnapshot();
});

it('it should rerender when new props are given', () => {
  const msa = mount(<MSAViewer sequences={[...dummySequences]} />);
  msa.setProps({width: 200, height: 300});
  expect(msa).toMatchSnapshot();
});
