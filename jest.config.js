// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  "setupFiles": ["jest-canvas-mock"],
  "coverageDirectory": "./coverage/",
  "collectCoverage": true,
  "coverageReporters": ["lcov", "json"],
  "transformIgnorePatterns": [
    "/node_modules/(?!lodash-es)"
  ],
  // will come with jest 24
  // https://github.com/facebook/jest/pull/6143
  //resolveSnapshotPath: (testPath, snapshotExtension) => {
    //return testPath.replace('__tests__', '__snapshots__') + snapshotExtension;
  //},
};
