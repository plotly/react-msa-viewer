/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';
import MSAViewer from './lib';

import {
  repeat,
  times,
} from 'lodash';

class App extends Component {
  render() {
    const options = {
      sequences: [
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
        },
      ],
      onResidueClick: (e) => {
        console.log("onResidueClick", e);
      },
      colorScheme: "clustal",
      width: 800,
      height: 800,
    };
    times(1000, (i) => {
      options.sequences.push({
        name: `sequence ${i}`,
        sequence:
          repeat(options.sequences[i % 7].sequence, 5),
      });
    });
    return (
      <div>
        <MSAViewer {...options} />
      </div>
    );
  }
}

export default App;
