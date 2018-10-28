/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import { connect } from 'react-redux';
import createRef from 'create-react-ref/lib/createRef';

import { storeKey } from './storeOptions';

import React, { PureComponent } from 'react';

// just inject the position store and further magic
function withPositionConsumer(Component) {
  class MSAPositionConsumer extends PureComponent {
    constructor(props) {
      super(props);
      this.el = createRef();
    }
    render() {
      return <Component ref={this.el} {...this.props} />
    }
  }
  MSAPositionConsumer.displayName = Component.name + '-PositionStore';
  return MSAPositionConsumer;
}

function msaConnect(mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
  options.storeKey = storeKey;
  const reduxConnect = connect(mapStateToProps, mapDispatchToProps, mergeProps, options);
  return function(Component) {
    //console.log(Component);
    const wrappedComponent = withPositionConsumer(Component);
    return reduxConnect(wrappedComponent);
  }
}

export default msaConnect;
