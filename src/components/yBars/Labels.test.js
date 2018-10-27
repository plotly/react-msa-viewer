/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';

import dummySequences from '../../test/dummySequences';
import FakePositionStore from '../../test/FakePositionStore';
import { Labels } from './Labels';
import MSAViewer from '../MSAViewer';

it('renders properly', () => {
  const component = renderer.create(
    <FakePositionStore currentViewSequence={0} >
      <Labels nrYTiles={10} tileHeight={40} height={400} sequences={[...dummySequences]} />
    </FakePositionStore>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders properly with a moved viewport', () => {
  const component = renderer.create(
    <FakePositionStore currentViewSequence={3} >
      <Labels nrYTiles={10} tileHeight={40} height={400} sequences={[...dummySequences]} />
    </FakePositionStore>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders properly when only 3 1/2 labels should be visible', () => {
  const component = renderer.create(
    <FakePositionStore currentViewSequence={0} yPosOffset={-50} >
      <Labels nrYTiles={10} tileHeight={100} height={400} sequences={[...dummySequences]} />
    </FakePositionStore>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});