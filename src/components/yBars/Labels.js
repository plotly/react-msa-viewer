/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';
import {
  pick
} from 'lodash-es';

import msaConnect from '../../store/connect'

import YBar from './yBar';

function createLabel({sequences, tileHeight, labelComponent}) {
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
        }
        return (
          <div {...otherProps}>
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
class HTMLLabelsComponent extends Component {

  componentWillMount() {
    this.updateLabel();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (["sequences", "tileHeight", "labelComponent"].some(key=> {
      return nextProps[key] !== this.props[key];
    }, true)){
      this.updateLabel();
      return true;
    }
    return shallowCompare(this, nextProps, nextState);
  }

  updateLabel() {
    this.label = createLabel(pick(this.props, ["sequences", "tileHeight", "labelComponent"]));
  }

  render() {
    const {cacheElements,
      dispatch,
      labelComponent,
      ...otherProps} = this.props;
    return (
      <YBar
        tileComponent={this.label}
        cacheElements={cacheElements}
        {...otherProps}
      />
    );
  }
}

HTMLLabelsComponent.defaultProps = {
  cacheElements: 10,
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
