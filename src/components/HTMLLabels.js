/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import msaConnect from '../store/connect'
import createRef from 'create-react-ref/lib/createRef';

import createShallowCompare from '../utils/createShallowCompare';

/**
 * Displays an individual sequence name.
 */
class Label extends PureComponent {
  render() {
    const {height, name, ...otherProps} = this.props;
    otherProps.style = {
      ...this.props.style,
      height: height,
    }
    return (
      <div {...otherProps}>
        {name}
      </div>
    );
  }
}

/**
 * Displays the sequence names.
 */
class HTMLLabelsComponent extends Component {

  constructor(props) {
    super(props);
    this.el = createRef();

    /**
     * Updates the entire component if a property except for the position
     * has changed. Otherwise just adjusts the scroll position;
     */
    const shallowCompare = createShallowCompare(['position']);
    this.shouldComponentUpdate = (nextProps, nextState) => {
      return shallowCompare(this.props, nextProps) ||
        this.updateScrollPosition();
    };
  }

  draw() {
    const LabelComponent = this.props.labelComponent;
    const labels = [];
    let yPos = this.props.stats.yPosOffset;
    let i = this.props.stats.currentViewSequence;
    for (; i < this.props.sequences.length; i++) {
      const sequence = this.props.sequences[i];
      labels.push(
        <LabelComponent
          height={this.props.tileHeight}
          key={i}
          name={sequence.name}
          />
      );
      yPos += this.props.tileHeight;
      if (yPos > this.props.height)
          break;
    }
    return labels;
  }

  componentDidUpdate() {
    this.updateScrollPosition();
  }

  updateScrollPosition() {
    if (this.el.current) {
      this.el.current.scrollTop = -this.props.stats.yPosOffset;
    }
    return false;
  }

  render() {
    const style = {
      font: "14px Arial",
      marginTop: 3,
      height: this.props.height,
      overflow: "hidden",
      position: "relative",
    };
    return (
      <div style={this.props.style}>
        <div style={style} ref={this.el}>
          {this.draw()}
        </div>
      </div>
    );
  }
}

HTMLLabelsComponent.defaultProps = {
  width: 80, // TODO: can we calculate this automatically?
  labelComponent: Label,
};

HTMLLabelsComponent.propTypes = {
  /**
   * Font of the sequence labels, e.g. `20px Arial`
   */
  font: PropTypes.string,
}

const mapStateToProps = state => {
  return {
    position: state.position,
    height: state.props.height,
    tileHeight: state.props.tileHeight,
    msecsPerFps: state.props.msecsPerFps,
    nrSequences: state.sequences.raw.length,
    sequences: state.sequences.raw,
    stats: state.sequenceStats,
  }
}

export default msaConnect(
  mapStateToProps,
)(HTMLLabelsComponent);
