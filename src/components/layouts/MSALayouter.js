/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import createRef from 'create-react-ref/lib/createRef';

import {
} from 'lodash-es'

import {
  same,
  forwardPropsMapper,
} from './util';

import BasicLayout from './basic';
import InverseLayout from './inverse';
import FullLayout from './inverse';
import CompactLayout from './inverse';
import FunkyLayout from './funky';

const layouts = {
  "basic": BasicLayout,
  "inverse": InverseLayout,
  "full": FullLayout,
  "compact": CompactLayout,
  "funky": FunkyLayout,
  "default": BasicLayout,
};

/**
 * Pick the selected layout and forwards all properties to it.
 */
class MSALayouter extends PureComponent {

  constructor(props) {
    super(props);
    this.el = createRef();
    this.forwardedPropsKeys = Object.keys(this.constructor.propsToForward);
  }

  // all properties that should be forwarded
  static propsToForward = {
    // List of props forwarded to the SequenceViewer component
    sequenceViewerProps: {
      "showModBar": same,
      "onResidueMouseEnter": same,
      "onResidueMouseLeave": same,
      "onResidueClick": same,
      "onResidueDoubleClick": same,
      "sequenceBorder": "border",
      "sequenceBorderColor": "borderColor",
      "sequenceBorderWidth": "borderWidth",
      "sequenceTextColor": "textColor",
      "sequenceTextFont": "textFont",
      "sequenceOverflow": "overflow",
      "sequenceOverflowX": "overflowX",
      "sequenceOverflowy": "overflowY",
      "sequenceScrollBarPositionX": "scrollBarPositionX",
      "sequenceScrollBarPositionY": "scrollBarPositionY",
    },
    // List of props forwarded to the Labels component
    labelsProps: {
      "labelComponent": same,
      "labelStyle": same,
      "labelAttributes": same,
    },
    // List of props forwarded to the PositionBar component
    positionBarProps: {
      "markerSteps": same,
      "markerStartIndex": "startIndex",
      "markerComponent": same,
      "markerStyle": same,
      "markerAttributes": same,
    },
    // List of props forwarded to the OverviewBar component
    overviewBarProps: {
      "barMethod": "method",
      "barFillColor": "fillColor",
      "barComponent": same,
      "barStyle": same,
      "barAttributes": same,
    }
  };

  // behave like a DOM node and support event dispatching
  dispatchEvent(event) {
    this.el.current.dispatchEvent(event);
  }

  render() {
    const {layout, ...otherProps} = this.props;
    if (layout in layouts) {
      const Layout = layouts[layout];
      const {forwardProps, otherProps: propsOnDiv} =
        forwardPropsMapper(otherProps, this.constructor.propsToForward);
      return <div el={this.ref} {...propsOnDiv} >
          <Layout {...forwardProps} forwardedPropsKeys={this.forwardedPropsKeys} />
        </div>;
    } else {
        console.error(`$this.props.layout} is invalid. Please use one of ${Object.keys(layouts)}`);
    }
  }
}

MSALayouter.defaultProps = {
  layout: "default"
};

MSALayouter.propTyes = {
  /**
   * Layout scheme to use.
   */
  layout: PropTypes.oneOf(Object.keys(layouts)),
};

export default MSALayouter;
