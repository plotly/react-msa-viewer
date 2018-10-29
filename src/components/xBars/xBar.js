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

import withPositionStore from '../../store/withPositionStore';

import ListComponent from '../ListComponent';

/**
* Displays the sequence names with an arbitrary Marker component
*/
class XBarComponent extends PureComponent {

  constructor(props) {
    super(props);
    this.el = createRef();
  }

  render() {
    const {
      tileWidth,
      sequences,
      width,
      cacheElements,
      tileComponent,
      nrXTiles,
      maxLength,
      position,
      positionDispatch,
      componentCache,
      ...otherProps
    } = this.props;
    const style = {
      width,
      overflow: "hidden",
      position: "relative",
      whiteSpace: "nowrap",
    };
    const containerStyle = {
      ...this.props.style,
      height: this.props.height,
    };
    const forwardedProps = {
      tileWidth,
      sequences,
      tileComponent,
    };
    const startTile = Math.max(0, this.props.position.currentViewSequencePosition - this.props.cacheElements);
    const endTile = Math.min(this.props.maxLength, startTile + this.props.nrXTiles + this.props.cacheElements * 2);
    const maxWidth = this.props.width + this.props.cacheElements * 2 * this.props.tileWidth;
    this.props.position.lastStartXTile = startTile;
    this.props.position.lastCurrentViewSequencePosition = this.props.position.currentViewSequencePosition;
    return (
      <div style={containerStyle} {...otherProps}>
        <div style={style} ref={this.el}>
          <ListComponent {...forwardedProps}
            componentCache={this.props.componentCache}
            startTile={startTile}
            endTile={endTile}
            maxWidth={maxWidth}
          />
        </div>
      </div>
    );
  }
}

XBarComponent.propTypes = {
  /**
   * Tile to render.
   */
  tileComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,

  cacheElements: PropTypes.number.isRequired,

  tileWidth: PropTypes.number.isRequired,
  nrXTiles: PropTypes.number.isRequired,
  maxLength: PropTypes.number.isRequired,

  componentCache: PropTypes.func.isRequired,
}

export default withPositionStore(XBarComponent, {withX: true});
export {
  XBarComponent as xBar,
}
