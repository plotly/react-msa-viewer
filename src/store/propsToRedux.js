/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * This wrapper listens to prop changes and forwards these to their
 * appropriate redux store actions.
 */

import React, { Component } from 'react';
import createRef from 'create-react-ref/lib/createRef';

import createMSAStore from './createMSAStore';
import * as actions from './actions';

import {MSAPropTypes, PropTypes} from '../PropTypes';

import {
  isEqual,
  pick,
  omit,
} from 'lodash-es';

/// Maps property changes to redux actions
const reduxActions = {
  "sequences": "updateSequences",
}

Object.keys(MSAPropTypes).forEach(key => {
  if(!(key in reduxActions) && MSAPropTypes[key] !== PropTypes.func) {
    reduxActions[key] = 'updateProps';
  }
});

const attributesToStore = Object.keys(reduxActions);


export const propsToRedux = (WrappedComponent) => {
  return class PropsToReduxComponent extends Component {

    constructor(props) {
      super(props);
      const storeProps = pick(props, attributesToStore) || {};
      this.el = createRef();
      this.msaStore = props.msaStore;
      if (storeProps.sequences !== undefined) {
        this.msaStore = createMSAStore(storeProps);
      } else {
        console.warn("Check your MSA properties", storeProps);
      }
    }

    componentDidMount() {
      if (this.props.position) {
        this.updatePosition(this.props.position);
      }
    }

    updatePosition(position) {
      const {xPos, yPos} = this.el.current.positionStore.getState().position;
      const movement = {
        xMovement: (position.xPos || xPos) - xPos,
        yMovement: (position.yPos || yPos) - yPos,
      };
      this.el.current.updatePosition(movement);
    }

    // Notify the internal Redux store about property updates
    componentDidUpdate(oldProps) {
      const newProps = this.props;
      // TODO: support batch updates
      for (const prop in pick(newProps, attributesToStore)) {
        if (!isEqual(oldProps[prop], newProps[prop])) {
          if (prop === "position") {
            this.updatePosition(newProps[prop]);
          } else if (prop in reduxActions) {
            let action;
            switch(reduxActions[prop]){
              case 'updateProp':
                action = actions[reduxActions[prop]](prop, newProps[prop]);
                break;
              default:
                action = actions[reduxActions[prop]](newProps[prop]);
            }
            console.log("Prop -> Redux: ", action);
            this.msaStore.dispatch(action);
          } else {
            console.error(prop, " is unknown.");
          }
        }
      }
    }

    render() {
      const {msaStore, ...props} = omit(this.props, attributesToStore);
      if (this.msaStore === undefined) {
        return (<div> Error initializing the MSAViewer. </div>)
      } else {
        return (
          <WrappedComponent ref={this.el} msaStore={msaStore || this.msaStore} {...props} />
        );
      }
    }
  }
}

export default propsToRedux;
