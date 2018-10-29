/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import { connect } from 'react-redux';

import { storeKey } from './storeOptions';

/**
 * Injects the msaStore into a component.
 *
 * @param {Object} mapStateToProps - plain object of store state to be mapped into the component
 * @param {Object} mapDispatchToProps - methods to be mapped into the component
 * @param {Object} mergeProps - custom merge method for (stateProps, dispatchProps, ownProps)
 * @param {Object} options - further customization for the connector
 *
 * See also: https://react-redux.js.org/docs/api
 */
function msaConnect(mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
  options.storeKey = storeKey;
  return connect(mapStateToProps, mapDispatchToProps, mergeProps, options);
}

export default msaConnect;
