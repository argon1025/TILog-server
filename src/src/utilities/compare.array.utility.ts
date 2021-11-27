export const compareArray = <T>(arr1: Array<T>, arr2: Array<T>) => {
  return arr1.filter((item) => !arr2.includes(item));
};
