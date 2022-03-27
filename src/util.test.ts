import { replaceAt } from './util';

describe('replaceAt', () => {
  test('correctly replaces one value', () => {
    let array = Array(4).fill(false);

    array = replaceAt(array, 3, true);
    expect(array).toEqual([false, false, false, true]);
  });
  test('correctly chains value replacement', () => {
    let array = Array(4).fill(0);

    array = replaceAt(array, 0, 1);
    array = replaceAt(array, 1, 1);
    array = replaceAt(array, 2, 1);
    array = replaceAt(array, 3, 1);
    expect(array).toEqual([1, 1, 1, 1]);
  });
});
