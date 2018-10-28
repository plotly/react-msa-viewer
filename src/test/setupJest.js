import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;

// Make requestAnimationFrame fire immediately
global.requestAnimationFrame = (cb) => {
  // remember to call jest.runAllTimers() for fast-forwarding
  setTimeout(cb, 0);
};

// https://jestjs.io/docs/en/timer-mocks.html
jest.useFakeTimers();
