/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import MSAViewer from './MSAViewer';
import dummySequences from '../test/dummySequences';


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MSAViewer sequences={[...dummySequences]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
