/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  partialRight,
  pick,
} from 'lodash-es';

import msaConnect from '../../store/connect'
import shallowSelect from '../../utils/shallowSelect';
import autobind from '../../utils/autobind';

import YBar from './yBar';

function createLabel({sequences, tileHeight, labelComponent,
  labelStyle, labelAttributes}) {
  /**
   * Displays an individual sequence name.
   */
  class Label extends PureComponent {
    render() {
      const {index, ...otherProps} = this.props;
      if (labelComponent) {
        const LabelComponent = labelComponent;
        return <LabelComponent sequence={sequences[index]} index={index} />;
      } else {
        otherProps.style = {
          ...this.props.style,
          height: tileHeight,
          ...labelStyle
        }
        const attributes = {...otherProps, ...labelAttributes};
        return (
          <div {...attributes} >
            {sequences[index].name}
          </div>
        );
      }
    }
  }
  return Label;
}

/**
 * Displays the sequence names.
 */
class HTMLLabelsComponent extends PureComponent {

  static labelProps = [
    "sequences", "tileHeight",
    "labelComponent", "labelStyle", "labelAttributes"
  ];

  constructor(props) {
    super(props);
    autobind(this, 'createLabel');
    this.label= shallowSelect(
      partialRight(pick, this.constructor.labelProps),
      this.createLabel
    );
  }

  createLabel(props) {
    this.cache = function(){};
    return createLabel(props);
  }

  render() {
    const {cacheElements,
      dispatch,
      labelComponent,
      labelStyle,
      labelAttributes,
      ...otherProps} = this.props;
    return (
      <YBar
        tileComponent={this.label(this.props)}
        cacheElements={cacheElements}
        componentCache={this.cache}
        {...otherProps}
      />
    );
  }
}

HTMLLabelsComponent.defaultProps = {
  cacheElements: 10,
  labelStyle: {},
};

HTMLLabelsComponent.propTypes = {
  /**
   * Font of the sequence labels, e.g. `20px Arial`
   */
  font: PropTypes.string,

  /**
   * Component to create labels from.
   */
  labelComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

  /**
   * Inline styles to apply to the Label component
   */
  style: PropTypes.object,

  /**
   * Inline styles to apply to each label.
   */
  labelStyle: PropTypes.object,

  /**
   * Attributes to apply to each label.
   */
  labelAttributes: PropTypes.object,
}

const mapStateToProps = state => {
  return {
    height: state.props.height,
    tileHeight: state.props.tileHeight,
    sequences: state.sequences.raw,
    nrYTiles: state.sequenceStats.nrYTiles,
  }
}

export default msaConnect(
  mapStateToProps,
)(HTMLLabelsComponent);
// for testing
export {
  HTMLLabelsComponent as Labels,
}
