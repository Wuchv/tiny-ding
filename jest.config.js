const path = require('path');

module.exports = {
  setupFiles: ['./test/setup.ts'],
  rootDir: path.resolve(__dirname),
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: '.*\\.test\\.(ts|tsx)$',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    '@src': path.resolve(__dirname, './src'),
  },
};
