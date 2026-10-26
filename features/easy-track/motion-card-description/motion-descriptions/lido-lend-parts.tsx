import { type Hex } from 'viem';

export const MarketId = ({ marketId }: { marketId: Hex }) => (
  <b title={marketId}>
    {marketId.slice(0, 10)}…{marketId.slice(-8)}
  </b>
);

export const Amount = ({ value }: { value: bigint | number }) => (
  <b>{value.toLocaleString('en-US')}</b>
);
