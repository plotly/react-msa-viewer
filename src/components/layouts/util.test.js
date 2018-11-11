/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import {
  forwardProps,
  forwardPropsMapper,
  same,
} from './util';

describe("It should forward properties properly", () => {
  it("should split correctly with forwardProps", () => {
    const result = forwardProps({a: 1, b: 2, c: 3}, {b: "myB"});
    expect(result).toEqual({forward: {myB: 2}, other: {a: 1, c: 3}});
  });

  it("should split correctly with forwardProps (including same)", () => {
    const result = forwardProps({a: 1, b: 2, c: 3}, {b: "myB", c: same});
    expect(result).toEqual({forward: {myB: 2, c: 3}, other: {a: 1}});
  });
});

describe("selectForwardProps", () => {
  it("should split a map correctly with one selector", () => {
    const props = {a: 1, b: 2, c: 3};
    const result = forwardPropsMapper(props, {
      myFirstSelector: {
        b: "myB",
      },
    });
    expect(result).toEqual({
      forward: {
        myFirstSelector: {
          myB: 2,
        }
      },
      other: {
        a: 1,
        c: 3,
      }
    });
  });
  it("should split a map correctly with multiple selectors", () => {
    const props = {a: 1, b: 2, c: 3};
    const result = forwardPropsMapper(props, {
      myFirstSelector: {
        b: "myB",
      },
      mySecondSelector: {
        c: same,
      },
    });
    expect(result).toEqual({
      forward: {
        myFirstSelector: {
          myB: 2,
        },
        mySecondSelector: {
          c: 3,
        }
      },
      other: {
        a: 1,
      },
    });
  });
  it("should split a map correctly when no props are forward", () => {
    const props = {a: 1};
    const result = forwardPropsMapper(props, {
      myFirstSelector: {
        b: "myB",
      },
      mySecondSelector: {
        c: same,
      },
    });
    expect(result).toEqual({
      forward: {
        myFirstSelector: {},
        mySecondSelector: {}
      },
      other: {
        a: 1,
      },
    });
  });
  it("should split a map correctly when no props are remaining to be forwarded", () => {
    const props = {b: 2, c: 3};
    const result = forwardPropsMapper(props, {
      myFirstSelector: {
        b: "myB",
      },
      mySecondSelector: {
        c: same,
      },
    });
    expect(result).toEqual({
      forward: {
        myFirstSelector: {
          myB: 2,
        },
        mySecondSelector: {
          c: 3,
        },
      },
      other: {},
    });
  });
});

