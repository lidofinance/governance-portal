import { KnownToken } from 'shared/blockchain/tokens';
import { formatToken } from 'shared/blockchain/utils';

type Args = {
  stake: bigint;
  showSymbol?: boolean;
  showFullValue?: boolean;
};

export const formatVp = ({ stake, showSymbol, showFullValue }: Args) =>
  formatToken({
    amount: stake,
    decimals: KnownToken.LDO.decimals,
    symbol: showSymbol ? KnownToken.LDO.symbol : undefined,
    maxFractionDigits: showFullValue ? 4 : 1,
    notation: showFullValue ? 'standard' : 'compact',
  });
