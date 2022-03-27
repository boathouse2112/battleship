const replaceAt = function <T>(
  array: Array<T>,
  index: number,
  value: T
): Array<T> {
  const newArray = array.slice(0);
  newArray[index] = value;
  return newArray;
};

export { replaceAt };
