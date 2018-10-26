/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import createRef from 'create-react-ref/lib/createRef';
import { updatePosition } from '../../store/positionReducers';
import positionStoreMixin from '../../store/positionStoreMixin';

import requestAnimation from '../../utils/requestAnimation';

class FakeScroll extends PureComponent {

  componentWillMount() {
    this.el = createRef();
  }

  onScroll = (e) => {
    requestAnimation(this, () => {
      const movement = {
        xMovement: this.el.current.scrollLeft - this.position.xPos,
        yMovement: this.el.current.scrollTop - this.position.yPos,
      };
      this.dispatch(updatePosition(movement));
    });
  };

  updateScrollPosition = () => {
    if (!this.el || !this.el.current) return;
    this.el.current.scrollTop = this.position.yPos;
    this.el.current.scrollLeft = this.position.xPos;
  }

  shouldShowTester(overflow, {withX = false, withY = false}) {
    let show = false;
    switch(this.props.overflow) {
      case "auto":
        if (withX) {
          show |= this.props.fullWidth > this.props.width;
        }
        if (withY) {
          show |= this.props.fullHeight > this.props.height;
        }
        break;
      case "hidden":
        show = false;
        break;
      case "scroll":
        show = true;
        break;
      default:
    }
    return show;
  }

  shouldShow() {
    const withX = {withX: true};
    const withY = {withY: true};
    const showX = this.shouldShowTester(this.props.overflowX, withX) &&
      this.shouldShowTester(this.props.overflow, withX);
    const showY = this.shouldShowTester(this.props.overflowY, withY) &&
      this.shouldShowTester(this.props.overflow, withY);
    return {showX, showY};
  }

  render() {
    const {
      width, height,
      fullWidth, fullHeight
    } = this.props;
    const style = {
      position: "absolute",
      overflow: "scroll",
    };
    const {showX, showY} = this.shouldShow();
    const childStyle = {};
    if (!showY && !showX) {
      return <div />;
    }
    if (showX) {
      style.width = width;
      childStyle.width = fullWidth;
    }
    if (showY) {
      style.height = height;
      childStyle.height = fullHeight;
    }
    return <div style={style} onScroll={this.onScroll} ref={this.el}>
      <div style={childStyle} />
    </div>;
  }
}

FakeScroll.defaultProps = {
  overflow: "auto",
  overflowX: "auto",
  overflowY: "auto",
}

FakeScroll.propTypes = {
  overflow: PropTypes.oneOf(["hidden", "auto", "scroll"]),
  overflowX: PropTypes.oneOf(["hidden", "auto", "scroll"]),
  overflowY: PropTypes.oneOf(["hidden", "auto", "scroll"]),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fullHeight: PropTypes.number.isRequired,
  fullWidth: PropTypes.number.isRequired,
}

positionStoreMixin(FakeScroll, {
  withPosition: true,
});

export default FakeScroll;
