// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  "setupFiles": ["jest-canvas-mock"],
  "transform": {
      "^.+\\.(mjs|jsx|js)$": "babel-jest"
  },
  "transformIgnorePatterns": [
    "/node_modules/(?!lodash-es)"
  ]
};
