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
import { List } from 'immutable';

const sequences = List([
  {
    name: "sequence 1",
    sequence: "MEEPQSDPSIEP-PLSQETFSDLWKLLPENNVLSPLPS-QA-VDDLMLSPDDLAQWLTED"
  },
  {
    name: "sequence 2",
    sequence: "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP"
  },
  {
    name: "sequence 3",
    sequence: "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP"
  },
  {
    name: "sequence 4",
    sequence: "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP"
  },
  {
    name: "sequence 5",
    sequence: "MEEPQSD--IEL-PLSEETFSDLWWPLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP"
  },
  {
    name: "sequence 6",
    sequence: "MEEPQEDLSSSL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP"
  },
  {
    name: "sequence 7",
    sequence: "MEEPQ---SISE-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE---LSENVAGWLEDP"
  }
]);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MSAViewer sequences={[...sequences]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
