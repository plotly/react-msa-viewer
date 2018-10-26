/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/


/**
 * Perform updates in a browser-requested animation frame.
 * If this is called multiple times before a new animation frame was provided,
 * the subsequent calls will be dropped.
 * Thus, make sure to use the current data in the callback
 * (it might have been updated once the callback fired)
 *
 * @param {Object} Class instance to bind the callback too
 * @param {Function} callback Function to be called in the animation frame
 */
function requestAnimation(instance, callback) {
  if (instance.nextFrame === undefined) {
    instance.nextFrame = window.requestAnimationFrame(function(){
      callback();
      this.nextFrame = undefined;
    }.bind(instance));
  }
}

export default requestAnimation;
