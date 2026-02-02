import { formatEther } from 'viem';

export const convertShareLimitToInputValue = (value: bigint) => {
  const formatted = formatEther(value);

  const num = parseFloat(formatted);

  if (Number.isInteger(num)) {
    return num.toString();
  }

  return formatted;
};
