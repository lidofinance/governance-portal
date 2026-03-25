import { KnownToken } from 'shared/blockchain/tokens';
import { formatToken } from 'shared/blockchain/utils';
import { parseUnits } from 'viem';

const MIN_VP_TO_SHOW = '0.01'; // LDO
const MIN_VP_WEI = parseUnits(MIN_VP_TO_SHOW, KnownToken.LDO.decimals);

type Args = {
  stake: bigint;
  showSymbol?: boolean;
  showFullValue?: boolean;
};

export const formatVp = ({ stake, showSymbol, showFullValue }: Args) => {
  if (stake < MIN_VP_WEI) {
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    return `<${MIN_VP_TO_SHOW}${showSymbol ? ` ${KnownToken.LDO.symbol}` : ''}`;
  }

  return formatToken({
    amount: stake,
    decimals: KnownToken.LDO.decimals,
    symbol: showSymbol ? KnownToken.LDO.symbol : undefined,
    maxFractionDigits: showFullValue ? 4 : 1,
    notation: showFullValue ? 'standard' : 'compact',
  });
};
