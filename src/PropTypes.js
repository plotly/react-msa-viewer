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

export const MSAPropTypes = {
  /**
   * Sequence data.
   * `sequences` expects an array of individual sequences.
   *
   * `sequence`: Raw sequence, e.g. `MEEPQSDPSIEP` (required)
   * `name`: name of the sequence, e.g. `Sequence X`
   *
   * Example:
   *
   * ```js
   * const sequences = [
   *   {
   *     name: "seq.1",
   *     sequence: "MEEPQSDPSIEP-PLSQETFSDLWKLLPENNVLSPLPS-QA-VDDLMLSPDDLAQWLTED",
   *   },
   *   {
   *     name: "seq.2",
   *     sequence: "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP",
   *   },
   * ];
   * ```
   */
  sequences: PropTypes.arrayOf(SequencePropType).isRequired,

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
   * Font of the individual residue tiles, e.g. `"20px Arial"`.
   */
  textFont: PropTypes.string,

  /**
   * Current x and y position of the viewpoint
   * in the main sequence viewer (in pixels).
   * This specifies the position of the top-left corner
   * of the viewpoint within the entire alignment,
   * e.g. `{xPos: 20, yPos: 5}`.
   */
  position: PositionPropType,

  /**
   * Colorscheme to use. Currently the follow colorschemes are supported:
   * `buried_index`, `clustal`, `clustal2`, `cinema`, `helix_propensity`, `hydro`,
   *`lesk`, `mae`, `nucleotide`, `purine_pyrimidine`, `strand_propensity`, `taylor`,
   * `turn_propensity`, and `zappo`.
   *
  * See [msa-colorschemes](https://github.com/wilzbach/msa-colorschemes) for details.
  */
  colorScheme: ColorSchemePropType,

  /**
   * Background color to use, e.g. `red`
   */
  backgroundColor: PropTypes.string,

  /**
   * Rendering engine: `canvas` or `webgl` (experimental).
   */
  engine: PropTypes.oneOf(['canvas', 'webl']), // experimental

  /**
   * Callback fired when the mouse pointer is entering a residue.
   */
  onResidueMouseEnter: PropTypes.func,

  /**
   * Callback fired when the mouse pointer is leaving a residue.
   */
  onResidueMouseLeave: PropTypes.func,

  /**
   * Callback fired when the mouse pointer clicked a residue.
   */
  onResidueClick: PropTypes.func,

  /**
   * Callback fired when the mouse pointer clicked a residue.
   */
  onResidueDoubleClick: PropTypes.func,
};


// TODO: separate individual properties into their components
export const msaDefaultProps = {
  width: 500,
  height: 100,
  tileWidth: 20,
  tileHeight: 20,
  colorScheme: "clustal",
  backgroundColor: "red",
  engine: "canvas", // experimental
};

export {PropTypes};
