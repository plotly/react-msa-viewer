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

import ColorScheme from './utils/ColorScheme';
import MSAViewer from './components/MSAViewer';
export * from './components';

const VERSION = "MSA_DEVELOPMENT_VERSION";

export {
  ColorScheme,
  createMSAStore,
  msaConnect,
  MSAProvider,
  VERSION as version,
};

export default MSAViewer;
