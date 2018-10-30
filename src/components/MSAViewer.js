/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';
import createRef from 'create-react-ref/lib/createRef';

import PropTypes from 'prop-types';

import {
  forOwn,
  memoize,
  omit,
} from 'lodash-es'

import {
  msaDefaultProps,
  SequencePropType,
  ColorSchemePropType,
  PositionPropType,
  MSAPropTypes,
} from '../PropTypes';

import MSAProvider from '../store/provider';
import propsToRedux from '../store/propsToRedux';

import {
  actions,
  positionReducer,
  createPositionStore,
} from '../store/positionReducers';

import MSALayouter from './layouts/MSALayouter';

import shallowSelect from '../utils/shallowSelect';

// list of events with a default implementation
// mapping: eventName -> DOM event name
const defaultEvents = {
  "onResidueClick": "residueClick",
};

/**
 * A general-purpose layout for the MSA components
 *
 * When children are passed it acts as a Context Provider for the msaStore,
 * otherwise it provides a default layout and forwards it props the respective
 * components.
 */
class MSAViewerComponent extends Component {

    constructor(props) {
      super(props);
      this.el = createRef();
      this._setupStores();
      this.createDomHandler = memoize(this.createDomHandler.bind(this));
      this.forwardProps = shallowSelect(
        p => omit(p, ['msaStore']),
        this.forwardProps.bind(this),
      );
    }

  _setupStores() {
    this.positionStore = createPositionStore(positionReducer);
    this.positionStore.dispatch(
      actions.updateMainStore(this.props.msaStore.getState())
    );
    this.msaStoreUnsubscribe = this.props.msaStore.subscribe(() => {
      // forward the msaStore to the positionStore for convenience
      this.positionStore.dispatch(
        actions.updateMainStore(this.props.msaStore.getState())
      );
    });
  }

  componentWillUnmount() {
    this.msaStoreUnsubscribe();
  }

  // TODO: we could inject this in the main redux store for better compatibility
  getChildContext() {
    return {
      positionMSAStore: this.positionStore,
    };
  }

  /**
   * Creates a listener which triggers `domEventName`
   */
  createDomHandler(domEventName) {
    return (e) => {
      const event = new CustomEvent(domEventName, {
        detail: e,
        bubbles: true,
      });
      this.el.current.dispatchEvent(event);
    };
  }

  forwardProps(props) {
    const options = {...props};
    /**
     * Inject default event handler if no handler for the respective
     * event has been provided.
     */
    forOwn(defaultEvents, (forwardedName, currentName) => {
      if (currentName in defaultEvents && !(currentName in options)) {
        options[currentName] = this.createDomHandler(forwardedName);
      }
    });
    return options;
  }

  render() {
    const {children, msaStore, ...otherProps} = this.props;
    if (children) {
      return (
        <MSAProvider store={msaStore}>
          <div {...otherProps} ref={this.el}>
            {children}
          </div>
        </MSAProvider>
      );
    } else {
      return (
        <MSAProvider store={msaStore}>
          <div ref={this.el}>
            <MSALayouter {...this.forwardProps(otherProps)} />
          </div>
        </MSAProvider>
      );
    }
  }
}

MSAViewerComponent.childContextTypes = {
  positionMSAStore: PropTypes.object,
};

MSAViewerComponent.propTypes = {
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

  /**
   * Predefined layout scheme to use (only used when no child elements are provided).
   * Available layouts: `basic`, `inverse`, `full`, `compact`, `funky`
   */
  layout: PropTypes.oneOf(['basic', 'default', 'inverse', 'full', 'compact',
    'funky']),

  /**
   * Whether to draw a border.
   */
  sequenceBorder: PropTypes.bool,

  /**
   * Color of the border. Name, hex or RGB value.
   */
  sequenceBorderColor: PropTypes.string,

  /**
   * Width of the border.
   */
  sequenceBorderWidth: PropTypes.number,

  /**
   * Color of the text residue letters (name, hex or RGB value)
   */
  sequenceTextColor: PropTypes.string,

  /**
   * Font to use when drawing the individual residues.
   */
  sequenceTextFont: PropTypes.string,

  /**
   * What should happen if content overflows.
   */
  sequenceOverflow: PropTypes.oneOf(["hidden", "auto", "scroll"]),

  /**
   * What should happen if x-axis content overflows (overwrites "overflow")
   */
  sequenceOverflowX: PropTypes.oneOf(["hidden", "auto", "scroll", "initial"]),

  /**
   * What should happen if y-axis content overflows (overwrites "overflow")
   */
  sequenceOverflowY: PropTypes.oneOf(["hidden", "auto", "scroll", "initial"]),

  /**
   * X Position of the scroll bar ("top or "bottom")
   */
  sequenceScrollBarPositionX: PropTypes.oneOf(["top", "bottom"]),

  /**
   * Y Position of the scroll bar ("left" or "right")
   */
  sequenceScrollBarPositionY: PropTypes.oneOf(["left", "right"]),

  /**
   * Component to create labels from.
   */
  labelComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

  /**
   * Inline styles to apply to each label.
   */
  labelStyle: PropTypes.object,

  /**
   * Attributes to apply to each label.
   */
  labelAttributes: PropTypes.object,

  /**
   * At which steps the position labels should appear, e.g. `2` for (1, 3, 5)
   */
  markerSteps: PropTypes.number,

  /**
   * At which number the PositionBar marker should start counting.
   * Typical values are: `1` (1-based indexing) and `0` (0-based indexing).
   */
  markerStartIndex: PropTypes.number,

  /**
   * Component to create markers from.
   */
  markerComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

  /**
   * Inline styles to apply to each marker.
   */
  markerStyle: PropTypes.object,

  /**
   * Attributes to apply to each marker.
   */
  markerAttributes: PropTypes.object,

  /**
   * Method to use for the OverviewBar:
   *  - `information-content`: Information entropy after Shannon of a column (scaled)
   *  - `conservation`: Conservation of a column (scaled)
   */
  barMethod: PropTypes.oneOf(['information-content', 'conservation']),

  /**
   * Fill color of the OverviewBar, e.g. `#999999`
   */
  barFillColor: PropTypes.string,

  /**
   * Inline styles to apply to each bar.
   */
  barStyle: PropTypes.object,

  /**
   * Attributes to apply to each bar.
   */
  barAttributes: PropTypes.object,

  /**
   * A custom msaStore (created with `createMSAStore`).
   * Useful for custom interaction with other components
   */
  msaStore: PropTypes.object,
};

const MSAViewer = propsToRedux(MSAViewerComponent);
MSAViewer.defaultProps = msaDefaultProps;

/**
 * react-docgen trickery:
 * React-docgen doesn't detect the MSAViewer as a documented component, because
 * it only looks for two patterns and MSAViewer is a `propsToRedux`.
 *
 * So instead of declaring the properties directly on the MSAViewer,
 * we declare them on MSAViewerComponent, s.t. they get documented
 * However, we need to exclude the properties that `propsToRedux` passes to redux.
 * Luckily, react-docgen doesn't stops looking at the source tree once it found the first `<class>.propTypes` pattern.
 */
MSAViewer.propTypes = {...MSAViewerComponent.propTypes};
MSAViewerComponent.propTypes = omit(MSAViewerComponent.propTypes, [
  ...Object.keys(MSAPropTypes), 'sequences', 'position',
]);

export default MSAViewer;
