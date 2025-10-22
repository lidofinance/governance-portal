import { formatEther } from 'viem';

const defaultFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumSignificantDigits: 3,
});

export const formatBalance = (
  amount: bigint,
  maximumFractionDigits?: number,
) => {
  if (maximumFractionDigits !== undefined) {
    const customFormatter = new Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits,
    });
    return customFormatter.format(Number(formatEther(amount)));
  }

  return defaultFormatter.format(Number(formatEther(amount)));
};
