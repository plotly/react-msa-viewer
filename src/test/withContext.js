/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import { mount, shallow } from 'enzyme';

/**
 * Mounts the only child with the context of the current element.
 * @param {object} reactElement - element to mount the children from
 *
 * This is very useful for convenience in tests, with the following pattern:
 * <Provider ... />
 *    <MyComponent />
 * </Provider
 */
export function mountWithContext(reactElement) {
  return mount(reactElement.getElement(), {
    context: reactElement.instance().getChildContext(),
    childContextTypes: reactElement.instance().constructor.childContextTypes,
  });
}
/**
 * Dive shallowly into the only child with the context of the current element.
 * @param {object} reactElement - element to mount the children from
 *
 * This is very useful for convenience in tests, with the following pattern:
 * <Provider ... />
 *    <MyComponent/>
 * </Provider
 */
export function diveWithContext(reactElement) {
  return reactElement.dive({
    context: reactElement.instance().getChildContext(),
    childContextTypes: reactElement.instance().constructor.childContextTypes,
  });
}
