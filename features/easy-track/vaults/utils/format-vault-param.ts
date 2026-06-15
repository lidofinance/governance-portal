import { formatEther, parseEther } from 'viem';

const formatter = new Intl.NumberFormat('en', {
  notation: 'standard',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatPercentBp = (value: number) => {
  return `${formatter.format(value * 0.01)}%`;
};

export const formatBp = (value: bigint | number) => {
  const valueNum = typeof value === 'number' ? value : Number(value);
  return `${formatter.format(valueNum)} BP (${formatPercentBp(valueNum)})`;
};

const formatShareLimit = (value: bigint) => {
  const formattedEtherValue = formatEther(value);
  if (value < parseEther('0.01')) {
    return formattedEtherValue;
  }
  return formatter.format(parseFloat(formattedEtherValue));
};

export const formatVaultParam = (value: bigint | number, isBp?: boolean) => {
  if (isBp) {
    return formatBp(value);
  }
  return formatShareLimit(BigInt(value));
};
