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
import { select, text, withKnobs } from '@storybook/addon-knobs';
import {
  zipObject,
} from 'lodash-es';

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

// Storybook 4 selects only accepts key/value objects
function createObject(options) {
  return zipObject(options, options);
}

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
      colorScheme: select("Colorscheme", createObject(colorschemes), "zappo"),
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
    const fontSizes = ["6px", "8px", "10px", "12px", "14px", "16px", "18px", "20px"];
    const fontSize = select("Font size", createObject(fontSizes), "14px");
    const options = {
      sequences,
      labelComponent: ({sequence}) => {
        return (
          <div style={{height: 20, fontWeight: 'bold', fontSize}}>
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
    const fontSizes = ["6px", "8px", "10px", "12px", "14px", "16px", "18px"];
    const fontSize = select("Font size", createObject(fontSizes), "10px");
    const options = {
      sequences,
      markerComponent: ({index}) => {
        return (
          <div style={{
            width: 20,
            display: "inline-block",
            textAlign: "center",
            fontSize: fontSize,
            fontWeight: 'bold'}}>
            {index}
          </div>
        );
      }
    };
    return (
      <MSAViewer {...options} />
    )
  })
 .add('Custom styling', function(){
    const options = {
      sequences,
      labelStyle: {
        outline: text("Label style (outline)", "1px solid black"),
      },
      markerStyle: {
        outline: text("Marker style (outline)", "1px solid black"),
      },
      sequenceTextColor: text("Sequence color", "blue"),
     };
    return (
      <MSAViewer {...options} />
    )
  })
 .add('Custom scollbars', function(){
    const options = {
      sequences,
      sequenceScrollBarPositionX: select("ScrollBarPositionX", createObject(["top", "bottom"]), "top"),
      sequenceScrollBarPositionY: select("ScrollBarPositionY", createObject(["left", "right"]), "left"),
      sequenceOverflow: select("Overflow", createObject(["scroll", "auto", "hidden"]), "scroll"),
     };
    return (
      <MSAViewer {...options} />
    )
  })
 ;
