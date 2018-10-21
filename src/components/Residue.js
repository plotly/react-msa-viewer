/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { PureComponent } from 'react';

import { keyword, hex } from 'color-convert';

/**
 * Render an individual residue.
 */
class Residue extends PureComponent {
  render() {
    const {height, width, color, name} = this.props;
    let colorRGB;
    if (color && color[0] === "#") {
      colorRGB = hex.rgb(color);
    } else {
      colorRGB = keyword.rgb(color);
    }
    const style = {
      height,
      width,
      backgroundColor: `rgba(${colorRGB[0]}, ${colorRGB[1]}, ${colorRGB[2]}, 0.7)`,
      display: "inline-block",
      textAlign: "center",
    }
    return (
      <div style={style}>
        {name}
      </div>
    );
  }
}
export default Residue;
