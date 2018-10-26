import {
  actions,
  createPositionStore,
  positionReducer,
} from './positionReducers';

const fakeMainStore = {
  props: {
    tileWidth: 50,
    tileHeight: 50,
  },
  sequences: {
    length: 20,
    maxLength: 30,
    raw: {
      length: 20,
    }
  },
}

describe('positionStore', () => {
  it('should create actions properly', () => {
    const payload = {xPos: 10, yPos: 20};
    expect(actions.updatePosition(payload)).toEqual({
      type: actions.updatePosition.key,
      payload: {
        xPos: 10, yPos: 20,
      }
    })
  })

  it('should should have a valid initial state', () => {
    const store = createPositionStore(positionReducer);
    expect(store.getState()).toEqual({
      position: { xPos: 0, yPos: 0 }
    });
  });

  it('should update the position store after an updateMainStore', () => {
    const store = createPositionStore(positionReducer);
    store.dispatch(actions.updateMainStore(fakeMainStore));
    expect(store.getState()).toEqual({
      position: { xPos: 0, yPos: 0 },
      ...fakeMainStore,
      xPosOffset: -0,
      yPosOffset: -0,
      currentViewSequence: 0,
      currentViewSequencePosition: 0
    });
  })

  it('should update the position store after an updatePosition', () => {
    const store = createPositionStore(positionReducer);
    store.dispatch(actions.updateMainStore(fakeMainStore));
    store.dispatch(actions.updatePosition({xPos: 20, yPos: 60}));
    expect(store.getState()).toEqual({
      ...fakeMainStore,
     "currentViewSequencePosition" : 0,
     "xPosOffset" : -0,
     "position" : {
        "yPos" : 0,
        "xPos" : 0
     },
     "yPosOffset" : -0,
     "currentViewSequence" : 0,
    });
  })
})
