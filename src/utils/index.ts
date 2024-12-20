//二分法查找
const binarySearch = (list: any[], value: number) => {
  let start = 0;
  let end = list.length - 1;
  let tempIndex = null;
  while (start <= end) {
    let midIndex = parseInt(((start + end) / 2).toString());
    let midValue = list[midIndex].bottom;
    if (midValue === value) {
      return midIndex + 1;
    } else if (midValue < value) {
      start = midIndex + 1;
    } else if (midValue > value) {
      if (tempIndex === null || tempIndex > midIndex) {
        tempIndex = midIndex;
      }
      end = end - 1;
    }
  }
  return tempIndex;
};

export { binarySearch };
