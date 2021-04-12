const utils = require('../../src/utils');
const { calcFileSize } = utils;

test('calcFileSize', () => {
  expect(calcFileSize(7524354)).toMatch(/(\d+)\s(B|KB|MB|GB)$/);
  expect(calcFileSize('75254 MB')).toBe('75254 MB');
});
