module.exports = {
  rootDir: __dirname,
  moduleFileExtensions: [
    'js',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '!!raw-loader!(.*)': 'jest-raw-loader',
  },
  modulePaths: [
    '<rootDir>',
  ],
  transform: {
    '.*\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns : ['/__fixtures__/'],
  testRunner: 'jest-jasmine2',
}