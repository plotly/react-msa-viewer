import { Map } from  'immutable';
import {
  actions,
  createPositionStore,
  positionReducer,
} from './positionReducers';

const fakeMainStore = Map({
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
});

describe('Basic positionStore tests', () => {
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
    store.dispatch(actions.updateMainStore(fakeMainStore.toObject()));
    expect(store.getState()).toEqual({
      position: { xPos: 0, yPos: 0 },
      ...fakeMainStore.toObject(),
      xPosOffset: -0,
      yPosOffset: -0,
      currentViewSequence: 0,
      currentViewSequencePosition: 0
    });
    expect(fakeMainStore.position).toBeUndefined();
  })
})

describe('PositionStore tests with an existing mainStore', () => {
  let store;
  beforeEach(() => {
    store = createPositionStore(positionReducer);
    store.dispatch(actions.updateMainStore(fakeMainStore.toObject()));
  })
  it('should update the position store after an updatePosition', () => {
    store.dispatch(actions.updatePosition({xPos: 20, yPos: 60}));
    expect(store.getState()).toEqual({
      ...fakeMainStore.toObject(),
     "currentViewSequencePosition" : 0,
     "xPosOffset" : -20,
     "position" : {
        "xPos" : 20,
        "yPos" : 60,
     },
     "yPosOffset" : -10,
     "currentViewSequence" : 1,
    });
  })

  it('should update the position store after an updatePosition with only xPos', () => {
    store.dispatch(actions.updatePosition({xPos: 20}));
    expect(store.getState()).toEqual({
      ...fakeMainStore.toObject(),
     "currentViewSequencePosition" : 0,
     "xPosOffset" : -20,
     "position" : {
        "xPos" : 20,
        "yPos" : 0,
     },
     "yPosOffset" : -0,
     "currentViewSequence" : 0,
    });
  })

  it('should update the position store after an updatePosition with only yPos', () => {
    store.dispatch(actions.updatePosition({yPos: 60}));
    expect(store.getState()).toEqual({
      ...fakeMainStore.toObject(),
     "currentViewSequencePosition" : 0,
     "xPosOffset" : -0,
     "position" : {
        "xPos" : 0,
        "yPos" : 60,
     },
     "yPosOffset" : -10,
     "currentViewSequence" : 1,
    });
  })

  it('should update the position store after multiple updatePosition', () => {
    store.dispatch(actions.updatePosition({xPos: 20}));
    store.dispatch(actions.updatePosition({yPos: 60}));
    expect(store.getState()).toEqual({
      ...fakeMainStore.toObject(),
     "currentViewSequencePosition" : 0,
     "xPosOffset" : -20,
     "position" : {
        "xPos" : 20,
        "yPos" : 60,
     },
     "yPosOffset" : -10,
     "currentViewSequence" : 1,
    });
  })

  it('should update the position store after an movePosition', () => {
    store.dispatch(actions.movePosition({xMovement: 30, yMovement: 40}));
    expect(store.getState()).toEqual({
      ...fakeMainStore.toObject(),
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

  it('should update the position store after an movePosition with only xMovement', () => {
    store.dispatch(actions.movePosition({xMovement: 30}));
    expect(store.getState()).toEqual({
      ...fakeMainStore.toObject(),
     "currentViewSequencePosition" : 0,
     "xPosOffset" : -30,
     "position" : {
        "xPos" : 30,
        "yPos" : 0,
     },
     "yPosOffset" : -0,
     "currentViewSequence" : 0,
    });
  })

  it('should update the position store after an movePosition with only yMovement', () => {
    store.dispatch(actions.movePosition({yMovement: 40}));
    expect(store.getState()).toEqual({
      ...fakeMainStore.toObject(),
     "currentViewSequencePosition" : 0,
     "xPosOffset" : -0,
     "position" : {
        "xPos" : 0,
        "yPos" : 40,
     },
     "yPosOffset" : -40,
     "currentViewSequence" : 0,
    });
  })

  it('should update the position store after multiple movePosition', () => {
    store.dispatch(actions.movePosition({xMovement: 30, yMovement: 40}));
    store.dispatch(actions.movePosition({xMovement: 50, yMovement: 20}));
    expect(store.getState()).toEqual({
      ...fakeMainStore.toObject(),
     "currentViewSequencePosition" : 1,
     "xPosOffset" : -30,
     "position" : {
        "xPos" : 80,
        "yPos" : 60,
     },
     "yPosOffset" : -10,
     "currentViewSequence" : 1,
    });
  })

  it('should update the position store after multiple movePosition', () => {
    const movements = [
      [0, 1],
      [1, 0],
      [1, 2],
      [1, 1],
      [1, 0],
      [0, 1],
      [0, 0],
    ];
    movements.forEach(m => {
      store.dispatch(actions.movePosition({xMovement: m[0], yMovement: m[1]}));
    });
    expect(store.getState()).toEqual({
      ...fakeMainStore.toObject(),
     "currentViewSequencePosition" : 0,
     "xPosOffset" : -4,
     "position" : {
        "xPos" : 4,
        "yPos" : 5,
     },
     "yPosOffset" : -5,
     "currentViewSequence" : 0,
    });
  })
})
