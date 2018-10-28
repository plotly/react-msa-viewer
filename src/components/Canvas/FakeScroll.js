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
import { movePosition } from '../../store/positionReducers';
import withPositionStore from '../../store/withPositionStore';

import requestAnimation from '../../utils/requestAnimation';

/**
 * Creates a DOM element with absolute position that can have scrollbars.
 * However, no actual content is displayed by this element.
 */
class FakeScroll extends PureComponent {

  constructor(props) {
    super(props);
    this.el = createRef();
  }

  onScroll = (e) => {
    requestAnimation(this, () => {
      const movement = {
        xMovement: this.el.current.scrollLeft - this.props.position.xPos,
        yMovement: this.el.current.scrollTop - this.props.position.yPos,
      };
      this.props.positionDispatch(movePosition(movement));
    });
  };

  updateScrollPosition = () => {
    if (!this.el || !this.el.current) return;
    this.el.current.scrollTop = this.props.position.yPos;
    this.el.current.scrollLeft = this.props.position.xPos;
  }

  checkOverflow(overflow, {withX = false, withY = false}) {
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
    const overflowX = this.props.overflowX === "initial" ? this.props.overflow : this.props.overflowX;
    const overflowY = this.props.overflowY === "initial" ? this.props.overflow : this.props.overflowY;
    const showX = this.checkOverflow(overflowX, withX) &&
      this.checkOverflow(this.props.overflow, withX);
    const showY = this.checkOverflow(overflowY, withY) &&
      this.checkOverflow(this.props.overflow, withY);
    return {showX, showY};
  }

  render() {
    const {
      width, height,
      fullWidth, fullHeight
    } = this.props;
    const style = {
      position: "absolute",
      overflowX: "auto",
      overflowY: "auto",
      width, height,
      transform: "",
    };
    const {showX, showY} = this.shouldShow();
    const childStyle = {
      height: 1,
      width: 1,
    };
    if (!showY && !showX) {
      return <div />;
    }
    if (showX) {
      childStyle.width = fullWidth;
      style.overflowX = "scroll";
      if (this.props.positionX === "top") {
        style.transform += "rotateX(180deg)";
      }
    }
    if (showY) {
      childStyle.height = fullHeight;
      style.overflowY = "scroll";
      if (this.props.positionY === "left") {
        style.transform += "rotateY(180deg)";
      }
    }
    return <div style={style} onScroll={this.onScroll} ref={this.el}>
      <div style={childStyle} />
    </div>;
  }
}

FakeScroll.defaultProps = {
  overflow: "auto",
  overflowX: "initial",
  overflowY: "initial",
  positionX: "bottom",
  positionY: "right",
  scrollBarWidth: 5,
}

FakeScroll.propTypes = {
  overflow: PropTypes.oneOf(["hidden", "auto", "scroll"]),
  overflowX: PropTypes.oneOf(["hidden", "auto", "scroll", "initial"]),
  overflowY: PropTypes.oneOf(["hidden", "auto", "scroll", "initial"]),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fullHeight: PropTypes.number.isRequired,
  fullWidth: PropTypes.number.isRequired,
  positionX: PropTypes.oneOf(["top", "bottom"]),
  positionY: PropTypes.oneOf(["left", "right"]),
}

export default withPositionStore(FakeScroll, {withX: true, withY: true});
