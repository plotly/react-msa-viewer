/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import ReactDOM from 'react-dom';

import SequenceViewer from './SequenceViewer';
import MSAViewer from '../MSAViewer';
import {
  dummySequences
} from '../../test';

import { mount } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MSAViewer sequences={[...dummySequences]}>
    <SequenceViewer />
  </MSAViewer>, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('sends movement actions on mousemove events', () => {
  const msa = mount(<MSAViewer sequences={[...dummySequences]}
    width={400} height={200}
    >
    <SequenceViewer />
  </MSAViewer>);
  const el = msa.find('canvas').first();
  it('should have correctly rendered the canvas', () => {
    const props = el.props();
    expect(props.width).toBe(400);
    expect(props.height).toBe(140); // only 7 dummy sequences
  });

  it('should have correctly rendered the parent div', () => {
    const props = el.parent().props();
    expect(props.width).toBe(400);
    expect(props.height).toBe(140); // only 7 dummy sequences
  });

  //it('should have change the cursor on mousedown', () => {
  //});

  //it('should move the viewport on mousemove', () => {
  //});

  //it("shouldn't move the viewport on mousemove after an mouseup", () => {
  //});
})
