/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import PropTypes from 'prop-types';

import {ColorScheme, isColorScheme} from './utils/ColorScheme';

/**
 * Definition of a single sequence object.
 *   name: label or id of the sequence (doesn't need to be unique)
 *   sequence: raw sequence data (e.g. AGAAAA)
 */
export const SequencePropType = PropTypes.shape({
  name: PropTypes.string,
  sequence: PropTypes.string,
})

export const AllowedColorschemes = [
  "buried_index", "clustal", "clustal2", "cinema",
  "helix_propensity", "hydro",
  "lesk", "mae", "nucleotide", "purine_pyrimidine",
  "strand_propensity", "taylor", "turn_propensity", "zappo",
];

export const ColorSchemePropType = PropTypes.oneOfType([
  PropTypes.oneOf(AllowedColorschemes),
  PropTypes.instanceOf(ColorScheme),
  function isColorSchemeObject(props, propName, componentName) {
    if (isColorScheme(props[propName])) {
      // is a child of ColorScheme
    } else {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  }
]);

export const PositionPropType = PropTypes.shape({
  xPos: PropTypes.number,
  yPos: PropTypes.number,
})

/**
 * These are the "globally" exposes properties which get inserted into the
 * Redux store.
 */
export const MSAPropTypes = {
  /**
   * Width of the sequence viewer (in pixels), e.g. `500`.
   */
  width: PropTypes.number,

  /**
   * Height of the sequence viewer (in pixels), e.g. `500`.
   */
  height: PropTypes.number,

  /**
   * Width of the main tiles (in pixels), e.g. `20`
   */
  tileWidth: PropTypes.number,

  /**
   * Height of the main tiles (in pixels), e.g. `20`
   */
  tileHeight: PropTypes.number,

  /**
   * Colorscheme to use. Currently the follow colorschemes are supported:
   * `buried_index`, `clustal`, `clustal2`, `cinema`, `helix_propensity`, `hydro`,
   *`lesk`, `mae`, `nucleotide`, `purine_pyrimidine`, `strand_propensity`, `taylor`,
   * `turn_propensity`, and `zappo`.
   *
  * See [msa-colorschemes](https://github.com/wilzbach/msa-colorschemes) for details.
  */
  colorScheme: ColorSchemePropType,
};


// TODO: separate individual properties into their components
export const msaDefaultProps = {
  width: 500,
  height: 100,
  tileWidth: 20,
  tileHeight: 20,
  colorScheme: "clustal",
};
