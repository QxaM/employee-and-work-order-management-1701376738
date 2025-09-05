const fileSizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

export const formatFileSize = (size: number): string => {
  const multiplicand = 1024;

  let calculatedSize = size;
  let index = 0;

  while (
    Math.abs(calculatedSize) >= multiplicand &&
    index < fileSizes.length - 1
  ) {
    calculatedSize /= multiplicand;
    index++;
  }

  return `${+calculatedSize.toFixed(2)}${fileSizes[index]}`;
};
