import { formatEther, formatUnits } from 'viem';
import {
  StethIcon,
  WstethIcon,
  UnstethIcon,
  EthIcon,
} from '../components/icons';
import { Token } from './types';

export const getTokenIcon = (token: Token | 'ETH') => {
  switch (token) {
    case Token.stETH:
      return <StethIcon viewBox="0 0 36 36" />;
    case Token.wstETH:
      return <WstethIcon viewBox="0 0 36 36" />;
    case Token.unstETH:
      return <UnstethIcon viewBox="0 0 36 36" />;
    case 'ETH':
      return <EthIcon viewBox="0 0 36 36" />;
    default:
      return null;
  }
};

type FormatNumberArgs = {
  value: string | number | bigint | null | undefined;
  maxFractionDigits?: number;
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
};

export const formatNumber = (args: FormatNumberArgs) => {
  const { value, maxFractionDigits = 2, notation = 'standard' } = args;

  if (value === null || value === undefined) return 'N/A';
  const num = Number(value);

  if (isNaN(num)) {
    return 'N/A';
  }

  const formattedNumber = num.toLocaleString('en-US', {
    notation,
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  });

  const minValue = 1 / 10 ** maxFractionDigits;

  if (num < minValue && num > 0) {
    return `<${minValue}`;
  }

  return formattedNumber;
};

export const formatEth = (amount: bigint) => {
  return formatNumber({
    value: formatEther(amount),
    maxFractionDigits: 4,
  });
};

export const formatEthFull = (amount: bigint) => {
  return formatNumber({
    value: formatEther(amount),
    maxFractionDigits: 18,
  });
};

export const formatEthCompact = (amount: bigint, maxFractionDigits = 2) => {
  return formatNumber({
    value: formatEther(amount),
    maxFractionDigits,
    notation: 'compact',
  });
};

export const parsePercent16 = (value: bigint | null | undefined) => {
  if (!value) return 0;

  const formattedString = formatNumber({
    value: formatUnits(value, 16),
    maxFractionDigits: 2,
  });

  // Remove "<" getting from the formatNumber util before parseFloat to avoid NaN result
  const cleanFormattedString = formattedString.replace('<', '').trim();

  return parseFloat(cleanFormattedString);
};
