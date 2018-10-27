// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  "setupFiles": ["./src/test/setupJest.js", "jest-canvas-mock"],
  "coverageDirectory": "./coverage/",
  "collectCoverage": true,
  "coverageReporters": ["lcov", "json"],
  "transformIgnorePatterns": [
    "/node_modules/(?!lodash-es)"
  ],
  "snapshotSerializers": ["enzyme-to-json/serializer"],
  // will come with jest 24
  // https://github.com/facebook/jest/pull/6143
  //resolveSnapshotPath: (testPath, snapshotExtension) => {
    //return testPath.replace('__tests__', '__snapshots__') + snapshotExtension;
  //},
};
