/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import createMSAStore from '../store/createMSAStore';
import MSAProvider from '../store/provider';

import {
  pick,
  omit,
} from 'lodash-es';

/**
 * Forwards all passed-in properties to an mocked `positionStore`
 *
 * Special properties:
 *  - `subscribe` (allows to overwrite the subscribe method of the mocked store)
 */
class FakePositionStore extends Component {
  constructor(props) {
    super(props);
    const positionAttributes = [
      "xPosOffset", "yPosOffset",
      "currentViewSequence", "currentViewSequencePosition", "position",
    ]
    this.positionStore = {
      actions: [],
      getState: () => ({
        ...pick(this.props, positionAttributes),
      }),
      subscribe: this.subscribe,
      dispatch: (e) => {
        this.positionStore.actions.push(e);
        if (this._subscribe !== undefined) {
          this._subscribe();
        }
      }
    };
    // only if defined
    if (this.props.sequences) {
      this.msaStore = createMSAStore(omit(props, positionAttributes));
    }
  }
  getChildContext() {
    return {
      positionMSAStore: this.positionStore,
    };
  }
  subscribe = (fn) => {
    this._subscribe = fn;
    // unsubscribe callback
    return () => {
      this._subscribe = undefined;
    }
  }
  componentDidUpdate() {
    // notify listeners
    if (this._subscribe) this._subscribe();
  }
  render() {
    // only inject the msaStore if defined
    if (this.msaStore) {
      return (<MSAProvider store={this.msaStore}>
        <div>
          { this.props.children }
        </div>
      </MSAProvider>);
    } else {
      return this.props.children;
    }
  }
}

FakePositionStore.defaultProps = {
  subscribe: () => {},
  yPosOffset: 0,
  xPosOffset: 0,
  currentViewSequence: 0,
  currentViewSequencePosition: 0,
  position: {
    xPos: 0,
    yPos: 0,
  },
}

FakePositionStore.childContextTypes = {
  positionMSAStore: PropTypes.object,
};

export default FakePositionStore;
