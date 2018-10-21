/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { PureComponent } from 'react';

/**
 * Renders an individual sequence fragment.
 */
class Sequence extends PureComponent {
    render() {
      const {
        xPos,
        jPos,
        sequence,
        tileWidth,
        tileHeight,
        tileFont,
        colorScheme,
        width,
        residueComponent,
      } = this.props;
      const rawSequence = sequence.sequence;
      const residues = [];
      let xPosMoved = xPos;
      const Residue = residueComponent;
      for (let j = jPos; j < rawSequence.length; j++) {
        const el = rawSequence[j];
        residues.push(<Residue
          width={tileWidth}
          height={tileHeight}
          color={colorScheme.getColor(el)}
          font={tileFont}
          name={el}
          key={j}
        />);
        xPosMoved += tileWidth;
        if (xPosMoved > width)
            break;
      }
      return (
        <div>
          {residues}
        </div>
      );
    }
}
export default Sequence;
