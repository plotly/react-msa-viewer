/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import { storiesOf } from '@storybook/react';
import { MSAViewer } from '../lib';
import { select, withKnobs } from '@storybook/addon-knobs';

const sequences = [
  {
    name: "seq.1",
    sequence: "MEEPQSDPSIEP-PLSQETFSDLWKLLPENNVLSPLPS-QA-VDDLMLSPDDLAQWLTED"
  },
  {
    name: "seq.2",
    sequence: "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP"
  },
  {
    name: "seq.3",
    sequence: "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP"
  },
];

storiesOf('Customization', module)
  .addDecorator(withKnobs)
  .add('Colorschemes', function(){
    // see https://github.com/wilzbach/msa-colorschemes for now
    const colorschemes = [
      "buried_index", "clustal", "clustal2",
      "cinema", "helix_propensity", "hydro", "lesk", "mae", "nucleotide",
      "purine_pyrimidine", "strand_propensity", "taylor", "turn_propensity",
      "zappo",
    ];
    const options = {
      colorScheme: select("Colorscheme", colorschemes, "zappo"),
      sequences,
    };
    return (
      <MSAViewer {...options} />
    )
  })
  .add('Custom ColorScheme', function(){
    // see https://github.com/wilzbach/msa-colorschemes for now
    const myColorMap = {
      "M": "blue",
      "E": "red",
      "T": "green",
    }
    class MyColorScheme  {
      getColor(element) {
        return element in myColorMap ? myColorMap[element] : "grey";
      }
    }
    const myColorScheme = new MyColorScheme();
    const options = {
      colorScheme: myColorScheme,
      sequences,
    };
    return (
      <MSAViewer {...options} />
    )
  })
 .add('Custom Labels', function(){
    const options = {
      sequences,
      labelComponent: ({sequence}) => {
        return (
          <div style={{height: 20, fontWeight: 'bold'}}>
            My: {sequence.name}
          </div>
        );
      }
    };
    return (
      <MSAViewer {...options} />
    )
  })
 .add('Custom Markers', function(){
    const options = {
      sequences,
      markerComponent: ({name}) => {
        return (
          <div style={{
            width: 20,
            display: "inline-block",
            textAlign: "center",
            fontWeight: 'bold'}}>
            {name}
          </div>
        );
      }
    };
    return (
      <MSAViewer {...options} />
    )
  })
 ;
