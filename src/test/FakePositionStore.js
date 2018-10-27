/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
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
    this.positionStore = {
      getState: () => ({
      ...omit(props, ["subscribe"]),
      }),
      subscribe: this.props.subscribe,
    };
  }
  getChildContext() {
    return {
      positionMSAStore: this.positionStore,
    };
  }
  render() {
    return this.props.children;
  }
}

FakePositionStore.defaultProps = {
  subscribe: () => {},
}

FakePositionStore.childContextTypes = {
  positionMSAStore: PropTypes.object,
};

export default FakePositionStore;
