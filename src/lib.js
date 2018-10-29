/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import msaConnect from './store/connect'
import createMSAStore from './store/createMSAStore';
import MSAProvider from './store/provider';
import withPositionStore from './store/withPositionStore';

import ColorScheme from './utils/ColorScheme';
import MSAViewer from './components/MSAViewer';

import mainStoreActions from './store/actions';
import { actions as positionStoreActions } from './store/positionReducers';

const VERSION = "MSA_DEVELOPMENT_VERSION";

const actions = {...mainStoreActions, ...positionStoreActions};

export * from './components';
export {
  actions,
  ColorScheme,
  createMSAStore,
  msaConnect,
  MSAProvider,
  MSAViewer,
  withPositionStore,
  VERSION as version,
};

export default MSAViewer;
