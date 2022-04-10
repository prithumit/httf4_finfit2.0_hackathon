/* eslint-disable no-useless-escape */
process.env.VUE_CLI_BABEL_TARGET_NODE = true;
process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true;
require('jsdom-global');

module.exports = {
  verbose: true,
  moduleDirectories: ['node_modules', 'src', 'src/admin'],
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue',
    'html',
  ],
  transformIgnorePatterns: [
  ],
  transform: {
    '^.+\\.vue$': '<rootDir>/node_modules/vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.(js|jsx)?$': '<rootDir>/node_modules/babel-jest',
  },
  globals: {
    NODE_ENV: 'test',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: [
    'jest-serializer-vue',
  ],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
  ],
  testURL: 'http://localhost/',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  setupTestFrameworkScriptFile: '<rootDir>/tests/setupTestFramework.js',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/components/**/*.{js,vue}',
    'src/pages/**/*.{js,vue}',
    'src/admin/components/**/*.{js,vue}',
    'src/admin/pages/**/*.{js,vue}',
  ],
};
