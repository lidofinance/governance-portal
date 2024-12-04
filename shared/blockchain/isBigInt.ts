export const isBigInt = (value: bigint | undefined): value is bigint => {
  return value !== undefined;
};
