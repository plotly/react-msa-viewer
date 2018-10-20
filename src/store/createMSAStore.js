/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import PropTypes from 'prop-types';

import { createStore } from 'redux'

import {
  each,
  merge,
} from 'lodash-es';

import { MSAPropTypes, msaDefaultProps } from '../PropTypes';

import positionReducers from '../store/reducers';
import {
  updateProps,
  updatePosition,
  updateSequences,
} from '../store/actions';

/**
Initializes a new MSAViewer store-like structure.
For performance reasons, the frequently changing position information
has its own redux store.
The default properties from MSAViewer.defaultProps are used.
*/
export const createMSAStore = (props) => {
  PropTypes.checkPropTypes(MSAPropTypes, props, 'prop', 'MSAViewer');
  const propsWithDefaultValues = merge({}, msaDefaultProps, props);
  const {sequences, position, ...otherProps} = propsWithDefaultValues;
  const store = createStore(positionReducers,
    // https://github.com/zalmoxisus/redux-devtools-extension
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  each(otherProps, (v, k) => {
    store.dispatch(updateProps(k, v));
  });
  store.dispatch(updatePosition(position));
  store.dispatch(updateSequences(sequences));
  return store;
}

export default createMSAStore;
