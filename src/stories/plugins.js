/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, {Component} from 'react';
import { storiesOf } from '@storybook/react';
import {
  msaConnect,
  MSAViewer,
  withPositionStore,
  SequenceViewer,
} from '../lib';

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

storiesOf('Plugins', module)
  .add('My first plugin', function(){

    class MyFirstMSAPluginComponent extends Component {
      // called on every position update (e.g. mouse movement or scrolling)
      shouldRerender() {
        return true;
      }
      render() {
        return (
          <div>
            x: {this.props.position.xPos},
            y: {this.props.position.yPos}
          </div>
        );
      }
    }

    // inject position awareness (this is done to avoid react tree computations)
    // "performance is the root of all evil"
    const MyFirstMSAPluginConnected = withPositionStore(MyFirstMSAPluginComponent);

    // select attributes from the main redux store
    const mapStateToProps = state => {
      return {
        height: state.props.height,
        sequences: state.sequences,
      }
    }

    // subscribe to the main redux store
    const MyFirstMSAPlugin = msaConnect(
      mapStateToProps,
    )(MyFirstMSAPluginConnected);

    return (
      <MSAViewer sequences={sequences} height={60}>
        <SequenceViewer />
        <MyFirstMSAPlugin />
      </MSAViewer>
    );
  })
 ;
