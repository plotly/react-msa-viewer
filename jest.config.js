// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  "setupFiles": ["jest-canvas-mock"],
  "transform": {
      "^.+\\.(mjs|jsx|js)$": "babel-jest"
  },
  "coverageDirectory": "./coverage/",
  "collectCoverage": true,
  "transformIgnorePatterns": [
    "/node_modules/(?!lodash-es)"
  ]
};
