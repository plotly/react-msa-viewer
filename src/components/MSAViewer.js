/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';
import createRef from 'create-react-ref/lib/createRef';

import {
  forOwn,
} from 'lodash-es'

import {
  msaDefaultProps,
  MSAPropTypes,
  PropTypes,
} from '../PropTypes';

import {
  Labels,
  OverviewBar,
  PositionBar,
  SequenceViewer,
} from './index';

import MSAProvider from '../store/provider';
import propsToRedux from '../store/propsToRedux';

import {
  actions,
  positionReducer,
  createPositionStore,
} from '../store/positionReducers';

const same = "FORWARD_SAME_PROP_NAME";

// list of events with a default implementation
// mapping: eventName -> DOM event name
const defaultEvents = {
  "onResidueClick": "residueClick",
};

/**
 * A general-purpose layout for the MSA components
 *
 * When children are passed it acts as a Context Provider for the msaStore,
 * otherwise it provides a default layout and forwards it props the respective
 * components.
 */
class MSAViewerComponent extends Component {

    constructor(props) {
      super(props);
      this.el = createRef();
      // add default event callback
      forOwn(defaultEvents, (domEventName, eventName) => {
        this["_" + eventName] = (e) => {
          const event = new CustomEvent(domEventName, {
            detail: e,
            bubbles: true,
          });
          this.el.current.dispatchEvent(event);
        };
      });
      this._setupStores();
    }

  // List of props forwarded to the SequenceViewer component
  static sequenceViewerProps = {
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
  };

  // List of props forwarded to the Labels component
  static labelsProps = {
    "labelComponent": same,
    "labelStyle": same,
    "labelAttributes": same,
  };

  // List of props forwarded to the PositionBar component
  static positionBarProps = {
    "markerComponent": same,
    "markerStyle": same,
    "markerAttributes": same,
  };

  // List of props forwarded to the OverviewBar component
  static overviewBarProps = {
    "barComponent": same,
    "barStyle": same,
    "barAttributes": same,
  };

  forwardProps(propsToBeForwarded) {
    const options = {};
    forOwn(propsToBeForwarded, (forwardedName, currentName) => {
      if (this.props[currentName] !== undefined) {
        const name = forwardedName === same ? currentName : forwardedName;
        options[name] = this.props[currentName];
      } else if (currentName in defaultEvents) {
        // inject default event handler
        options[currentName] = this["_" + currentName];
      }
    });
    return options;
  }

  _setupStores() {
    this.positionStore = createPositionStore(positionReducer);
    this.positionStore.dispatch(
      actions.updateMainStore(this.props.msaStore.getState())
    );
    this.msaStoreUnsubscribe = this.props.msaStore.subscribe(() => {
      // forward the msaStore to the positionStore for convenience
      this.positionStore.dispatch(
        actions.updateMainStore(this.props.msaStore.getState())
      );
    });
  }

  componentWillUnmount() {
    this.msaStoreUnsubscribe();
  }

  // TODO: we could inject this in the main redux store for better compatibility
  getChildContext() {
    return {
      positionMSAStore: this.positionStore,
    };
  }

  render() {
    const {children, msaStore, ...otherProps} = this.props;
    if (children) {
      return (
        <MSAProvider store={msaStore}>
          <div {...otherProps} ref={this.el}>
            {children}
          </div>
        </MSAProvider>
      );
    } else {
      // TODO: add more advanced layouts
      const currentState = msaStore.getState();
      const labelsPadding = currentState.props.tileHeight;
      const overviewBarHeight = 50;
      const labelsAndSequenceDiv = {
        display: "flex",
      };
      const labelsStyle = {
        paddingTop: labelsPadding + overviewBarHeight,
      }
      const separatorPadding = {
        height: 10,
      };
      return (
        <MSAProvider store={msaStore}>
          <div style={labelsAndSequenceDiv} ref={this.el}>
            <Labels
              style={labelsStyle}
              {...this.forwardProps(MSAViewerComponent.labelsProps)}
            />
            <div>
              <OverviewBar height={overviewBarHeight}
                {...this.forwardProps(MSAViewerComponent.overviewBarProps)}
              />
              <PositionBar
                {...this.forwardProps(MSAViewerComponent.positionBarProps)}
              />
              <SequenceViewer
                {...this.forwardProps(MSAViewerComponent.sequenceViewerProps)}
              />
              <div style={separatorPadding} />
            </div>
          </div>
        </MSAProvider>
      );
      //<SequenceOverview />
    }
  }
}

MSAViewerComponent.childContextTypes = {
  positionMSAStore: PropTypes.object,
};

const MSAViewer = propsToRedux(MSAViewerComponent);

MSAViewer.defaultProps = msaDefaultProps;
MSAViewer.propTypes = {
  /**
   * A custom msaStore (created with `createMSAStore`).
   * Useful for custom interaction with other components
   */
  msaStore: PropTypes.object,

  ...MSAPropTypes
};

export default MSAViewer;
