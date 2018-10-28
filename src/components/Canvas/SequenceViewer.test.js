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
import { SequenceViewer as CanvasSequenceViewer } from './SequenceViewer';
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
})

it("should fire an event on mouseclick", () => {
  const mockOnClick = jest.fn();
  const msa = mount(<MSAViewer
    sequences={[...dummySequences]}
    width={400} height={200}
    >
    <SequenceViewer onResidueClick={mockOnClick} />
  </MSAViewer>);
  expect(msa).toMatchSnapshot();
  const sv = msa.find(CanvasSequenceViewer).instance();
  const fakeClickEvent = {
    offsetX: 50,
    offsetY: 20,
  };
  sv.onClick(fakeClickEvent);
  expect(mockOnClick.mock.calls.length).toBe(1);
  expect(mockOnClick.mock.calls[0][0]).toEqual({
    "i": 1, "position": 2, "residue": "E",
    "sequence": {
      "name": "sequence 2",
      "sequence": "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP"
    }
  });
})
