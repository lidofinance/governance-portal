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

// Returns unformatted string balance
export const formatRawBalance = (amount: bigint, maxDecimalDigits = 4) => {
  const balanceString = formatEther(amount);

  if (balanceString.includes('.')) {
    const parts = balanceString.split('.');
    return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
  }

  return balanceString;
};
