/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  MSAViewer,
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

// storybook-action-logger doesn't support auto event expansion,
// but most consoles do
const storyAction = (name) => {
  const actionCallback = action(name);
  return (e) => {
    console.log(name, e);
    actionCallback(e);
  }
}

function Tooltip(props) {
  const {direction, style, children, ...otherProps} = props;
  const containerStyle = {
    display: "inline-block",
  };
  const tooltipStyle = {
    position: "relative",
    width: "160px",
  }
  const textStyle = {
    color: "#fff",
    fontSize: "14px",
    lineHeight: 1.2,
    textAlign: "center",
    backgroundColor: "#000",
    borderRadius: "3px",
    padding: "7px",
  };
  const triangleStyle = {
    position: "absolute",
    width: 0,
    fontSize: 0,
    lineHeight: 0,
    visibility: "visible",
    opacity: 1,
  }

  switch (direction) {
    case "up":
    case "down":
      triangleStyle.borderLeft = "5px solid transparent";
      triangleStyle.borderRight = "5px solid transparent";
      triangleStyle.left = "50%";
      triangleStyle.marginLeft = "-5px";
      break;
    case "left":
    case "right":
      triangleStyle.borderTop = "5px solid transparent";
      triangleStyle.borderBottom = "5px solid transparent";
      triangleStyle.top = "50%";
      triangleStyle.marginTop = "-5px";
      break;
    default:
  }

  switch (direction) {
    case "down":
      triangleStyle.borderTop = "5px solid #000";
      triangleStyle.top = "100%";
      containerStyle.paddingBottom = "5px";
      break;
    case "up":
      triangleStyle.borderBottom = "5px solid #000";
      triangleStyle.top = "0%";
      triangleStyle.marginTop = "-5px";
      containerStyle.paddingTop = "5px";
      break;
    case "left":
      triangleStyle.borderRight = "5px solid #000";
      triangleStyle.marginLeft = "-5px";
      containerStyle.paddingLeft = "5px";
      break;
    case "right":
      triangleStyle.left = "100%";
      triangleStyle.borderLeft = "5px solid #000";
      containerStyle.paddingRight = "5px";
      break;
    default:
  }
  return (
    <div style={{...containerStyle, ...style}} {...otherProps}>
      <div style={tooltipStyle}>
        <div style={textStyle}>
          {children}
        </div>
        <div style={triangleStyle} />
      </div>
    </div>
  );
}
Tooltip.defaultProps = {
  style: {},
  direction: "down",
};

storiesOf('Events', module)
  .add('onResidue', () => (
    <MSAViewer sequences={sequences} >
      Check the console or the "Action Logger" tab for the resulting events.
      <SequenceViewer
        onResidueMouseEnter={storyAction('onResidueMouseEnter')}
        onResidueMouseLeave={storyAction('onResidueMouseLeave')}
        onResidueClick={storyAction('onResidueClick')}
        onResidueDoubleClick={storyAction('onResidueDoubleClick')}
      />
    </MSAViewer>
  ))
  .add('onClick', () => {
    class ExtraInformation extends Component {
      state = {
      }
      onResidueClick = (e) => {
        this.setState({lastEvent: e});
      }
      render() {
        return (
          <div>
            Click on a residue:
            <MSAViewer sequences={sequences} >
              <SequenceViewer
                onResidueClick={this.onResidueClick}
              />
            </MSAViewer>
            { this.state.lastEvent &&
              <div>
                Selection: {this.state.lastEvent.residue}
                (from {this.state.lastEvent.sequence.name})
              </div>
            }
          </div>
        );
      }
    };
    return <ExtraInformation />;
  })
  .add('Tooltips (WIP)', () => {

    class SimpleTooltip extends Component {
      state = {
      }
      onResidueMouseEnter = (e) => {
        let direction, tooltipPosition;
        if (e.position < 10) {
          direction = "left";
          tooltipPosition = {
            top: (e.i - 0.3) * 20 + "px",
            left: (e.position + 1) * 20 + "px",
          };
        } else {
          direction = "right";
          tooltipPosition = {
            top: (e.i - 0.3) * 20 + "px",
            left: (e.position) * 20 - 165 + "px",
          };
        }
        this.setState({
          lastEvent: e,
          tooltipPosition,
          direction,
        });
      }
      onResidueMouseLeave = (e) => {
        this.setState({lastEvent: undefined});
      }
      render() {
        return (
          <div>
            <MSAViewer sequences={sequences} >
              <div style={{position: "relative"}}>
                <SequenceViewer
                  onResidueMouseEnter={this.onResidueMouseEnter}
                  onResidueMouseLeave={this.onResidueMouseLeave}
                />
                { this.state.lastEvent &&
                    <div style={{
                      position: "absolute",
                      opacity: 0.8,
                      ...this.state.tooltipPosition,
                      }}>
                      <Tooltip direction={this.state.direction}>
                        {this.state.lastEvent.residue}
                      </Tooltip>
                  </div>
                }
              </div>
            </MSAViewer>
          </div>
        );
      }
    };
    return <SimpleTooltip />;
  })

;
