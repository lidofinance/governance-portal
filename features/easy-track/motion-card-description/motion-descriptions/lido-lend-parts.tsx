import { type Hex } from 'viem';
import { useIsMotionDetailed } from '@easy-track/providers/motion-detailed-context';
import { useLidoLendTokenData } from '@easy-track/hooks/use-lido-lend-token-data';
import { formatToken } from 'shared/blockchain/utils';
import { SkeletonText } from 'shared/components/skeleton-text';

export const MarketId = ({ marketId }: { marketId: Hex }) => {
  const isMotionDetailed = useIsMotionDetailed();

  if (isMotionDetailed) {
    return <b>{marketId}</b>;
  }

  return (
    <b title={marketId}>
      {marketId.slice(0, 10)}…{marketId.slice(-8)}
    </b>
  );
};

export const Amount = ({ value }: { value: bigint | number }) => (
  <b>{value.toLocaleString('en-US')}</b>
);

type Props = {
  marketId: Hex;
  value: bigint;
  isCollateral?: boolean;
};

export const TokenAmount = ({ marketId, value, isCollateral }: Props) => {
  const { data: tokenData, isLoading } = useLidoLendTokenData(
    marketId,
    isCollateral,
  );

  if (isLoading) {
    return (
      <SkeletonText
        width={80}
        style={{ display: 'inline-flex', verticalAlign: 'middle' }}
      />
    );
  }

  if (!tokenData) {
    return <Amount value={value} />;
  }

  return (
    <b>
      {formatToken({
        amount: value,
        decimals: tokenData.decimals,
        symbol: tokenData.label,
        maxFractionDigits: tokenData.decimals,
      })}
    </b>
  );
};
