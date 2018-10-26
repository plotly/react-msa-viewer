import {
  actions,
  createPositionStore,
  positionReducer,
} from './positionReducers';

const fakeMainStore = {
  props: {
    tileWidth: 50,
    tileHeight: 50,
    width: 200,
    height: 200,
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
    expect(fakeMainStore.position).toBeUndefined();
  })

  it('should update the position store after an updatePosition', () => {
    const store = createPositionStore(positionReducer);
    store.dispatch(actions.updateMainStore(fakeMainStore));
    store.dispatch(actions.updatePosition({xPos: 20, yPos: 60}));
    expect(store.getState()).toEqual({
      ...fakeMainStore,
     "currentViewSequencePosition" : 0,
     "xPosOffset" : -20,
     "position" : {
        "xPos" : 20,
        "yPos" : 60,
     },
     "yPosOffset" : -10,
     "currentViewSequence" : 0,
    });
  })

  it('should update the position store after an movePosition', () => {
    const store = createPositionStore(positionReducer);
    store.dispatch(actions.updateMainStore(fakeMainStore));
    store.dispatch(actions.movePosition({xMovement: 30, yMovement: 40}));
    expect(store.getState()).toEqual({
      ...fakeMainStore,
     "currentViewSequencePosition" : 0,
     "xPosOffset" : -30,
     "position" : {
        "xPos" : 30,
        "yPos" : 40,
     },
     "yPosOffset" : -40,
     "currentViewSequence" : 0,
    });
  })
})
