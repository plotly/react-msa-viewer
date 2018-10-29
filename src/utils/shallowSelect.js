/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import { createSelectorCreator, defaultMemoize } from 'reselect';
import shallowEqual from './shallowEqual';

/**
 * A reselect selector with shallow identity comparison.
 * @param {function} input selectors
 * @param {function} result function
 * See also: https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc
 */
const shallowSelect = createSelectorCreator(defaultMemoize, shallowEqual);
export default shallowSelect;
