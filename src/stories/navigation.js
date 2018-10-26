/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { MSAViewer } from '../lib';
import { number, button, withKnobs } from '@storybook/addon-knobs';
import { repeat, times } from 'lodash-es';

const rawSequences = [
  "MEEPQSDPSIEP-PLSQETFSDLWKLLPENNVLSPLPS-QA-VDDLMLSPDDLAQWLTED",
  "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP",
  "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP",
];

const sequences = [];

times(1000, (i) => {
  sequences.push({
    name: `sequence ${i}`,
    sequence:
      repeat(rawSequences[i % 3], 5),
  });
});

storiesOf('Navigation', module)
  .addDecorator(withKnobs)
  .add('Move viewpoint', function(){
    const options = {
      sequences,
      sequenceOverflow: "hidden",
      width: 600,
      height: 600,
    };
    const mov = number("Movement by", 10, {
      range: true,
      min: 1,
      max: 100,
      step: 1,
    });

    class MSA extends Component {
      state = {
        position: {
          xPos: 100,
          yPos: 100,
        }
      }
      moveLeft = () => this.move({x: -mov});
      moveRight = () => this.move({x: mov});
      moveTop = () => this.move({y: -mov});
      moveBottom = () => this.move({y: mov});

      move = ({x = 0, y = 0}) => {
        const {xPos, yPos} = this.state.position;
        const position = {
          xPos: xPos + x,
          yPos: yPos + y,
        }
        this.setState({position});
      }
      startLoop = () => {
        if (this.frame) return;
        this.counter = 0;
        this.loop = () => {
          const xMov = this.counter % 40 < 20 ? 5 : -5;
          this.counter++;
          this.move({x: xMov, y: xMov});
          this.frame = window.requestAnimationFrame(this.loop);
        };
        this.loop();
      }
      endLoop = () => {
        window.cancelAnimationFrame(this.frame);
      }
      render() {
        return (
          <div>
            <MSAViewer {...this.props} {...this.state} />
            <div>
              <button onClick={this.moveLeft}>Left</button>
              <button onClick={this.moveRight}>Right</button>
              <button onClick={this.moveTop}>Top</button>
              <button onClick={this.moveBottom}>Bottom</button>
            </div>
            <button onClick={this.startLoop}>Start Loop</button>
            <button onClick={this.endLoop}>End Loop</button>
          </div>
        );
      }
    }
    return <MSA {...options} />;
  })
 ;
