/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import { Component } from 'react';
import PropTypes from 'prop-types';

import {
  some,
} from 'lodash';

import shallowEqual from '../../utils/shallowEqual';

/**
 * Provides a `shouldComponentUpdate` method for the layouts.
 * Analogous to React.PureComponent, but checks the forwarded properties
 * shallowly too.
 */
class PureBaseLayout extends Component {
  shouldComponentUpdate(nextProps) {
    return !(shallowEqual(this.props, nextProps) &&
      some(this.props.forwardedPropsKeys.map(k => shallowEqual(this.props[k], nextProps[k]))));
  }
}

PureBaseLayout.propTypes = {
  forwardPropKeys: PropTypes.array,
};

export default PureBaseLayout;
