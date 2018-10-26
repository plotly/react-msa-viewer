/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { PureComponent } from 'react';

/**
 * Renders a list of tiles, but caches already seen components.
 */
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
    if (elements.length === 0) {
      console.warn(`The TileComponent rendered returned 0 elements from ${this.props.startTile} to ${this.props.endTile}`);
    }
    // React 15 doesn't allow to return arrays directly. Only React 16 does.
    return <div>
      {elements}
    </div>
  }
}
export default ListComponent;
