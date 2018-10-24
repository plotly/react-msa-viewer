/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { PureComponent } from 'react';

class ListComponent extends PureComponent {

  componentWillMount() {
    this.cache = {};
  }

  renderTile(i) {
    const TileComponent = this.props.tileComponent;
    if (i in this.cache) {
      return this.cache[i];
    } else {
      const el = <TileComponent
          key={i}
          index={i}
      />;
      this.cache[i] = el;
      return el;
    }
  }

  render() {
    const elements = [];
    for (let i = this.props.startTile; i < this.props.endTile; i++) {
      elements.push(this.renderTile(i));
    }
    return elements;
  }
}
export default ListComponent;
